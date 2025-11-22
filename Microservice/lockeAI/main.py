import os
import json
import pika
import requests
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import io
import warnings
import logging

# Configurações de Ambiente e Log
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
warnings.filterwarnings("ignore")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

# Constantes
MODEL_PATH = "models/my_classifier_v3.h5"
CLASSIFIER_IMG_SIZE = (224, 224)
LIMIAR_CLASSIFICADOR = 0.45

# Configurações do RabbitMQ (Padronizadas com seu Java)
RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'rabbitmq') # 'rabbitmq' é o nome do serviço no docker-compose, ou 'localhost' se rodar local
RABBITMQ_QUEUE_INPUT = 'validacao.documento.request'
RABBITMQ_QUEUE_NEXT_STEP = 'validacao.biometria.request' # Fila do ReconhecimentoAI
RABBITMQ_QUEUE_REJECT = 'validacao.documento.response'   # Fila de volta pro Java

class DocumentClassifier:
    def __init__(self, model_path):
        self.model = None
        self.img_size = CLASSIFIER_IMG_SIZE
        try:
            self.model = load_model(model_path)
            logging.info(f"Modelo '{model_path}' carregado com sucesso.")
        except Exception as e:
            logging.error(f"Falha ao carregar modelo '{model_path}'. Erro: {e}")
            # Em produção, talvez fosse ideal parar o serviço aqui se o modelo não carregar

    def _prepare_image(self, image_bytes: bytes):
        img = image.load_img(io.BytesIO(image_bytes), target_size=self.img_size)
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        return tf.keras.applications.mobilenet_v2.preprocess_input(img_array)

    def predict(self, image_bytes: bytes) -> (bool, float):
        if not self.model:
            logging.error("Modelo indisponível para predição.")
            return False, 1.0 # Retorna falso por segurança
        
        processed_img = self._prepare_image(image_bytes)
        prediction = self.model.predict(processed_img)
        score = prediction[0][0]

        is_document = score < LIMIAR_CLASSIFICADOR
        logging.info(f"Score: {score:.4f} | É documento? {is_document}")
        return is_document, float(score)

# Inicializa o classificador
classifier = DocumentClassifier(MODEL_PATH)

def download_image(url):
    """Baixa a imagem da URL fornecida pelo Java"""
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            return response.content
        else:
            logging.error(f"Erro ao baixar imagem {url}: Status {response.status_code}")
            return None
    except Exception as e:
        logging.error(f"Exceção ao baixar imagem {url}: {e}")
        return None

def callback(ch, method, properties, body):
    """Função executada para cada mensagem recebida da fila"""
    try:
        dados = json.loads(body)
        funcionario_id = dados.get('funcionarioId')
        url_documento = dados.get('fotoDocumentoUrl')
        
        logging.info(f" [x] Processando ID: {funcionario_id}")

        # 1. Baixar a imagem do documento
        img_bytes = download_image(url_documento)
        
        is_valid_document = False
        motivo = "Erro ao baixar imagem do documento"

        if img_bytes:
            # 2. Classificar usando seu modelo TensorFlow
            is_valid_document, score = classifier.predict(img_bytes)
            motivo = "A imagem enviada não parece ser um documento válido (Score alto)."

        # 3. Decisão de Roteamento
        if is_valid_document:
            # --- CENÁRIO SUCESSO (Triagem Aprovada) ---
            # Envia para a fila do PRÓXIMO serviço (ReconhecimentoAI)
            logging.info(f"ID {funcionario_id}: Documento Válido. Encaminhando para Biometria.")
            
            channel.basic_publish(
                exchange='',
                routing_key=RABBITMQ_QUEUE_NEXT_STEP,
                body=json.dumps(dados) # Passa os dados para frente
            )
        else:
            # --- CENÁRIO FALHA (Triagem Reprovada) ---
            # Envia resposta de erro direto para o JAVA
            logging.info(f"ID {funcionario_id}: REJEITADO na triagem de documento.")
            
            payload_rejeicao = {
                "funcionarioId": funcionario_id,
                "aprovado": False,
                "motivoRejeicao": motivo
            }
            
            channel.basic_publish(
                exchange='',
                routing_key=RABBITMQ_QUEUE_REJECT,
                body=json.dumps(payload_rejeicao)
            )

    except Exception as e:
        logging.error(f"Erro fatal processando mensagem: {e}")
    
    # Confirma processamento da mensagem (Ack)
    ch.basic_ack(delivery_tag=method.delivery_tag)

# --- Configuração do Worker RabbitMQ ---
if __name__ == "__main__":
    try:
        # Conexão
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=RABBITMQ_HOST, port=5672)
        )
        channel = connection.channel()

        # Declarar filas (Garante que existam)
        channel.queue_declare(queue=RABBITMQ_QUEUE_INPUT, durable=True)      # Entrada (do Java)
        channel.queue_declare(queue=RABBITMQ_QUEUE_NEXT_STEP, durable=True)  # Saída Sucesso (para Biometria)
        channel.queue_declare(queue=RABBITMQ_QUEUE_REJECT, durable=True)     # Saída Erro (para Java)

        logging.info(" [*] LockeAI Worker rodando. Aguardando mensagens...")
        
        channel.basic_qos(prefetch_count=1)
        
        channel.basic_consume(queue=RABBITMQ_QUEUE_INPUT, on_message_callback=callback)
        channel.start_consuming()

    except KeyboardInterrupt:
        logging.info('Worker interrompido pelo usuário')
    except Exception as e:
        logging.error(f"Erro de conexão com RabbitMQ: {e}")
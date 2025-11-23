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
import base64

os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
warnings.filterwarnings("ignore")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

MODEL_PATH = "models/my_classifier_v3.h5"
CLASSIFIER_IMG_SIZE = (224, 224)
LIMIAR_CLASSIFICADOR = 0.45

RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'rabbitmq')
RABBITMQ_QUEUE_INPUT = 'validacao.documento.request'
RABBITMQ_QUEUE_NEXT_STEP = 'validacao.biometria.request'
RABBITMQ_QUEUE_REJECT = 'validacao.documento.response'

class DocumentClassifier:
    def __init__(self, model_path):
        self.model = None
        self.img_size = CLASSIFIER_IMG_SIZE
        try:
            self.model = load_model(model_path)
            logging.info(f"Modelo '{model_path}' carregado com sucesso.")
        except Exception as e:
            logging.error(f"Falha ao carregar modelo '{model_path}'. Erro: {e}")

    def _prepare_image(self, image_bytes: bytes):
        img = image.load_img(io.BytesIO(image_bytes), target_size=self.img_size)
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        return tf.keras.applications.mobilenet_v2.preprocess_input(img_array)

    def predict(self, image_bytes: bytes) -> (bool, float):
        if not self.model:
            logging.error("Modelo indisponível para predição.")
            return False, 1.0
        
        processed_img = self._prepare_image(image_bytes)
        prediction = self.model.predict(processed_img)
        score = prediction[0][0]

        is_document = score < LIMIAR_CLASSIFICADOR
        logging.info(f"Score: {score:.4f} | É documento? {is_document}")
        return is_document, float(score)

classifier = DocumentClassifier(MODEL_PATH)

def carregar_imagem_bytes(source):
    try:
        if source.startswith("data:image") or len(source) > 2000:
            if "," in source:
                source = source.split(",")[1]
            return base64.b64decode(source)
        
        if source.startswith("http"):
            response = requests.get(source, timeout=10)
            if response.status_code == 200:
                return response.content
    except Exception as e:
        logging.error(f"Erro ao processar imagem: {e}")
    return None

def callback(ch, method, properties, body):
    try:
        dados = json.loads(body)
        funcionario_id = dados.get('funcionarioId')
        url_documento = dados.get('fotoDocumentoUrl')
        
        logging.info(f" [x] Processando ID: {funcionario_id}")

        img_bytes = carregar_imagem_bytes(url_documento)
        
        is_valid_document = False
        motivo = "Erro ao baixar ou decodificar imagem do documento"

        if img_bytes:
            is_valid_document, score = classifier.predict(img_bytes)
            motivo = "A imagem enviada não parece ser um documento válido (Score alto)."

        if is_valid_document:
            logging.info(f"ID {funcionario_id}: Documento Válido. Encaminhando para Biometria.")
            
            channel.basic_publish(
                exchange='',
                routing_key=RABBITMQ_QUEUE_NEXT_STEP,
                body=json.dumps(dados)
            )
        else:
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
    
    ch.basic_ack(delivery_tag=method.delivery_tag)

if __name__ == "__main__":
    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=RABBITMQ_HOST, port=5672)
        )
        channel = connection.channel()

        channel.queue_declare(queue=RABBITMQ_QUEUE_INPUT, durable=True)
        channel.queue_declare(queue=RABBITMQ_QUEUE_NEXT_STEP, durable=True)
        channel.queue_declare(queue=RABBITMQ_QUEUE_REJECT, durable=True)

        logging.info(" [*] LockeAI Worker rodando. Aguardando mensagens...")
        
        channel.basic_qos(prefetch_count=1)
        
        channel.basic_consume(queue=RABBITMQ_QUEUE_INPUT, on_message_callback=callback)
        channel.start_consuming()

    except KeyboardInterrupt:
        logging.info('Worker interrompido pelo usuário')
    except Exception as e:
        logging.error(f"Erro de conexão com RabbitMQ: {e}")
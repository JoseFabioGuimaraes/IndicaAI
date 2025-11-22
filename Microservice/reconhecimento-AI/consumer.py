import json
import pika
import os
import logging
import requests
import numpy as np
import cv2
from insightface.app import FaceAnalysis

# --- Configuração de Log e Ambiente ---
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'rabbitmq')
# A MUDANÇA ESTÁ AQUI: Escuta a fila intermediária
QUEUE_INPUT = 'validacao.biometria.request' 
# Responde para o Java
QUEUE_OUTPUT = 'validacao.documento.response'

# --- Inicialização do Modelo (InsightFace) ---
# Carregamos fora do loop para não travar a cada requisição
logging.info("Carregando modelo InsightFace...")
app = FaceAnalysis(name='buffalo_l', providers=['CPUExecutionProvider'])
app.prepare(ctx_id=0, det_size=(640, 640))
logging.info("Modelo carregado!")

def download_image(url):
    """Baixa a imagem e converte para formato OpenCV (numpy)"""
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code != 200:
            return None
        image_array = np.asarray(bytearray(resp.content), dtype="uint8")
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        return image
    except Exception as e:
        logging.error(f"Erro download imagem: {e}")
        return None

def processar_biometria(url_rosto, url_doc):
    """Logica Core de Reconhecimento"""
    img_rosto = download_image(url_rosto)
    img_doc = download_image(url_doc)

    if img_rosto is None or img_doc is None:
        return False, "Erro ao baixar uma das imagens."

    faces_rosto = app.get(img_rosto)
    faces_doc = app.get(img_doc)

    # Validação básica de detecção
    if len(faces_rosto) == 0:
        return False, "Nenhum rosto detectado na selfie."
    if len(faces_doc) == 0:
        return False, "Nenhum rosto detectado no documento."

    # Pega o primeiro rosto (mais proeminente)
    emb_rosto = faces_rosto[0].embedding
    emb_doc = faces_doc[0].embedding

    # Cálculo da similaridade (Cosseno)
    sim = np.dot(emb_rosto, emb_doc) / (np.linalg.norm(emb_rosto) * np.linalg.norm(emb_doc))
    
    logging.info(f"Similaridade calculada: {sim}")

    if sim >= 0.4: # Seu threshold definido
        return True, "Validação biométrica realizada com sucesso."
    else:
        return False, "O rosto da selfie não confere com o documento."

def callback(ch, method, properties, body):
    try:
        dados = json.loads(body)
        func_id = dados.get('funcionarioId')
        logging.info(f" [ReconhecimentoAI] Iniciando análise para ID: {func_id}")

        aprovado, motivo = processar_biometria(
            dados.get('fotoRostoUrl'), 
            dados.get('fotoDocumentoUrl')
        )

        # Monta resposta final para o Java
        payload = {
            "funcionarioId": func_id,
            "aprovado": aprovado,
            "motivoRejeicao": motivo if not aprovado else None
        }

        channel.basic_publish(
            exchange='',
            routing_key=QUEUE_OUTPUT,
            body=json.dumps(payload)
        )
        logging.info(f" [ReconhecimentoAI] Resultado enviado para Java: {aprovado}")

    except Exception as e:
        logging.error(f"Erro fatal: {e}")

    ch.basic_ack(delivery_tag=method.delivery_tag)

# --- Loop Principal ---
if __name__ == "__main__":
    while True:
        try:
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host=RABBITMQ_HOST, port=5672)
            )
            channel = connection.channel()
            
            # Declara as filas necessárias
            channel.queue_declare(queue=QUEUE_INPUT, durable=True)
            channel.queue_declare(queue=QUEUE_OUTPUT, durable=True)

            logging.info(f" [*] ReconhecimentoAI aguardando na fila '{QUEUE_INPUT}'")
            channel.basic_qos(prefetch_count=1)
            channel.basic_consume(queue=QUEUE_INPUT, on_message_callback=callback)
            channel.start_consuming()
        except Exception as e:
            logging.error(f"Conexão caiu, tentando reconectar em 5s... Erro: {e}")
            import time
            time.sleep(5)
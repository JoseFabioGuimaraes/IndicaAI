import json
import pika
import os
import logging
import requests
import numpy as np
import cv2
import base64
import urllib.request
from insightface.app import FaceAnalysis

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'rabbitmq')
QUEUE_INPUT = 'validacao.biometria.request' 
QUEUE_OUTPUT = 'validacao.documento.response'

logging.info("Carregando modelo InsightFace...")
app = FaceAnalysis(name='buffalo_l', providers=['CPUExecutionProvider'])
app.prepare(ctx_id=0, det_size=(640, 640))
logging.info("Modelo carregado!")

def carregar_imagem(source):
    try:
        if source.startswith("data:image") or source.startswith("JVBER") or len(source) > 2000:
            if "," in source:
                source = source.split(",")[1]
            
            image_data = base64.b64decode(source)
            image_array = np.asarray(bytearray(image_data), dtype="uint8")
            return cv2.imdecode(image_array, cv2.IMREAD_COLOR)

        if source.startswith("http"):
            resp = requests.get(source, timeout=10)
            if resp.status_code == 200:
                image_array = np.asarray(bytearray(resp.content), dtype="uint8")
                return cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    except Exception as e:
        logging.error(f"Erro ao processar imagem: {e}")
    return None

def processar_biometria(url_rosto, url_doc):
    img_rosto = carregar_imagem(url_rosto)
    img_doc = carregar_imagem(url_doc)

    if img_rosto is None or img_doc is None:
        return False, "Erro ao baixar ou decodificar uma das imagens."

    faces_rosto = app.get(img_rosto)
    faces_doc = app.get(img_doc)

    if len(faces_rosto) == 0:
        return False, "Nenhum rosto detectado na selfie."
    if len(faces_doc) == 0:
        return False, "Nenhum rosto detectado no documento."

    emb_rosto = faces_rosto[0].embedding
    emb_doc = faces_doc[0].embedding

    sim = np.dot(emb_rosto, emb_doc) / (np.linalg.norm(emb_rosto) * np.linalg.norm(emb_doc))
    
    logging.info(f"Similaridade calculada: {sim}")

    if sim >= 0.4:
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

if __name__ == "__main__":
    while True:
        try:
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host=RABBITMQ_HOST, port=5672)
            )
            channel = connection.channel()
            
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
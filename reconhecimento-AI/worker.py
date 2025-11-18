import os
import warnings
import pika
import json
import logging
from deepface import DeepFace
from scipy.spatial.distance import cosine
import time

os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
warnings.filterwarnings("ignore")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - (Worker) - %(message)s"
)

MODELO_FACIAL = "Facenet"
DETECTOR_FACIAL = "mtcnn"
LIMIAR_FACIAL = 0.50

RABBITMQ_HOST = 'localhost'
RABBITMQ_QUEUE = 'fila_de_verificacao'

def processar_trabalho(job_data: dict):
    job_id = job_data.get("job_id", "ID_DESCONHECIDO")
    selfie_path = job_data.get("selfie_path")
    document_path = job_data.get("document_path")

    if not selfie_path or not document_path:
        logging.error(f"Trabalho {job_id} com dados incompletos. Descartando.")
        return

    logging.info(f"Iniciando processamento do Job {job_id}...")

    try:
        embedding_selfie = DeepFace.represent(
            img_path=selfie_path,
            model_name=MODELO_FACIAL,
            detector_backend=DETECTOR_FACIAL,
            enforce_detection=True
        )[0]["embedding"]
        
        embedding_document = DeepFace.represent(
            img_path=document_path,
            model_name=MODELO_FACIAL,
            detector_backend=DETECTOR_FACIAL,
            enforce_detection=True
        )[0]["embedding"]
        
        distance = float(cosine(embedding_selfie, embedding_document))
        is_same_person = distance < LIMIAR_FACIAL
        message = "VERIFICADO: Os rostos são da mesma pessoa." if is_same_person else "FALHA: Os rostos são de pessoas diferentes."

        logging.info(f"--- RESULTADO DO JOB {job_id} ---")
        logging.info(f"  Distância: {distance}")
        logging.info(f"  Resultado: {message}")
        logging.info(f"----------------------------------")
    
    except Exception as e:
        logging.error(f"Falha ao processar Job {job_id}: {e}")
    
    finally:
        try:
            os.remove(selfie_path)
            os.remove(document_path)
            logging.info(f"Arquivos do Job {job_id} limpos.")
        except OSError as e:
            logging.warning(f"Não foi possível limpar os arquivos do Job {job_id}: {e}")

def main():
    logging.info("Tentando conectar ao RabbitMQ...")
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
        channel = connection.channel()

        channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)
        
        channel.basic_qos(prefetch_count=1)

        def callback(ch, method, properties, body):
            job_data = json.loads(body.decode('utf-8'))
            logging.info(f"Job {job_data.get('job_id')} recebido.")
            
            try:
                processar_trabalho(job_data)
                ch.basic_ack(delivery_tag=method.delivery_tag)
                logging.info(f"Job {job_data.get('job_id')} finalizado e ACK enviado.")
            except Exception as e:
                logging.error(f"Erro no processamento do callback: {e}")
                ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

        channel.basic_consume(queue=RABBITMQ_QUEUE, on_message_callback=callback)

        logging.info(f"[*] Worker iniciado. Aguardando trabalhos na fila '{RABBITMQ_QUEUE}'. Pressione CTRL+C para sair.")
        channel.start_consuming()

    except pika.exceptions.AMQPConnectionError as e:
        logging.error(f"Falha ao conectar ou consumir do RabbitMQ: {e}. Tentando novamente em 5s...")
        time.sleep(5)
        main()
    except KeyboardInterrupt:
        logging.info("Desligando o worker...")
        connection.close()

if __name__ == "__main__":
    main()
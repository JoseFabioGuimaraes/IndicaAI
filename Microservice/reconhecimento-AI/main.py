import os
import uvicorn
import warnings
import uuid
import pika
import json
from fastapi import FastAPI, UploadFile, File, HTTPException, status
from pydantic import BaseModel
import logging

os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
warnings.filterwarnings("ignore")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

RABBITMQ_HOST = os.getenv('RABBITMQ_HOST','localhost')
RABBITMQ_QUEUE = 'fila_de_verificacao'

os.makedirs("uploads", exist_ok=True)

class JobResponse(BaseModel):
    message: str
    job_id: str

app = FastAPI(
    title="Serviço de Verificação Facial",
    description="API que enfileira trabalhos de comparação de rostos.",
    version="1.0.0"
)

logging.info("API de Verificação Facial (Produtor) inicializada.")

@app.post("/reconhecimento-facial", 
          response_model=JobResponse, 
          status_code=status.HTTP_202_ACCEPTED)
async def enfileirar_verificacao(
    selfie_file: UploadFile = File(...),
    document_file: UploadFile = File(...)
):
    try:
        job_id = str(uuid.uuid4())
        
        selfie_path = f"uploads/{job_id}_selfie.jpg"
        document_path = f"uploads/{job_id}_doc.jpg"
        
        with open(selfie_path, "wb") as f:
            f.write(await selfie_file.read())
            
        with open(document_path, "wb") as f:
            f.write(await document_file.read())

        logging.info(f"Arquivos salvos: {selfie_path}, {document_path}")

        job_data = {
            "job_id": job_id,
            "selfie_path": selfie_path,
            "document_path": document_path
        }
        message_body = json.dumps(job_data)

        try:
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
            channel = connection.channel()
            
            channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)
            
            channel.basic_publish(
                exchange='',
                routing_key=RABBITMQ_QUEUE,
                body=message_body,
                properties=pika.BasicProperties(
                    delivery_mode=2,
                ))
            
            connection.close()
            
            logging.info(f"Trabalho {job_id} enviado para a fila {RABBITMQ_QUEUE}.")

        except pika.exceptions.AMQPConnectionError as e:
            logging.error(f"Não foi possível conectar ao RabbitMQ: {e}")
            raise HTTPException(status_code=503, detail="Serviço de enfileiramento indisponível.")

        return JobResponse(
            message="Verificação enfileirada para processamento.",
            job_id=job_id
        )

    except Exception as e:
        logging.error(f"Erro inesperado ao enfileirar: {e}")
        raise HTTPException(status_code=500, detail=f"Erro geral do servidor: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
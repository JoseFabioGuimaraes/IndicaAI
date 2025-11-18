import os
import uvicorn
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
import io
import warnings
import logging

os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
warnings.filterwarnings("ignore")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

MODEL_PATH = "models/my_classifier_v3.h5"
CLASSIFIER_IMG_SIZE = (224, 224)
LIMIAR_CLASSIFICADOR = 0.45

class ClassifierResponse(BaseModel):
    is_document: bool
    score: float
    message: str

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
            logging.error("Tentativa de predição sem modelo carregado.")
            raise HTTPException(status_code=500, detail="Modelo indisponível.")
        
        processed_img = self._prepare_image(image_bytes)
        prediction = self.model.predict(processed_img)
        score = prediction[0][0]

        logging.info(f"Score gerado pelo modelo: {score}")

        is_document = score < LIMIAR_CLASSIFICADOR
        return is_document, float(score)

app = FastAPI(
    title="Serviço Classificador de Documentos",
    description="API para verificar se uma imagem é um documento de identidade.",
    version="1.0.0"
)

classifier = DocumentClassifier(MODEL_PATH)

@app.post("/is-document", response_model=ClassifierResponse)
async def check_is_document(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        is_doc, score = classifier.predict(image_bytes)
        message = "A imagem é um documento." if is_doc else "A imagem NÃO é um documento."

        logging.info(f"Resultado: {message} | Score: {score}")

        return ClassifierResponse(is_document=is_doc, score=score, message=message)
    except Exception as e:
        logging.error(f"Erro ao processar imagem: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao processar imagem: {e}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

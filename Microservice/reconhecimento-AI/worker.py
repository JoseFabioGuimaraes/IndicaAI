import cv2
import numpy as np
import insightface
from insightface.app import FaceAnalysis
import urllib.request

# Inicializa o modelo uma vez só (para não carregar a cada mensagem)
app = FaceAnalysis(name='buffalo_l', providers=['CPUExecutionProvider'])
app.prepare(ctx_id=0, det_size=(640, 640))

def download_image(url):
    resp = urllib.request.urlopen(url)
    image = np.asarray(bytearray(resp.read()), dtype="uint8")
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    return image

# A função agora APENAS processa e retorna True/False
def processar_reconhecimento(url_rosto, url_documento):
    try:
        img_rosto = download_image(url_rosto)
        img_doc = download_image(url_documento)

        faces_rosto = app.get(img_rosto)
        faces_doc = app.get(img_doc)

        if len(faces_rosto) == 0 or len(faces_doc) == 0:
            return {"aprovado": False, "motivo": "Rosto não detectado em uma das fotos"}

        # Pega o primeiro rosto encontrado
        embedding_rosto = faces_rosto[0].embedding
        embedding_doc = faces_doc[0].embedding

        # Calcula similaridade
        sim = np.dot(embedding_rosto, embedding_doc) / (np.linalg.norm(embedding_rosto) * np.linalg.norm(embedding_doc))
        
        if sim >= 0.4: # Seu threshold atual
            return {"aprovado": True, "motivo": "Validado com sucesso"}
        else:
            return {"aprovado": False, "motivo": "Biometria não confere"}

    except Exception as e:
        return {"aprovado": False, "motivo": f"Erro no processamento: {str(e)}"}
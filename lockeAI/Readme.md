# LockeAI: Serviço Classificador de Documentos

Esta é uma API de microserviço em Python/FastAPI que usa um modelo de Visão Computacional (TensorFlow/MobileNetV2) para determinar se uma imagem é um documento de identidade.

## Instalação (com Poetry)

1.  **Clone o projeto:**
    ```bash
    git clone ...
    cd lockeAI
    ```

2.  **Instale as dependências:**
    (É necessário ter o Poetry instalado: `pip install poetry`)
    ```bash
    poetry install
    ```

## Como Executar

Execute o servidor Uvicorn usando o Poetry. O modelo (`my_classifier_v3.h5`) deve estar na pasta `models/`.

```bash
poetry run uvicorn main:app --port 8000 --reload
```

O servidor estará disponível em `http://127.0.0.1:8000`.

## Como Testar

Acesse a documentação interativa (Swagger UI) gerada automaticamente pelo FastAPI:

**`http://127.0.0.1:8000/docs`**

### Endpoint

* **POST** `/is-document`
* **Body:** `multipart/form-data`
* **Key:** `file`
* **Value:** (O arquivo de imagem)
# Microservice/reconhecimento-AI/Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Instala dependências do sistema necessárias para OpenCV e InsightFace
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml poetry.lock* ./

# Instala as dependências do projeto
# IMPORTANTE: Certifique-se de ter rodado "poetry add pika" antes
RUN pip install poetry && \
    poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi --no-root

COPY . .

CMD ["python", "consumer.py"]
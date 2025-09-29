# Dockerfile for Django backend
FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema necesarias para dlib y face-recognition
RUN apt-get update && apt-get install -y \
    cmake \

    build-essential \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgtk-3-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["sh", "-c", "python manage.py migrate --noinput && python manage.py runserver 0.0.0.0:8000"]

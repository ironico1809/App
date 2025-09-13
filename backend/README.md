# Backend (Django + PostgreSQL)

Este proyecto usa Django como framework backend y PostgreSQL como base de datos. Incluye Django REST Framework para exponer una API.

## Requisitos
- Python 3.10+
- PostgreSQL

## Instalación
1. Crea un entorno virtual:
   ```sh
   python -m venv venv
   venv\Scripts\activate
   ```
2. Instala dependencias:
   ```sh
   pip install django djangorestframework psycopg2-binary
   ```
3. Crea el proyecto Django:
   ```sh
   django-admin startproject backend .
   ```
4. Configura la base de datos en `backend/settings.py`:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'nombre_db',
           'USER': 'usuario_db',
           'PASSWORD': 'contraseña_db',
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }
   ```
5. Realiza migraciones:
   ```sh
   python manage.py migrate
   ```
6. Ejecuta el servidor:
   ```sh
   python manage.py runserver
   ```

## Notas
- Cambia los valores de la base de datos según tu configuración local.
- La API estará disponible en http://localhost:8000/
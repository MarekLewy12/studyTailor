#!/usr/bin/env bash
# Instalowanie zależności, zbieranie statycznych plików i migracja bazy danych
echo "Building the project..."
python -m pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
#!/usr/bin/env bash
# Instalowanie zależności, zbieranie statycznych plików i migracja bazy danych
echo "Building the project..."
python -m pip install -r requirements.txt

echo "Making migrations..."
cd backend  # Przechodzimy do katalogu z manage.py
python manage.py makemigrations
python manage.py migrate

echo "Collecting static files..."
python manage.py collectstatic --no-input

echo "Build completed!"
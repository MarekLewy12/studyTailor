release: cd backend && python manage.py collectstatic --noinput
web: cd backend && gunicorn studyPlanner.wsgi --workers 1 --threads 4 --preload --max-requests 200 --max-requests-jitter 50 --log-file -
worker: cd backend && celery -A studyPlanner worker --loglevel=info -c 1

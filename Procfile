web: cd backend && gunicorn studyPlanner.wsgi --log-file -
worker: cd backend && celery -A studyPlanner worker --loglevel=info -c 1
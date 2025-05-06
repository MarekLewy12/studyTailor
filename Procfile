web: cd backend && gunicorn studyPlanner.wsgi \
      --workers 1 \            # jeden proces
      --threads 4 \            # 4 wątki
      --preload \              # biblioteki ładują się raz
      --max-requests 200 \
      --max-requests-jitter 50 \
      --log-file -
worker: cd backend && celery -A studyPlanner worker --loglevel=info -c 1

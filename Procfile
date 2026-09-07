release: cd backend && python manage.py migrate --noinput && python manage.py collectstatic --noinput --clear
web: cd backend && gunicorn prokope.wsgi
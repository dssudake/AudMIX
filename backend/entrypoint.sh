#!/bin/sh

python manage.py flush --no-input
python manage.py makemigrations
python manage.py makemigrations file_upload
python manage.py migrate

exec "$@"
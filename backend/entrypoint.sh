#!/bin/sh

# python manage.py flush --no-input
python manage.py makemigrations
python manage.py makemigrations processAPI
python manage.py migrate

exec "$@"
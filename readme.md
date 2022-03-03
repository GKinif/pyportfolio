# Bookmarks

## Starting Project

> docker compose up

## Migrate Database

> docker compose exec web python manage.py migrate

## Create super user

> docker compose exec web python manage.py createsuperuser

## Create new app

> docker compose exec web python manage.py startapp [app name]

## Create new migration

> docker compose exec web python manage.py makemigrations [app name]

## Add a new python dependency

> docker compose exec web poetry add [package]

## Source

- Django 3 by Example
  - > https://learning.oreilly.com/library/view/django-3-by/9781838981952/

- Dockerizing Django
  - > https://testdriven.io/blog/dockerizing-django-with-postgres-gunicorn-and-nginx/

- Docker Compose django postgres
  - > https://docs.docker.com/samples/django/


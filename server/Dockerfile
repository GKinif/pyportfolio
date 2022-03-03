FROM python:3.9.6-slim as requirements

ARG YOUR_ENV
ARG POETRY_VERSION

ENV PYTHONDONTWRITEBYTECODE 1
ENV POETRY_VERSION $POETRY_VERSION

RUN apt-get update && apt-get install -y curl
RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -
ENV PATH="${PATH}:/root/.poetry/bin"

RUN mkdir /app

# Copy only requirements to cache them in docker layer
WORKDIR /app
COPY ./pyproject.toml pyproject.toml
COPY ./poetry.lock poetry.lock

RUN poetry export -f requirements.txt $(test "$YOUR_ENV" == production && echo "--no-dev") --without-hashes -o /app/requirements.txt


FROM python:3.9.6-slim

ARG YOUR_ENV
ARG POETRY_VERSION

ENV YOUR_ENV=${YOUR_ENV} \
  PYTHONFAULTHANDLER=1 \
  PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1 \
  PYTHONHASHSEED=random \
  PIP_NO_CACHE_DIR=off \
  PIP_DISABLE_PIP_VERSION_CHECK=on \
  PIP_DEFAULT_TIMEOUT=100 \
  POETRY_VERSION=$POETRY_VERSION

# Project initialization:
#RUN poetry config virtualenvs.create false \
#  && poetry install $(test "$YOUR_ENV" == production && echo "--no-dev") --no-interaction --no-ansi

WORKDIR /app

RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*
COPY --from=requirements /app/requirements.txt .

RUN pip install -r requirements.txt
RUN apt-get purge -y --auto-remove gcc

# Creating folders, and files for a project:
COPY . /app

# EXPOSE 8000

# CMD ["gunicorn", "--access-logfile", "-", "--error-logfile", "-", "-b", "0.0.0.0:8000", "app.wsgi", "-w", "4", "--preload"]

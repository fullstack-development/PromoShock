# PromoShock Backend

PromoShock Backend is a Python project for indexing information stored on BNB for TicketFactory and PromoFactory contracts. Powered by FastAPI and SQLAlchemy.

## Installation

Use [pipenv](https://pipenv.pypa.io/en/latest/) to run and install the project.

```bash
pipenv install
```

## Start the server

```bash
pipenv run uvicorn server.fast_api:app --reload --host 0.0.0.0 --log-config log_conf.yaml
```

## Use docker

Alternatively you can use `docker-compose` to start necessary services for local development. Use `docker-compose.yaml` located at root of the project and run:

```bash
docker-compose up -d
```

The server should be reacheable through 5005 port.

## OpenAPI

With FastAPI you can view OpenAPI schema by calling `http://localhost:5005/docs`.

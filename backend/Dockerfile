FROM python:3.9-slim-buster

COPY requirements.txt /tmp
RUN pip install -r /tmp/requirements.txt


RUN mkdir -p /code
COPY *.py /code/
WORKDIR /code
CMD uvicorn server.fast_api:app --reload --port 80 --host 0.0.0.0

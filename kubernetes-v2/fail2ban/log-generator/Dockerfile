FROM python:3.11-alpine

WORKDIR /app

RUN pip install requests

COPY generator.py .

CMD ["python", "generator.py"]

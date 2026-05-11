import json
import os
import time

import pika

RABBITMQ_HOST = os.environ.get("RABBITMQ_HOST", "localhost")
ANIMAL_ID = os.environ.get("ANIMAL_ID", "cow-001")


def connect(queue_name: str):
    while True:
        try:
            conn = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
            ch = conn.channel()
            ch.queue_declare(queue=queue_name, durable=True)
            return conn, ch
        except pika.exceptions.AMQPConnectionError:
            print("RabbitMQ not ready, retrying in 3s...")
            time.sleep(3)


def publish(ch, queue: str, payload: dict):
    ch.basic_publish(
        exchange="",
        routing_key=queue,
        body=json.dumps(payload),
        properties=pika.BasicProperties(delivery_mode=2),
    )

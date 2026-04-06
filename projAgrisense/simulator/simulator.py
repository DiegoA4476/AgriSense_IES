import json
import math
import os
import random
import time

import pika

RABBITMQ_HOST = os.environ.get("RABBITMQ_HOST", "localhost")
ANIMAL_ID = "cow-001"
METRICS_QUEUE = "animal.metrics"
WEIGHT_QUEUE = "animal.weight"


def connect():
    while True:
        try:
            conn = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
            ch = conn.channel()
            ch.queue_declare(queue=METRICS_QUEUE, durable=True)
            ch.queue_declare(queue=WEIGHT_QUEUE, durable=True)
            return conn, ch
        except pika.exceptions.AMQPConnectionError:
            print("RabbitMQ not ready, retrying in 3s...")
            time.sleep(3)


def publish(ch, queue, payload):
    ch.basic_publish(
        exchange="",
        routing_key=queue,
        body=json.dumps(payload),
        properties=pika.BasicProperties(delivery_mode=2),
    )


def main():
    conn, ch = connect()
    t = 0
    last_weight_time = 0

    while True:
        now = time.time()
        t += 1

        heart_rate = int(65 + 10 * math.sin(t * 0.3) + random.uniform(-2, 2))
        temperature = round(38.5 + 0.5 * math.sin(t * 0.2) + random.uniform(-0.1, 0.1), 2)
        stress = round(min(10.0, max(0.0, 5 + 4 * math.sin(t * 0.15) + random.uniform(-0.5, 0.5))), 1)
        movement = random.randint(0, 20)

        publish(ch, METRICS_QUEUE, {
            "animalId": ANIMAL_ID,
            "timestamp": now,
            "heartRate": heart_rate,
            "temperature": temperature,
            "stressLevel": stress,
            "movement": movement,
        })
        print(f"[metrics] hr={heart_rate} temp={temperature} stress={stress} mov={movement}")

        if now - last_weight_time >= 60:
            weight = round(320 + random.uniform(-2, 2), 1)
            publish(ch, WEIGHT_QUEUE, {
                "animalId": ANIMAL_ID,
                "timestamp": now,
                "weight": weight,
            })
            print(f"[weight] {weight} kg")
            last_weight_time = now

        time.sleep(3)


if __name__ == "__main__":
    main()

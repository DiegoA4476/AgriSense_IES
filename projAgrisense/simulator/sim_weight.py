import random
import time

from base import ANIMAL_ID, connect, publish

QUEUE = "animal.weight"

conn, ch = connect(QUEUE)
while True:
    value = round(320 + random.uniform(-2, 2), 1)
    publish(ch, QUEUE, {"animalId": ANIMAL_ID, "timestamp": time.time(), "weight": value})
    print(f"[weight] {value} kg")
    time.sleep(60)

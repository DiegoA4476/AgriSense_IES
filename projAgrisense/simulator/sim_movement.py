import random
import time

from base import ANIMAL_ID, connect, publish

QUEUE = "animal.movement"

conn, ch = connect(QUEUE)
while True:
    value = random.randint(0, 20)
    publish(ch, QUEUE, {"animalId": ANIMAL_ID, "timestamp": time.time(), "movement": value})
    print(f"[movement] {value}")
    time.sleep(3)

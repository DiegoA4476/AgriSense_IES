import math
import random
import time

from base import ANIMAL_ID, connect, publish

QUEUE = "animal.temperature"

conn, ch = connect(QUEUE)
t = 0
while True:
    t += 1
    value = round(38.5 + 0.5 * math.sin(t * 0.2) + random.uniform(-0.1, 0.1), 2)
    publish(ch, QUEUE, {"animalId": ANIMAL_ID, "timestamp": time.time(), "temperature": value})
    print(f"[temperature] {value} °C")
    time.sleep(3)

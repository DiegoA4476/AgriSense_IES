import math
import random
import time

from base import ANIMAL_ID, connect, publish

QUEUE = "animal.stress"

conn, ch = connect(QUEUE)
t = 0
while True:
    t += 1
    value = round(min(10.0, max(0.0, 5 + 4 * math.sin(t * 0.15) + random.uniform(-0.5, 0.5))), 1)
    publish(ch, QUEUE, {"animalId": ANIMAL_ID, "timestamp": time.time(), "stressLevel": value})
    print(f"[stress] {value}")
    time.sleep(3)

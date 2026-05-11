import math
import random
import time

from base import ANIMAL_ID, connect, publish

QUEUE = "animal.heart_rate"

conn, ch = connect(QUEUE)
t = 0
while True:
    t += 1
    value = int(65 + 10 * math.sin(t * 0.3) + random.uniform(-2, 2))
    publish(ch, QUEUE, {"animalId": ANIMAL_ID, "timestamp": time.time(), "heartRate": value})
    print(f"[heart_rate] {value} bpm")
    time.sleep(3)

import math
import random
import threading
import time

from base import animal_id, connect, get_profile, publish, sync_animals

QUEUE = "animal.heart_rate"


def run(animal, stop):
    conn, ch = connect(QUEUE)
    p = get_profile(animal["type"], "heart_rate")
    aid = animal_id(animal)
    t = 0
    while not stop.is_set():
        t += 1
        value = int(p["base"] + p["amp"] * math.sin(t * p["freq"]) + random.uniform(-p["noise"], p["noise"]))
        publish(ch, QUEUE, {"animalId": aid, "timestamp": time.time(), "heartRate": value})
        print(f"[heart_rate] {aid}: {value} bpm")
        time.sleep(3)
    conn.close()


threading.Event().wait() if False else sync_animals(run)

import math
import random
import time

from base import animal_id, connect, get_profile, publish, sync_animals

QUEUE = "animal.stress"


def run(animal, stop):
    conn, ch = connect(QUEUE)
    p = get_profile(animal["type"], "stress")
    aid = animal_id(animal)
    t = 0
    while not stop.is_set():
        t += 1
        value = round(min(10.0, max(0.0, p["base"] + p["amp"] * math.sin(t * p["freq"]) + random.uniform(-p["noise"], p["noise"]))), 1)
        publish(ch, QUEUE, {"animalId": aid, "timestamp": time.time(), "stressLevel": value})
        print(f"[stress] {aid}: {value}")
        time.sleep(3)
    conn.close()


sync_animals(run)

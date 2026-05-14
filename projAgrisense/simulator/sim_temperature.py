import math
import random
import time

from base import animal_id, connect, get_profile, publish, sync_animals

QUEUE = "animal.temperature"


def run(animal, stop):
    conn, ch = connect(QUEUE)
    p = get_profile(animal["type"], "temperature")
    aid = animal_id(animal)
    t = 0
    while not stop.is_set():
        t += 1
        value = round(p["base"] + p["amp"] * math.sin(t * p["freq"]) + random.uniform(-p["noise"], p["noise"]), 2)
        publish(ch, QUEUE, {"animalId": aid, "timestamp": time.time(), "temperature": value})
        print(f"[temperature] {aid}: {value} °C")
        time.sleep(3)
    conn.close()


sync_animals(run)

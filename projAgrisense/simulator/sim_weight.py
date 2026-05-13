import random
import time

from base import animal_id, connect, get_profile, publish, sync_animals

QUEUE = "animal.weight"


def run(animal, stop):
    conn, ch = connect(QUEUE)
    p = get_profile(animal["type"], "weight")
    aid = animal_id(animal)
    while not stop.is_set():
        value = round(max(0.1, p["base"] + random.uniform(-p["noise"], p["noise"])), 1)
        publish(ch, QUEUE, {"animalId": aid, "timestamp": time.time(), "weight": value})
        print(f"[weight] {aid}: {value} kg")
        time.sleep(60)
    conn.close()


sync_animals(run)

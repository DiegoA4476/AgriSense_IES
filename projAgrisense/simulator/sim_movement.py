import random
import time

from base import animal_id, connect, get_profile, publish, sync_animals

QUEUE = "animal.movement"


def run(animal, stop):
    conn, ch = connect(QUEUE)
    p = get_profile(animal["type"], "movement")
    aid = animal_id(animal)
    while not stop.is_set():
        value = random.randint(p["min"], p["max"])
        publish(ch, QUEUE, {"animalId": aid, "timestamp": time.time(), "movement": value})
        print(f"[movement] {aid}: {value}")
        time.sleep(3)
    conn.close()


sync_animals(run)

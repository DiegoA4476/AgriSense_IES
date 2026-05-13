import json
import os
import threading
import time

import pika
import urllib.request

RABBITMQ_HOST = os.environ.get("RABBITMQ_HOST", "localhost")
API_HOST = os.environ.get("API_HOST", "api")
API_PORT = os.environ.get("API_PORT", "8080")
POLL_INTERVAL = int(os.environ.get("POLL_INTERVAL", "30"))

SPECIES_PROFILES = {
    "cow": {
        "heart_rate":  {"base": 65,   "amp": 10,  "noise": 2,   "freq": 0.3},
        "temperature": {"base": 38.5, "amp": 0.5, "noise": 0.1, "freq": 0.2},
        "stress":      {"base": 5.0,  "amp": 4.0, "noise": 0.5, "freq": 0.15},
        "movement":    {"min": 0,     "max": 20},
        "weight":      {"base": 320,  "noise": 2},
    },
    "sheep": {
        "heart_rate":  {"base": 75,   "amp": 12,  "noise": 3,   "freq": 0.3},
        "temperature": {"base": 39.0, "amp": 0.4, "noise": 0.1, "freq": 0.2},
        "stress":      {"base": 6.0,  "amp": 3.5, "noise": 0.5, "freq": 0.15},
        "movement":    {"min": 0,     "max": 25},
        "weight":      {"base": 70,   "noise": 1},
    },
    "pork": {
        "heart_rate":  {"base": 80,   "amp": 15,  "noise": 3,   "freq": 0.3},
        "temperature": {"base": 39.2, "amp": 0.6, "noise": 0.15,"freq": 0.2},
        "stress":      {"base": 5.5,  "amp": 4.5, "noise": 0.6, "freq": 0.15},
        "movement":    {"min": 0,     "max": 30},
        "weight":      {"base": 100,  "noise": 2},
    },
}

DEFAULT_PROFILE = SPECIES_PROFILES["cow"]

# Registry of active animal threads: simulatorId -> threading.Event (stop signal)
_active: dict[str, threading.Event] = {}
_lock = threading.Lock()


def get_profile(species: str, metric: str) -> dict:
    return SPECIES_PROFILES.get(species.lower(), DEFAULT_PROFILE)[metric]


def animal_id(animal: dict) -> str:
    return animal.get("simulatorId") or f"{animal['type']}-{animal['id']}"


def fetch_animals() -> list:
    url = f"http://{API_HOST}:{API_PORT}/api/animals/all"
    try:
        with urllib.request.urlopen(url, timeout=5) as r:
            return json.loads(r.read())
    except Exception as e:
        print(f"Failed to fetch animals: {e}")
        return []


def connect(queue_name: str):
    while True:
        try:
            conn = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
            ch = conn.channel()
            ch.queue_declare(queue=queue_name, durable=True)
            return conn, ch
        except pika.exceptions.AMQPConnectionError:
            print("RabbitMQ not ready, retrying in 3s...")
            time.sleep(3)


def publish(ch, queue: str, payload: dict):
    ch.basic_publish(
        exchange="",
        routing_key=queue,
        body=json.dumps(payload),
        properties=pika.BasicProperties(delivery_mode=2),
    )


def sync_animals(run_fn):
    """Fetch current animals and start/stop threads to match. run_fn(animal, stop_event) is the sim loop."""
    while True:
        animals = fetch_animals()
        current_ids = {animal_id(a) for a in animals}

        with _lock:
            # Start new animals
            for animal in animals:
                aid = animal_id(animal)
                if aid not in _active:
                    stop = threading.Event()
                    _active[aid] = stop
                    threading.Thread(target=run_fn, args=(animal, stop), daemon=True).start()
                    print(f"[sync] Started simulator for {aid}")

            # Stop removed animals
            for aid in list(_active):
                if aid not in current_ids:
                    _active[aid].set()
                    del _active[aid]
                    print(f"[sync] Stopped simulator for {aid}")

        time.sleep(POLL_INTERVAL)

import time
import random
import requests
from datetime import datetime
import ipaddress

BACKEND_URL = "http://backend:3000/events"

IP_RANGES = {
    "north_america": [
        ("8.0.0.0", "8.255.255.255"),
        ("3.0.0.0", "3.255.255.255"),
    ],
    "europe": [
        ("51.0.0.0", "51.255.255.255"),
        ("18.184.0.0", "18.194.255.255"),
    ],
    "asia": [
        ("13.112.0.0", "13.115.255.255"),
        ("43.224.0.0", "43.255.255.255"),
    ],
    "south_america": [
        ("200.128.0.0", "200.191.255.255"),
    ],
    "africa": [
        ("102.0.0.0", "102.255.255.255"),
    ]
}

def random_ip_from_range(start, end):
    return str(
        ipaddress.IPv4Address(
            random.randint(
                int(ipaddress.IPv4Address(start)),
                int(ipaddress.IPv4Address(end))
            )
        )
    )

print("IP Generator V2 started")

while True:
    region = random.choice(list(IP_RANGES.keys()))
    ip_range = random.choice(IP_RANGES[region])
    ip = random_ip_from_range(*ip_range)

    payload = {
        "ip": ip,
        "jail": "geo-simulator"
    }

    try:
        r = requests.post(BACKEND_URL, json=payload, timeout=1)
    except Exception as e:
        print("Error:", e)

    time.sleep(2)

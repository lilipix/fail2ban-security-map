import time
import random
from datetime import datetime
import os

ips = [
    "185.220.101.45",
    "91.234.12.67",
    "203.0.113.5",
    "51.38.22.10",
    "192.168.1.10"
]

services = ["ssh", "ftp", "nginx"]

log_file = "/logs/app.log"

if not os.path.exists("/logs"):
    raise RuntimeError("/logs n'existe pas dans le conteneur")

while True:
    ip = random.choice(ips)
    service = random.choice(services)

    line = f"{datetime.now()} Failed password for {service} from {ip}\n"

    with open(log_file, "a") as f:
        f.write(line)

    print(line.strip())
    time.sleep(2)

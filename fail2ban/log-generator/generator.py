import time
import random
from datetime import datetime
import os

IP_CLUSTERS = {
    "europe_west": [
        "185.220.101.45",
        "185.220.101.46",
        "185.220.101.47"
    ],
    "russia": [
        "5.188.10.20",
        "5.188.10.21"
    ],
    "tor_exit_nodes": [
        "185.220.101.50",
        "185.220.101.51"
    ],
    "asia_east": [
        "203.0.113.5",
        "203.0.113.6"
    ]
}

users = ["root", "admin", "test", "guest"]
ports = [22]

LOG_DIR = "/logs"
LOG_FILE = f"{LOG_DIR}/app.log"

if not os.path.exists(LOG_DIR):
    raise RuntimeError("/logs n'existe pas dans le conteneur")

print("🚨 Log generator started (burst mode)")

while True:
    # Choisir une zone + une IP
    cluster = random.choice(list(IP_CLUSTERS.keys()))
    ip = random.choice(IP_CLUSTERS[cluster])

    # Nombre de tentatives consécutives (BURST)
    attempts = random.randint(4, 8)

    for _ in range(attempts):
        user = random.choice(users)

        line = (
            f"{datetime.now().strftime('%b %d %H:%M:%S')} "
            f"server sshd[1234]: "
            f"Failed password for invalid user {user} "
            f"from {ip} port 22 ssh2\n"
        )

        with open(LOG_FILE, "a") as f:
            f.write(line)

        print(line.strip())
        time.sleep(0.5)

    # Pause avant une nouvelle IP
    time.sleep(5)

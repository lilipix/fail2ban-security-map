import time
import random
from datetime import datetime
import os
import ipaddress

# Plages IP publiques géolocalisables
IP_RANGES = {
    "north_america": [
        ("3.0.0.0", "3.255.255.255"),
        ("8.0.0.0", "8.255.255.255"),
    ],
    "europe": [
        ("18.184.0.0", "18.194.255.255"),
        ("51.0.0.0", "51.255.255.255"),
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
    ],
}

USERS = ["root", "admin", "test", "guest"]
LOG_DIR = "/logs"
LOG_FILE = f"{LOG_DIR}/app.log"

if not os.path.exists(LOG_DIR):
    raise RuntimeError("/config/logs n'existe pas")

def random_ip_from_range(start, end):
    return str(
        ipaddress.IPv4Address(
            random.randint(
                int(ipaddress.IPv4Address(start)),
                int(ipaddress.IPv4Address(end))
            )
        )
    )

print("🌍 Fail2Ban world attack simulator started")

while True:
    # 1️⃣ Nombre d'IP attaquées en parallèle
    ip_count = random.randint(5, 10)

    ips = set()
    while len(ips) < ip_count:
        region = random.choice(list(IP_RANGES.keys()))
        ip_range = random.choice(IP_RANGES[region])
        ips.add(random_ip_from_range(*ip_range))

    # 2️⃣ Pour chaque IP → burst d'attaques
    for ip in ips:
        attempts = random.randint(3, 5)  # doit >= maxretry

        for _ in range(attempts):
            user = random.choice(USERS)

            line = (
                f"{datetime.now().strftime('%b %d %H:%M:%S')} "
                f"server sshd[1234]: "
                f"Failed password for invalid user {user} "
                f"from {ip} port 22 ssh2\n"
            )

            with open(LOG_FILE, "a") as f:
                f.write(line)

            print(line.strip())
            time.sleep(0.3)

    # 3️⃣ Pause avant le prochain "wave" d'attaques
    time.sleep(8)


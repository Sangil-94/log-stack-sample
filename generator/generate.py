"""가짜 JSON 로그 생성기 (샘플용)."""
import json
import os
import random
import time
from datetime import datetime, timezone

LOG_FILE = os.environ.get("LOG_FILE", "/logs/app.log")
INTERVAL = float(os.environ.get("INTERVAL_SEC", "0.5"))

SERVICES = ["api", "worker", "scheduler"]
EVENTS = [
    ("INFO", "request handled"),
    ("INFO", "job completed"),
    ("WARN", "slow response"),
    ("ERROR", "database timeout"),
    ("ERROR", "upstream unavailable"),
]
WEIGHTS = [50, 25, 12, 8, 5]

with open(LOG_FILE, "a", buffering=1, encoding="utf-8") as f:
    while True:
        level, message = random.choices(EVENTS, weights=WEIGHTS)[0]
        record = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": level,
            "service": random.choice(SERVICES),
            "message": message,
            "duration_ms": random.randint(5, 1500),
        }
        f.write(json.dumps(record) + "\n")
        time.sleep(INTERVAL)

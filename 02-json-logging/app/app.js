// 텍스트 로그와 JSON 로그를 "동시에" 기록하는 샘플 앱 (의존성 없음)
const fs = require("fs");

const LOG_DIR = process.env.LOG_DIR || "/logs";
const INTERVAL = Number(process.env.INTERVAL_MS || 500);

const textStream = fs.createWriteStream(`${LOG_DIR}/app.text.log`, { flags: "a" });
const jsonStream = fs.createWriteStream(`${LOG_DIR}/app.json.log`, { flags: "a" });

// 하나의 이벤트를 두 형식으로 기록한다 (전환기에 쓰는 이중 기록 방식)
function log(level, service, message, fields = {}) {
  const now = new Date();

  const kv = Object.entries(fields).map(([k, v]) => `${k}=${v}`).join(" ");
  const ts = now.toISOString().replace("T", " ").slice(0, 23);
  textStream.write(`${ts} [${level}] ${service}: ${message} (${kv})\n`);

  jsonStream.write(
    JSON.stringify({ timestamp: now.toISOString(), level, service, message, ...fields }) + "\n"
  );
}

const SERVICES = ["api", "worker", "scheduler"];
const EVENTS = [
  ["INFO", "request handled"],
  ["INFO", "job completed"],
  ["WARN", "slow response"],
  ["ERROR", "database timeout"],
  ["ERROR", "upstream unavailable"],
];
const WEIGHTS = [50, 25, 12, 8, 5];

function pick() {
  const total = WEIGHTS.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < EVENTS.length; i++) {
    r -= WEIGHTS[i];
    if (r < 0) return EVENTS[i];
  }
  return EVENTS[0];
}

setInterval(() => {
  const [level, message] = pick();
  const service = SERVICES[Math.floor(Math.random() * SERVICES.length)];
  log(level, service, message, {
    request_id: Math.random().toString(16).slice(2, 10),
    user_id: 1000 + Math.floor(Math.random() * 50),
    duration_ms: 5 + Math.floor(Math.random() * 1500),
  });
}, INTERVAL);

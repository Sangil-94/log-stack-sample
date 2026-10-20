# 02. 텍스트 로그 vs JSON 로그 (동시 기록 샘플)

하나의 이벤트를 **텍스트와 JSON 두 형식으로 동시에** 기록하고, Loki에서 같은 질문을 두 방식으로 조회해 비교합니다.

```
app.js ─┬─ logs/app.text.log ─┐
        └─ logs/app.json.log ─┴→ Alloy → Loki → Grafana
```

## 실행

```bash
docker compose up -d
```

- Grafana: http://localhost:3001 (Explore)
- Loki: http://localhost:3101/ready
- Alloy UI: http://localhost:12346

## 같은 질문, 두 가지 쿼리

**1초 넘게 걸린 요청**
```logql
# 텍스트: 정규식으로 직접 뽑아야 함
{job="app-text"} | regexp `duration_ms=(?P<d>\d+)` | d > 1000

# JSON: 필드 이름으로 바로
{job="app-json"} | json | duration_ms > 1000
```

**특정 사용자(user_id=1010)의 로그**
```logql
# 텍스트: 문자열 포함 검색 (user_id=10100 같은 값도 걸릴 수 있음)
{job="app-text"} |= "user_id=1010"

# JSON: 필드 값 비교 (정확히 1010만)
{job="app-json"} | json | user_id = 1010
```

**서비스별 평균 응답 시간 (최근 5분)**
```logql
# 텍스트
avg by (service) (avg_over_time({job="app-text"} | regexp `duration_ms=(?P<d>\d+)` | unwrap d [5m]))

# JSON
avg by (service) (avg_over_time({job="app-json"} | json | unwrap duration_ms [5m]))
```

## 종료 / 초기화

```bash
docker compose down -v
```

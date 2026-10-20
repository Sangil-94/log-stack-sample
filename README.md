# Log Stack Sample (Alloy + Loki + Grafana)

Docker만 있으면 로컬에서 로그 수집 파이프라인을 바로 체험할 수 있는 샘플입니다.

```
log-generator → logs/app.log → Alloy → Loki → Grafana
```

## 실행

```bash
docker compose up -d
```

- Grafana: http://localhost:3000 (익명 접속, Explore 메뉴 사용)
- Alloy UI: http://localhost:12345
- Loki 준비 확인: http://localhost:3100/ready

## LogQL 예시 (Grafana → Explore → Loki)

```logql
{job="sample-app"}
{job="sample-app", level="ERROR"}
{job="sample-app"} | json | duration_ms > 1000
sum by (level) (count_over_time({job="sample-app"}[1m]))
```

## 종료 / 초기화

```bash
docker compose down        # 중지
docker compose down -v     # 저장 데이터까지 삭제
```

## 구조

| 경로 | 역할 |
|---|---|
| `generator/generate.py` | 가짜 JSON 로그 생성 |
| `alloy/config.alloy` | 파일 읽기 → JSON 파싱 → Loki 전송 |
| `loki/loki-config.yaml` | 단일 노드 Loki 설정 |
| `grafana/provisioning/` | Loki 데이터소스 자동 등록 |

## 주의
샘플용 설정입니다(인증 없음, 익명 Admin). 운영 환경에서는 그대로 쓰지 마세요.

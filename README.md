# Log Stack Sample (Alloy + Loki + Grafana)

Docker만 있으면 로컬에서 로그 수집·조회 환경을 바로 체험할 수 있는 샘플 모음입니다.
블로그 시리즈 **"로그 중앙화 실전"** 의 예제 코드입니다.

## 예제 목록

| 예제 | 위치 | 내용 | 글 |
|---|---|---|---|
| **01. 기본 로그 수집 환경** | 저장소 루트 (이 폴더) | 가짜 JSON 로그 → Alloy → Loki → Grafana | Docker로 10분 만에 만드는 로그 수집 환경 |
| **02. 텍스트 vs JSON 로그** | [`02-json-logging/`](02-json-logging) | 한 앱이 텍스트·JSON을 동시에 기록하고 같은 질문을 두 방식으로 조회 | 텍스트 로그를 JSON 구조화 로그로 바꾸면 달라지는 것들 |

> 두 예제는 호스트 포트가 달라서 **동시에** 실행할 수 있습니다.
> 01은 Grafana `3000` / Loki `3100` / Alloy `12345`, 02는 `3001` / `3101` / `12346`입니다.

필요 환경: Docker, Docker Compose

---

# 01. 기본 로그 수집 환경

```
log-generator → logs/app.log → Alloy → Loki → Grafana
```

## 실행

```bash
docker compose up -d
```

- Grafana: http://localhost:3000 (익명 접속, Explore 메뉴 사용)
- Alloy UI: http://localhost:12345
- Loki 준비 확인: http://localhost:3100/ready (시작 직후 약 15초는 not ready일 수 있습니다)

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
| `02-json-logging/` | 02 예제 (별도 docker-compose.yml) |

---

## 주의
학습용 샘플입니다. 인증이 없고 Grafana 익명 접속이 Admin 권한으로 열려 있으니
**운영 환경에서는 그대로 쓰지 마세요.**

## 라이선스
MIT

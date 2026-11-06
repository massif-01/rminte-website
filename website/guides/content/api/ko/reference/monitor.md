# 컴퓨팅 리소스 모니터링 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [monitor.config](#monitorconfig) | 컴퓨팅 모니터 구성 가져오기 |
| [monitor.data](#monitordata) | 최신 컴퓨팅 원격 측정 데이터 가져오기 |
| [monitor.set_server](#monitorset_server) | 컴퓨팅 모니터링 서버 IP 및 포트 설정 |
| [monitor.start](#monitorstart) | 컴퓨팅 모니터링 시작 |
| [monitor.status](#monitorstatus) | 컴퓨팅 모니터 상태 가져오기 |
| [monitor.stop](#monitorstop) | 컴퓨팅 모니터링 중지 |

<a id="monitorconfig"></a>

## monitor.config

컴퓨팅 모니터 구성 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/monitor/config`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.server/port/reconnect_ms/heartbeat_timeout_ms/startup_delay_ms/auto_start/update_temp_source.

<a id="monitordata"></a>

## monitor.data

최신 컴퓨팅 원격 측정 데이터 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/monitor/data`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.timestamp, cpu의 cores/data(id/usage/freq), memory의 ram/swap used/total(MB), temperature의 cpu/soc0/soc1/soc2/tj(섭씨), power의 gpu_soc/cpu_cv/sys_5v current/average(mW), gpu.gr3d_freq_pct가 반환됩니다.

### 사용 참고 사항

유효한 컴퓨팅 데이터가 누락되면 API 처리 오류가 반환됩니다. 이는 컴퓨팅 호스트 측정항목입니다.

<a id="monitorset_server"></a>

## monitor.set_server

컴퓨팅 모니터링 서버 IP 및 포트 설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/monitor/set_server`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `server` | string | 필수 | 모니터링 서버 주소입니다. | 기본값 없음 |
| `port` | integer | 선택 사항 | 포트 1-65535; 생략은 드라이버 기본값을 따릅니다. | 0은 기본 처리를 선택합니다. |

### 요청 예시

```json
{
  "server": "192.0.2.20",
  "port": 58090
}
```

### 응답 및 완료

data.server/port/saved.

<a id="monitorstart"></a>

## monitor.start

컴퓨팅 모니터링 시작

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/monitor/start`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.started.

<a id="monitorstatus"></a>

## monitor.status

컴퓨팅 모니터 상태 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/monitor/status`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.initialized/running/connection/reconnects/messages/errors/reliability/connected_time_ms가 반환되며 last_error가 포함될 수 있습니다.

<a id="monitorstop"></a>

## monitor.stop

컴퓨팅 모니터링 중지

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/monitor/stop`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.stopped.

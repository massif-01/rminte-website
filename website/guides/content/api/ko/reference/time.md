# 시간 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [time.force_sync](#timeforce_sync) | 강제 NTP 동기화 |
| [time.info](#timeinfo) | 시간 동기화 정보 가져오기 |
| [time.set_ntp](#timeset_ntp) | NTP 서버 설정 |
| [time.set_timezone](#timeset_timezone) | 시간대 설정 |
| [time.sync](#timesync) | 브라우저에서 시간 동기화 |

<a id="timeforce_sync"></a>

## time.force_sync

강제 NTP 동기화

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/time/force_sync`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.syncing/message가 반환됩니다. 실제 동기화 여부는 time.info로 확인하세요.

<a id="timeinfo"></a>

## time.info

시간 동기화 정보 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/time/info`
**최소 액세스**: 공개

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.timestamp(Unix 시간, 초 단위), timestamp_ms, datetime/timezone, source/sync_status/synced/last_sync/sync_count/ntp_server가 반환됩니다.

<a id="timeset_ntp"></a>

## time.set_ntp

NTP 서버 설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/time/set_ntp`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `server` | string | 필수 | NTP 서버 호스트 이름 또는 주소입니다. | 기본값 없음 |
| `index` | integer | 선택 사항 | 서버 슬롯 인덱스. | 0 |

### 요청 예시

```json
{
  "server": "YOUR_NTP_SERVER",
  "index": 0
}
```

### 응답 및 완료

data.server/index/success.

<a id="timeset_timezone"></a>

## time.set_timezone

시간대 설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/time/set_timezone`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `timezone` | string | 필수 | POSIX 시간대 문자열(예: CST-8) | 기본값 없음 |

### 요청 예시

```json
{
  "timezone": "CST-8"
}
```

### 응답 및 완료

data.timezone/local_time/success.

<a id="timesync"></a>

## time.sync

브라우저에서 시간 동기화

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/time/sync`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `timestamp_ms` | integer | 필수 | Unix 타임스탬프(밀리초)입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "timestamp_ms": 1793894400000
}
```

### 응답 및 완료

data.datetime/synced/source.

### 사용 참고 사항

시스템 시간을 변경하면 인증서 유효성 확인에 영향을 줍니다. 나중에 time.info를 읽어 확인하세요.

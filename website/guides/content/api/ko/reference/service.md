# 컨트롤러 서비스 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [service.list](#servicelist) | 모든 서비스 나열 |
| [service.restart](#servicerestart) | 서비스 다시 시작 |
| [service.start](#servicestart) | 서비스 시작 |
| [service.status](#servicestatus) | 서비스 상태 가져오기 |
| [service.stop](#servicestop) | 서비스 중지 |

<a id="servicelist"></a>

## service.list

모든 서비스 나열

**메서드**: GET / POST
**경로**: `/api/v1/service/list`
**최소 액세스**: 공개

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.total/running/services가 반환됩니다. 각 항목에는 name/state/phase/healthy/start_time_ms/start_duration_ms가 포함됩니다.

<a id="servicerestart"></a>

## service.restart

서비스 다시 시작

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/service/restart`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `name` | string | 필수 | service.list에서 가져온 서비스 이름입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "name": "SERVICE_FROM_LIST"
}
```

### 응답 및 완료

data.name/status.

### 사용 참고 사항

유지보수는 네트워크, WebUI, 의존 서비스의 동작을 중단할 수 있습니다. 원격 애플리케이션은 automation.services로 관리하세요.

<a id="servicestart"></a>

## service.start

서비스 시작

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/service/start`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `name` | string | 필수 | service.list에서 가져온 서비스 이름입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "name": "SERVICE_FROM_LIST"
}
```

### 응답 및 완료

data.name/status.

### 사용 참고 사항

유지보수는 네트워크, WebUI, 의존 서비스의 동작을 중단할 수 있습니다. 원격 애플리케이션은 automation.services로 관리하세요.

<a id="servicestatus"></a>

## service.status

서비스 상태 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/service/status`
**최소 액세스**: 공개

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `name` | string | 필수 | service.list에서 가져온 서비스 이름입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "name": "webui"
}
```

### 응답 및 완료

data.name/state/phase/healthy/start_time_ms/start_duration_ms.

<a id="servicestop"></a>

## service.stop

서비스 중지

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/service/stop`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `name` | string | 필수 | service.list에서 가져온 서비스 이름입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "name": "SERVICE_FROM_LIST"
}
```

### 응답 및 완료

data.name/status.

### 사용 참고 사항

유지보수는 네트워크, WebUI, 의존 서비스의 동작을 중단할 수 있습니다. 원격 애플리케이션은 automation.services로 관리하세요.

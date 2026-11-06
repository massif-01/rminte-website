# SSH 호스트 지문 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [hosts.clear](#hostsclear) | 알려진 모든 호스트 지우기 |
| [hosts.info](#hostsinfo) | 알려진 호스트 정보 얻기 |
| [hosts.list](#hostslist) | 알려진 모든 SSH 호스트 나열 |
| [hosts.remove](#hostsremove) | 알려진 호스트 제거 |
| [hosts.update](#hostsupdate) | 호스트 지문 강제 업데이트 |

<a id="hostsclear"></a>

## hosts.clear

알려진 모든 호스트 지우기

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/hosts/clear`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.cleared.

### 사용 참고 사항

이후 SSH/SFTP 신뢰 확인에 영향을 미칩니다. 저장된 호스트 연결 정의는 삭제되지 않습니다.

<a id="hostsinfo"></a>

## hosts.info

알려진 호스트 정보 얻기

**메서드**: GET / POST
**경로**: `/api/v1/hosts/info`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `host` | string | 필수 | 원격 주소; 신뢰 레코드가 주소 및 포트와 일치합니다. | 기본값 없음 |
| `port` | integer | 선택 사항 | SSH 포트, 1-65535. | 22 |

### 요청 예시

```json
{
  "host": "192.0.2.20",
  "port": 22
}
```

### 응답 및 완료

data.host/port/type/fingerprint/added.

<a id="hostslist"></a>

## hosts.list

알려진 모든 SSH 호스트 나열

**메서드**: GET / POST
**경로**: `/api/v1/hosts/list`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.hosts/count가 반환됩니다. 각 항목에는 host/port/type/fingerprint/added가 포함됩니다.

<a id="hostsremove"></a>

## hosts.remove

알려진 호스트 제거

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/hosts/remove`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `host` | string | 필수 | 원격 주소; 신뢰 레코드가 주소 및 포트와 일치합니다. | 기본값 없음 |
| `port` | integer | 선택 사항 | SSH 포트, 1-65535. | 22 |

### 요청 예시

```json
{
  "host": "192.0.2.20"
}
```

### 응답 및 완료

data.host/port/removed.

### 사용 참고 사항

신뢰 기록을 제거해도 원격 사용자나 키의 권한이 해제되지는 않습니다. 다음 연결 전에 신원을 다시 확인하세요.

<a id="hostsupdate"></a>

## hosts.update

호스트 지문 강제 업데이트

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/hosts/update`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `host` | string | 필수 | 원격 주소; 신뢰 레코드가 주소 및 포트와 일치합니다. | 기본값 없음 |
| `port` | integer | 선택 사항 | SSH 포트, 1-65535. | 22 |

### 요청 예시

```json
{
  "host": "192.0.2.20"
}
```

### 응답 및 완료

data.host/port/updated/message.

### 사용 참고 사항

원격 호스트에 연결하고 신뢰를 업데이트합니다. 먼저 신원을 독립적으로 확인하십시오.

# GPIO API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [gpio.info](#gpioinfo) | GPIO 핀 정보 가져오기 |
| [gpio.list](#gpiolist) | 제어 가능한 모든 GPIO 핀 나열 |
| [gpio.set](#gpioset) | GPIO 레벨 설정 |
| [gpio.toggle](#gpiotoggle) | GPIO 레벨 전환 |

<a id="gpioinfo"></a>

## gpio.info

GPIO 핀 정보 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/gpio/info`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `pin` | integer | 핀 또는 이름이 필요합니다. | gpio.list의 화이트리스트 GPIO 번호입니다. | 없음 |
| `name` | string | 핀 또는 이름이 필요합니다. | gpio.list에서 얻은 핀 이름입니다. | 없음 |

### 요청 예시

```json
{
  "name": "AGX_RESET"
}
```

### 응답 및 완료

data.gpio/name/description/level/default/modified.

<a id="gpiolist"></a>

## gpio.list

제어 가능한 모든 GPIO 핀 나열

**메서드**: GET / POST
**경로**: `/api/v1/gpio/list`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.count/pins; 항목 gpio/name/description/level/default/modified.

### 사용 참고 사항

임의 GPIO 액세스가 아닌 화이트리스트 핀만 사용한 고급 유지 관리입니다.

<a id="gpioset"></a>

## gpio.set

GPIO 레벨 설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/gpio/set`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `pin` | integer | 핀 또는 이름이 필요합니다. | gpio.list의 화이트리스트 GPIO 번호입니다. | 없음 |
| `name` | string | 핀 또는 이름이 필요합니다. | gpio.list에서 얻은 핀 이름입니다. | 없음 |
| `level` | integer | 필수 | 0 또는 1. | 기본값 없음 |

### 요청 예시

```json
{
  "name": "AGX_RESET",
  "level": 0
}
```

### 응답 및 완료

data.gpio/name/level.

### 사용 참고 사항

핀은 재설정, 강제 종료 또는 USB 라우팅을 제어할 수 있습니다. 먼저 물리적 기능을 확인하세요.

<a id="gpiotoggle"></a>

## gpio.toggle

GPIO 레벨 전환

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/gpio/toggle`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `pin` | integer | 핀 또는 이름이 필요합니다. | gpio.list의 화이트리스트 GPIO 번호입니다. | 없음 |
| `name` | string | 핀 또는 이름이 필요합니다. | gpio.list에서 얻은 핀 이름입니다. | 없음 |

### 요청 예시

```json
{
  "name": "AGX_RESET"
}
```

### 응답 및 완료

data.gpio/name/previous/level.

### 사용 참고 사항

다시 호출하면 토글이 한 번 더 수행됩니다. 네트워크 시간 초과 후에 상태를 확인하지 않고 재실행하지 마세요.

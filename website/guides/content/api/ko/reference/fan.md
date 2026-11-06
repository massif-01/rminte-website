# 팬 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [fan.config](#fanconfig) | 곡선을 포함한 팬 구성 가져오기 |
| [fan.curve](#fancurve) | 팬의 온도 곡선 설정 |
| [fan.enable](#fanenable) | 팬 활성화 또는 비활성화 |
| [fan.limits](#fanlimits) | 듀티 사이클 한도 설정(min/max) |
| [fan.mode](#fanmode) | 팬 작동 모드 설정 |
| [fan.save](#fansave) | 팬 구성을 NVS에 저장 |
| [fan.set](#fanset) | 팬 속도 설정(수동 모드) |
| [fan.status](#fanstatus) | 팬 상태 가져오기 |

<a id="fanconfig"></a>

## fan.config

곡선을 포함한 팬 구성 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/fan/config`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | integer | 선택 사항 | 팬 ID; 먼저 fan.status에서 가져오세요. | 생략 시 모두 |

### 요청 예시

```json
{
  "id": 0
}
```

### 응답 및 완료

팬 하나 또는 모든 팬의 설정인 id/mode/min_duty/max_duty/invert_pwm/hysteresis/min_interval/curve가 반환됩니다. 곡선의 각 점은 temp(섭씨)/duty(퍼센트)로 구성됩니다.

<a id="fancurve"></a>

## fan.curve

팬의 온도 곡선 설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/fan/curve`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | integer | 필수 | 장치가 지원하는 범위 내의 팬 ID입니다. | 기본값 없음 |
| `curve` | array | 필수 | {temp:Celsius,duty:percent} 형식의 점을 최대 10개 지정합니다. 온도는 오름차순이어야 하며 듀티비는 0~100%입니다. | 기본값 없음 |
| `hysteresis` | number | 선택 사항 | 온도 히스테리시스, 0-20섭씨. | 현재 값 |
| `min_interval` | integer | 선택 사항 | 최소 조정 간격, 정수 100-60000밀리초. | 현재 값 |

### 요청 예시

```json
{
  "id": 0,
  "curve": [
    {
      "temp": 30,
      "duty": 30
    },
    {
      "temp": 60,
      "duty": 80
    }
  ],
  "hysteresis": 3,
  "min_interval": 2000
}
```

### 응답 및 완료

data.id/points/applied/persisted.

### 사용 참고 사항

곡선 구성과 제어 모드는 별개입니다. 구성을 다시 읽고 필요한 경우 곡선 모드를 선택합니다.

<a id="fanenable"></a>

## fan.enable

팬 활성화 또는 비활성화

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/fan/enable`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | integer | 필수 | 장치가 지원하는 범위 내의 팬 ID입니다. | 기본값 없음 |
| `enable` | boolean | 필수 | true가 활성화됩니다. false는 비활성화됩니다. | 기본값 없음 |

### 요청 예시

```json
{
  "id": 0,
  "enable": true
}
```

### 응답 및 완료

data.id/enabled.

### 사용 참고 사항

비활성화하면 냉각 성능이 저하될 수 있습니다. 온도와 보호 기능을 별도로 확인하세요.

<a id="fanlimits"></a>

## fan.limits

듀티 사이클 한도 설정(min/max)

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/fan/limits`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | integer | 필수 | 장치가 지원하는 범위 내의 팬 ID입니다. | 기본값 없음 |
| `min_duty` | integer | 선택 사항 | 최소 듀티비입니다. 0~100%이며 최댓값보다 클 수 없습니다. | 현재 값 |
| `max_duty` | integer | 선택 사항 | 최대 듀티, 0-100%. | 현재 값 |

### 요청 예시

```json
{
  "id": 0,
  "min_duty": 20,
  "max_duty": 100
}
```

### 응답 및 완료

data.id/min_duty/max_duty/applied/persisted.

<a id="fanmode"></a>

## fan.mode

팬 작동 모드 설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/fan/mode`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | integer | 필수 | 장치가 지원하는 범위 내의 팬 ID입니다. | 기본값 없음 |
| `mode` | string | 필수 | off/manual/auto/curve입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "id": 0,
  "mode": "auto"
}
```

### 응답 및 완료

data.id/mode/applied/persisted가 반환됩니다. 실행 중 설정 적용 여부와 저장 실패 여부를 구분하세요.

<a id="fansave"></a>

## fan.save

팬 구성을 NVS에 저장

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/fan/save`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | integer | 선택 사항 | 팬 ID입니다. | 모든 팬 |

### 요청 예시

```json
{}
```

### 응답 및 완료

data.status/persisted가 반환됩니다. 실패 세부 정보를 확인하고 재시작 후에도 설정이 유지된다고 가정하지 마세요.

<a id="fanset"></a>

## fan.set

팬 속도 설정(수동 모드)

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/fan/set`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | integer | 필수 | 장치가 지원하는 범위 내의 팬 ID입니다. | 기본값 없음 |
| `duty` | integer | 필수 | 요청할 듀티비입니다. 범위는 0~100%입니다. | 기본값 없음 |

공유 [데이터 모델](../response-models.md#fan)을 참조하세요.

### 요청 예시

```json
{
  "id": 0,
  "duty": 50
}
```

### 응답 및 완료

적용된 팬 상태입니다. duty_valid/duty/target_duty/mode를 확인하세요.

### 사용 참고 사항

냉각에 영향을 줍니다. 신중하게 변경하고 실제 출력과 요청한 출력을 다시 읽어 확인하세요.

<a id="fanstatus"></a>

## fan.status

팬 상태 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/fan/status`
**최소 액세스**: 공개

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | integer | 선택 사항 | 팬 ID; 먼저 fan.status에서 가져오세요. | 생략 시 모두 |

공유 [데이터 모델](../response-models.md#fan)을 참조하세요.

### 요청 예시

```json
{
  "id": 0
}
```

### 응답 및 완료

ID를 사용하면 데이터가 하나의 팬입니다. 그렇지 않으면 data.fans와 온도/temp_valid/temp_source. 팬 응답 모델을 참조하세요.

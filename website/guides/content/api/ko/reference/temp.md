# 온도 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [temp.bind](#tempbind) | 온도와 시스템 변수의 바인딩 설정·해제 |
| [temp.manual](#tempmanual) | 수동 온도 모드 조회·설정 |
| [temp.read](#tempread) | 현재 온도 읽기 |
| [temp.select](#tempselect) | 우선 온도 소스 조회·설정 |
| [temp.sources](#tempsources) | 모든 온도 소스 정보 가져오기 |
| [temp.status](#tempstatus) | 온도 시스템 상태 가져오기 |

<a id="tempbind"></a>

## temp.bind

온도와 시스템 변수의 바인딩 설정·해제

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/temp/bind`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `variables` | array | 선택 사항 | {name,weight} 항목을 최대 8개 지정합니다. 빈 배열은 다중 변수 바인딩을 해제합니다. | 변경되지 않음 |
| `variable` | string / null | 선택 사항 | 레거시 단일 변수 바인딩; null 또는 빈 문자열은 이를 지웁니다. | 변경되지 않음 |

### 요청 예시

```json
{
  "variables": [
    {
      "name": "compute.temperature",
      "weight": 1
    }
  ]
}
```

### 응답 및 완료

data.bound_variables, 바인딩 상태, 유효한 항목 수와 가중치, weighted_temp_c, partial_stale/valid가 반환됩니다. 권한이 없는 변수 값은 필터링됩니다.

### 사용 참고 사항

변수가 존재하고 숫자형 온도 값이어야 합니다. ADMIN은 바인딩 필드를 생략하여 조회할 수 있습니다. variables 또는 variable을 보내 바인딩을 변경하거나 지우려면 ROOT가 필요합니다.

<a id="tempmanual"></a>

## temp.manual

수동 온도 모드 조회·설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/temp/manual`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `enable` | boolean | 선택 사항 | 수동 온도 모드를 활성화 또는 비활성화합니다. | 변경되지 않음 |
| `temperature_c` | number | 선택 사항 | 섭씨, -50.0 ~ 150.0. | 변경되지 않음 |
| `temperature` | number | 선택 사항 | temperature_c의 별칭입니다. 가능하면 온도 필드는 하나만 보내세요. | 변경되지 않음 |
| `temperature_01c` | integer | 선택 사항 | 섭씨 10분의 1, -500 ~ 1500; 섭씨 필드가 제공되지 않은 경우 사용됩니다. | 변경되지 않음 |

### 요청 예시

```json
{
  "enable": true,
  "temperature_c": 45
}
```

### 응답 및 완료

data.manual_mode/current_temp_c/current_temp_01c/active_source.

### 사용 참고 사항

제어에 사용되는 온도 입력을 변경합니다. 수동 모드를 명시적으로 비활성화하고 테스트 후 상태를 다시 읽어옵니다.

<a id="tempread"></a>

## temp.read

현재 온도 읽기

**메서드**: GET / POST
**경로**: `/api/v1/temp/read`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `source` | string | 선택 사항 | default/local, sensor_local/agx, agx_auto/variable/manual을 사용합니다. | 현재 활성 소스 |

공유 [데이터 모델](../response-models.md#temperature)을 참조하세요.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.temperature_c/temperature_01c/source/timestamp_ms/valid가 반환됩니다. 변수 소스에는 partial_stale과 바인딩 수·가중치가 포함될 수 있습니다.

<a id="tempselect"></a>

## temp.select

우선 온도 소스 조회·설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/temp/select`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `source` | string | 선택 사항 | auto/agx/sensor/variable입니다. | 쿼리 전용 |

### 요청 예시

```json
{
  "source": "auto"
}
```

### 응답 및 완료

data.preferred_source/active_source/temperature_c/valid.

<a id="tempsources"></a>

## temp.sources

모든 온도 소스 정보 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/temp/sources`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

현재 온도/validity 플러스 공급자. Entries는 이름 포함/type/active/valid/stale/last_value_c/last_value_01c/last_update_ms/age_ms/update_count.

### 사용 참고 사항

age_ms=null은 사용할 수 있는 갱신 시각이 없음을 뜻합니다. 변수 소스는 일부 입력의 실패와 유효한 항목 수·가중치도 보고합니다.

<a id="tempstatus"></a>

## temp.status

온도 시스템 상태 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/temp/status`
**최소 액세스**: 공개

### 매개변수

기능별 매개변수는 없습니다.

공유 [데이터 모델](../response-models.md#temperature)을 참조하세요.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.initialized/manual_mode/active_source/preferred_source/temperature_c/temperature_01c/timestamp_ms/valid가 반환되며 bound_variable이 포함될 수 있습니다.

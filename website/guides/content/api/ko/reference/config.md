# 설정 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [config.delete](#configdelete) | 구성 값 삭제 |
| [config.get](#configget) | 구성 값 가져오기 |
| [config.list](#configlist) | 설정 키 나열 |
| [config.module.list](#configmodulelist) | 모든 구성 모듈 나열 |
| [config.module.reset](#configmodulereset) | 모듈 구성 재설정 |
| [config.module.save](#configmodulesave) | 모듈 구성을 NVS에 저장 |
| [config.module.set](#configmoduleset) | 모듈 구성 설정 |
| [config.module.show](#configmoduleshow) | 모듈 구성 표시 |
| [config.save](#configsave) | 구성을 스토리지에 저장 |
| [config.set](#configset) | 구성 값 설정 |

<a id="configdelete"></a>

## config.delete

구성 값 삭제

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/config/delete`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `key` | string | 필수 | 전체 구성 키 이름입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "key": "example.setting"
}
```

### 응답 및 완료

data.key/deleted.

<a id="configget"></a>

## config.get

구성 값 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/config/get`
**최소 액세스**: 공개

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `key` | string | 필수 | 전체 구성 키 이름입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "key": "system.language"
}
```

### 응답 및 완료

data.key/type/value가 반환됩니다. key=system.language만 로그인 없이 조회할 수 있고 다른 키에는 ADMIN이 필요합니다.

<a id="configlist"></a>

## config.list

설정 키 나열

**메서드**: GET / POST
**경로**: `/api/v1/config/list`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.items/file_keys/nvs_keys/total_keys.

<a id="configmodulelist"></a>

## config.module.list

모든 구성 모듈 나열

**메서드**: GET / POST
**경로**: `/api/v1/config/module/list`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.modules에 name/version/dirty/nvs_namespace/registered가 포함됩니다. 전역 순서 정보도 표시될 수 있습니다.

<a id="configmodulereset"></a>

## config.module.reset

모듈 구성 재설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/config/module/reset`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `module` | string | 필수 | net/dhcp/wifi/nat/led/fan/device/system 등을 사용합니다. 전체 지원 범위는 해당 작업 설명을 확인하세요. | 기본값 없음 |
| `persist` | boolean | 선택 사항 | 재설정 결과를 유지합니다. | false |

### 요청 예시

```json
{
  "module": "system",
  "persist": false
}
```

### 응답 및 완료

data.module/reset/persisted. 이름/버전/더러운/nvs_namespace/등록된

### 사용 참고 사항

선택한 모듈을 덮어씁니다. 먼저 필요한 설정을 읽고 유지하십시오.

<a id="configmodulesave"></a>

## config.module.save

모듈 구성을 NVS에 저장

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/config/module/save`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `module` | string | 필수 | net/dhcp/wifi/nat/led/fan/device/system 등을 사용합니다. 전체 지원 범위는 해당 작업 설명을 확인하세요. | 기본값 없음 |

### 요청 예시

```json
{
  "module": "all"
}
```

### 응답 및 완료

단일 모듈 결과, 또는 결과 모두/success_count/fail_count. 각 성공 확인/error.

<a id="configmoduleset"></a>

## config.module.set

모듈 구성 설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/config/module/set`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `module` | string | 필수 | net/dhcp/wifi/nat/led/fan/device/system 등을 사용합니다. 전체 지원 범위는 해당 작업 설명을 확인하세요. | 기본값 없음 |
| `key` | string | 필수 | 전체 구성 키 이름입니다. | 기본값 없음 |
| `value` | boolean / number / string | 필수 | 모듈 필드 유형과 일치하는 값입니다. | 기본값 없음 |

공유 [데이터 모델](../configuration-models.md#module-configuration)을 참조하세요.

### 요청 예시

```json
{
  "module": "system",
  "key": "timezone",
  "value": "CST-8"
}
```

### 응답 및 완료

data.module/key/success/dirty가 반환됩니다. 저장하려면 config.module.save를 사용하세요.

<a id="configmoduleshow"></a>

## config.module.show

모듈 구성 표시

**메서드**: GET / POST
**경로**: `/api/v1/config/module/show`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `module` | string | 필수 | net/dhcp/wifi/nat/led/fan/device/system 등을 사용합니다. 전체 지원 범위는 해당 작업 설명을 확인하세요. | 기본값 없음 |

공유 [데이터 모델](../configuration-models.md#module-configuration)을 참조하세요.

### 요청 예시

```json
{
  "module": "wifi"
}
```

### 응답 및 완료

단일 모듈은 data.module/config/dirty를 반환합니다. all은 모듈별로 묶은 결과를 반환할 수 있습니다. ADMIN 미만의 조회 결과에는 비밀번호가 생략됩니다.

<a id="configsave"></a>

## config.save

구성을 스토리지에 저장

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/config/save`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.saved가 반환됩니다. 실패 후에는 현재 상태를 보관하거나 조회하세요. 전체 저장이 완료되었다고 가정하지 마세요.

<a id="configset"></a>

## config.set

구성 값 설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/config/set`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `key` | string | 필수 | 전체 구성 키 이름입니다. | 기본값 없음 |
| `value` | boolean / number / string | 필수 | 구성 값; 객체나 배열이 아닙니다. | 기본값 없음 |

### 요청 예시

```json
{
  "key": "system.language",
  "value": "zh-CN"
}
```

### 응답 및 완료

data.key/success가 반환됩니다. 저장하려면 config.save를 별도로 호출하세요.

# 설정 패키지 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [config.pack.apply](#configpackapply) | 지원되지 않는 일반 구성 애플리케이션 |
| [config.pack.content](#configpackcontent) | 가져온 구성 팩의 내용을 해독하고 가져옵니다. |
| [config.pack.export](#configpackexport) | 암호화된 .tscfg로 구성 내보내기 |
| [config.pack.export_cert](#configpackexport_cert) | 암호화를 위한 장치 인증서 내보내기 |
| [config.pack.import](#configpackimport) | 업로드된 .tscfg 파일의 유효성을 검사합니다. |
| [config.pack.info](#configpackinfo) | 구성 팩 시스템 정보 가져오기 |
| [config.pack.list](#configpacklist) | 디렉토리의 .tscfg 파일 나열 |
| [config.pack.verify](#configpackverify) | .tscfg 패키지 서명 확인 |

<a id="configpackapply"></a>

## config.pack.apply

지원되지 않는 일반 구성 애플리케이션

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/config/pack/apply`
**최소 액세스**: ADMIN

**지원되지 않는 작업.** 더 이상 사용되지 않는 호출을 명시적으로 거부하기 위해 이름이 유지됩니다.

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `path` | string | 필수 | 절대 장치 경로; 관리되는 구성 및 민감한 파일에는 추가 제한사항이 있습니다. | 기본값 없음 |

### 요청 예시

```json
{
  "path": "/sdcard/example.tscfg"
}
```

### 응답 및 완료

data.success=false와 지원되지 않음을 나타내는 result_code/reason이 반환됩니다. 최상위 code=0이어도 설정은 적용되지 않습니다.

### 사용 참고 사항

일반 적용은 지원되지 않습니다. 개체의 전용 가져오기 흐름을 사용합니다.

<a id="configpackcontent"></a>

## config.pack.content

가져온 구성 팩의 내용을 해독하고 가져옵니다.

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/config/pack/content`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `name` | string | 필수 | 패키지 저장소에서 사용되는 패키지 이름입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "name": "example"
}
```

### 응답 및 완료

data.name/content/content_raw; 콘텐츠는 JSON을 구문 분석할 때 구조화됩니다.

### 사용 참고 사항

신뢰할 수 있는 관리자만 읽으세요. 설정의 비밀 정보를 공개 로그에 기록하지 마세요.

<a id="configpackexport"></a>

## config.pack.export

암호화된 .tscfg로 구성 내보내기

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/config/pack/export`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `name` | string | 필수 | 패키지 이름입니다. | 기본값 없음 |
| `content` | object / string | 필수 | 구성 콘텐츠를 암호화합니다. JSON으로 인코딩할 수 있어야 합니다. | 기본값 없음 |
| `recipient_cert` | string | 필수 | 수신 장치 인증서 PEM. | 기본값 없음 |
| `description` | string | 선택 사항 | 패키지 설명. | 비어 있음 |
| `save_path` | string | 선택 사항 | 선택적 SD 저장 경로. | 장치에 파일을 저장하지 않음 |

### 요청 예시

```json
{
  "name": "example",
  "content": {
    "example": true
  },
  "recipient_cert": "RECIPIENT_CERTIFICATE_PEM"
}
```

### 응답 및 완료

data.tscfg/filename/size가 반환됩니다. 요청한 파일 저장이 성공하면 saved_path도 포함됩니다.

### 사용 참고 사항

로컬 개발자 내보내기 기능이 필요합니다. 대상은 여전히 ​​패키지의 유효성을 검사하고 명시적으로 가져옵니다.

<a id="configpackexport_cert"></a>

## config.pack.export_cert

암호화를 위한 장치 인증서 내보내기

**메서드**: GET / POST
**경로**: `/api/v1/config/pack/export_cert`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.certificate/fingerprint/cn이 반환됩니다. 이 장치용으로 암호화할 때 쓰는 공개 정보이며 개인 키가 아닙니다.

<a id="configpackimport"></a>

## config.pack.import

업로드된 .tscfg 파일의 유효성을 검사합니다.

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/config/pack/import`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `content` | string | 콘텐츠 또는 경로가 필요합니다. | 임의의 Base64 페이로드가 아닌 원시 패키지 JSON 텍스트입니다. | 기본값 없음 |
| `path` | string | 콘텐츠 또는 경로가 필요합니다. | 장치에 업로드된 패키지의 절대 경로입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "path": "/sdcard/example.tscfg"
}
```

### 응답 및 완료

성공 시 data에는 valid/result_code/result_message/reason/path/saved_path, name/description/source_file/target_device/created_at, signature가 포함됩니다. 유효하지 않은 패키지는 처리 오류를 반환합니다.

### 사용 참고 사항

content는 검증된 패키지를 패키지 저장소에 저장할 수 있고 path는 해당 위치의 패키지를 검증합니다. 어느 방식도 실제 설정을 적용하지는 않습니다. 해당 객체의 가져오기 기능을 사용하세요.

<a id="configpackinfo"></a>

## config.pack.info

구성 팩 시스템 정보 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/config/pack/info`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.can_export/device_type/cert_fingerprint/cert_cn/cert_ou/pack_version/algorithm.

<a id="configpacklist"></a>

## config.pack.list

디렉토리의 .tscfg 파일 나열

**메서드**: GET / POST
**경로**: `/api/v1/config/pack/list`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `path` | string | 선택 사항 | 절대 디렉토리 경로. | /sdcard/config |

### 요청 예시

```json
{
  "path": "/sdcard/config"
}
```

### 응답 및 완료

data.files/count; 항목 이름/path/size/mtime/valid 그리고 유효한 발행인 정보.

<a id="configpackverify"></a>

## config.pack.verify

.tscfg 패키지 서명 확인

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/config/pack/verify`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `content` | string | 콘텐츠 또는 경로가 필요합니다. | 임의의 Base64 페이로드가 아닌 원시 패키지 JSON 텍스트입니다. | 기본값 없음 |
| `path` | string | 콘텐츠 또는 경로가 필요합니다. | 장치에 업로드된 패키지의 절대 경로입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "path": "/sdcard/example.tscfg"
}
```

### 응답 및 완료

data.valid/result_code/result_message/reason/signature가 반환됩니다. signature에는 valid/is_official/signer_cn/signer_ou/signed_at이 포함됩니다.

### 사용 참고 사항

중첩된 valid/reason을 확인하세요. 일반 검증 성공만으로 설정 가져오기가 완료되었다고 판단하지 마세요.

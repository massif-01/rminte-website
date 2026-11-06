# SSH 키 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [key.delete](#keydelete) | 키 삭제 |
| [key.export](#keyexport) | 공개 키 내보내기 |
| [key.exportPrivate](#keyexportprivate) | 개인 키 내보내기(내보낼 수 있는 키에만 해당) |
| [key.generate](#keygenerate) | 새 키 생성 |
| [key.info](#keyinfo) | 키 정보 가져오기 |
| [key.list](#keylist) | 저장된 모든 키 나열 |

<a id="keydelete"></a>

## key.delete

키 삭제

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/key/delete`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 로컬 키 ID입니다. | 기본값 없음 |
| `preview` | boolean | 선택 사항 | true는 연결된 호스트·실행에 미치는 영향을 미리 보고 false는 삭제합니다. | false |

### 요청 예시

```json
{
  "id": "example-key",
  "preview": true
}
```

### 응답 및 완료

미리보기: data.hosts/runs/complete. 삭제: data.id/deleted.

### 사용 참고 사항

원격 프로세스를 중지하거나 authorized_keys에서 공개 키를 제거하지는 않습니다. 삭제하면 기존 실행을 검증하거나 중지할 수 없게 될 수 있습니다.

<a id="keyexport"></a>

## key.export

공개 키 내보내기

**메서드**: GET / POST
**경로**: `/api/v1/key/export`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 로컬 키 ID입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "id": "example-key"
}
```

### 응답 및 완료

data.id/type/public_key/comment; public_key는 OpenSSH 텍스트입니다.

### 사용 참고 사항

숨겨진 키 읽기에는 적절한 역할이 필요합니다.

<a id="keyexportprivate"></a>

## key.exportPrivate

개인 키 내보내기(내보낼 수 있는 키에만 해당)

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/key/exportPrivate`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 로컬 키 ID입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "id": "example-key"
}
```

### 응답 및 완료

data.id/type/private_key/comment/warning.

### 사용 참고 사항

ADMIN과 exportable=true가 필요합니다. 키는 기본적으로 내보낼 수 없습니다. 응답은 비밀 정보로 취급하고 일반 로그에 기록하지 마세요.

<a id="keygenerate"></a>

## key.generate

새 키 생성

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/key/generate`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 로컬 키 ID입니다. | 기본값 없음 |
| `type` | string | 선택 사항 | rsa2048/rsa4096/ec256/ecdsa/ec384. | rsa2048 |
| `comment` | string | 선택 사항 | 공개 키 주석입니다. | 비어 있음 |
| `alias` | string | 선택 사항 | 표시 별칭. | 비어 있음 |
| `hidden` | boolean | 선택 사항 | 키를 숨깁니다. | false |
| `exportable` | boolean | 선택 사항 | 나중에 개인 키 내보내기를 허용합니다. | false |
| `request_id` | string | 선택 사항 | 선택적인 요청 연결 값입니다. 32바이트 미만이며 영숫자와 하이픈만 허용합니다. | 없음 |

### 요청 예시

```json
{
  "id": "example-key",
  "type": "ec256",
  "exportable": false
}
```

### 응답 및 완료

data.generated/id/type이 반환됩니다. 실패 시 failed_stage/esp_error/cleanup_complete/cleanup_error가 포함될 수 있습니다.

### 사용 참고 사항

generated를 확인하세요. 기존 ID와 생성 실패는 오류이며 키를 자동으로 덮어쓰지는 않습니다.

<a id="keyinfo"></a>

## key.info

키 정보 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/key/info`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 로컬 키 ID입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "id": "example-key"
}
```

### 응답 및 완료

data.id/type/type_desc/comment/alias/created/last_used/has_public_key/exportable/hidden.

<a id="keylist"></a>

## key.list

저장된 모든 키 나열

**메서드**: GET / POST
**경로**: `/api/v1/key/list`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.keys/count/max_keys; 메타데이터 ID/type/type_desc/comment/alias/created/last_used/has_pubkey/exportable/hidden.

### 사용 참고 사항

ADMIN 미만에는 허용된 키 메타데이터만 반환됩니다. 목록에 개인 키는 포함되지 않습니다.

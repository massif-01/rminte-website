# 장치 파일 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [storage.delete](#storagedelete) | 파일 또는 디렉토리 삭제 |
| [storage.info](#storageinfo) | 파일 정보 가져오기 |
| [storage.list](#storagelist) | 디렉터리 내용 나열 |
| [storage.mkdir](#storagemkdir) | 디렉토리 생성 |
| [storage.mount](#storagemount) | SD 카드 마운트 |
| [storage.read](#storageread) | 파일 내용 읽기 |
| [storage.rename](#storagerename) | 파일 이름 변경·이동 |
| [storage.status](#storagestatus) | 저장 상태 가져오기 |
| [storage.unmount](#storageunmount) | SD 카드 마운트 해제 |

<a id="storagedelete"></a>

## storage.delete

파일 또는 디렉토리 삭제

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/storage/delete`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `path` | string | 필수 | 절대 장치 경로; 관리되는 구성 및 민감한 파일에는 추가 제한사항이 있습니다. | 기본값 없음 |

### 요청 예시

```json
{
  "path": "/sdcard/example.txt"
}
```

### 응답 및 완료

data.deleted에는 삭제된 경로가 포함되어 있습니다.

### 사용 참고 사항

/sdcard/, /spiffs/, /www/ 아래에서 허용된 경로를 사용할 수 있습니다. 디렉터리는 재귀 삭제될 수 있지만 관리 설정과 저장소 루트는 보호됩니다.

<a id="storageinfo"></a>

## storage.info

파일 정보 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/storage/info`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `path` | string | 필수 | 절대 장치 경로; 관리되는 구성 및 민감한 파일에는 추가 제한사항이 있습니다. | 기본값 없음 |

### 요청 예시

```json
{
  "path": "/sdcard/example.txt"
}
```

### 응답 및 완료

data.path/name/type/size/modified가 반환됩니다. modified는 파일 시스템의 Unix 시간이며 초 단위입니다.

<a id="storagelist"></a>

## storage.list

디렉터리 내용 나열

**메서드**: GET / POST
**경로**: `/api/v1/storage/list`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `path` | string | 선택 사항 | 절대 디렉토리 경로. | /sdcard |
| `recursive` | boolean | 선택 사항 | 재귀 목록 조회는 구현되지 않았습니다. true를 보내도 이 디렉터리만 나열하므로 생략하는 것이 좋습니다. | false |

### 요청 예시

```json
{
  "path": "/sdcard"
}
```

### 응답 및 완료

data.path/entries가 반환되며 항목에는 name/type/size 등이 포함됩니다. 민감한 디렉터리 목록 조회에는 ADMIN이 필요합니다.

<a id="storagemkdir"></a>

## storage.mkdir

디렉토리 생성

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/storage/mkdir`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `path` | string | 필수 | 절대 장치 경로; 관리되는 구성 및 민감한 파일에는 추가 제한사항이 있습니다. | 기본값 없음 |

### 요청 예시

```json
{
  "path": "/sdcard/example"
}
```

### 응답 및 완료

data.created에는 디렉터리 경로가 포함되어 있습니다.

<a id="storagemount"></a>

## storage.mount

SD 카드 마운트

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/storage/mount`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.status가 반환되며 마운트 작업에는 path도 포함됩니다.

### 사용 참고 사항

SD를 사용하는 작업에 영향을 줍니다. 마운트를 해제하기 전에 파일·업데이트 작업을 끝내세요.

<a id="storageread"></a>

## storage.read

파일 내용 읽기

**메서드**: GET / POST
**경로**: `/api/v1/storage/read`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `path` | string | 필수 | 절대 장치 경로; 관리되는 구성 및 민감한 파일에는 추가 제한사항이 있습니다. | 기본값 없음 |

### 요청 예시

```json
{
  "path": "/sdcard/example.txt"
}
```

### 응답 및 완료

data.path/size/type/content가 반환됩니다. type=json이면 content는 파싱된 JSON이고 type=text이면 문자열입니다.

### 사용 참고 사항

최대 파일 크기는 8192바이트입니다. 민감한 경로에는 ADMIN이 필요합니다. 바이너리·대용량 파일에는 전용 다운로드 경로를 사용하세요.

<a id="storagerename"></a>

## storage.rename

파일 이름 변경·이동

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/storage/rename`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `from` | string | 필수 | 원래 절대 경로입니다. | 기본값 없음 |
| `to` | string | 필수 | 대상 절대 경로입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "from": "/sdcard/example.txt",
  "to": "/sdcard/renamed.txt"
}
```

### 응답 및 완료

data.from/to.

### 사용 참고 사항

두 경로 모두 허용된 /sdcard/, /spiffs/ 또는 /www/ 위치 내에 있어야 하며 관리 경로 검사를 통과해야 합니다. 파일 시스템 및 마운트 상태는 여전히 이동을 제한할 수 있습니다.

<a id="storagestatus"></a>

## storage.status

저장 상태 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/storage/status`
**최소 액세스**: 공개

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.sd/spiffs.

<a id="storageunmount"></a>

## storage.unmount

SD 카드 마운트 해제

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/storage/unmount`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.status가 반환되며 마운트 작업에는 path도 포함됩니다.

### 사용 참고 사항

SD를 사용하는 작업에 영향을 줍니다. 마운트를 해제하기 전에 파일·업데이트 작업을 끝내세요.

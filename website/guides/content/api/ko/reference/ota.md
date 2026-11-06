# 업데이트 및 복구 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [ota.abort](#otaabort) | 펌웨어 업데이트 취소 요청 |
| [ota.partitions](#otapartitions) | 업데이트 파티션 검사 |
| [ota.progress](#otaprogress) | 펌웨어 업데이트 진행 상황 읽기 |
| [ota.rollback](#otarollback) | 펌웨어 롤백 |
| [ota.server.get](#otaserverget) | 업데이트 서버 구성 읽기 |
| [ota.server.set](#otaserverset) | 업데이트 서버 구성 설정 |
| [ota.start_file](#otastart_file) | SD에서 펌웨어 업데이트 시작 |
| [ota.start_url](#otastart_url) | URL에서 펌웨어 업데이트 시작 |
| [ota.status](#otastatus) | 펌웨어 업데이트 상태 읽기 |
| [ota.test_connection](#otatest_connection) | 업데이트 URL 조사 |
| [ota.upgrade_file](#otaupgrade_file) | ota.start_file의 호환 별칭입니다. |
| [ota.upgrade_url](#otaupgrade_url) | ota.start_url의 호환 별칭입니다. |
| [ota.upload_abort](#otaupload_abort) | 펌웨어 업로드 제어 중단 |
| [ota.upload_begin](#otaupload_begin) | 펌웨어 업로드 제어 시작 |
| [ota.upload_end](#otaupload_end) | 펌웨어 업로드 제어 완료 |
| [ota.validate](#otavalidate) | 정상적으로 실행 중인 펌웨어 확인 |
| [ota.version](#otaversion) | 펌웨어 버전 읽기 |
| [ota.www.abort](#otawwwabort) | WWW 업데이트 취소 요청 |
| [ota.www.progress](#otawwwprogress) | WWW 업데이트 진행 상황 읽기 |
| [ota.www.start](#otawwwstart) | URL에서 WWW 업데이트 시작 |
| [ota.www.start_sdcard](#otawwwstart_sdcard) | SD에서 WWW 업데이트 시작 |

<a id="otaabort"></a>

## ota.abort

펌웨어 업데이트 취소 요청

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ota/abort`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.aborted=true; 상태를 확인하려면 해당 진행 상황을 읽어보세요.

### 사용 참고 사항

개인 작업이 아닌 현재 업데이트에 따라 작동합니다. 상태가 불분명한 동안에는 즉시 다른 업데이트를 시작하지 마십시오.

<a id="otapartitions"></a>

## ota.partitions

업데이트 파티션 검사

**메서드**: GET / POST
**경로**: `/api/v1/ota/partitions`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.running/next에는 각각 label/address/size/is_bootable이 포함되며 부팅 가능한 파티션에는 version/project도 포함됩니다. can_rollback도 반환됩니다.

<a id="otaprogress"></a>

## ota.progress

펌웨어 업데이트 진행 상황 읽기

**메서드**: GET / POST
**경로**: `/api/v1/ota/progress`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

공유 [데이터 모델](../response-models.md#ota)을 참조하세요.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.state/percent/total_size/received_size/message가 반환됩니다. state는 idle/checking/downloading/verifying/writing/pending_reboot/error 중 하나입니다.

### 사용 참고 사항

장치 전체의 진행 정보이며 로그인별 작업 결과가 아닙니다. 시작 후 진행 상황을 주기적으로 조회하세요. 진행률 100%만으로 장치가 새 버전을 실행 중이라고 판단하지 마세요.

<a id="otarollback"></a>

## ota.rollback

펌웨어 롤백

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ota/rollback`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

공유 [데이터 모델](../response-models.md#ota)을 참조하세요.

### 요청 예시

```json
{}
```

### 응답 및 완료

롤백 파티션을 선택하고 다시 시작하려고 시도합니다. 응답 전에 연결이 닫힐 수 있습니다. 반환된 경우 data.rolling_back=true입니다.

### 사용 참고 사항

먼저 ota.partitions.can_rollback을 확인하세요. 롤백 후 다시 로그인하여 버전과 설정 호환성을 확인하세요. no_reboot는 지원하지 않습니다.

<a id="otaserverget"></a>

## ota.server.get

업데이트 서버 구성 읽기

**메서드**: GET / POST
**경로**: `/api/v1/ota/server/get`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

ADMIN은 data.url/configured를 읽을 수 있고 하위 역할에는 configured만 반환됩니다.

<a id="otaserverset"></a>

## ota.server.set

업데이트 서버 구성 설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ota/server/set`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `url` | string | 필수 | 업데이트 서버 URL, 최대 255자. 빈 문자열은 이를 지웁니다. | 기본값 없음 |
| `save` | boolean | 선택 사항 | 서버 주소를 유지합니다. | false |

### 요청 예시

```json
{
  "url": "http://updates.example.com/firmware.bin",
  "save": true
}
```

### 응답 및 완료

data.url/saved.

### 사용 참고 사항

주소를 설정해도 업데이트가 시작되지 않습니다. WWW URL은 이 주소에서 파생될 수 있습니다.

<a id="otastart_file"></a>

## ota.start_file

SD에서 펌웨어 업데이트 시작

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ota/start_file`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `file` | string | 파일 또는 경로가 필요합니다. | 펌웨어 파일의 절대 경로입니다. file 사용을 권장합니다. | 기본값 없음 |
| `path` | string | 선택 사항 | file의 별칭입니다. | 공급되지 않음 |
| `auto_reboot` | boolean | 선택 사항 | 펌웨어 완료 후 자동으로 다시 시작됩니다. | true |
| `no_reboot` | boolean | 선택 사항 | auto_reboot의 역 별칭; 제공되면 이를 재정의합니다. | 기존 값을 재정의하지 않음 |
| `allow_downgrade` | boolean | 선택 사항 | 이전 버전을 허용합니다. 이미지 유효성 검사가 계속 적용됩니다. | false |
| `skip_verify` | boolean | 선택 사항 | SD 파일용 호환성 옵션입니다. TLS 연결은 없으며 펌웨어 완전성 검사를 생략하지도 않습니다. | false |

공유 [데이터 모델](../response-models.md#ota)을 참조하세요.

### 요청 예시

```json
{
  "file": "/sdcard/firmware.bin",
  "no_reboot": true
}
```

### 응답 및 완료

data.started/path.

### 사용 참고 사항

시작 성공은 요청이 시작되었음을 의미합니다. ota.progress를 읽고 다시 시작한 후 ota.status를 확인하세요. 이 하드웨어 및 파티션 레이아웃에 대한 전체 이미지를 사용하십시오.

<a id="otastart_url"></a>

## ota.start_url

URL에서 펌웨어 업데이트 시작

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ota/start_url`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `url` | string | 필수 | 전체 펌웨어 이미지의 HTTP 또는 HTTPS URL(최대 2048바이트) | 기본값 없음 |
| `auto_reboot` | boolean | 선택 사항 | 펌웨어 완료 후 자동으로 다시 시작됩니다. | true |
| `no_reboot` | boolean | 선택 사항 | auto_reboot의 역 별칭; 제공되면 이를 재정의합니다. | 기존 값을 재정의하지 않음 |
| `allow_downgrade` | boolean | 선택 사항 | 이전 버전을 허용합니다. 이미지 유효성 검사가 계속 적용됩니다. | false |
| `skip_verify` | boolean | 선택 사항 | 펌웨어 TLS 설정 범위에서 HTTPS 서버 검증 완화를 요청합니다. 연결은 여전히 실패할 수 있고 이미지 완전성 검사는 유지됩니다. 보통 false로 유지하세요. | false |

공유 [데이터 모델](../response-models.md#ota)을 참조하세요.

### 요청 예시

```json
{
  "url": "http://updates.example.com/firmware.bin",
  "no_reboot": true
}
```

### 응답 및 완료

data.started/url.

### 사용 참고 사항

시작 성공은 요청이 시작되었음을 의미합니다. ota.progress를 읽고 다시 시작한 후 ota.status를 확인하세요. 이 하드웨어 및 파티션 레이아웃에 대한 전체 이미지를 사용하십시오.

<a id="otastatus"></a>

## ota.status

펌웨어 업데이트 상태 읽기

**메서드**: GET / POST
**경로**: `/api/v1/ota/status`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.state/running/next/pending_verify가 반환되며 검증 대기 중에는 rollback_timeout이 포함됩니다. 파티션 정보에는 label/address/size와 확인 가능한 버전 정보가 포함됩니다.

### 사용 참고 사항

size는 바이트 단위입니다. 쓰기 후에는 재시작하여 실제 실행 버전을 확인하세요.

<a id="otatest_connection"></a>

## ota.test_connection

업데이트 URL 조사

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ota/test_connection`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `url` | string | 필수 | 업데이트 파일 URL입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "url": "http://updates.example.com/firmware.bin"
}
```

### 응답 및 완료

데이터에는 성공 및 연결 진단이 포함됩니다.

### 사용 참고 사항

실제 네트워크 요청을 수행합니다. 접속 성공만으로 이미지를 설치할 수 있다고 판단하지 마세요.

<a id="otaupgrade_file"></a>

## ota.upgrade_file

ota.start_file의 호환 별칭입니다.

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ota/upgrade_file`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `file` | string | 파일 또는 경로가 필요합니다. | 펌웨어 파일의 절대 경로입니다. file 사용을 권장합니다. | 기본값 없음 |
| `path` | string | 선택 사항 | file의 별칭입니다. | 공급되지 않음 |
| `auto_reboot` | boolean | 선택 사항 | 펌웨어 완료 후 자동으로 다시 시작됩니다. | true |
| `no_reboot` | boolean | 선택 사항 | auto_reboot의 역 별칭; 제공되면 이를 재정의합니다. | 기존 값을 재정의하지 않음 |
| `allow_downgrade` | boolean | 선택 사항 | 이전 버전을 허용합니다. 이미지 유효성 검사가 계속 적용됩니다. | false |
| `skip_verify` | boolean | 선택 사항 | SD 파일용 호환성 옵션입니다. TLS 연결은 없으며 펌웨어 완전성 검사를 생략하지도 않습니다. | false |

공유 [데이터 모델](../response-models.md#ota)을 참조하세요.

### 요청 예시

```json
{
  "file": "/sdcard/firmware.bin",
  "no_reboot": true
}
```

### 응답 및 완료

data.started/path.

### 사용 참고 사항

ota.start_file과 같은 매개변수, 권한, 결과를 사용하는 호환 별칭입니다.

<a id="otaupgrade_url"></a>

## ota.upgrade_url

ota.start_url의 호환 별칭입니다.

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ota/upgrade_url`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `url` | string | 필수 | 전체 펌웨어 이미지의 HTTP 또는 HTTPS URL(최대 2048바이트) | 기본값 없음 |
| `auto_reboot` | boolean | 선택 사항 | 펌웨어 완료 후 자동으로 다시 시작됩니다. | true |
| `no_reboot` | boolean | 선택 사항 | auto_reboot의 역 별칭; 제공되면 이를 재정의합니다. | 기존 값을 재정의하지 않음 |
| `allow_downgrade` | boolean | 선택 사항 | 이전 버전을 허용합니다. 이미지 유효성 검사가 계속 적용됩니다. | false |
| `skip_verify` | boolean | 선택 사항 | 펌웨어 TLS 설정 범위에서 HTTPS 서버 검증 완화를 요청합니다. 연결은 여전히 실패할 수 있고 이미지 완전성 검사는 유지됩니다. 보통 false로 유지하세요. | false |

공유 [데이터 모델](../response-models.md#ota)을 참조하세요.

### 요청 예시

```json
{
  "url": "http://updates.example.com/firmware.bin",
  "no_reboot": true
}
```

### 응답 및 완료

data.started/url.

### 사용 참고 사항

ota.start_url과 같은 매개변수, 권한, 결과를 사용하는 호환 별칭입니다.

<a id="otaupload_abort"></a>

## ota.upload_abort

펌웨어 업로드 제어 중단

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ota/upload_abort`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.aborted.

<a id="otaupload_begin"></a>

## ota.upload_begin

펌웨어 업로드 제어 시작

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ota/upload_begin`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `size` | integer | 필수 | 양수 총 펌웨어 바이트 수이며 대상 파티션에 의해 제한됩니다. | 기본값 없음 |

### 요청 예시

```json
{
  "size": 1048576
}
```

### 응답 및 완료

data.ready/expected_size.

### 사용 참고 사항

업로드를 제어하는 인터페이스입니다. 데이터 전송용 공개 upload_write API는 없으므로 begin/end만으로 펌웨어를 전송할 수 없습니다. 일반 연동에는 전체 파일 바이너리 경로를 사용하세요.

<a id="otaupload_end"></a>

## ota.upload_end

펌웨어 업로드 제어 완료

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ota/upload_end`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `auto_reboot` | boolean | 선택 사항 | 완료 시 자동으로 다시 시작됩니다. | true |

### 요청 예시

```json
{
  "auto_reboot": false
}
```

### 응답 및 완료

data.completed/reboot_pending.

### 사용 참고 사항

완전한 데이터가 포함된 활성 업로드가 필요합니다. 업로드가 활성화되지 않으면 실패합니다.

<a id="otavalidate"></a>

## ota.validate

정상적으로 실행 중인 펌웨어 확인

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ota/validate`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.validated.

### 사용 참고 사항

확인으로 롤백 상태가 변경됩니다. 먼저 실행 중인 버전과 애플리케이션 상태를 확인하세요.

<a id="otaversion"></a>

## ota.version

펌웨어 버전 읽기

**메서드**: GET / POST
**경로**: `/api/v1/ota/version`
**최소 액세스**: 공개

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.version/project/compile_date/compile_time/idf_version.

<a id="otawwwabort"></a>

## ota.www.abort

WWW 업데이트 취소 요청

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ota/www/abort`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.aborted=true; 상태를 확인하려면 해당 진행 상황을 읽어보세요.

### 사용 참고 사항

개인 작업이 아닌 현재 업데이트에 따라 작동합니다. 상태가 불분명한 동안에는 즉시 다른 업데이트를 시작하지 마십시오.

<a id="otawwwprogress"></a>

## ota.www.progress

WWW 업데이트 진행 상황 읽기

**메서드**: GET / POST
**경로**: `/api/v1/ota/www/progress`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

공유 [데이터 모델](../response-models.md#ota)을 참조하세요.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.state/percent/total/received/message/running이 반환됩니다. 완료 조건은 state=completed 및 running=false입니다.

### 사용 참고 사항

장치 전체의 진행 정보이며 로그인별 작업 결과가 아닙니다. 시작 후 진행 상황을 주기적으로 조회하세요. 진행률 100%만으로 장치가 새 버전을 실행 중이라고 판단하지 마세요.

<a id="otawwwstart"></a>

## ota.www.start

URL에서 WWW 업데이트 시작

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ota/www/start`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `url` | string | 선택 사항 | www.bin의 HTTP 또는 HTTPS URL입니다. 전체 URL을 255바이트로 제한하세요. 더 긴 입력은 전체가 유지되지 않을 수 있습니다. | 구성된 업데이트 서버에서 파생됨 |
| `skip_verify` | boolean | 선택 사항 | 펌웨어 TLS 설정 범위에서 HTTPS 서버 검증 완화를 요청합니다. 연결은 여전히 실패할 수 있고 이미지 완전성 검사는 유지됩니다. 보통 false로 유지하세요. | false |

공유 [데이터 모델](../response-models.md#ota)을 참조하세요.

### 요청 예시

```json
{
  "url": "http://updates.example.com/www.bin"
}
```

### 응답 및 완료

data.status=시작됨/url.

### 사용 참고 사항

개별 HTML 파일이 아닌 펌웨어와 일치하는 완전한 www.bin을 사용하십시오. 그런 다음 ota.www.progress를 읽어보세요.

<a id="otawwwstart_sdcard"></a>

## ota.www.start_sdcard

SD에서 WWW 업데이트 시작

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ota/www/start_sdcard`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `file` | string | 필수 | WWW 이미지의 절대 파일 경로입니다. 255바이트로 제한하세요. 더 긴 입력은 전체가 유지되지 않을 수 있습니다. | 기본값 없음 |

공유 [데이터 모델](../response-models.md#ota)을 참조하세요.

### 요청 예시

```json
{
  "file": "/sdcard/www.bin"
}
```

### 응답 및 완료

data.status=스타트/file.

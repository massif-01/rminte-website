# SSH 연결 및 명령 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [ssh.cancel](#sshcancel) | SSH exec 세션 실행 취소 |
| [ssh.commands.add](#sshcommandsadd) | SSH 명령 구성 추가 또는 업데이트 |
| [ssh.commands.export](#sshcommandsexport) | SSH 명령 구성을 .tscfg로 내보내기 |
| [ssh.commands.get](#sshcommandsget) | ID로 SSH 명령 구성 가져오기 |
| [ssh.commands.import](#sshcommandsimport) | .tscfg에서 SSH 명령 구성 가져오기 |
| [ssh.commands.list](#sshcommandslist) | 모든 SSH 명령 구성 나열 |
| [ssh.commands.remove](#sshcommandsremove) | SSH 명령 구성 제거 |
| [ssh.commands.update](#sshcommandsupdate) | 기존 SSH 명령 구성 업데이트 |
| [ssh.copyid](#sshcopyid) | 원격 서버에 공개 키 배포 |
| [ssh.exec](#sshexec) | SSH를 통해 원격 명령 실행 |
| [ssh.exec_status](#sshexec_status) | 소유한 현재 또는 최신 SSH 결과 읽기 |
| [ssh.exec_stream](#sshexec_stream) | WebSocket을 통한 스트리밍 출력으로 원격 명령 실행 |
| [ssh.hosts.add](#sshhostsadd) | SSH 호스트 구성 추가 |
| [ssh.hosts.export](#sshhostsexport) | SSH 호스트 구성을 .tscfg로 내보내기 |
| [ssh.hosts.get](#sshhostsget) | ID로 SSH 호스트 구성 가져오기 |
| [ssh.hosts.import](#sshhostsimport) | .tscfg에서 SSH 호스트 구성 가져오기 |
| [ssh.hosts.list](#sshhostslist) | 모든 SSH 호스트 구성 나열 |
| [ssh.hosts.remove](#sshhostsremove) | SSH 호스트 구성 제거 |
| [ssh.hosts.update](#sshhostsupdate) | 기존 SSH 호스트 구성 업데이트 |
| [ssh.keygen](#sshkeygen) | SSH 키 쌍 생성 |
| [ssh.revoke](#sshrevoke) | 원격 서버에 배포한 공개 키 폐기(제거) |
| [ssh.services.start](#sshservicesstart) | 저장된 관리형 서비스 시작 |
| [ssh.test](#sshtest) | SSH 연결 테스트 |

<a id="sshcancel"></a>

## ssh.cancel

SSH exec 세션 실행 취소

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ssh/cancel`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `session_id` | integer | 필수 | ssh.exec_stream에서 반환된 실행 ID입니다. | 기본값 없음 |
| `boot_id` | string | 선택 사항 | result_key와 함께 보내면 시작 시 받은 작업 접수 정보와 일치해야 합니다. 작업을 시작한 로그인 세션에서는 둘 다 생략할 수 있습니다. | 기본값 없음 |
| `result_key` | string | 선택 사항 | boot_id와 함께 제공되는 개인 작업 접수 정보 키입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "session_id": 1
}
```

### 응답 및 완료

data.cancelled=true는 취소 요청을 접수했다는 뜻입니다. 최종 상태를 계속 조회하세요.

### 사용 참고 사항

작업을 시작한 로그인 세션이 필요하며 다른 root 세션은 취소할 수 없습니다. 접수 정보를 보내면 완전한 일치 쌍인지도 검사합니다. cancelled는 취소 의사를 접수했다는 뜻일 뿐이며 exec_status에는 여전히 전체 작업 접수 정보가 필요합니다.

<a id="sshcommandsadd"></a>

## ssh.commands.add

SSH 명령 구성 추가 또는 업데이트

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ssh/commands/add`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |

공유 [데이터 모델](../configuration-models.md#ssh-commands)을 참조하세요.

### 요청 예시

```json
{
  "id": "example-command",
  "host_id": "example-host",
  "name": "Read OS",
  "command": "uname -a",
  "timeout_sec": 30,
  "enabled": true,
  "service_mode": false,
  "active_version": "CURRENT_VERSION"
}
```

### 응답 및 완료

active_version/source/loaded/configured/enabled/paused/saved/uncertain과 오류 위치를 포함하는 설정 결과입니다. 전체 config-result 모델을 참고하세요.

### 사용 참고 사항

추가에는 사용되지 않은 ID가 필요합니다. 업데이트에는 기존 개체가 필요합니다. 전체 모델 예를 확인하세요.

<a id="sshcommandsexport"></a>

## ssh.commands.export

SSH 명령 구성을 .tscfg로 내보내기

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ssh/commands/export`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `recipient_cert` | string | 선택 사항 | 수신자 인증서 PEM입니다. 생략하면 이 장치용으로 암호화합니다. | 이 장치 인증서 |
| `include_host` | boolean | 선택 사항 | 내보내기에 종속 호스트 정의를 포함합니다. | false |

공유 [데이터 모델](../configuration-models.md#ssh-commands)을 참조하세요.

### 요청 예시

```json
{
  "id": "example"
}
```

### 응답 및 완료

data.tscfg/filename이 반환됩니다. 내보내기에는 Developer 장치 ID와 수신자 자료도 필요합니다.

### 사용 참고 사항

클라이언트는 반환된 패키지 텍스트를 저장합니다. 자동으로 다른 장치의 활성 구성이 되지는 않습니다.

<a id="sshcommandsget"></a>

## ssh.commands.get

ID로 SSH 명령 구성 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/ssh/commands/get`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |

공유 [데이터 모델](../configuration-models.md#ssh-commands)을 참조하세요.

### 요청 예시

```json
{
  "id": "example"
}
```

### 응답 및 완료

하나의 SSH 명령 및 active_version; ADMIN 미만 필드는 필터링됩니다.

<a id="sshcommandsimport"></a>

## ssh.commands.import

.tscfg에서 SSH 명령 구성 가져오기

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ssh/commands/import`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `tscfg` | string | 필수 | 완전한 패키지 JSON 텍스트가 문자열로 제공됩니다. | 기본값 없음 |
| `preview` | boolean | 선택 사항 | true인 경우에만 미리 봅니다. | false |
| `active_version` | string | 적용 시 필수 | 현재 구성 버전입니다. | 미리보기는 현재 버전을 사용할 수 있습니다. |
| `overwrite` | boolean | 선택 사항 | 기존 개체를 다른 콘텐츠로 바꾸는 것을 허용합니다. | false |
| `expected_credential` | integer | 적용 시 필수 | 미리보기에서 반환한 credential_generation입니다. | 없음 |
| `expected_digest` | string | 적용 시 필수 | 미리보기에서 반환된 package_digest입니다. | 없음 |

공유 [데이터 모델](../configuration-models.md#ssh-commands)을 참조하세요.

### 요청 예시

```json
{
  "tscfg": "PACKAGE_JSON_TEXT",
  "preview": true
}
```

### 응답 및 완료

설정 결과 모델입니다. 미리보기에는 valid/items/exists/unchanged/package_digest/credential_generation이 추가되고, 적용 결과에는 imported/overwritten/restart_required가 추가됩니다.

### 사용 참고 사항

미리보기를 먼저 수행한 다음 다이제스트, 자격 증명 세대 번호 및 설정 버전이 포함된 동일한 패키지를 적용합니다. 조건이 변경되면 다시 미리 봅니다.

<a id="sshcommandslist"></a>

## ssh.commands.list

모든 SSH 명령 구성 나열

**메서드**: GET / POST
**경로**: `/api/v1/ssh/commands/list`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `offset` | integer | 선택 사항 | 음수가 아닌 반환 오프셋. | 0 |
| `limit` | integer | 선택 사항 | 반환 항목 수입니다. 생략했다고 일부만 잘라 반환하라는 뜻은 아닙니다. | 모두 |
| `host_id` | string | 선택 사항 | 저장된 호스트 ID로 필터링합니다. | 모두 |

공유 [데이터 모델](../configuration-models.md#ssh-commands)을 참조하세요.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.commands/count/total/active_version/load_error/paused; ADMIN 미만의 역할에는 제한된 메타데이터가 반환됩니다.

<a id="sshcommandsremove"></a>

## ssh.commands.remove

SSH 명령 구성 제거

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ssh/commands/remove`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |
| `preview` | boolean | 선택 사항 | true는 영향만 미리 보고 false는 삭제를 수행합니다. | false |
| `replacement_id` | string | 선택 사항 | 종속 참조에 대한 대체 개체 ID입니다. | 없음 |
| `mode` | string | 선택 사항 | cascade는 연쇄 처리를 요청합니다. force/replacement와 조합하지 말고 하나의 처리 방식을 선택하세요. | 일반 삭제 |
| `force` | boolean | 선택 사항 | 영향을 미리 본 후에만 참조 객체를 강제로 삭제합니다. | false |
| `pause_automation` | boolean | 선택 사항 | 처리하기 전에 자동화를 일시 중지합니다. | false |

공유 [데이터 모델](../configuration-models.md#ssh-commands)을 참조하세요.

### 요청 예시

```json
{
  "id": "example",
  "active_version": "CURRENT_VERSION",
  "preview": true
}
```

### 응답 및 완료

설정 결과 모델과 영향을 받는 참조를 설명하는 impact가 반환됩니다.

### 사용 참고 사항

로컬 정의를 삭제해도 원격 프로그램이 자동으로 중지되거나 공개 키가 취소되지 않습니다.

<a id="sshcommandsupdate"></a>

## ssh.commands.update

기존 SSH 명령 구성 업데이트

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ssh/commands/update`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |

공유 [데이터 모델](../configuration-models.md#ssh-commands)을 참조하세요.

### 요청 예시

```json
{
  "id": "example-command",
  "host_id": "example-host",
  "name": "Read OS",
  "command": "uname -a",
  "timeout_sec": 30,
  "enabled": true,
  "service_mode": false,
  "active_version": "CURRENT_VERSION"
}
```

### 응답 및 완료

active_version/source/loaded/configured/enabled/paused/saved/uncertain과 오류 위치를 포함하는 설정 결과입니다. 전체 config-result 모델을 참고하세요.

### 사용 참고 사항

추가에는 사용되지 않은 ID가 필요합니다. 업데이트에는 기존 개체가 필요합니다. 전체 모델 예를 확인하세요.

<a id="sshcopyid"></a>

## ssh.copyid

원격 서버에 공개 키 배포

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ssh/copyid`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `host` | string | 필수 | 원격 주소. | 기본값 없음 |
| `user` | string | 필수 | 원격 계정. | 기본값 없음 |
| `port` | integer | 선택 사항 | SSH 포트. | 22 |
| `password` | string | 필수 | 이 원격 인증을 위한 비밀번호입니다. | 기본값 없음 |
| `keyid` | string | 필수 | 공개 키를 배포하거나 폐기할 로컬 키의 ID입니다. | 기본값 없음 |
| `trust_new` | boolean | 선택 사항 | 독립적인 검증 후에만 새 호스트를 수락합니다. | false |
| `accept_changed` | boolean | 선택 사항 | 확인 후에만 변경된 호스트 지문을 수락합니다. | false |
| `confirmed_fingerprint` | string | 선택 사항 | 확인하려는 호스트와 일치하는, 별도로 검증한 지문입니다. | 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |
| `verify` | boolean | 선택 사항 | 배포 후 확인합니다. | true |

### 요청 예시

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "password": "REMOTE_PASSWORD",
  "keyid": "example-key",
  "active_version": "CURRENT_VERSION"
}
```

### 응답 및 완료

data.deployed/verified/registered/registration_error, host_id 및 호스트·키 세부 정보가 반환됩니다. 원격 배포 성공과 로컬 등록 성공을 각각 확인하세요.

### 사용 참고 사항

원격 배포는 로컬 등록이 실패하더라도 성공할 수 있습니다. 즉시 다시 설치하지 마십시오.

<a id="sshexec"></a>

## ssh.exec

SSH를 통해 원격 명령 실행

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ssh/exec`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `host` | string | 필수 | SSH 호스트 주소입니다. | 기본값 없음 |
| `user` | string | 필수 | 원격 사용자 이름. | 기본값 없음 |
| `port` | integer | 선택 사항 | 포트 1-65535. | 22 |
| `password` | string | 인증 대안 | TianshanOS 계정이 아닌 이 원격 로그인을 위한 비밀번호입니다. | 없음 |
| `keyid` | string | 인증 대안 | 장치에 저장된 SSH 개인 키 ID입니다. | 없음 |
| `keypath` | string | 즉시 호출에서 지원하는 대체 인증 방식 | 장치 개인 키 경로. 지원은 진입점에 따라 다릅니다. | 없음 |
| `command` | string | 필수 | 원격 명령 텍스트. | 기본값 없음 |
| `timeout_ms` | integer | 선택 사항 | 연결·실행 제한 시간(밀리초)입니다. | SSH 기본값 |
| `trust_new` | boolean | 선택 사항 | 독립적인 검증 후에만 새 호스트를 수락합니다. | false |
| `accept_changed` | boolean | 선택 사항 | 확인 후에만 변경된 호스트 지문을 수락합니다. | false |
| `confirmed_fingerprint` | string | 선택 사항 | 확인하려는 호스트와 일치하는, 별도로 검증한 지문입니다. | 없음 |

### 요청 예시

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "command": "uname -a"
}
```

### 응답 및 완료

data.stdout/stderr/exit_code/host_status/fingerprint. 종료 코드와 애플리케이션 출력을 확인하세요.

### 사용 참고 사항

처음 보는 지문이나 변경된 지문에는 확인 정보가 반환됩니다. 수락 전에 검증하세요. 원격 종료 코드가 0이 아니어도 최상위 code는 0일 수 있습니다.

<a id="sshexec_status"></a>

## ssh.exec_status

소유한 현재 또는 최신 SSH 결과 읽기

**메서드**: GET / POST
**경로**: `/api/v1/ssh/exec_status`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `session_id` | integer | 필수 | ssh.exec_stream에서 반환된 실행 ID입니다. | 기본값 없음 |
| `boot_id` | string | 필수 | 작업 접수 정보의 32자 16진수 부팅 ID입니다. | 기본값 없음 |
| `result_key` | string | 필수 | 작업 접수 정보의 32자 16진수 결과 자격 증명입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "session_id": 1,
  "boot_id": "00000000000000000000000000000000",
  "result_key": "00000000000000000000000000000000"
}
```

### 응답 및 완료

데이터는 WebSocket 결과 형식(활성 상태에서는 ssh_exec_running, 종료 시 ssh_exec_done/cancelled/error)을 사용합니다. status/exit_code/success 및 출력 완성도를 확인하세요.

### 사용 참고 사항

작업을 시작한 세션과 올바른 작업 접수 정보가 필요합니다. 0으로 채운 예제 값은 구조만 보여주므로 실제 시작 응답 값을 사용하세요. 이 조회는 명령을 다시 실행하지 않습니다.

<a id="sshexec_stream"></a>

## ssh.exec_stream

WebSocket을 통한 스트리밍 출력으로 원격 명령 실행

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ssh/exec_stream`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `host` | string | 필수 | SSH 호스트 주소입니다. | 기본값 없음 |
| `user` | string | 필수 | 원격 사용자 이름. | 기본값 없음 |
| `port` | integer | 선택 사항 | 포트 1-65535. | 22 |
| `password` | string | 인증 대안 | TianshanOS 계정이 아닌 이 원격 로그인을 위한 비밀번호입니다. | 없음 |
| `keyid` | string | 인증 대안 | 장치에 저장된 SSH 개인 키 ID입니다. | 없음 |
| `command` | string | 필수 | 명령 텍스트. | 기본값 없음 |
| `expect_pattern` | string | 선택 사항 | 성공 일치 패턴입니다. | 변경되지 않음 |
| `fail_pattern` | string | 선택 사항 | 실패 일치 패턴입니다. | 변경되지 않음 |
| `extract_pattern` | string | 선택 사항 | 출력 추출 패턴. | 변경되지 않음 |
| `var_name` | string | 선택 사항 | 결과 변수 접두사. | 변경되지 않음 |
| `timeout` | integer | 선택 사항 | 여기서는 저장된 명령 timeout_sec과 달리 밀리초입니다. | 기본 실행 기한 |
| `collect_output` | boolean | 선택 사항 | 수집된 출력을 유지합니다. | true |
| `max_output_size` | integer | 선택 사항 | 출력 수집 제한(바이트)입니다. | 장치 기본값 |
| `stop_on_match` | boolean | 선택 사항 | 조건이 일치하면 중지합니다. | false |
| `command_id` | string | command_instance와의 선택적 쌍 | 연결된 저장된 명령 ID입니다. | 없음 |
| `command_instance` | string | command_id와의 선택적 쌍 | 목록의 runtime_instance와 일치하는 16자리 소문자 16진수 식별자입니다. | 없음 |

### 요청 예시

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "command": "uname -a",
  "collect_output": true
}
```

### 응답 및 완료

data.session_id/boot_id/result_key. WebSocket 결과를 사용하거나 ssh.exec_status를 쿼리하기 전에 작업 접수 정보를 보존하세요.

### 사용 참고 사항

스트리밍 슬롯을 단독으로 사용합니다. 이 API는 일반 keypath 인증을 지원하지 않습니다. 작업 소유권, 종료 상태, 출력의 완전성을 확인하세요.

<a id="sshhostsadd"></a>

## ssh.hosts.add

SSH 호스트 구성 추가

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ssh/hosts/add`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |

공유 [데이터 모델](../configuration-models.md#ssh-hosts)을 참조하세요.

### 요청 예시

```json
{
  "id": "example-host",
  "host": "192.0.2.20",
  "port": 22,
  "username": "YOUR_USER",
  "auth_type": "key",
  "keyid": "example-key",
  "enabled": true,
  "active_version": "CURRENT_VERSION"
}
```

### 응답 및 완료

active_version/source/loaded/configured/enabled/paused/saved/uncertain과 오류 위치를 포함하는 설정 결과입니다. 전체 config-result 모델을 참고하세요.

### 사용 참고 사항

추가에는 사용되지 않은 ID가 필요합니다. 업데이트에는 기존 개체가 필요합니다. 전체 모델 예를 확인하세요.

<a id="sshhostsexport"></a>

## ssh.hosts.export

SSH 호스트 구성을 .tscfg로 내보내기

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ssh/hosts/export`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `recipient_cert` | string | 선택 사항 | 수신자 인증서 PEM입니다. 생략하면 이 장치용으로 암호화합니다. | 이 장치 인증서 |

공유 [데이터 모델](../configuration-models.md#ssh-hosts)을 참조하세요.

### 요청 예시

```json
{
  "id": "example"
}
```

### 응답 및 완료

data.tscfg/filename이 반환됩니다. 내보내기에는 Developer 장치 ID와 수신자 자료도 필요합니다.

### 사용 참고 사항

클라이언트는 반환된 패키지 텍스트를 저장합니다. 자동으로 다른 장치의 활성 구성이 되지는 않습니다.

<a id="sshhostsget"></a>

## ssh.hosts.get

ID로 SSH 호스트 구성 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/ssh/hosts/get`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |

공유 [데이터 모델](../configuration-models.md#ssh-hosts)을 참조하세요.

### 요청 예시

```json
{
  "id": "example"
}
```

### 응답 및 완료

1개의 호스트 및 active_version; ADMIN 미만 필드는 필터링됩니다.

<a id="sshhostsimport"></a>

## ssh.hosts.import

.tscfg에서 SSH 호스트 구성 가져오기

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ssh/hosts/import`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `tscfg` | string | 필수 | 완전한 패키지 JSON 텍스트가 문자열로 제공됩니다. | 기본값 없음 |
| `preview` | boolean | 선택 사항 | true인 경우에만 미리 봅니다. | false |
| `active_version` | string | 적용 시 필수 | 현재 구성 버전입니다. | 미리보기는 현재 버전을 사용할 수 있습니다. |
| `overwrite` | boolean | 선택 사항 | 기존 개체를 다른 콘텐츠로 바꾸는 것을 허용합니다. | false |
| `expected_credential` | integer | 적용 시 필수 | 미리보기에서 반환한 credential_generation입니다. | 없음 |
| `expected_digest` | string | 적용 시 필수 | 미리보기에서 반환된 package_digest입니다. | 없음 |

공유 [데이터 모델](../configuration-models.md#ssh-hosts)을 참조하세요.

### 요청 예시

```json
{
  "tscfg": "PACKAGE_JSON_TEXT",
  "preview": true
}
```

### 응답 및 완료

설정 결과 모델입니다. 미리보기에는 valid/items/exists/unchanged/package_digest/credential_generation이 추가되고, 적용 결과에는 imported/overwritten/restart_required가 추가됩니다.

### 사용 참고 사항

미리보기를 먼저 수행한 다음 다이제스트, 자격 증명 세대 번호 및 설정 버전이 포함된 동일한 패키지를 적용합니다. 조건이 변경되면 다시 미리 봅니다.

<a id="sshhostslist"></a>

## ssh.hosts.list

모든 SSH 호스트 구성 나열

**메서드**: GET / POST
**경로**: `/api/v1/ssh/hosts/list`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `offset` | integer | 선택 사항 | 음수가 아닌 반환 오프셋. | 0 |
| `limit` | integer | 선택 사항 | 반환 항목 수입니다. 생략했다고 일부만 잘라 반환하라는 뜻은 아닙니다. | 모두 |

공유 [데이터 모델](../configuration-models.md#ssh-hosts)을 참조하세요.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.hosts/count/total/active_version/load_error/paused; ADMIN 미만의 역할에는 제한된 메타데이터가 반환됩니다.

<a id="sshhostsremove"></a>

## ssh.hosts.remove

SSH 호스트 구성 제거

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ssh/hosts/remove`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |
| `preview` | boolean | 선택 사항 | true는 영향만 미리 보고 false는 삭제를 수행합니다. | false |
| `replacement_id` | string | 선택 사항 | 종속 참조에 대한 대체 개체 ID입니다. | 없음 |
| `mode` | string | 선택 사항 | cascade는 연쇄 처리를 요청합니다. force/replacement와 조합하지 말고 하나의 처리 방식을 선택하세요. | 일반 삭제 |
| `force` | boolean | 선택 사항 | 영향을 미리 본 후에만 참조 객체를 강제로 삭제합니다. | false |
| `pause_automation` | boolean | 선택 사항 | 처리하기 전에 자동화를 일시 중지합니다. | false |

공유 [데이터 모델](../configuration-models.md#ssh-hosts)을 참조하세요.

### 요청 예시

```json
{
  "id": "example",
  "active_version": "CURRENT_VERSION",
  "preview": true
}
```

### 응답 및 완료

설정 결과 모델과 영향을 받는 참조를 설명하는 impact가 반환됩니다.

### 사용 참고 사항

로컬 정의를 삭제해도 원격 프로그램이 자동으로 중지되거나 공개 키가 취소되지 않습니다.

<a id="sshhostsupdate"></a>

## ssh.hosts.update

기존 SSH 호스트 구성 업데이트

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ssh/hosts/update`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |

공유 [데이터 모델](../configuration-models.md#ssh-hosts)을 참조하세요.

### 요청 예시

```json
{
  "id": "example-host",
  "host": "192.0.2.20",
  "port": 22,
  "username": "YOUR_USER",
  "auth_type": "key",
  "keyid": "example-key",
  "enabled": true,
  "active_version": "CURRENT_VERSION"
}
```

### 응답 및 완료

active_version/source/loaded/configured/enabled/paused/saved/uncertain과 오류 위치를 포함하는 설정 결과입니다. 전체 config-result 모델을 참고하세요.

### 사용 참고 사항

추가에는 사용되지 않은 ID가 필요합니다. 업데이트에는 기존 개체가 필요합니다. 전체 모델 예를 확인하세요.

<a id="sshkeygen"></a>

## ssh.keygen

SSH 키 쌍 생성

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ssh/keygen`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 키 ID. | 기본값 없음 |
| `type` | string | 선택 사항 | 이 API에서 지원하는 키 유형입니다. 예: rsa2048/rsa4096/ec256/ec384. | rsa2048 |
| `comment` | string | 선택 사항 | 공개 키 주석입니다. | 비어 있음 |

### 요청 예시

```json
{
  "id": "example-key",
  "type": "ec256"
}
```

### 응답 및 완료

data.id/type/public_key.

### 사용 참고 사항

새로운 통합을 위해 key.generate를 선호합니다. 지원되는 매개변수는 다릅니다.

<a id="sshrevoke"></a>

## ssh.revoke

원격 서버에 배포한 공개 키 폐기(제거)

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ssh/revoke`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `host` | string | 필수 | 원격 주소. | 기본값 없음 |
| `user` | string | 필수 | 원격 계정. | 기본값 없음 |
| `port` | integer | 선택 사항 | SSH 포트. | 22 |
| `password` | string | 필수 | 이 원격 인증을 위한 비밀번호입니다. | 기본값 없음 |
| `keyid` | string | 필수 | 공개 키를 배포하거나 폐기할 로컬 키의 ID입니다. | 기본값 없음 |
| `trust_new` | boolean | 선택 사항 | 독립적인 검증 후에만 새 호스트를 수락합니다. | false |
| `accept_changed` | boolean | 선택 사항 | 확인 후에만 변경된 호스트 지문을 수락합니다. | false |
| `confirmed_fingerprint` | string | 선택 사항 | 확인하려는 호스트와 일치하는, 별도로 검증한 지문입니다. | 없음 |

### 요청 예시

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "password": "REMOTE_PASSWORD",
  "keyid": "example-key"
}
```

### 응답 및 완료

data.revoked/found/removed_count 및 원격 세부정보.

### 사용 참고 사항

로컬 키, 호스트 정의 또는 원격 프로세스가 아닌 지정된 공개 키만 제거합니다.

<a id="sshservicesstart"></a>

## ssh.services.start

저장된 관리형 서비스 시작

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ssh/services/start`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `command_id` | string | 필수 | 관리형 서비스로 구성된 저장된 명령 ID입니다. | 기본값 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |

### 요청 예시

```json
{
  "command_id": "example-service",
  "active_version": "CURRENT_VERSION"
}
```

### 응답 및 완료

data.operation_id/run_id가 반환됩니다. automation.services.status로 확인하세요.

### 사용 참고 사항

저장된 설정을 사용합니다. 호출에 성공해도 프로세스 실행 중 상태와 애플리케이션 준비 완료 상태는 구분해야 합니다.

<a id="sshtest"></a>

## ssh.test

SSH 연결 테스트

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ssh/test`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `host` | string | 필수 | SSH 호스트 주소입니다. | 기본값 없음 |
| `user` | string | 필수 | 원격 사용자 이름. | 기본값 없음 |
| `port` | integer | 선택 사항 | 포트 1-65535. | 22 |
| `password` | string | 인증 대안 | TianshanOS 계정이 아닌 이 원격 로그인을 위한 비밀번호입니다. | 없음 |
| `keyid` | string | 인증 대안 | 장치에 저장된 SSH 개인 키 ID입니다. | 없음 |
| `keypath` | string | 즉시 호출에서 지원하는 대체 인증 방식 | 장치 개인 키 경로. 지원은 진입점에 따라 다릅니다. | 없음 |
| `trust_new` | boolean | 선택 사항 | 독립적인 검증 후에만 새 호스트를 수락합니다. | false |
| `accept_changed` | boolean | 선택 사항 | 확인 후에만 변경된 호스트 지문을 수락합니다. | false |
| `confirmed_fingerprint` | string | 선택 사항 | 확인하려는 호스트와 일치하는, 별도로 검증한 지문입니다. | 없음 |

### 요청 예시

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key"
}
```

### 응답 및 완료

data.success/host/port/user/host_status/fingerprint가 반환됩니다. 연결 실패 시 stage/reason/error와 지문이 포함될 수 있습니다.

### 사용 참고 사항

연결·인증 조건을 확인하며, 모든 원격 명령이나 서비스의 사용 가능 여부를 보장하지는 않습니다.

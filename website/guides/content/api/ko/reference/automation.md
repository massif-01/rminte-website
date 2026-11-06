# 자동화 및 관리형 서비스 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [automation.action.stats](#automationactionstats) | 작업 실행 통계 가져오기 |
| [automation.action.stats.reset](#automationactionstatsreset) | 작업 통계 재설정 |
| [automation.actions.add](#automationactionsadd) | 새 작업 템플릿 만들기 |
| [automation.actions.delete](#automationactionsdelete) | 작업 템플릿 삭제 |
| [automation.actions.execute](#automationactionsexecute) | 작업 템플릿 실행 |
| [automation.actions.export](#automationactionsexport) | 작업 템플릿을 구성 팩(.tscfg)으로 내보내기 |
| [automation.actions.get](#automationactionsget) | ID로 작업 템플릿 가져오기 |
| [automation.actions.import](#automationactionsimport) | 구성 팩에서 작업 템플릿 가져오기 |
| [automation.actions.list](#automationactionslist) | 모든 작업 템플릿 나열 |
| [automation.actions.update](#automationactionsupdate) | 기존 작업 템플릿 업데이트 |
| [automation.config.apply](#automationconfigapply) | 확인된 복원 또는 소스 선택을 적용합니다. |
| [automation.config.backup](#automationconfigbackup) | 전체 비상 구성 저장 |
| [automation.config.enable](#automationconfigenable) | 현재 구성을 명시적으로 활성화하거나 일시 중지합니다. |
| [automation.config.preview](#automationconfigpreview) | 구성 복원 또는 소스 선택 미리보기 |
| [automation.config.refresh](#automationconfigrefresh) | 사용자 선택을 변경하지 않고 SD 카드를 한 번 확인하십시오. |
| [automation.config.status](#automationconfigstatus) | 현재 자동화 저장 및 백업 상태 |
| [automation.pause](#automationpause) | 자동화 엔진 일시 중지 |
| [automation.proxy.fetch](#automationproxyfetch) | 외부 REST API 프록시 요청 |
| [automation.proxy.socketio_test](#automationproxysocketio_test) | Socket.IO 연결 테스트(v4 프로토콜) |
| [automation.proxy.websocket_test](#automationproxywebsocket_test) | WebSocket 연결 테스트 |
| [automation.reload](#automationreload) | 구성 다시 로드 |
| [automation.resume](#automationresume) | 자동화 엔진 재개 |
| [automation.rules.add](#automationrulesadd) | 새 규칙 추가 |
| [automation.rules.delete](#automationrulesdelete) | 규칙 삭제 |
| [automation.rules.disable](#automationrulesdisable) | 규칙 비활성화 |
| [automation.rules.enable](#automationrulesenable) | 규칙 활성화 |
| [automation.rules.export](#automationrulesexport) | 구성 팩(.tscfg)으로 규칙 내보내기 |
| [automation.rules.get](#automationrulesget) | ID로 규칙 세부정보 가져오기 |
| [automation.rules.import](#automationrulesimport) | 구성 팩에서 규칙 가져오기 |
| [automation.rules.list](#automationruleslist) | 모든 규칙 나열 |
| [automation.rules.trigger](#automationrulestrigger) | 규칙을 수동으로 트리거 |
| [automation.rules.update](#automationrulesupdate) | 예상 리비전을 지정하여 규칙 업데이트 |
| [automation.services.list](#automationserviceslist) | 독립적인 원격 서비스 제어 나열 |
| [automation.services.status](#automationservicesstatus) | 관리형 원격 프로세스 상태 확인 |
| [automation.services.stop](#automationservicesstop) | 검증된 관리형 원격 프로세스 중지 |
| [automation.sources.add](#automationsourcesadd) | 새 데이터 소스 추가 |
| [automation.sources.add_mapping](#automationsourcesadd_mapping) | 기존 데이터 소스에 필드 매핑 추가 |
| [automation.sources.delete](#automationsourcesdelete) | 데이터 소스 삭제 |
| [automation.sources.disable](#automationsourcesdisable) | 데이터 소스 비활성화 |
| [automation.sources.enable](#automationsourcesenable) | 데이터 소스 활성화 |
| [automation.sources.export](#automationsourcesexport) | 데이터 소스를 구성 팩(.tscfg)으로 내보내기 |
| [automation.sources.import](#automationsourcesimport) | 구성 팩에서 데이터 소스 가져오기 |
| [automation.sources.list](#automationsourceslist) | 모든 데이터 소스 나열 |
| [automation.sources.remove_mapping](#automationsourcesremove_mapping) | 데이터 소스에서 필드 매핑 제거 |
| [automation.sources.update](#automationsourcesupdate) | 기존 데이터 소스 업데이트 |
| [automation.start](#automationstart) | 자동화 엔진 시작 |
| [automation.status](#automationstatus) | 자동화 엔진 상태 가져오기 |
| [automation.stop](#automationstop) | 자동화 엔진 중지 |
| [automation.test.device](#automationtestdevice) | 장치 제어 동작 테스트 |
| [automation.test.gpio](#automationtestgpio) | GPIO 동작 테스트 |
| [automation.test.led](#automationtestled) | LED 동작 테스트 |
| [automation.test.ssh](#automationtestssh) | SSH 명령 실행 테스트 |
| [automation.variables.delete](#automationvariablesdelete) | 저장된 사용자 변수 삭제 |
| [automation.variables.get](#automationvariablesget) | 변수 값 가져오기 |
| [automation.variables.list](#automationvariableslist) | 모든 변수 나열 |
| [automation.variables.set](#automationvariablesset) | 변수 값 설정 |

<a id="automationactionstats"></a>

## automation.action.stats

작업 실행 통계 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/automation/action/stats`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

지속적인 감사 추적이 아닌 현재 작업 관리자 런타임 통계입니다.

<a id="automationactionstatsreset"></a>

## automation.action.stats.reset

작업 통계 재설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/action/stats/reset`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

코드=0은 재설정 요청이 성공했음을 보고합니다.

<a id="automationactionsadd"></a>

## automation.actions.add

새 작업 템플릿 만들기

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/actions/add`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |

공유 [데이터 모델](../configuration-models.md#action-templates)을 참조하세요.

### 요청 예시

```json
{
  "id": "example-action",
  "name": "Record a message",
  "enabled": true,
  "type": "log",
  "log": {
    "level": 3,
    "message": "Example action"
  },
  "active_version": "CURRENT_VERSION"
}
```

### 응답 및 완료

active_version/source/loaded/configured/enabled/paused/saved/uncertain과 오류 위치를 포함하는 설정 결과입니다. 전체 config-result 모델을 참고하세요.

### 사용 참고 사항

추가에는 사용되지 않은 ID가 필요합니다. 업데이트에는 기존 개체가 필요합니다. 전체 모델 예를 확인하세요.

<a id="automationactionsdelete"></a>

## automation.actions.delete

작업 템플릿 삭제

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/actions/delete`
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

공유 [데이터 모델](../configuration-models.md#action-templates)을 참조하세요.

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

<a id="automationactionsexecute"></a>

## automation.actions.execute

작업 템플릿 실행

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/actions/execute`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |

공유 [데이터 모델](../configuration-models.md#action-templates)을 참조하세요.

### 요청 예시

```json
{
  "id": "example-action",
  "active_version": "CURRENT_VERSION"
}
```

### 응답 및 완료

data.async/status/duration_ms 및 실행 결과; 개인 출력은 ADMIN 이하에 대해 필터링됩니다.

### 사용 참고 사항

템플릿의 실제 하드웨어 실행/remote 효과. 비동기 템플릿에 대한 타겟 결과를 계속 검사합니다.

<a id="automationactionsexport"></a>

## automation.actions.export

작업 템플릿을 구성 팩(.tscfg)으로 내보내기

**방법**: POST
**경로**: `/api/v1/automation/actions/export`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `recipient_cert` | string | 선택 사항 | 수신자 인증서 PEM입니다. 생략하면 이 장치용으로 암호화합니다. | 이 장치 인증서 |

공유 [데이터 모델](../configuration-models.md#action-templates)을 참조하세요.

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

<a id="automationactionsget"></a>

## automation.actions.get

ID로 작업 템플릿 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/automation/actions/get`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |

공유 [데이터 모델](../configuration-models.md#action-templates)을 참조하세요.

### 요청 예시

```json
{
  "id": "example"
}
```

### 응답 및 완료

단일 작업 템플릿 및 active_version; ADMIN 미만 필드는 필터링됩니다.

<a id="automationactionsimport"></a>

## automation.actions.import

구성 팩에서 작업 템플릿 가져오기

**방법**: POST
**경로**: `/api/v1/automation/actions/import`
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

공유 [데이터 모델](../configuration-models.md#action-templates)을 참조하세요.

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

<a id="automationactionslist"></a>

## automation.actions.list

모든 작업 템플릿 나열

**메서드**: GET / POST
**경로**: `/api/v1/automation/actions/list`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `offset` | integer | 선택 사항 | 음수가 아닌 반환 오프셋. | 0 |
| `limit` | integer | 선택 사항 | 반환 항목 수입니다. 생략했다고 일부만 잘라 반환하라는 뜻은 아닙니다. | 모두 |

공유 [데이터 모델](../configuration-models.md#action-templates)을 참조하세요.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.templates/count/total/active_version/load_error/paused; ADMIN 미만의 역할에는 제한된 메타데이터가 반환됩니다.

<a id="automationactionsupdate"></a>

## automation.actions.update

기존 작업 템플릿 업데이트

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/actions/update`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |

공유 [데이터 모델](../configuration-models.md#action-templates)을 참조하세요.

### 요청 예시

```json
{
  "id": "example-action",
  "name": "Record a message",
  "enabled": true,
  "type": "log",
  "log": {
    "level": 3,
    "message": "Example action"
  },
  "active_version": "CURRENT_VERSION"
}
```

### 응답 및 완료

active_version/source/loaded/configured/enabled/paused/saved/uncertain과 오류 위치를 포함하는 설정 결과입니다. 전체 config-result 모델을 참고하세요.

### 사용 참고 사항

추가에는 사용되지 않은 ID가 필요합니다. 업데이트에는 기존 개체가 필요합니다. 전체 모델 예를 확인하세요.

<a id="automationconfigapply"></a>

## automation.config.apply

확인된 복원 또는 소스 선택을 적용합니다.

**방법**: POST
**경로**: `/api/v1/automation/config/apply`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `operation` | string | 필수 | 미리보기에서 선택했던 것과 동일한 작업입니다. | 기본값 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |
| `target_version` | string | 필수 | 미리보기로 반환된 대상 버전입니다. | 기본값 없음 |

공유 [데이터 모델](../response-models.md#config-result)을 참조하세요.

### 요청 예시

```json
{
  "operation": "use_sd",
  "active_version": "CURRENT_VERSION",
  "target_version": "PREVIEW_TARGET_VERSION"
}
```

### 응답 및 완료

active_version/source/loaded/configured/enabled/paused/saved/uncertain과 오류 위치를 포함하는 설정 결과입니다. 전체 config-result 모델을 참고하세요.

### 사용 참고 사항

설정 선택·복구는 전체 hosts/commands/rules/variables/sources 집합을 교체할 수 있습니다. 먼저 미리보기를 수행하고 현재 입력을 보관하세요.

<a id="automationconfigbackup"></a>

## automation.config.backup

전체 비상 구성 저장

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/config/backup`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |

공유 [데이터 모델](../response-models.md#config-result)을 참조하세요.

### 요청 예시

```json
{
  "active_version": "CURRENT_VERSION"
}
```

### 응답 및 완료

active_version/source/loaded/configured/enabled/paused/saved/uncertain과 오류 위치를 포함하는 설정 결과입니다. 전체 config-result 모델을 참고하세요.

<a id="automationconfigenable"></a>

## automation.config.enable

현재 구성을 명시적으로 활성화하거나 일시 중지합니다.

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/config/enable`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |
| `enabled` | boolean | 필수 | true는 현재 구성을 활성화합니다. false는 일시 중지합니다. | 기본값 없음 |

공유 [데이터 모델](../response-models.md#config-result)을 참조하세요.

### 요청 예시

```json
{
  "active_version": "CURRENT_VERSION",
  "enabled": false
}
```

### 응답 및 완료

active_version/source/loaded/configured/enabled/paused/saved/uncertain과 오류 위치를 포함하는 설정 결과입니다. 전체 config-result 모델을 참고하세요.

<a id="automationconfigpreview"></a>

## automation.config.preview

구성 복원 또는 소스 선택 미리보기

**방법**: POST
**경로**: `/api/v1/automation/config/preview`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `operation` | string | 필수 | use_sd/save_to_sd/restore_internal. | 기본값 없음 |

공유 [데이터 모델](../response-models.md#config-result)을 참조하세요.

### 요청 예시

```json
{
  "operation": "use_sd"
}
```

### 응답 및 완료

미리보기 차이, 현재·대상 버전, 선택의 전제 조건이 반환됩니다. 적용 시에는 반환된 버전을 사용해야 합니다.

### 사용 참고 사항

설정 선택·복구는 전체 hosts/commands/rules/variables/sources 집합을 교체할 수 있습니다. 먼저 미리보기를 수행하고 현재 입력을 보관하세요.

<a id="automationconfigrefresh"></a>

## automation.config.refresh

사용자 선택을 변경하지 않고 SD 카드를 한 번 확인하십시오.

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/config/refresh`
**최소 액세스**: ROOT

### 매개변수

기능별 매개변수는 없습니다.

공유 [데이터 모델](../response-models.md#config-result)을 참조하세요.

### 요청 예시

```json
{}
```

### 응답 및 완료

active_version/source/loaded/configured/enabled/paused/saved/uncertain과 오류 위치를 포함하는 설정 결과입니다. 전체 config-result 모델을 참고하세요.

<a id="automationconfigstatus"></a>

## automation.config.status

현재 자동화 저장 및 백업 상태

**메서드**: GET / POST
**경로**: `/api/v1/automation/config/status`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

공유 [데이터 모델](../response-models.md#config-result)을 참조하세요.

### 요청 예시

```json
{}
```

### 응답 및 완료

active_version/source/loaded/configured/enabled/paused/saved/uncertain과 오류 위치를 포함하는 설정 결과입니다. 전체 config-result 모델을 참고하세요.

<a id="automationpause"></a>

## automation.pause

자동화 엔진 일시 중지

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/pause`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

code=0/message는 요청 성공을 나타냅니다. 실행 상태는 automation.status를 읽어 확인하세요.

### 사용 참고 사항

엔진 상태, 완료되지 않은 작업 또는 스토리지가 요청을 거부할 수 있습니다. 중지 시간 초과는 모든 작업이 종료되었음을 의미하지 않습니다.

<a id="automationproxyfetch"></a>

## automation.proxy.fetch

외부 REST API 프록시 요청

**방법**: POST
**경로**: `/api/v1/automation/proxy/fetch`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `url` | string | 필수 | HTTP(S) 대상 또는 지원되는 로컬 API 주소입니다. | 기본값 없음 |
| `method` | string | 선택 사항 | GET/POST/PUT/DELETE를 지원합니다. 일반적인 요청 본문 매개변수는 없습니다. | GET |
| `headers` | object | 선택 사항 | 문자열 값 요청 헤더. 자격 증명을 일반 로그에서 제외하세요. | 없음 |
| `timeout` | integer | 선택 사항 | 총 요청 시간 초과(밀리초)입니다. | 15000 |
| `cert_pem` | string | 선택 사항 | 사설 발급자의 CA 자료이며 최대 16384바이트입니다. | 시스템 신뢰 |
| `skip_verify` | boolean | 선택 사항 | 호환성 매개변수이며 false만 허용하고 true는 거부합니다. | false |

### 요청 예시

```json
{
  "url": "https://example.com/status",
  "method": "GET"
}
```

### 응답 및 완료

data.status/content_length/body; 로컬 API 결과는 본문에 중첩되어 있으며 해당 코드도 확인해야 합니다.

### 사용 참고 사항

로컬 API 전달은 현재 세션 및 대상 권한을 유지합니다. 외부 HTTP(S) 요청에는 ROOT가 필요합니다. 시간, 규모, 네트워크 예산이 적용됩니다. 이는 무제한 프록시가 아닙니다.

<a id="automationproxysocketio_test"></a>

## automation.proxy.socketio_test

Socket.IO 연결 테스트(v4 프로토콜)

**방법**: POST
**경로**: `/api/v1/automation/proxy/socketio_test`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `url` | string | 필수 | Socket.IO v4 서버 주소입니다. | 기본값 없음 |
| `event` | string | 선택 사항 | 대상 이벤트 이름입니다. | 첫 번째 이벤트 |
| `timeout_ms` | integer | 선택 사항 | 연결·이벤트 대기 제한 시간(밀리초)입니다. | 10000 |
| `json_path` | string | 선택 사항 | 이벤트 데이터 추출 경로. | 전체 데이터 |

### 요청 예시

```json
{
  "url": "https://example.com",
  "event": "status"
}
```

### 응답 및 완료

data.connected/sid/event/data가 반환되며 value/path/path_error/error가 포함될 수 있습니다.

### 사용 참고 사항

일반 WebSocket 대신 Socket.IO를 사용합니다. 실제 원격 서비스에 연결됩니다.

<a id="automationproxywebsocket_test"></a>

## automation.proxy.websocket_test

WebSocket 연결 테스트

**방법**: POST
**경로**: `/api/v1/automation/proxy/websocket_test`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `uri` | string | 필수 | ws:// 또는 wss:// 대상. | 기본값 없음 |
| `timeout_ms` | integer | 선택 사항 | 연결·데이터 대기 제한 시간(밀리초)입니다. | 10000 |
| `subscribe` | string | 선택 사항 | 접속 후 보낼 구독 문자입니다. | 전송하지 않음 |
| `json_path` | string | 선택 사항 | JSON 추출 경로입니다. | 전체 메시지 |

### 요청 예시

```json
{
  "uri": "wss://example.com/events",
  "timeout_ms": 10000
}
```

### 응답 및 완료

data.connected/message가 반환되며 value/path/path_error/error가 포함될 수 있습니다.

### 사용 참고 사항

연결하여 문자를 보낼 수 있습니다. 하나의 테스트는 영구 구독이 아닙니다.

<a id="automationreload"></a>

## automation.reload

구성 다시 로드

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/reload`
**최소 액세스**: ROOT

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

active_version/source/loaded/configured/enabled/paused/saved/uncertain과 오류 위치를 포함하는 설정 결과입니다. 전체 config-result 모델을 참고하세요.

### 사용 참고 사항

엔진 상태, 완료되지 않은 작업 또는 스토리지가 요청을 거부할 수 있습니다. 중지 시간 초과는 모든 작업이 종료되었음을 의미하지 않습니다.

<a id="automationresume"></a>

## automation.resume

자동화 엔진 재개

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/resume`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

code=0/message는 요청 성공을 나타냅니다. 실행 상태는 automation.status를 읽어 확인하세요.

### 사용 참고 사항

엔진 상태, 완료되지 않은 작업 또는 스토리지가 요청을 거부할 수 있습니다. 중지 시간 초과는 모든 작업이 종료되었음을 의미하지 않습니다.

<a id="automationrulesadd"></a>

## automation.rules.add

새 규칙 추가

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/rules/add`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |
| `expected_revision` | integer | 선택 사항 | 원래 규칙 리비전입니다. 업데이트 시 가장 최근에 조회한 값을 보내세요. | 생성에는 필요하지 않습니다. |

공유 [데이터 모델](../configuration-models.md#automation-rules)을 참조하세요.

### 요청 예시

```json
{
  "id": "example-rule",
  "name": "Temperature example",
  "enabled": false,
  "logic": "and",
  "conditions": [
    {
      "variable": "example.temperature",
      "operator": "gt",
      "value": 50
    }
  ],
  "actions": [
    {
      "type": "log",
      "level": 3,
      "message": "Temperature high"
    }
  ],
  "cooldown_ms": 10000,
  "active_version": "CURRENT_VERSION"
}
```

### 응답 및 완료

active_version/source/loaded/configured/enabled/paused/saved/uncertain과 오류 위치를 포함하는 설정 결과입니다. 전체 config-result 모델을 참고하세요.

### 사용 참고 사항

저장과 트리거링은 별개입니다. 필터링된 보기의 전체 규칙을 덮어쓰지 마세요.

<a id="automationrulesdelete"></a>

## automation.rules.delete

규칙 삭제

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/rules/delete`
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

공유 [데이터 모델](../configuration-models.md#automation-rules)을 참조하세요.

### 요청 예시

```json
{
  "id": "example-rule",
  "active_version": "CURRENT_VERSION",
  "preview": true
}
```

### 응답 및 완료

설정 결과 모델과 경우에 따라 impact가 반환됩니다.

<a id="automationrulesdisable"></a>

## automation.rules.disable

규칙 비활성화

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/rules/disable`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |
| `expected_revision` | integer | 선택 사항 | 현재 규칙 리비전입니다. | 추천 |

공유 [데이터 모델](../configuration-models.md#automation-rules)을 참조하세요.

### 요청 예시

```json
{
  "id": "example-rule",
  "active_version": "CURRENT_VERSION"
}
```

### 응답 및 완료

active_version/source/loaded/configured/enabled/paused/saved/uncertain과 오류 위치를 포함하는 설정 결과입니다. 전체 config-result 모델을 참고하세요.

<a id="automationrulesenable"></a>

## automation.rules.enable

규칙 활성화

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/rules/enable`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |
| `expected_revision` | integer | 선택 사항 | 현재 규칙 리비전입니다. | 추천 |

공유 [데이터 모델](../configuration-models.md#automation-rules)을 참조하세요.

### 요청 예시

```json
{
  "id": "example-rule",
  "active_version": "CURRENT_VERSION"
}
```

### 응답 및 완료

active_version/source/loaded/configured/enabled/paused/saved/uncertain과 오류 위치를 포함하는 설정 결과입니다. 전체 config-result 모델을 참고하세요.

<a id="automationrulesexport"></a>

## automation.rules.export

구성 팩(.tscfg)으로 규칙 내보내기

**방법**: POST
**경로**: `/api/v1/automation/rules/export`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `recipient_cert` | string | 선택 사항 | 수신자 인증서 PEM입니다. 생략하면 이 장치용으로 암호화합니다. | 이 장치 인증서 |

공유 [데이터 모델](../configuration-models.md#automation-rules)을 참조하세요.

### 요청 예시

```json
{
  "id": "example-rule"
}
```

### 응답 및 완료

data.tscfg/filename; 포장은 규칙 윤곽 입력을 포함합니다.

<a id="automationrulesget"></a>

## automation.rules.get

ID로 규칙 세부정보 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/automation/rules/get`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |

공유 [데이터 모델](../configuration-models.md#automation-rules)을 참조하세요.

### 요청 예시

```json
{
  "id": "example-rule"
}
```

### 응답 및 완료

규칙 정의, 현재 개정 및 런타임 통계; 아래-ADMIN omits 완전한 상태/actions.

<a id="automationrulesimport"></a>

## automation.rules.import

구성 팩에서 규칙 가져오기

**방법**: POST
**경로**: `/api/v1/automation/rules/import`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `tscfg` | string | 필수 | 패키지 JSON 텍스트. | 기본값 없음 |
| `preview` | boolean | 선택 사항 | 미리보기 또는 적용 모드. | false |
| `active_version` | string | 적용 시 필수 | 현재 구성 버전입니다. | 기본값 없음 |
| `overwrite` | boolean | 선택 사항 | 동일한 ID로 규칙을 덮어씁니다. | false |
| `expected_revision` | integer | 적용 시 필수 | 미리보기에서 반환된 규칙 리비전입니다. | 기본값 없음 |
| `expected_generation` | integer | 적용 시 필수 | 미리보기에서 반환된 규칙 세대 번호입니다. | 기본값 없음 |
| `credential_generation` | integer | 적용 시 필수 | 미리보기에서 반환된 인증서·자격 증명 세대 번호입니다. | 기본값 없음 |
| `package_digest` | string | 적용 시 필수 | 미리보기로 반환된 패키지 다이제스트입니다. | 기본값 없음 |

공유 [데이터 모델](../configuration-models.md#automation-rules)을 참조하세요.

### 요청 예시

```json
{
  "tscfg": "PACKAGE_JSON_TEXT",
  "preview": true
}
```

### 응답 및 완료

미리보기·적용 결과, 버전, 다이제스트가 반환됩니다. 적용 시에는 미리보기의 전제 조건이 여전히 유효한지 확인합니다.

### 사용 참고 사항

완전한 JSON 본문만 사용하며 쿼리 매개변수는 사용하지 않습니다. 확인 필드가 다른 가져오기와 다르므로 여기서는 expected_credential/expected_digest를 사용하지 마세요.

<a id="automationruleslist"></a>

## automation.rules.list

모든 규칙 나열

**메서드**: GET / POST
**경로**: `/api/v1/automation/rules/list`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

공유 [데이터 모델](../configuration-models.md#automation-rules)을 참조하세요.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.rules/count/active_version/loaded/paused/load_error/recovery_required/invalid_items/restart_required. 항목에는 ID, 활성화, 개정, 런타임 통계가 포함됩니다. 이하-ADMIN은(는) 제한됩니다.

<a id="automationrulestrigger"></a>

## automation.rules.trigger

규칙을 수동으로 트리거

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/rules/trigger`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |

### 요청 예시

```json
{
  "id": "example-rule",
  "active_version": "CURRENT_VERSION"
}
```

### 응답 및 완료

트리거 결과 또는 거부 사유입니다. 완료 여부는 동작·서비스 상태로 확인하세요.

### 사용 참고 사항

실제 효과가 있습니다. 쿨다운, 일시정지, 조건 및 런타임 상태로 인해 트리거링이 거부될 수 있습니다.

<a id="automationrulesupdate"></a>

## automation.rules.update

예상 리비전을 지정하여 규칙 업데이트

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/rules/update`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |
| `expected_revision` | integer | 선택 사항 | 원래 규칙 리비전입니다. 업데이트 시 가장 최근에 조회한 값을 보내세요. | 생성에는 필요하지 않습니다. |

공유 [데이터 모델](../configuration-models.md#automation-rules)을 참조하세요.

### 요청 예시

```json
{
  "id": "example-rule",
  "name": "Temperature example",
  "enabled": false,
  "logic": "and",
  "conditions": [
    {
      "variable": "example.temperature",
      "operator": "gt",
      "value": 50
    }
  ],
  "actions": [
    {
      "type": "log",
      "level": 3,
      "message": "Temperature high"
    }
  ],
  "cooldown_ms": 10000,
  "active_version": "CURRENT_VERSION"
}
```

### 응답 및 완료

active_version/source/loaded/configured/enabled/paused/saved/uncertain과 오류 위치를 포함하는 설정 결과입니다. 전체 config-result 모델을 참고하세요.

### 사용 참고 사항

저장과 트리거링은 별개입니다. 필터링된 보기의 전체 규칙을 덮어쓰지 마세요.

<a id="automationserviceslist"></a>

## automation.services.list

독립적인 원격 서비스 제어 나열

**메서드**: GET / POST
**경로**: `/api/v1/automation/services/list`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.items에 run_id/command_id/rule_id/source/name/state/current/last_known과 작업 상태가 포함됩니다.

### 사용 참고 사항

보유된 실행 레코드는 원격 프로세스가 여전히 존재함을 증명하지 않습니다. 필요한 경우 명시적으로 확인을 요청하세요.

<a id="automationservicesstatus"></a>

## automation.services.status

관리형 원격 프로세스 상태 확인

**메서드**: GET / POST
**경로**: `/api/v1/automation/services/status`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `run_id` | string | 필수 | 시작 응답 또는 서비스 목록의 실행 ID입니다. | 기본값 없음 |
| `verify` | boolean | 선택 사항 | 원래 호스트에 연결하여 상태를 확인합니다. | 작업별 처리 |

### 요청 예시

```json
{
  "run_id": "YOUR_RUN_ID",
  "verify": true
}
```

### 응답 및 완료

data.run_id/state/source/last_known/confirmed_ms/generation/busy, operation_id/operation_phase/operation_kind/operation_reason/operation_error.

### 사용 참고 사항

busy이거나 진행 중인 작업은 계속 조회하세요. 중지는 검증된 원래 프로세스 ID를 사용하며, 임의의 이름으로 프로세스를 종료하지 않습니다.

<a id="automationservicesstop"></a>

## automation.services.stop

검증된 관리형 원격 프로세스 중지

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/services/stop`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `run_id` | string | 필수 | 시작 응답 또는 서비스 목록의 실행 ID입니다. | 기본값 없음 |
| `verify` | boolean | 선택 사항 | 원래 호스트에 연결하여 상태를 확인합니다. | 작업별 처리 |

### 요청 예시

```json
{
  "run_id": "YOUR_RUN_ID",
  "verify": true
}
```

### 응답 및 완료

data.run_id/state/source/last_known/confirmed_ms/generation/busy, operation_id/operation_phase/operation_kind/operation_reason/operation_error.

### 사용 참고 사항

busy이거나 진행 중인 작업은 계속 조회하세요. 중지는 검증된 원래 프로세스 ID를 사용하며, 임의의 이름으로 프로세스를 종료하지 않습니다.

<a id="automationsourcesadd"></a>

## automation.sources.add

새 데이터 소스 추가

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/sources/add`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |

공유 [데이터 모델](../configuration-models.md#data-sources)을 참조하세요.

### 요청 예시

```json
{
  "id": "example-source",
  "label": "Temperature",
  "type": "rest",
  "enabled": false,
  "poll_interval_ms": 5000,
  "rest_url": "https://example.com/status",
  "rest_method": "GET",
  "auto_discover": false,
  "mappings": [
    {
      "path": "temperature",
      "var": "compute.temperature"
    }
  ],
  "active_version": "CURRENT_VERSION"
}
```

### 응답 및 완료

active_version/source/loaded/configured/enabled/paused/saved/uncertain과 오류 위치를 포함하는 설정 결과입니다. 전체 config-result 모델을 참고하세요.

### 사용 참고 사항

추가에는 사용되지 않은 ID가 필요합니다. 업데이트에는 기존 개체가 필요합니다. 전체 모델 예를 확인하세요.

<a id="automationsourcesadd_mapping"></a>

## automation.sources.add_mapping

기존 데이터 소스에 필드 매핑 추가

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/sources/add_mapping`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |
| `json_path` | string | 필수 | 추출할 데이터 필드 경로입니다. | 기본값 없음 |
| `var_name` | string | 필수 | 대상 변수 이름입니다. | 기본값 없음 |
| `transform` | string | 선택 사항 | 선택적 변환 표현식입니다. | 없음 |

공유 [데이터 모델](../configuration-models.md#data-sources)을 참조하세요.

### 요청 예시

```json
{
  "id": "example-source",
  "active_version": "CURRENT_VERSION",
  "json_path": "temperature",
  "var_name": "compute.temperature"
}
```

### 응답 및 완료

설정 결과 모델과 source_id/mapping_count/mapping_index가 반환됩니다.

<a id="automationsourcesdelete"></a>

## automation.sources.delete

데이터 소스 삭제

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/sources/delete`
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

공유 [데이터 모델](../configuration-models.md#data-sources)을 참조하세요.

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

<a id="automationsourcesdisable"></a>

## automation.sources.disable

데이터 소스 비활성화

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/sources/disable`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |

공유 [데이터 모델](../configuration-models.md#data-sources)을 참조하세요.

### 요청 예시

```json
{
  "id": "example-source",
  "active_version": "CURRENT_VERSION"
}
```

### 응답 및 완료

active_version/source/loaded/configured/enabled/paused/saved/uncertain과 오류 위치를 포함하는 설정 결과입니다. 전체 config-result 모델을 참고하세요.

<a id="automationsourcesenable"></a>

## automation.sources.enable

데이터 소스 활성화

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/sources/enable`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |

공유 [데이터 모델](../configuration-models.md#data-sources)을 참조하세요.

### 요청 예시

```json
{
  "id": "example-source",
  "active_version": "CURRENT_VERSION"
}
```

### 응답 및 완료

active_version/source/loaded/configured/enabled/paused/saved/uncertain과 오류 위치를 포함하는 설정 결과입니다. 전체 config-result 모델을 참고하세요.

<a id="automationsourcesexport"></a>

## automation.sources.export

데이터 소스를 구성 팩(.tscfg)으로 내보내기

**방법**: POST
**경로**: `/api/v1/automation/sources/export`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `recipient_cert` | string | 선택 사항 | 수신자 인증서 PEM입니다. 생략하면 이 장치용으로 암호화합니다. | 이 장치 인증서 |

공유 [데이터 모델](../configuration-models.md#data-sources)을 참조하세요.

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

<a id="automationsourcesimport"></a>

## automation.sources.import

구성 팩에서 데이터 소스 가져오기

**방법**: POST
**경로**: `/api/v1/automation/sources/import`
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

공유 [데이터 모델](../configuration-models.md#data-sources)을 참조하세요.

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

<a id="automationsourceslist"></a>

## automation.sources.list

모든 데이터 소스 나열

**메서드**: GET / POST
**경로**: `/api/v1/automation/sources/list`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `offset` | integer | 선택 사항 | 음수가 아닌 반환 오프셋. | 0 |
| `limit` | integer | 선택 사항 | 반환 항목 수입니다. 생략했다고 일부만 잘라 반환하라는 뜻은 아닙니다. | 모두 |

공유 [데이터 모델](../configuration-models.md#data-sources)을 참조하세요.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.sources/count/total/active_version/load_error/paused; root가 아닌 사람은 제한된 메타데이터를 얻습니다.

<a id="automationsourcesremove_mapping"></a>

## automation.sources.remove_mapping

데이터 소스에서 필드 매핑 제거

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/sources/remove_mapping`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |
| `index` | integer | 하나의 선택 대안 | 음수가 아닌 매핑 ​​인덱스입니다. | 없음 |
| `json_path` | string | 하나의 선택 대안 | 기존 필드 경로입니다. | 없음 |
| `var_name` | string | 하나의 선택 대안 | 기존 변수 이름입니다. | 없음 |

공유 [데이터 모델](../configuration-models.md#data-sources)을 참조하세요.

### 요청 예시

```json
{
  "id": "example-source",
  "active_version": "CURRENT_VERSION",
  "index": 0
}
```

### 응답 및 완료

설정 결과 모델과 source_id/mapping_count가 반환됩니다.

<a id="automationsourcesupdate"></a>

## automation.sources.update

기존 데이터 소스 업데이트

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/sources/update`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `id` | string | 필수 | 고정된 객체 ID입니다. 조회한 기존 ID를 유지하세요. | 기본값 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |

공유 [데이터 모델](../configuration-models.md#data-sources)을 참조하세요.

### 요청 예시

```json
{
  "id": "example-source",
  "label": "Temperature",
  "type": "rest",
  "enabled": false,
  "poll_interval_ms": 5000,
  "rest_url": "https://example.com/status",
  "rest_method": "GET",
  "auto_discover": false,
  "mappings": [
    {
      "path": "temperature",
      "var": "compute.temperature"
    }
  ],
  "active_version": "CURRENT_VERSION"
}
```

### 응답 및 완료

active_version/source/loaded/configured/enabled/paused/saved/uncertain과 오류 위치를 포함하는 설정 결과입니다. 전체 config-result 모델을 참고하세요.

### 사용 참고 사항

추가에는 사용되지 않은 ID가 필요합니다. 업데이트에는 기존 개체가 필요합니다. 전체 모델 예를 확인하세요.

<a id="automationstart"></a>

## automation.start

자동화 엔진 시작

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/start`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

code=0/message는 요청 성공을 나타냅니다. 실행 상태는 automation.status를 읽어 확인하세요.

### 사용 참고 사항

엔진 상태, 완료되지 않은 작업 또는 스토리지가 요청을 거부할 수 있습니다. 중지 시간 초과는 모든 작업이 종료되었음을 의미하지 않습니다.

<a id="automationstatus"></a>

## automation.status

자동화 엔진 상태 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/automation/status`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

데이터에는 엔진 상태에 따른 엔진 상태, 카운터, 구성 소스 및 자동 시작 정보가 포함됩니다.

<a id="automationstop"></a>

## automation.stop

자동화 엔진 중지

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/stop`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

code=0/message는 요청 성공을 나타냅니다. 실행 상태는 automation.status를 읽어 확인하세요.

### 사용 참고 사항

엔진 상태, 완료되지 않은 작업 또는 스토리지가 요청을 거부할 수 있습니다. 중지 시간 초과는 모든 작업이 종료되었음을 의미하지 않습니다.

<a id="automationtestdevice"></a>

## automation.test.device

장치 제어 동작 테스트

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/test/device`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `device` | string | 필수 | agx 또는 lpmu. | 기본값 없음 |
| `action` | string | 필수 | 대상에서 지원하는 전원·리셋 동작입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "device": "agx",
  "action": "on"
}
```

### 응답 및 완료

code=0/message는 제어 호출 성공을 보고합니다. 나중에 device.status를 읽어보세요.

### 사용 참고 사항

실제 대상 컴퓨터를 제어합니다.

<a id="automationtestgpio"></a>

## automation.test.gpio

GPIO 동작 테스트

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/test/gpio`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `pin` | integer | 필수 | 지원되는 핀 번호입니다. | 기본값 없음 |
| `level` | boolean | 필수 | true=high, false=low입니다. | 기본값 없음 |
| `pulse_ms` | integer | 선택 사항 | 펄스 지속 시간(밀리초); 0은 시간 펄스가 없음을 의미합니다. | 0 |

### 요청 예시

```json
{
  "pin": 1,
  "level": false,
  "pulse_ms": 0
}
```

### 응답 및 완료

코드=0/message action-call 성공 보고. 대상 핀을 별도로 읽으십시오.

### 사용 참고 사항

하드웨어 핀을 작동합니다. 먼저 기능을 확인하십시오.

<a id="automationtestled"></a>

## automation.test.led

LED 동작 테스트

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/test/led`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `device` | string | 필수 | 대상 LED 장치. | 기본값 없음 |
| `index` | integer | 선택 사항 | LED 인덱스. | 0 |
| `r` | integer | 선택 사항 | 빨간색 구성 요소, 0-255. | 0 |
| `g` | integer | 선택 사항 | 녹색 구성 요소, 0-255. | 0 |
| `b` | integer | 선택 사항 | 파란색 구성 요소, 0-255. | 0 |

### 요청 예시

```json
{
  "device": "board",
  "r": 0,
  "g": 64,
  "b": 128
}
```

### 응답 및 완료

액션 실행 결과가 데이터로 표시됩니다.

### 사용 참고 사항

이름 테스트에도 불구하고 장치를 변경합니다.

<a id="automationtestssh"></a>

## automation.test.ssh

SSH 명령 실행 테스트

**방법**: POST
**경로**: `/api/v1/automation/test/ssh`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `host_id` | string | 필수 | 저장된 SSH 호스트 구성 ID입니다. | 기본값 없음 |
| `command` | string | 필수 | 원격 명령. | 기본값 없음 |
| `timeout_ms` | integer | 선택 사항 | 시간 초과(밀리초)입니다. | 30000 |

### 요청 예시

```json
{
  "host_id": "example-host",
  "command": "uname -a",
  "timeout_ms": 30000
}
```

### 응답 및 완료

원격 실행 결과; 종료 코드와 출력을 검사합니다.

### 사용 참고 사항

연결하고 실행합니다. 구문 전용 검사가 아닙니다.

<a id="automationvariablesdelete"></a>

## automation.variables.delete

저장된 사용자 변수 삭제

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/variables/delete`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `name` | string | 필수 | 사용자 변수 이름입니다. | 기본값 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |
| `preview` | boolean | 선택 사항 | 참조에 미치는 영향만 미리 봅니다. | false |
| `force` | boolean | 선택 사항 | 영향 확인 후 강제 삭제를 요청합니다. | false |
| `pause_automation` | boolean | 선택 사항 | 처리하기 전에 자동화를 일시 중지합니다. | false |

공유 [데이터 모델](../response-models.md#variable)을 참조하세요.

### 요청 예시

```json
{
  "name": "example.temperature",
  "active_version": "CURRENT_VERSION",
  "preview": true
}
```

### 응답 및 완료

설정 결과 모델과 경우에 따라 impact가 반환됩니다.

<a id="automationvariablesget"></a>

## automation.variables.get

변수 값 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/automation/variables/get`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `name` | string | 필수 | 완전한 변수 이름입니다. | 기본값 없음 |

공유 [데이터 모델](../response-models.md#variable)을 참조하세요.

### 요청 예시

```json
{
  "name": "compute.temperature"
}
```

### 응답 및 완료

데이터에는 변수 값과 유형, 소스, 읽기 전용 및 업데이트 메타데이터가 포함됩니다.

<a id="automationvariableslist"></a>

## automation.variables.list

모든 변수 나열

**메서드**: GET / POST
**경로**: `/api/v1/automation/variables/list`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `configured_only` | boolean | 선택 사항 | 저장된 사용자 변수 정의만 나열합니다. | false |
| `prefix` | string | 선택 사항 | 변수 이름 접두사 필터. | 없음 |
| `source_id` | string | 선택 사항 | 소스 ID로 필터링합니다. | 없음 |
| `include_value` | boolean | 선택 사항 | 변수 값을 포함합니다. | true |
| `include_meta` | boolean | 선택 사항 | timestamps, source, readonly 등 추가 메타데이터를 포함합니다. | true |

공유 [데이터 모델](../response-models.md#variable)을 참조하세요.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.variables/count가 반환됩니다. include_value는 값 포함 여부를, include_meta는 시간, 소스, readonly 등 관련 메타데이터 포함 여부를 제어합니다.

<a id="automationvariablesset"></a>

## automation.variables.set

변수 값 설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/automation/variables/set`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `name` | string | 필수 | 사용자 변수 이름입니다. | 기본값 없음 |
| `active_version` | string | 필수 | 구성 상태의 최신 active_version; 변경 후 다시 읽으십시오. | 기본값 없음 |
| `value` | boolean / number / string / null | 필수 | 저장할 값입니다. 숫자형 온도 대신 배열이나 객체를 보내지 마세요. | 기본값 없음 |
| `create_only` | boolean | 선택 사항 | 덮어쓰지 않고 기존 값을 반환합니다. | false |
| `source_id` | string | 선택 사항 | 소스 식별자입니다. | user |
| `value_type` | integer | 선택 사항 | 선택적 유형 ID; 일반적으로 값에서 추론합니다. | 값에서 추론됨 |

공유 [데이터 모델](../response-models.md#variable)을 참조하세요.

### 요청 예시

```json
{
  "name": "example.temperature",
  "value": 42.5,
  "active_version": "CURRENT_VERSION"
}
```

### 응답 및 완료

설정 결과 모델과 name/created/value가 반환됩니다.

### 사용 참고 사항

읽기 전용 변수와 시스템 소스 변수는 변경을 거부할 수 있습니다. 배열·객체는 이 단순화된 값 모델에서 지원하지 않습니다.

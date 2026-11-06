# 애플리케이션 컴퓨터 네트워크 설정 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [network.lpmu_access.log](#networklpmu_accesslog) | 애플리케이션 컴퓨터 네트워크 접속 실행에 대한 실행 로그를 가져옵니다. |
| [network.lpmu_access.start](#networklpmu_accessstart) | 애플리케이션 컴퓨터의 업스트림 네트워크 접속 설정 시작 |
| [network.lpmu_access.status](#networklpmu_accessstatus) | 애플리케이션 컴퓨터 업스트림 네트워크 액세스 설정 상태 가져오기 |

<a id="networklpmu_accesslog"></a>

## network.lpmu_access.log

애플리케이션 컴퓨터 네트워크 접속 실행에 대한 실행 로그를 가져옵니다.

**메서드**: GET / POST
**경로**: `/api/v1/network/lpmu_access/log`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `run_id` | integer | 필수 | 시작 응답 또는 상태 조회에서 반환된 현재 실행 번호입니다. | 기본값 없음 |
| `offset` | integer | 필수 | 음수가 아닌 바이트 오프셋; 처음에는 0을 사용합니다. | 기본값 없음 |

### 요청 예시

```json
{
  "run_id": 1,
  "offset": 0
}
```

### 응답 및 완료

data.run_id/output/next_offset/done. next_offset에서 계속하세요.

### 사용 참고 사항

청크당 최대 1024바이트입니다. 오래된 run_id는 거부됩니다. done은 현재까지 쌓인 로그를 모두 읽었다는 뜻입니다. 작업 상태도 확인하세요.

<a id="networklpmu_accessstart"></a>

## network.lpmu_access.start

애플리케이션 컴퓨터의 업스트림 네트워크 접속 설정 시작

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/network/lpmu_access/start`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `sudo_password` | string | 선택 사항 | 원격 sudo 비밀번호는 이 실행에만 사용됩니다. | 비어 있음 |

### 요청 예시

```json
{}
```

### 응답 및 완료

data.run_id/running/stage가 반환됩니다. 상태와 로그를 계속 조회하세요.

### 사용 참고 사항

고정 대상은 10.10.99.99:22입니다. 저장된 호스트와 키가 필요하며 한 번에 작업 하나만 실행합니다. 원격 네트워크를 변경합니다.

<a id="networklpmu_accessstatus"></a>

## network.lpmu_access.status

애플리케이션 컴퓨터 업스트림 네트워크 액세스 설정 상태 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/network/lpmu_access/status`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `diagnostics` | boolean | 선택 사항 | 추가 시간·리소스 진단 정보를 포함합니다. | false |

### 요청 예시

```json
{}
```

### 응답 및 완료

data.run_id/running/stage, 전송된 바이트,exit_code/reason/failure_stage,internet_confirmed/configuration_complete,output_tail/output_truncated. 진단은 요청한 경우에만 나타납니다.

### 사용 참고 사항

완료 여부는 최종 단계나 스크립트의 확인 결과로 판단합니다. 대기열 등록이나 스크립트 종료 코드 0만으로 네트워크 설정이 완료되었다고 판단하지 마세요.

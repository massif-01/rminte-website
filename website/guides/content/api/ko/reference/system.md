# 컨트롤러 상태 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [system.apis](#systemapis) | 등록된 모든 API 나열 |
| [system.cpu](#systemcpu) | CPU 코어 통계 가져오기 |
| [system.info](#systeminfo) | 시스템 정보 가져오기 |
| [system.log.level](#systemloglevel) | 로그 수준 조회·설정 |
| [system.memory](#systemmemory) | 메모리 정보 가져오기 |
| [system.memory_detail](#systemmemory_detail) | 자세한 메모리 분석 가져오기 |
| [system.reboot](#systemreboot) | 시스템 재부팅 |
| [system.tasks](#systemtasks) | 작업 목록 가져오기 |

<a id="systemapis"></a>

## system.apis

등록된 모든 API 나열

**메서드**: GET / POST
**경로**: `/api/v1/system/apis`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.apis는 총계를 포함한 이름 문자열의 배열입니다. 레거시 모니터 존재 플래그도 나타날 수 있습니다.

### 사용 참고 사항

이름 목록은 매개변수·접근 권한 설명을 대신하지 않습니다.

<a id="systemcpu"></a>

## system.cpu

CPU 코어 통계 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/system/cpu`
**최소 액세스**: 공개

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.total_usage/cores가 반환되며 각 코어에는 id/usage가 포함됩니다. 추론 컴퓨터가 아닌 컨트롤러의 지표입니다.

<a id="systeminfo"></a>

## system.info

시스템 정보 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/system/info`
**최소 액세스**: 공개

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.app에는 name/version/idf_version/compile_time/compile_date, chip에는 model/cores/revision/features가 포함됩니다. flash_size는 바이트, uptime_ms는 밀리초 단위입니다.

<a id="systemloglevel"></a>

## system.log.level

로그 수준 조회·설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/system/log/level`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `level` | integer | 선택 사항 | 0=NONE, 1=ERROR, 2=WARN, 3=INFO, 4=DEBUG, 5=VERBOSE입니다. | 변경되지 않음 |
| `tag` | string | 선택 사항 | 이 모듈의 로그 수준만 변경합니다. 생략은 모든 모듈에 영향을 미칩니다. | 글로벌 |

### 요청 예시

```json
{
  "level": 3
}
```

### 응답 및 완료

data.status가 반환되며 변경 작업에는 level/tag도 포함됩니다.

### 사용 참고 사항

임시 진단용입니다. 영구 파일 로깅은 약속되지 않습니다.

<a id="systemmemory"></a>

## system.memory

메모리 정보 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/system/memory`
**최소 액세스**: 공개

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.free_heap/min_free_heap의 단위는 바이트입니다. internal과 사용 가능한 psram에는 total/free/allocated/largest_block이 포함되며 모두 바이트 단위입니다.

<a id="systemmemory_detail"></a>

## system.memory_detail

자세한 메모리 분석 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/system/memory_detail`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.dram/psram/iram/dma/static/rtc/nvs/tasks/history/tips 진단 그룹이 반환됩니다. total/free/used는 메모리 통계이며 stack_allocation_estimated는 추정치임을 나타냅니다.

### 사용 참고 사항

한 시점의 진단 스냅샷에 담긴 추정치는 물리 메모리의 정확한 사용 내역이나 메모리 누수의 증거가 아닙니다.

<a id="systemreboot"></a>

## system.reboot

시스템 재부팅

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/system/reboot`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `delay` | integer | 선택 사항 | 지연(밀리초), 최종적으로 100-10000으로 제한됩니다. | 500 |

### 요청 예시

```json
{
  "delay": 500
}
```

### 응답 및 완료

data.status=rebooting, delay_ms, waiting_for_maintenance=false가 반환됩니다. 지연 시간이 지난 뒤 재시작을 요청하며, 이 API는 업데이트 완료를 기다리지 않습니다.

### 사용 참고 사항

관리 연결을 중단합니다. 필요한 설정을 저장하고 복구를 기다린 후 다시 로그인하세요.

<a id="systemtasks"></a>

## system.tasks

작업 목록 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/system/tasks`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.tasks/count가 반환되며 작업에는 name/state/priority/core/stack_hwm이 포함됩니다. stack_hwm은 네이티브 스택 워터마크이며 전체 여유 메모리가 아닙니다.

# 로그 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [log.capture](#logcapture) | ESP_LOG 수집 활성화·비활성화 |
| [log.clear](#logclear) | 로그 버퍼 지우기 |
| [log.list](#loglist) | 필터링을 통해 로그 항목 가져오기 |
| [log.setLevel](#logsetlevel) | 로그 수준 설정 |
| [log.stats](#logstats) | 로그 시스템 통계 가져오기 |

<a id="logcapture"></a>

## log.capture

ESP_LOG 수집 활성화·비활성화

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/log/capture`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `enable` | boolean | 필수 | 시스템 로그를 로그 버퍼에 수집합니다. | 기본값 없음 |

### 요청 예시

```json
{
  "enable": true
}
```

### 응답 및 완료

data.capturing.

<a id="logclear"></a>

## log.clear

로그 버퍼 지우기

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/log/clear`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.cleared가 반환됩니다. 이전 메모리 로그는 더 이상 이 버퍼에서 읽을 수 없습니다.

<a id="loglist"></a>

## log.list

필터링을 통해 로그 항목 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/log/list`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `offset` | integer | 선택 사항 | 이 검색 결과 내에서 시작 오프셋입니다. | 0 |
| `limit` | integer | 선택 사항 | 반환할 항목 수의 한도입니다. 범위는 1~200입니다. | 50 |
| `level` | integer | 선택 사항 | 정확한 로그 수준 1-5; 범위 필터와 결합하지 마십시오. | 모두 |
| `minLevel` | integer | 선택 사항 | 최소 로그 수준. | ERROR |
| `maxLevel` | integer | 선택 사항 | 최대 로그 수준. | VERBOSE |
| `tag` | string | 선택 사항 | 모듈 이름 하위 문자열 필터입니다. | 없음 |
| `keyword` | string | 선택 사항 | 메시지 키워드입니다. | 없음 |

### 요청 예시

```json
{
  "limit": 50
}
```

### 응답 및 완료

data.logs/total/offset/returned/bufferCapacity/bufferCount가 반환됩니다. 각 항목에는 timestamp(시작 이후 밀리초)/level/levelName/tag/message/task가 포함됩니다.

### 사용 참고 사항

메모리 기록의 보관량은 제한되어 있습니다. offset은 선택한 검색 결과 안에서 적용되며 무제한 기록을 뜻하지 않습니다.

<a id="logsetlevel"></a>

## log.setLevel

로그 수준 설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/log/setLevel`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `level` | integer / string | 필수 | 0~5의 정수 또는 error/warn/info/debug/verbose 등의 로그 수준 이름입니다. | 기본값 없음 |
| `tag` | string | 선택 사항 | 특정 모듈; 전역에서는 생략합니다. | 글로벌 |

### 요청 예시

```json
{
  "level": 3
}
```

### 응답 및 완료

data.level은 레벨 이름입니다. 모듈별 변경 사항에는 태그가 포함됩니다.

<a id="logstats"></a>

## log.stats

로그 시스템 통계 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/log/stats`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

로그 버퍼와 수집 통계입니다. 용량과 현재 기록 상태를 나타냅니다.

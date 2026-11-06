# 주소 할당 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [dhcp.clients](#dhcpclients) | DHCP 클라이언트 나열 |
| [dhcp.start](#dhcpstart) | DHCP 서버 시작 |
| [dhcp.status](#dhcpstatus) | DHCP 서버 상태 가져오기 |
| [dhcp.stop](#dhcpstop) | DHCP 서버 중지 |

<a id="dhcpclients"></a>

## dhcp.clients

DHCP 클라이언트 나열

**메서드**: GET / POST
**경로**: `/api/v1/dhcp/clients`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `interface` | string | 선택 사항 | ap/wifi 또는 eth/ethernet입니다. | 조회 시 전체 집계, 시작·중지 시 AP |

### 요청 예시

```json
{
  "interface": "ap"
}
```

### 응답 및 완료

data.clients/count; 임대는 맥을 포함/ip/hostname/lease_start/lease_expire/is_static.

<a id="dhcpstart"></a>

## dhcp.start

DHCP 서버 시작

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/dhcp/start`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `interface` | string | 선택 사항 | ap/wifi 또는 eth/ethernet입니다. | 조회 시 전체 집계, 시작·중지 시 AP |

### 요청 예시

```json
{
  "interface": "ap"
}
```

### 응답 및 완료

data.interface/started.

<a id="dhcpstatus"></a>

## dhcp.status

DHCP 서버 상태 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/dhcp/status`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `interface` | string | 선택 사항 | ap/wifi 또는 eth/ethernet입니다. | 조회 시 전체 집계, 시작·중지 시 AP |

### 요청 예시

```json
{
  "interface": "ap"
}
```

### 응답 및 완료

data.interfaces 또는 개별 인터페이스에 state/running, pool, gateway/dns/netmask/lease_min과 통계가 포함됩니다. interface_present/restore_error/apply_error도 포함됩니다. eth에는 want_running/link_up/resume_error가 추가됩니다. 오류 코드 0은 해당 단계에서 오류가 보고되지 않았음을 뜻합니다.

### 사용 참고 사항

want_running은 요청된 상태이며 실제 running 상태가 아닙니다. 인터페이스 존재 여부, 링크 상태, 복원 오류를 각각 확인하세요. 주소를 얻었다는 사실만으로 충분하지 않습니다.

<a id="dhcpstop"></a>

## dhcp.stop

DHCP 서버 중지

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/dhcp/stop`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `interface` | string | 선택 사항 | ap/wifi 또는 eth/ethernet입니다. | 조회 시 전체 집계, 시작·중지 시 AP |

### 요청 예시

```json
{
  "interface": "ap"
}
```

### 응답 및 완료

data.interface/stopped.

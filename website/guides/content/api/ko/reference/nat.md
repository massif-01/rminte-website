# 네트워크 전달 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [nat.disable](#natdisable) | NAT 게이트웨이 비활성화 |
| [nat.enable](#natenable) | NAT 게이트웨이 활성화 |
| [nat.save](#natsave) | NAT 구성 저장 |
| [nat.status](#natstatus) | NAT 게이트웨이 상태 가져오기 |

<a id="natdisable"></a>

## nat.disable

NAT 게이트웨이 비활성화

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/nat/disable`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.success.

### 사용 참고 사항

활성화하려면 연결된 WiFi STA가 필요합니다. nat.save를 사용하여 런타임 변경 사항을 저장합니다.

<a id="natenable"></a>

## nat.enable

NAT 게이트웨이 활성화

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/nat/enable`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.success.

### 사용 참고 사항

활성화하려면 연결된 WiFi STA가 필요합니다. nat.save를 사용하여 런타임 변경 사항을 저장합니다.

<a id="natsave"></a>

## nat.save

NAT 구성 저장

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/nat/save`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.success.

### 사용 참고 사항

활성화하려면 연결된 WiFi STA가 필요합니다. nat.save를 사용하여 런타임 변경 사항을 저장합니다.

<a id="natstatus"></a>

## nat.status

NAT 게이트웨이 상태 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/nat/status`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.enabled/state/wifi_connected/eth_up.

### 사용 참고 사항

활성화하려면 연결된 WiFi STA가 필요합니다. nat.save를 사용하여 런타임 변경 사항을 저장합니다.

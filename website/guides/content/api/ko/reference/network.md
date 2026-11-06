# 네트워크 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [network.eth.status](#networkethstatus) | 이더넷 상태 가져오기 |
| [network.hostname](#networkhostname) | 호스트 이름 조회·설정 |
| [network.status](#networkstatus) | 전체 네트워크 상태 가져오기 |
| [network.wifi.ap.config](#networkwifiapconfig) | WiFi AP 구성 |
| [network.wifi.ap.stations](#networkwifiapstations) | 연결된 AP 스테이션 가져오기 |
| [network.wifi.connect](#networkwificonnect) | WiFi 네트워크에 연결 |
| [network.wifi.disconnect](#networkwifidisconnect) | WiFi 연결 끊기 |
| [network.wifi.mode](#networkwifimode) | Wi-Fi 모드 조회·설정 |
| [network.wifi.scan](#networkwifiscan) | WiFi 네트워크 검색 |

<a id="networkethstatus"></a>

## network.eth.status

이더넷 상태 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/network/eth/status`
**최소 액세스**: 공개

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.status/link_up, config_error/config_error_name/interface_present, 유효한 IP/netmask/gateway/dns1/dns2, 및 전송/receive 통계.

<a id="networkhostname"></a>

## network.hostname

호스트 이름 조회·설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/network/hostname`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `hostname` | string | 선택 사항 | 새 장치 호스트 이름입니다. | 쿼리 전용 |

### 요청 예시

```json
{}
```

### 응답 및 완료

data.hostname.

### 사용 참고 사항

액세스 주소와 인증서 이름 일치를 변경할 수 있습니다. 고객은 실제 주소를 확인해야 합니다.

<a id="networkstatus"></a>

## network.status

전체 네트워크 상태 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/network/status`
**최소 액세스**: 공개

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.hostname/wifi_mode, 이더네트, wifi_sta, 및 wifi_ap. ethernet는 또한 포함합니다 config_error/config_error_name/interface_present. IP 및 게이트웨이 필드는 연결 상태에 따라 달라집니다.

<a id="networkwifiapconfig"></a>

## network.wifi.ap.config

WiFi AP 구성

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/network/wifi/ap/config`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `ssid` | string | 필수 | 액세스 포인트 SSID. | 기본값 없음 |
| `password` | string | 선택 사항 | 액세스 포인트 비밀번호입니다. 생략하거나 빈 문자열을 보내면 개방형 AP를 만듭니다. | 빈 문자열 |
| `channel` | integer | 선택 사항 | 액세스 포인트 채널. | 구현 초기값 |
| `hidden` | boolean | 선택 사항 | SSID를 숨깁니다. | false |

### 요청 예시

```json
{
  "ssid": "TianShanOS",
  "password": "REPLACE_WITH_STRONG_PASSWORD",
  "channel": 6,
  "hidden": false
}
```

### 응답 및 완료

data.ssid/auth/channel/hidden/configured.

### 사용 참고 사항

핫스팟을 변경하면 현재 연결에 영향을 줄 수 있습니다.

<a id="networkwifiapstations"></a>

## network.wifi.ap.stations

연결된 AP 스테이션 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/network/wifi/ap/stations`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.count/stations.

<a id="networkwificonnect"></a>

## network.wifi.connect

WiFi 네트워크에 연결

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/network/wifi/connect`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `ssid` | string | 필수 | 대상 네트워크 SSID. | 기본값 없음 |
| `password` | string | 선택 사항 | 네트워크 비밀번호입니다. | 빈 문자열 |

### 요청 예시

```json
{
  "ssid": "YOUR_SSID",
  "password": "YOUR_WIFI_PASSWORD"
}
```

### 응답 및 완료

data.ssid/connecting이 반환됩니다. IP 주소를 받을 때까지 WiFi 상태를 조회하세요.

### 사용 참고 사항

활성 네트워크 연결을 변경할 수 있습니다. 다른 접근 경로를 준비하십시오.

<a id="networkwifidisconnect"></a>

## network.wifi.disconnect

WiFi 연결 끊기

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/network/wifi/disconnect`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.disconnected가 반환됩니다. 관리 연결도 끊길 수 있습니다.

<a id="networkwifimode"></a>

## network.wifi.mode

Wi-Fi 모드 조회·설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/network/wifi/mode`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `mode` | string | 선택 사항 | off/sta/ap/apsta입니다. | 쿼리 전용 |

### 요청 예시

```json
{
  "mode": "apsta"
}
```

### 응답 및 완료

data.mode.

### 사용 참고 사항

스테이션이 네트워크에 합류합니다. ap는 핫스팟을 제공합니다. 전환하면 관리 연결이 끊어질 수 있습니다.

<a id="networkwifiscan"></a>

## network.wifi.scan

WiFi 네트워크 검색

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/network/wifi/scan`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.count/networks; 항목 ssid/rssi/channel/auth 및 wifi.scan의 bssid. RSSI는 dBm입니다.

### 사용 참고 사항

실제 스캔을 시작합니다. 두 인터페이스의 접근 권한 요구 사항은 같지만 auth 설명과 필드가 다릅니다.

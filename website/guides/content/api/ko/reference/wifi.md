# Wi-Fi API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [wifi.connect](#wificonnect) | WiFi 네트워크에 연결 |
| [wifi.disconnect](#wifidisconnect) | WiFi 연결 끊기 |
| [wifi.scan](#wifiscan) | WiFi 네트워크 검색 |
| [wifi.status](#wifistatus) | WiFi 상태 가져오기 |

<a id="wificonnect"></a>

## wifi.connect

WiFi 네트워크에 연결

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/wifi/connect`
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

<a id="wifidisconnect"></a>

## wifi.disconnect

WiFi 연결 끊기

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/wifi/disconnect`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.disconnected가 반환됩니다. 관리 연결도 끊길 수 있습니다.

<a id="wifiscan"></a>

## wifi.scan

WiFi 네트워크 검색

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/wifi/scan`
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

<a id="wifistatus"></a>

## wifi.status

WiFi 상태 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/wifi/status`
**최소 액세스**: 공개

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.ap/sta에는 state/has_ip와 사용 가능한 ip가 포함됩니다. STA에는 gateway/rssi가 추가될 수 있습니다. 구조는 network.status와 다릅니다.

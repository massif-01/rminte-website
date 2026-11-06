# 컴퓨터 및 USB API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [device.fan.set](#devicefanset) | 팬 모드 및 듀티 설정 |
| [device.fan.status](#devicefanstatus) | 팬 상태 가져오기 |
| [device.ping](#deviceping) | 네트워크 연결 테스트(TCP 포트 확인) |
| [device.power](#devicepower) | 장치 전원 제어(on/off/force_off) |
| [device.power.status](#devicepowerstatus) | 전력 측정 가져오기 |
| [device.reset](#devicereset) | 장치 리셋 |
| [device.status](#devicestatus) | 장치 전원 상태 가져오기 |
| [device.usb.set](#deviceusbset) | USB MUX 대상 설정 |
| [device.usb.status](#deviceusbstatus) | USB MUX 상태 가져오기 |

<a id="devicefanset"></a>

## device.fan.set

팬 모드 및 듀티 설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/device/fan/set`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `fan` | integer | 필수 | 팬 ID입니다. | 기본값 없음 |
| `mode` | string | 선택 사항 | off/manual/auto/curve입니다. 이 호환용 API는 별도의 처리 방식을 사용합니다. | 변경되지 않음 |
| `duty` | integer | 선택 사항 | 수동 제어 듀티비입니다. 범위는 0~100%입니다. | 변경되지 않음 |

### 요청 예시

```json
{
  "fan": 0,
  "mode": "manual",
  "duty": 50
}
```

### 응답 및 완료

data.fan/success.

### 사용 참고 사항

새로운 통합을 위해 별도의 fan.mode 및 fan.set 호출을 선호합니다.

<a id="devicefanstatus"></a>

## device.fan.status

팬 상태 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/device/fan/status`
**최소 액세스**: 공개

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `fan` | integer | 선택 사항 | 팬 ID입니다. | 모두 |

### 요청 예시

```json
{}
```

### 응답 및 완료

data.fans 또는 팬 1개; 호환성 온도는 이 항목의 모델을 따릅니다. 새로운 통합을 위해서는 fan.status를 선호하세요.

<a id="deviceping"></a>

## device.ping

네트워크 연결 테스트(TCP 포트 확인)

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/device/ping`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `host` | string | 필수 | 대상 IPv4 주소 또는 호스트 이름입니다. | 기본값 없음 |
| `timeout` | integer | 선택 사항 | 요청 제한 시간(밀리초)입니다. | 1000 |

### 요청 예시

```json
{
  "host": "192.0.2.20",
  "timeout": 1000
}
```

### 응답 및 완료

data.host/reachable이 반환됩니다. 성공 시 latency_ms, 실패 시 error가 포함될 수 있습니다.

### 사용 참고 사항

reachable=false는 진단 결과이지 API가 실행되지 않았다는 증거는 아닙니다.

<a id="devicepower"></a>

## device.power

장치 전원 제어(on/off/force_off)

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/device/power`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `device` | string | 선택 사항 | 대상 컴퓨터: agx=추론, lpmu=응용 프로그램. | agx |
| `action` | string | 필수 | on/off/toggle/force_off. | 기본값 없음 |

### 요청 예시

```json
{
  "device": "agx",
  "action": "on"
}
```

### 응답 및 완료

data.device/action/success는 제어 호출을 보고합니다. 계속해서 device.status를 읽어보세요.

### 사용 참고 사항

force_off는 저장되지 않은 데이터를 잃을 수 있습니다. 정상적인 종료를 선호합니다. 토글을 반복하면 상태가 다시 반전됩니다.

<a id="devicepowerstatus"></a>

## device.power.status

전력 측정 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/device/power/status`
**최소 액세스**: 공개

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.rails의 항목은 name/voltage_mv/current_ma/power_mw이며 total_power_mw도 반환됩니다. 단위는 mV/mA/mW입니다.

<a id="devicereset"></a>

## device.reset

장치 리셋

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/device/reset`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `device` | string | 선택 사항 | 대상 컴퓨터: agx=추론, lpmu=응용 프로그램. | agx |

### 요청 예시

```json
{
  "device": "agx"
}
```

### 응답 및 완료

data.device/reset이 반환됩니다. 이후 컴퓨터와 애플리케이션 상태를 다시 확인하세요.

### 사용 참고 사항

대상 컴퓨터의 작업을 중단합니다.

<a id="devicestatus"></a>

## device.status

장치 전원 상태 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/device/status`
**최소 액세스**: 공개

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `device` | string | 선택 사항 | 대상 컴퓨터: agx=추론, lpmu=응용 프로그램. | agx |

### 요청 예시

```json
{
  "device": "agx"
}
```

### 응답 및 완료

data.device/state/power_good/uptime_ms/boot_count가 반환됩니다. state는 off/standby/on/booting/error 중 하나입니다.

### 사용 참고 사항

전원 상태만으로 운영 체제나 애플리케이션이 준비되었다고 판단하지 마세요.

<a id="deviceusbset"></a>

## device.usb.set

USB MUX 대상 설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/device/usb/set`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `target` | string | 필수 | esp32/agx/lpmu/disconnect. | 기본값 없음 |

### 요청 예시

```json
{
  "target": "agx"
}
```

### 응답 및 완료

data.target/success.

### 사용 참고 사항

전환하면 이전 경로의 제어·전송이 중단될 수 있습니다.

<a id="deviceusbstatus"></a>

## device.usb.status

USB MUX 상태 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/device/usb/status`
**최소 액세스**: 공개

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.target/configured가 반환됩니다. target은 esp32/agx/lpmu/disconnected 중 하나입니다.

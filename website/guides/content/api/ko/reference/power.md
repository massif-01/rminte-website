# 전원 및 보호 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [power.chip](#powerchip) | 전원 칩 데이터 가져오기 |
| [power.debug](#powerdebug) | 디버그 모드 설정 |
| [power.interval.set](#powerintervalset) | 샘플링 간격 설정 |
| [power.monitor.start](#powermonitorstart) | 전력 모니터링 시작 |
| [power.monitor.stop](#powermonitorstop) | 전력 모니터링 중지 |
| [power.protection.config](#powerprotectionconfig) | 전압 보호 구성 가져오기 |
| [power.protection.set](#powerprotectionset) | 전압 보호 구성 |
| [power.protection.status](#powerprotectionstatus) | 전압 보호 상태 가져오기 |
| [power.stats](#powerstats) | 모니터링 통계 가져오기 |
| [power.stats.reset](#powerstatsreset) | 모니터링 통계 재설정 |
| [power.status](#powerstatus) | 전력 모니터링 상태 가져오기 |
| [power.threshold.set](#powerthresholdset) | 전압 임계값 설정 |
| [power.voltage](#powervoltage) | 현재 전압 읽기 |

<a id="powerchip"></a>

## power.chip

전원 칩 데이터 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/power/chip`
**최소 액세스**: 공개

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.voltage_v/current_a/power_w/valid/crc_valid/timestamp_ms/raw_data가 반환됩니다. 유효성과 통신 무결성이 확인된 값만 사용하세요.

<a id="powerdebug"></a>

## power.debug

디버그 모드 설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/power/debug`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `enable` | boolean | 필수 | 디버그 출력을 활성화합니다. | 기본값 없음 |

### 요청 예시

```json
{
  "enable": false
}
```

### 응답 및 완료

data.debug_enabled.

<a id="powerintervalset"></a>

## power.interval.set

샘플링 간격 설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/power/interval/set`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `interval_ms` | integer | 필수 | 샘플링 간격(밀리초). 장치는 지원되는 범위보다 낮은 값을 거부합니다. | 기본값 없음 |

### 요청 예시

```json
{
  "interval_ms": 1000
}
```

### 응답 및 완료

data.interval_ms.

<a id="powermonitorstart"></a>

## power.monitor.start

전력 모니터링 시작

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/power/monitor/start`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.running.

### 사용 참고 사항

샘플링을 중지하면 향후 업데이트에 영향을 미칩니다. 보호에 필요한 데이터도 확인하세요.

<a id="powermonitorstop"></a>

## power.monitor.stop

전력 모니터링 중지

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/power/monitor/stop`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.running.

### 사용 참고 사항

샘플링을 중지하면 향후 업데이트에 영향을 미칩니다. 보호에 필요한 데이터도 확인하세요.

<a id="powerprotectionconfig"></a>

## power.protection.config

전압 보호 구성 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/power/protection/config`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.low_voltage_threshold/recovery_voltage_threshold(V), shutdown_delay_sec/recovery_hold_sec/fan_stop_delay_sec(초) 및 기본값이 반환됩니다.

<a id="powerprotectionset"></a>

## power.protection.set

전압 보호 구성

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/power/protection/set`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `enable` | boolean | 선택 사항 | 보호 기능을 시작하거나 중지합니다. 이 필드를 보내면 활성화 상태는 항상 저장됩니다. | 변경되지 않음 |
| `low_threshold` | number | 선택 사항 | 저전압 임계값(V) | 변경되지 않음 |
| `recovery_threshold` | number | 선택 사항 | 복구 임계 전압(V)입니다. | 변경되지 않음 |
| `shutdown_delay` | integer | 선택 사항 | 저전압 셧다운 지연(초). | 변경되지 않음 |
| `recovery_hold` | integer | 선택 사항 | 필요한 복구 보류 시간(초)입니다. | 변경되지 않음 |
| `fan_stop_delay` | integer | 선택 사항 | 컴퓨터 종료 후 팬 정지 지연 시간(초)입니다. | 변경되지 않음 |
| `persist` | boolean | 선택 사항 | true는 매개변수 전용 변경 사항을 저장합니다. 활성화 변경 사항은 자동으로 저장됩니다. | false |

### 요청 예시

```json
{
  "persist": true
}
```

### 응답 및 완료

data.low_threshold_v/recovery_threshold_v/running/persisted.

### 사용 참고 사항

보호 기능과 자동 종료에 영향을 줍니다. 일부 적용 후 오류가 발생할 수 있으므로 설정과 상태를 다시 읽어 확인하세요.

<a id="powerprotectionstatus"></a>

## power.protection.status

전압 보호 상태 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/power/protection/status`
**최소 액세스**: 공개

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.initialized/running/state/current_voltage_v/countdown_remaining_sec/recovery_timer_sec/protection_count/uptime_ms가 반환됩니다. devices에는 agx_powered/lpmu_powered/agx_connected가 포함됩니다.

### 사용 참고 사항

initialized=false인 상태를 보호 기능이 작동 중인 상태로 간주하지 마세요.

<a id="powerstats"></a>

## power.stats

모니터링 통계 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/power/stats`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.voltage_samples/power_chip_packets/crc_errors/timeout_errors/threshold_violations/avg_voltage_v/avg_current_a/avg_power_w/uptime_ms.

<a id="powerstatsreset"></a>

## power.stats.reset

모니터링 통계 재설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/power/stats/reset`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.reset.

### 사용 참고 사항

센서 교정이 아닌 통계를 재설정합니다.

<a id="powerstatus"></a>

## power.status

전력 모니터링 상태 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/power/status`
**최소 액세스**: 공개

### 매개변수

기능별 매개변수는 없습니다.

공유 [데이터 모델](../response-models.md#power)을 참조하세요.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.voltage가 반환됩니다. power_chip에는 voltage_v/current_a/power_w/valid/crc_valid가 포함됩니다. protection, stats, monitoring_active는 각각 보호 상태, 집계 정보, 샘플링 상태를 나타냅니다.

<a id="powerthresholdset"></a>

## power.threshold.set

전압 임계값 설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/power/threshold/set`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `min_v` | number | 필수 | 최소 전압(V) | 기본값 없음 |
| `max_v` | number | 필수 | 최대 전압(V); 최소값보다 큽니다. | 기본값 없음 |

### 요청 예시

```json
{
  "min_v": 12,
  "max_v": 24
}
```

### 응답 및 완료

data.min_v/max_v.

### 사용 참고 사항

모니터링 임계값과 보호 정책은 별개입니다. 보호를 위해 power.protection.set를 사용하십시오.

<a id="powervoltage"></a>

## power.voltage

현재 전압 읽기

**메서드**: GET / POST
**경로**: `/api/v1/power/voltage`
**최소 액세스**: 공개

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `now` | boolean | 선택 사항 | true는 지금 측정하고 false는 가장 최근 측정값을 읽습니다. | false |

### 요청 예시

```json
{}
```

### 응답 및 완료

data.voltage_v(V)/voltage_mv(mV)/adc_raw/timestamp_ms.

# 응답 데이터 모델

이 문서는 `data` 내부의 필드를 설명합니다. 외부 HTTP 상태와 `code`의 처리 방법은 [공통 규칙](conventions.md)을 참고하세요. 반환되는 필드는 장치 상태, 기능 초기화 여부, 호출자의 역할에 따라 달라집니다. 필드가 없으면 알 수 없는 값으로 유지하고, `0`이나 `false`로 채우지 마세요.

## 온도

| 필드 | 해석 |
| --- | --- |
| `temperature_c`, `temperature_01c` | 같은 온도를 각각 섭씨와 섭씨 0.1도 단위로 나타냅니다. |
| `valid` | 측정값을 사용할 수 있는지 나타냅니다. `false`인 값을 정상 온도로 취급하지 마세요. |
| `source`, `active_source`, `preferred_source` | 각각 이번 측정의 소스, 실제 사용 중인 소스, 우선 소스입니다. 필드 이름은 API에 따라 다릅니다. |
| `timestamp_ms`, `last_update_ms` | 이번 장치 시작 이후의 시간이며 Unix 시간이 아닙니다. 단위는 밀리초입니다. |
| `stale`, `age_ms` | 각각 데이터가 오래되었는지와 갱신 후 경과 시간(밀리초)입니다. `null`은 갱신된 적이 없음을 뜻할 수 있습니다. |
| `partial_stale`, `valid_count`, `stale_count` | 다중 변수 바인딩에서 일부 소스가 유효하지 않은 상태를 나타냅니다. 평균값만 확인하지 마세요. |

시스템은 유효한 온도 범위를 제한합니다. 입력은 로컬 센서, 컴퓨팅 원격 측정, 변수 또는 수동 테스트에서 올 수 있습니다. 수동 입력값이 실제 물리적 온도라는 뜻은 아닙니다.

## 팬

`fan.status`에 `id`를 지정하면 팬 하나의 객체를 반환합니다. `id`를 생략하면 `fans`, `temperature`, `temp_valid`, `temp_source`가 포함된 객체를 반환하며, `fans`는 팬 목록입니다.

| 필드 | 유형, 단위 또는 의미 |
| --- | --- |
| `id` | 팬 번호입니다. |
| `mode` | `off`, `manual`, `auto`, `curve` 중 하나입니다. |
| `duty_valid`, `duty` | 각각 출력 유효성과 확인된 실제 듀티비(%)입니다. 듀티비를 알 수 없으면 `duty`는 `null`입니다. |
| `target_duty` | 목표 출력 비율(%)이며 실제 듀티비와 다를 수 있습니다. |
| `rpm` | 분당 회전수입니다. 회전수 측정 지원 여부와 오류 상태를 함께 확인하세요. |
| `enabled`, `running`, `fault` | 각각 활성화, 실행 중, 오류 상태입니다. 실행 상태를 알 수 없으면 `null`일 수 있습니다. |
| `temperature` | 이 팬의 제어에 사용하는 온도이며 단위는 섭씨입니다. |
| `control_temperature`, `guard_temperature`, `predicted_temperature` | 각각 제어 온도, 보호 온도, 예측 온도입니다. 단위는 섭씨입니다. |
| `slope_c_per_min` | 분당 온도 변화량이며 단위는 °C/분입니다. |
| `auto_state`, `guard_active`, `temp_stale` | 각각 자동 제어 단계, 보호 동작 활성 여부, 온도 데이터가 오래되었는지 나타냅니다. |
| `controller_gain`, `cooling_response` | 제어기 진단값입니다. RPM이나 온도로 해석하지 마세요. |

설정 쓰기 결과의 `applied`는 적용 여부, `persisted`는 저장 여부를 나타냅니다. 50%를 요청했다는 사실만으로 하드웨어가 유효한 50% 출력을 내고 있다고 판단하지 마세요.

## 전원

`power.status`는 전압, 전원 칩 측정값, 보호 상태와 통계를 종합해 반환합니다. 세부 정보는 `power.voltage`, `power.chip`, `power.protection.status`로 확인하세요.

| 필드 | 단위 또는 의미 |
| --- | --- |
| `voltage_v`, `current_a`, `power_w` | 각각 V, A, W 단위입니다. |
| `voltage_mv` | mV 단위입니다. V 단위 값과 비교하기 전에 변환하세요. |
| `valid`, `crc_valid` | 각각 데이터 유효성과 통신 검증 결과입니다. 전원 칩 측정값은 두 필드를 모두 확인하세요. |
| `timestamp_ms` | 장치 시작 이후 밀리초입니다. |
| `state`, `countdown_remaining_sec` | 각각 보호 단계와 남은 대기 시간(초)입니다. |
| `initialized`, `running` | 각각 보호 기능의 초기화 완료 여부와 실행 여부입니다. |

`device.power.status`는 별도의 전원 레일 모델을 사용합니다.

| 필드 | 단위 또는 의미 |
| --- | --- |
| `rails`의 `voltage_mv`, `current_ma`, `power_mw` | 각각 mV, mA, mW 단위입니다. |
| `total_power_mw` | 전체 전력이며 단위는 mW입니다. |

컴퓨팅 원격 측정의 `power`도 mW를 사용할 수 있으므로 각 필드에 명시된 단위를 따르세요.

## 구성 결과

객체 저장이나 설정 소스 선택 등의 작업은 상태 필드를 반환합니다. 모든 API가 매번 아래 필드를 전부 반환하는 것은 아닙니다.

| 필드 | 의미 |
| --- | --- |
| `active_version` | 현재 설정 버전입니다. 다음 쓰기에는 이번에 반환된 새 값을 사용하세요. |
| `source` | 현재 활성 설정 소스입니다. |
| `loaded`, `configured`, `enabled`, `paused` | 각각 로드됨, 설정됨, 활성화됨, 일시 중지됨을 뜻하며 서로 다른 상태입니다. |
| `saved`, `uncertain` | 각각 저장 완료 여부와 저장 결과가 불확실한지 나타냅니다. |
| `load_error`, `internal_error` | 활성 설정 또는 내부 백업 오류입니다. |
| `sd_available`, `internal_exists`, `internal_valid` | 각각 SD 사용 가능 여부, 내부 백업 존재 여부, 내부 백업 유효성입니다. |
| `comparison_known`, `backup_matches` | 각각 비교 가능 여부와 백업 일치 여부입니다. 비교 결과를 알 수 없으면 일치한다고 판단하지 마세요. |
| `awaiting_sd_choice` | SD 설정을 사용할지 선택해야 함을 나타냅니다. |
| `internal_saved_at` | 내부 백업 저장 시간 정보입니다. |
| `collection`, `id`, `dependency` | 작업과 관련된 컬렉션, 객체, 종속성 위치입니다. |
| `impact` | 삭제나 교체의 영향을 받는 참조와 실행 기록입니다. |

가져오기 미리보기의 `package_digest`와 `credential_generation`은 적용의 전제 조건이며 재사용할 수 있는 전역 권한이 아닙니다. `restart_required=false`만으로 `loaded`, `enabled` 또는 실제 작업 실행 상태의 확인을 대신할 수 없습니다.

## 변수

변수 객체에는 다음 필드가 포함됩니다. 일부 필드는 반환되지 않을 수 있습니다.

| 필드 | 해석 |
| --- | --- |
| `name` | 변수 이름입니다. |
| `type`, `value_type` | 유형 필드이며 이름은 API에 따라 다릅니다. |
| `value` | 변수 값입니다. |
| `source_id`, `persistent`, `readonly`, `flags` | 소스, 영구 저장, 읽기 전용 여부와 플래그 정보가 포함될 수 있습니다. |
| `last_change_ms`, `last_update_ms`, `age_ms`, `stale` | 변경 시간, 갱신 시간, 데이터 경과 시간과 오래된 데이터 여부가 포함될 수 있습니다. |

`variables.list`에서는 `include_value`로 값 포함 여부를, `include_meta`로 메타데이터 포함 여부를 지정합니다. `value` 필드가 없는 것과 값이 `null`인 것은 다릅니다.

## 인증서

`cert.status`는 인증서 자료, 장치 인증서 정보, 별도 HTTPS 진단 서비스 상태를 구분해 보고합니다.

| 필드 또는 정보 | 해석 |
| --- | --- |
| `has_private_key` | 장치 개인 키가 있는지 나타냅니다. |
| `has_certificate` | 장치 인증서가 있는지 나타냅니다. |
| `has_ca_chain` | CA 인증서 체인이 있는지 나타냅니다. |
| 장치 인증서 정보, 별도 HTTPS 진단 서비스 상태 | 각각 따로 보고되며 서로를 대신하지 않습니다. |
| `time_ready` | 인증서 유효성 판단은 신뢰할 수 있는 시간에 의존할 수 있습니다. 신뢰할 수 있는 시간이 설정되지 않아 판단할 수 없는 상태를 유효하다고 간주하지 마세요. |

설치된 장치 인증서, 별도 HTTPS 진단 서비스가 실제로 불러온 인증 정보, 진단 클라이언트의 신뢰 여부는 각각 확인해야 합니다. 설치 후 서비스 상태를 확인하고, 다시 로드해야 한다면 유지보수 절차를 따르세요. 장치 관리 API는 계속 HTTP를 사용하며, 해당 Bearer 역할은 mTLS 진단 역할과 별개입니다.

## 색상

RGB 성분의 범위는 0~255입니다. `led.fill` 등 직접 색상을 받는 API는 다음 형식을 허용합니다.

- 지원되는 색상 문자열.
- `r`, `g`, `b`를 포함하는 객체.
- `0xRRGGBB`에 해당하는 10진수 정수. JSON에는 16진수 숫자 리터럴을 직접 쓸 수 없습니다.

`led.color.hsv`의 `h`는 0~359도, `s`와 `v`는 0~255이며 백분율이 아닙니다.

색상 보정은 설정 객체를 반환합니다. 변경할 때도 같은 중첩 객체 구조를 사용하세요.

| 필드 또는 하위 객체 | 내용과 범위 |
| --- | --- |
| `enabled` | 색상 보정 활성화 상태입니다. |
| `white_point` | `enabled`, `red_scale`, `green_scale`, `blue_scale`을 포함합니다. |
| `gamma` | `enabled`, `gamma`를 포함하며 `gamma` 범위는 0.1~4입니다. |
| `brightness`, `saturation` | 각각 `enabled`, `factor`를 포함합니다. |
| 배율 | 범위는 0~2입니다. |

일반 장치 `brightness`의 0~255와 보정 `factor`는 서로 다른 단위입니다.

## OTA

URL 또는 SD 파일로 업데이트를 시작한 뒤 `ota.progress`를 조회하세요. 진행 정보는 장치 전체의 상태이며 로그인 세션별 작업 접수 정보가 아닙니다.

| 대상 | 필드와 완료 조건 |
| --- | --- |
| APP 진행 정보 | `state`, `percent`, `total_size`, `received_size`, `message`를 포함합니다. `pending_reboot`는 재시작 대기 상태를 뜻합니다. |
| WWW 진행 정보 | `state`, `percent`, `total`, `received`, `message`, `running`을 포함합니다. `state=completed`와 `running=false`로 완료를 확인합니다. |

진행률 100%만으로 장치가 새 버전을 실행 중이라고 판단하지 마세요.

| 파티션 또는 취소 정보 | 해석 |
| --- | --- |
| `label`, `address`, `size` | 파티션 정보이며 부팅 가능 여부도 함께 반환됩니다. |
| `version`, `project` | 확인 가능한 경우 버전과 프로젝트 정보가 반환됩니다. |
| `can_rollback` | 현재 롤백할 수 있는지 나타냅니다. |
| `aborted` | 이번 취소 호출의 결과입니다. 이후 진행 상황과 실제 상태를 계속 확인하세요. |

바이너리 직접 업로드는 별도의 응답 형식을 사용합니다. HTTP 409와 함께 다음 값이 반환되면 Flash 쓰기는 완료되었지만 SD 복구 캐시가 완전히 저장되지 않은 상태입니다.

| 필드 | 값 |
| --- | --- |
| `status` | `partial` |
| `error` | `recovery_cache_failed` |
| `flash_written` | `true` |

먼저 파티션과 복구 파일을 확인하세요. 쓰기가 수행되지 않았다고 판단해 자동으로 재시도하지 마세요.

## 네트워크

Ethernet 인터페이스와 DHCP 서비스 상태는 구분해서 확인하세요.

| 필드 | 해석 |
| --- | --- |
| `interface_present` | Ethernet 인터페이스가 있는지 나타냅니다. |
| `link_up` | 물리 링크 상태입니다. |
| `config_error`, `config_error_name` | 설정 적용 오류입니다. |
| DHCP의 `running` | 실제 실행 상태입니다. |
| `eth`의 `want_running` | 요청된 상태입니다. |
| `restore_error`, `apply_error`, `resume_error` | 각각 설정 복원, 적용, 연결 단절 후 서비스 재개 단계의 오류입니다. `0`은 해당 단계에서 오류가 보고되지 않았음을 뜻합니다. |

케이블이 연결되어 있다는 사실만으로 IP 설정을 받거나 적용하는 데 성공했다고 판단하지 마세요. 인터페이스와 링크 상태를 함께 확인한 뒤 서비스가 실행되어야 하는지 판단하세요.

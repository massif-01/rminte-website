# 설정 데이터 모델

이러한 모델은 장치가 런타임에 사용할 수 있는 호스트, 명령, 소스, 작업 및 규칙을 저장합니다. 비활성화된 예제를 저장하고 효과를 활성화하기 전에 다시 읽어보세요.

## 쓰기 전에 버전을 읽어보세요

root로 automation.config.status를 읽고 active_version을 보관하세요. 쓰기 요청의 최상위 필드에 이 값을 넣으세요. 쓰기가 성공할 때마다 반환된 새 버전을 다음 요청에 사용하세요. 규칙 업데이트에는 조회한 revision도 expected_revision으로 보내야 합니다. 충돌 시에는 다시 읽고 병합해야 하며, 버전 토큰만 바꿔 오래된 입력을 다시 보내서는 안 됩니다.

아래 JSON 객체는 완전한 요청 구조의 예제입니다. CURRENT_VERSION, 식별자, 주소, 키, 변수 이름을 실제 값으로 바꾸세요. 모델 필드는 요청의 최상위에 놓으세요. 명시된 하위 객체를 제외하고 config로 감싸지 마세요.

restricted:true는 메타데이터만 표시되었음을 뜻할 수 있습니다. SSH 호스트·명령, 규칙, 동작의 전체 내용 조회에는 ADMIN을 사용하세요. automation.sources.list의 비밀 정보에는 여전히 ROOT가 필요합니다. 정의 쓰기 권한은 각 인터페이스의 요구 사항을 따릅니다. 생략된 비밀 필드는 빈 값이 아닙니다. 호스트·소스 업데이트는 기존 JSON과 병합되지만 명령·동작 업데이트에는 완전한 정의를 보내야 합니다. 규칙은 자체 병합·리비전 검사를 사용하므로 한 종류의 업데이트 동작을 다른 종류에도 그대로 적용하지 마세요.

## SSH 호스트

ssh.hosts.add/update에서 사용합니다. 접속 위치와 방법, 사용할 키를 기록합니다. 호스트 지문은 hosts.*에서 별도로 관리합니다.

```json
{"id":"example-host","active_version":"CURRENT_VERSION","host":"192.0.2.20","port":22,"username":"YOUR_USER","auth_type":"key","keyid":"example-key","enabled":true}
```

| 필드 | 유형, 제한 및 의미 |
| --- | --- |
| id | 고정 식별 문자열이며 최대 31바이트입니다. 추가 시에는 존재하지 않아야 하고 업데이트 시에는 존재해야 합니다. |
| host | 주소 문자열, 최대 63바이트 |
| port | SSH 포트 정수입니다. 보통 22이며 1~65535를 사용합니다. |
| username | 원격 사용자, 최대 31바이트; 장치 로그인과 구별됨 |
| auth_type | key/password 중 하나이며, 저장할 정의에는 key를 권장합니다. |
| keyid | 저장된 로컬 SSH 개인 키 ID(최대 31바이트) |
| enabled | 부울, 디코딩 기본값 true |
| created_time | 선택적 부호 없는 32비트 시간 값. 일반적으로 기존 값을 유지합니다. |

영구 모델은 비밀번호 필드를 저장하지 않습니다. 비밀번호 모드는 저장된 원격 비밀번호를 의미하지 않습니다. 즉시 호출은 자체 자격 증명을 제공합니다. 호스트는 최대 16개입니다. 주소, 키 유무, 원격 신뢰 여부를 별도로 확인합니다.

## SSH 명령

ssh.commands.add/update에서 사용합니다. 저장만으로 명령이 실행되지는 않습니다. 짧게 끝나는 명령에는 service_mode:false를, 장시간 관리할 서비스에는 true와 ssh.services.start를 사용하세요.

```json
{"id":"example-command","active_version":"CURRENT_VERSION","host_id":"example-host","name":"Read OS","command":"uname -a","timeout_sec":30,"enabled":true,"service_mode":false}
```

| 필드 | 유형, 제한 및 의미 |
| --- | --- |
| id / host_id | 각각 최대 31바이트인 문자열입니다. host_id는 저장된 호스트를 참조합니다. |
| name / command | 문자열, 최대 63/1023바이트 |
| desc / icon | 선택적 문자열, 최대 127/63바이트; 아이콘은 디스플레이 아이콘 또는 경로일 수 있습니다. |
| expect_pattern / fail_pattern / extract_pattern | 선택적인 일치·추출 패턴이며 각각 최대 127바이트입니다. |
| var_name | 선택적 결과 변수 접두사(최대 31바이트) |
| timeout_sec | 0~65535초이며 기본값은 30입니다. 밀리초가 아닙니다. |
| stop_on_match / nohup / enabled / service_mode | 부울 값입니다. enabled 기본값은 true이고 나머지는 false입니다. |
| ready_pattern / service_fail_pattern | 서비스 준비·실패 확인용 패턴이며 각각 최대 127바이트입니다. |
| ready_timeout_sec / ready_check_interval_ms | 0~65535 범위의 정수로 각각 초·밀리초 단위입니다. 서비스 특성에 맞게 설정하세요. |
| created_time | 선택적 부호 없는 32비트 시간 값 |

별칭은 timeout,expectPattern,failPattern,extractPattern,varName,stopOnMatch,serviceMode,readyPattern,serviceFailPattern,readyTimeout,readyInterval입니다. 테이블 이름을 선호하세요. 두 별칭을 모두 제공하지 마세요. _object_id/runtime_instance는 영구/런타임 ID를 나타냅니다. 반환된 값을 만들어내는 대신 이를 유지합니다. 명령은 최대 64개입니다.

## 데이터 소스

automation.sources.add/update에서 사용합니다. 소스는 데이터를 수집하고 규칙에서 사용하는 변수에 매핑합니다.

```json
{"id":"example-source","active_version":"CURRENT_VERSION","label":"Temperature","type":"rest","enabled":false,"poll_interval_ms":5000,"auto_discover":false,"rest_url":"https://example.com/status","rest_method":"GET","mappings":[{"path":"temperature","var":"compute.temperature"}]}
```

| 공유 필드 | 유형 및 의미 |
| --- | --- |
| id / label | 문자열, 최대 63/47바이트 |
| type | builtin/websocket/socketio/rest/variable 문자열 또는 이에 대응하는 정수 0~4 |
| enabled / auto_discover | 부울; auto_discover 기본값은 true입니다. 예제에서는 이를 명시적으로 비활성화합니다. |
| poll_interval_ms | 0~4294967295밀리초 범위의 정수입니다. 갱신 동작은 type에 따라 다르며 0은 무제한 샘플링을 뜻하지 않습니다. |
| mappings | 최대 4개입니다. path 최대 95바이트, var 최대 63바이트, 선택 사항인 transform 최대 63바이트입니다. |

매핑의 path/var는 json_path/var_name 별칭도 허용합니다. path는 temperature나 cpu.cores[0].freq처럼 data 내부 필드의 위치를 지정하며 URL이 아닙니다. 알고 있는 예시 값으로 변환 결과를 확인하세요.

| 유형 | 유형별 필드 |
| --- | --- |
| websocket | ws_uri 최대 95바이트; ws_path 레거시 단일 필드 경로(최대 63바이트); reconnect_ms0-65535ms |
| socketio | sio_url 최대 95바이트; sio_event 최대 63바이트 |
| rest | rest_url 최대 95바이트, rest_method 최대 7바이트, rest_auth 최대 47바이트, 기존 단일 필드 경로인 rest_path 최대 63바이트 |
| variable | var_name, var_prefix, var_watch_all을 사용합니다. SSH 데이터 흐름은 ssh_host_id, ssh_command, expect_pattern, fail_pattern, extract_pattern, timeout_sec도 사용합니다. |
| builtin | builtin 객체입니다. type으로 내장 샘플을 선택합니다. GPIO는 pin, ADC는 channel/atten을 사용하며 컴퓨터 상태에는 device_index를 사용할 수 있습니다. |

문자열 형식의 소스는 편의 별칭도 허용합니다. WebSocket은 uri/json_path, Socket.IO는 url/event, REST는 url/method/auth_header/json_path를 사용할 수 있습니다. 가능하면 위의 정식 필드명을 사용하세요. 변수 소스 문자열은 보통 최대 63바이트, ssh_command는 95바이트이며 timeout_sec는 0~65535초입니다. 내장 하드웨어의 숫자형 type/channel ID는 핀이나 채널을 추측하지 말고 기존 정의를 참고하세요.

## 사용자 변수

automation.variables.set은 쓰기, get/list는 읽기에 사용합니다. value뿐 아니라 name, source, readonly, age도 확인하세요.

```json
{"name":"example.temperature","value":42.5,"active_version":"CURRENT_VERSION"}
```

값은 null, 부울, 유한 숫자 또는 최대 63바이트의 문자열을 지원합니다. 일반적으로 추론을 위해 value_type을 생략합니다. 명시적 유형은 0=null,1=bool,2=int,3=float,4=string이며 일치해야 합니다. 정수는 부호 있는 32비트 범위를 사용합니다. 다른 유한 숫자 값은 부동 소수점을 사용합니다.

source_id 기본값은 user입니다. create_only:true는 기존 변수를 유지하므로 새로 요청한 값이 쓰였다고 판단할 수 없습니다. 읽기 전용 변수나 시스템 소스 변수는 변경을 거부할 수 있습니다. 온도 바인딩에는 적절한 숫자형 온도 변수가 필요합니다. 문자열, 유효하지 않은 값, 오래된 데이터는 정상적인 센서 측정값이 아닙니다.

## 작업 템플릿

automation.actions.add/update는 재사용할 동작을 저장합니다. 이 예제는 하드웨어를 제어하지 않고 로그 메시지를 기록합니다.

```json
{"id":"example-action","active_version":"CURRENT_VERSION","name":"Record a message","enabled":true,"type":"log","async":false,"delay_ms":0,"log":{"level":3,"message":"Example action"}}
```

공통 필드: id 최대 63바이트, name 47바이트, description 63바이트입니다. enabled 기본값은 true, async 기본값은 false이며 delay_ms 범위는 0~65535밀리초입니다. created_at은 선택적인 0 이상의 정수 시간 값이며, 보통 기존 객체의 값을 유지합니다.

| type | 유형별 하위 개체 및 필드 |
| --- | --- |
| log | log: level, 최대 47바이트의 message |
| set_var | set_var: variable, value, 선택 사항인 value_type |
| ssh_cmd | ssh: host_ref, command, timeout_ms, async |
| ssh_cmd_ref | ssh_ref: 저장된 명령을 참조하는 cmd_id |
| gpio | gpio: pin, **부울** 형식의 level, pulse_ms |
| device_ctrl | device: device, 지원되는 동작을 지정한 action |
| cli | cli: command, var_name, timeout_ms |
| webhook | webhook: url, method, body_template |
| led | led: device, ctrl_type과 해당 표시 기능에 필요한 필드 |

호스트 참조, 변수 이름, 명령 참조, 장치·동작 이름은 보통 최대 63바이트입니다. 인라인 SSH/CLI 명령과 webhook URL은 최대 95바이트, method는 7바이트, body_template은 63바이트입니다. 너무 긴 필드는 거부되므로 자동 잘림에 의존하지 마세요. 인라인 동작 명령의 용량은 저장된 ssh.commands보다 작습니다.

### LED 동작 필드

led.ctrl_type은 fill/effect/brightness/off/text/image/qrcode/filter/filter_stop/text_stop을 사용합니다. 직접 LED API의 모든 매개변수가 아니라 선택한 표시 기능에 필요한 필드만 보내세요.

표시 공통 필드는 device, index(255=전체), color 문자열 또는 r/g/b, brightness 0~255, effect, speed, duration_ms 0~65535입니다. 매트릭스 필드는 text 최대 127바이트, font 31바이트, image_path 127바이트, qr_text 255바이트, qr_ecc 문자열 L/M/Q/H, filter 31바이트, filter_params, center, loop, scroll, align, x/y와 텍스트 위치용 auto_pos입니다. scroll은 none/left/right/up/down, align은 left/center/right를 사용하며 x/y는 부호 있는 16비트 좌표입니다.

QR 코드 전경색은 qr_fg, 배경 이미지는 qr_bg_image를 사용합니다. 명시한 검정은 값 생략이 아닌 의도한 색상입니다. filter_params는 효과가 지원하는 이름별 숫자 옵션을 사용합니다. 실행하려면 지원 하드웨어와 유효한 경로·설정도 필요합니다. 효과를 테스트하기 전에 기존 설정을 읽고 보관하세요.

## 자동화 규칙

automation.rules.add/update는 조건과 동작을 저장합니다. 활성화된 규칙은 자동으로 실행될 수 있으므로 처음에는 enabled:false로 설정하세요.

```json
{"id":"example-rule","active_version":"CURRENT_VERSION","name":"Temperature example","enabled":false,"logic":"and","cooldown_ms":10000,"conditions":[{"variable":"example.temperature","operator":"gt","value":50}],"actions":[{"type":"log","level":3,"message":"Temperature high"}]}
```

| 필드 | 유형 및 의미 |
| --- | --- |
| id / name / icon | 문자열이며 각각 최대 63/47/63바이트입니다. ID에는 경로 구분자와 제어 문자를 사용할 수 없습니다. |
| enabled | 부울 값이며 기본값은 true입니다. 예제에서는 명시적으로 비활성화합니다. |
| manual_trigger / show_on_dashboard / allow_manual_trigger | 트리거·표시 동작을 정하는 부울 값이며 호출자의 권한이 아닙니다. |
| cooldown_ms | 부호 없는 32비트 밀리초 |
| revision | 규칙의 리비전입니다. 조회한 revision을 업데이트 조건의 expected_revision으로 사용하세요. |
| logic / conditions | and/or이며 기본값은 and입니다. 조건은 최대 255개입니다. |
| actions | 최대 255개입니다. 활성화된 규칙에는 동작이 하나 이상 있어야 합니다. |

조건은 {변수, 연산자, 값}입니다. 연산자 eq/ne/lt/le/gt/ge/contains. 값은 변수 모델을 따릅니다. 조건:{논리, 항목:[...]}도 허용됩니다. 하나의 표현을 선택하십시오.

규칙의 인라인 동작은 **평면 필드**를 사용합니다. log는 level/message, SSH는 host_ref/command, GPIO는 pin/level을 사용합니다. 템플릿은 중첩 하위 객체를 사용합니다. 인라인 SSH의 type은 ssh이고 템플릿의 type은 ssh_cmd입니다. template_id 참조가 있으면 캐시된 인라인 필드보다 우선합니다.

동작 공통 필드는 delay_ms, async, repeat_mode(once/while_true/count), repeat_count 0~255, repeat_interval_ms 0~65535, 선택 사항인 condition입니다. condition은 조건 모델을 따르며 null이면 지웁니다. 동작의 실제 영향을 고려해 반복 방식을 선택하세요.

| 인라인 유형 | 플랫 필드 |
| --- | --- |
| log / set_var | level/message 또는 variable/value/value_type |
| ssh / ssh_cmd_ref | host_ref/command/ssh_async/timeout_ms 또는 cmd_id |
| gpio / device_ctrl | pin/부울 level/pulse_ms 또는 device/action |
| webhook / cli | url/method/body_template 또는 command/var_name/timeout_ms |
| led | 평면 필드인 device/ctrl_type/r/g/b 등을 사용합니다. ctrl_type은 템플릿 문자열이 아닌 정수 열거값입니다. |

복잡한 LED 규칙에는 저장된 템플릿 참조를 사용하는 것이 좋습니다. 인라인 ctrl_type은 0 fill, 1 effect, 2 brightness, 3 off, 4 text, 5 image, 6 qrcode, 7 filter, 8 filter_stop, 9 text_stop입니다. 인라인 qr_ecc는 문자 코드 정수로 L76/M77/Q81/H72를 사용합니다.

filter_params는 별도 객체로 유지합니다. 정수 범위는 speed 1~100, intensity/density/decay/amplitude 0~255, scale 1~100, levels 2~16, amount/saturation/frequency 0~100, angle 0~360, width 1~16, wavelength 1~32입니다. 템플릿·UI의 단위는 일부 직접 LED 필터의 단위와 다릅니다. 전체 API 요청을 actions 배열에 넣지 마세요.

## 모듈 구성

config.module.show는 모듈의 구성 객체를 반환합니다. config.module.set가 하나의 키를 변경하기 전에 기존 필드를 읽으십시오. 모듈: net/dhcp/wifi/nat/led/fan/device/system. 모든 지원은 개별 작업을 참조하세요. 키는 모듈에 대해 로컬입니다. 값 유형을 유지합니다.

config.module.save 및 더티 상태는 자동화 active_version과 별개입니다. 네트워킹 변경으로 인해 액세스가 중단될 수 있습니다. 먼저 접근 경로를 기록해 두세요. ADMIN 아래의 WiFi 보기에는 비밀번호가 생략되어 있습니다.

## 모니터링 위젯

ui.widgets는 프런트엔드 레이아웃 JSON을 저장하며 데이터 수집기를 만들지는 않습니다. widgets는 프런트엔드가 해석하는 배열이며 처음에는 비어 있을 수 있습니다. ui.widgets.get을 읽은 뒤 기존 필드와 ID를 유지하며 수정하세요. refresh_interval의 단위는 밀리초이고 기본값은 5000입니다. 직렬화된 전체 설정은 4000바이트로 제한됩니다. nvs_saved만으로 변수에 데이터가 있다고 판단해서는 안 됩니다.

## 가져오기, 삭제 및 소스 선택

먼저 미리보기를 수행한 뒤 미리보기의 전제 조건으로 적용하세요. tscfg는 임의 객체가 아닌 전체 패키지 JSON을 담은 **문자열**입니다. 호스트, 명령, 소스, 동작 가져오기는 expected_digest/expected_credential을 사용합니다. 규칙 가져오기는 확인 필드가 다르므로 해당 참고 문서를 확인하세요.

일반 삭제, 교체, 연쇄 삭제를 선택하기 전에 삭제 영향을 미리 확인하세요. 정의를 삭제해도 원격 프로세스가 자동으로 중지되거나 원격 키 권한이 해제되지는 않습니다. SD/내부 백업 선택은 설정 집합을 교체하므로, 보호된 파일을 덮어쓰지 말고 automation.config.preview/apply를 사용하세요.

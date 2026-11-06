# WebSocket

`ws://10.10.99.97/ws` 에 연결하여 주소를 장치 IP로 바꿉니다. 이 채널은 원격 분석, 로그, 컨트롤러 명령 및 대화형 SSH를 제공합니다. 성공적인 연결만으로는 개인 기능을 승인하지 않습니다.

## 인증 및 구독

HTTP 로그인을 통해 토큰을 얻은 후 다음을 보냅니다.

```json
{"type":"auth","token":"YOUR_TOKEN"}
```

auth_ok를 기다립니다. 실패하면 auth_error가 반환됩니다. 일반 원격 측정 항목은 현재 공개되어 있지만 인증 설정은 보호되는 기능에 여전히 유용합니다. 인증은 READ 세션을 ROOT로 상승시킬 수 없습니다.

```json
{"type":"subscribe","topic":"fan.status","params":{"interval":5000}}
```

성공적인 승인:

```json
{"type":"subscribed","topic":"fan.status","success":true}
```

예시 데이터 봉투:

```json
{"type":"data","topic":"fan.status","timestamp":123,"data":{"fans":[]}}
```

timestamp는 **시작 이후 경과한 초**입니다. HTTP 측정값과 로그는 밀리초를 사용할 수 있습니다. 구독 성공만으로 첫 측정값을 받았다고 판단하지 마세요. 갱신이 멈추면 채널·소스 상태를 확인하고 필요하면 HTTP로 다시 조회하세요.

## 주제

| 주제 | 기본·최소 표시 간격 | 콘텐츠 |
| --- | --- | --- |
| system.dashboard | 1000ms | cpu/memory/info/network/power/fan/services이며, 사용할 수 없는 영역은 생략될 수 있습니다. |
| system.info | 5000ms | 컨트롤러 정보 |
| system.memory | 5000ms | 컨트롤러 메모리 |
| system.cpu | 1000ms | 컨트롤러 CPU |
| network.status | 5000ms | 네트워크 상태 |
| power.status | 5000ms | 전원 상태 |
| fan.status | 5000ms | 팬 |
| service.list | 5000ms | 컨트롤러 서비스 |
| device.status | 이벤트 구동, 기본값 2000ms | 주기적인 전체 스냅샷이 아닌 컴퓨터 상태 이벤트 |
| ota.progress | 이벤트 구동, 기본값 1000ms | 장치 전반에 걸친 진행; 다시 시작한 후 HTTP 진행 상황과 버전을 확인하세요. |
| config.pack.validated | 이벤트 기반, 기본값 0 | 업로드된 패키지를 검증하며 설정을 적용하는 작업은 아님 |

params.interval은 밀리초 단위의 음수가 아닌 정수입니다. 처음 8개의 정기 주제는 0을 거부하고 더 작은 간격을 최소값으로 높입니다. 간격은 마지막 세 개의 이벤트 주제를 폴링으로 변환하지 않습니다. 연결에서 동일한 주제를 다시 구독하면 해당 구독이 업데이트됩니다. 히스토리 큐를 생성하지 않습니다.

`{"type":"unsubscribe","topic":"fan.status"}`로 구독을 취소하고 unsubscribed/success를 확인하세요. `{"type":"ping"}`에 대한 응답은 pong입니다. pong만으로 세션 권한이나 측정 데이터의 정상 상태를 확인할 수는 없습니다.

## 로그

ADMIN 이상이 필요합니다. 인증한 후 log_subscribe를 보냅니다. 기록에도 ADMIN이 필요합니다.

| 송신 type | 필드 | 결과·영향 |
| --- | --- | --- |
| log_subscribe | minLevel, 기본값 VERBOSE | log_subscribed/minLevel을 받은 뒤 type=log 메시지를 받습니다. |
| log_set_level | minLevel | 전체 모듈 출력 수준이 아닌 이 연결의 필터만 바꿉니다. |
| log_get_history | limit 기본값 500, minLevel 기본값 ERROR, maxLevel 기본값 VERBOSE | logs/total을 포함하는 log_history이며 버퍼 용량의 제한을 받습니다. |
| log_unsubscribe | 없음 | 이 연결의 로그 스트림을 중지합니다. |

로그 항목은 start, Level, LevelName, tag, message 및 Task 이후 밀리 초 내에 타임 스탬프를 포함합니다. 레벨 0-5는 NONE입니다/ERROR/WARN/INFO/DEBUG/VERBOSE. Retention는 경계됩니다; reconnect는 자동으로 역사를 재생하지 않습니다.

## 컨트롤러 명령 터미널

이 터미널은 관리 컨트롤러를 제어하며 두 컴퓨터의 Linux 시스템을 제어하는 터미널이 아닙니다. ROOT가 필요하고 명령으로 하드웨어나 설정이 바뀔 수 있습니다.

| 송신 type | 필드 | 결과 |
| --- | --- | --- |
| terminal_start | token | 터미널을 연결하고 사용을 요청합니다. connected 응답에는 prompt가 포함됩니다. 이미 사용 중이면 terminal_busy/retry_after가 반환됩니다. |
| terminal_input | data: 완전한 명령 문자열 | output/data 메시지 뒤에 code/output_incomplete/stopped를 포함한 done이 전달됩니다. |
| terminal_interrupt | 없음 | 중단을 요청합니다. command_stopping이 완료보다 앞설 수 있습니다. |
| terminal_stop | 없음 | 외부 효과의 롤백이 아닌 이 연결의 터미널을 해제합니다. |

한 번에 하나의 터미널 소유자만 활성화됩니다. 라이브 터미널을 인수하지 마십시오. 누락된 출력 자체가 실행 실패를 증명하지는 않습니다. 첫 번째 통합을 위해 터미널 출력을 구문 분석하는 것보다 구조화된 HTTP 상태 API를 선호합니다.

## 대화형 SSH 쉘

root가 필요합니다. ssh_connect는 토큰을 전달하고 연결을 바인딩합니다. 먼저 원격 지문을 확인하세요. 이 셸에는 알 수 없는 자동 지문 인식 스위치가 없습니다.

| 송신 type | 필드 | 결과 |
| --- | --- | --- |
| ssh_connect | token, host, user와 이 원격 로그인에 사용할 선택적 port(기본값 22)/password | ssh_status의 connecting/connected/error를 확인합니다. 이 인터페이스는 비밀번호 인증을 사용합니다. |
| ssh_input | data | 텍스트를 씁니다. 필수 개행 문자를 명시적으로 포함 |
| ssh_resize | width, height | 터미널 열·행 수를 나타내는 1~65535 범위의 정수 |
| ssh_signal | signal | 지원되는 신호를 보냅니다. 지원되지 않는 요청은 실패합니다 |
| ssh_disconnect | 없음 | 이 연결의 쉘 연결을 끊습니다. 최종 ssh_status를 관찰하세요 |

출력은 ssh_output/data, 상태는 ssh_status/status/message로 전달됩니다. 각 연결은 자신이 만든 셸만 제어합니다. 제어 실패나 연결 끊김 후에 입력을 자동으로 다시 보내지 마세요. 원격 측에서 이미 받았을 수 있습니다.

## HTTP 시작 스트리밍 SSH

ssh.exec_stream 시작하다 HTTP 그리고 반환 session_id/boot_id/result_key. 상호 작용하는 포탄에서 분리됩니다. 초기 이벤트를 피하기 위해 시작하기 전에 WebSocket을 인증합니다. 개인 이벤트는 시작 세션에 대한 허가를 연결하기만 합니다.

| 수신 유형 | 필드 및 해석 |
| --- | --- |
| ssh_exec_start | session_id, 명령 및 패턴; 시작했지만 완료되지 않았습니다 |
| ssh_exec_output | session_id, output_offset, output_length, is_stderr, data_b64 |
| ssh_exec_match | session_id, expect_matched/fail_matched와 선택적인 extracted/is_final |
| ssh_exec_running | HTTP 상태 쿼리의 진행 중인 응답 |
| ssh_exec_done | session_id, execution_status, exit_code, status/success 및 일치 결과 |
| ssh_exec_cancelled | session_id, execution_status가 반환됩니다. 취소만으로 원격 프로세스가 종료되었다고 판단해서는 안 됩니다. |
| ssh_exec_error | session_id, error와 선택적인 stage/detail |

data_b64를 바이트로 디코딩하고 output_length를 확인하세요. output_offset으로 누락이나 중복을 감지하세요. 문자가 메시지 경계를 넘어 나뉠 수 있으므로 프레임 간 상태를 유지하는 UTF-8 디코딩을 사용하세요.

최종 결과에는 output_bytes/output_incomplete/collection_truncated/conditions_complete가 포함될 수 있습니다. **실행 완료, 조건 일치, 출력의 완전성은 별개입니다.** exit_code=0이어도 출력이 누락될 수 있으며, 조건 검사가 불완전하면 일치 성공으로 판단할 수 없습니다. 연결이 끊긴 뒤에는 작업 접수 정보로 ssh.exec_status를 조회하세요. 이 조회는 명령을 다시 실행하지 않으며 전체 과거 출력의 복구를 보장하지도 않습니다.

## 용량 및 재연결

이 빌드는 서비스 전반에 걸쳐 8개의 WebSocket 클라이언트와 32개의 주제 구독을 허용합니다. 대형 프레임, 느린 클라이언트, 단독 작업 및 종료로 인해 작업이 거부될 수 있습니다. 입력은 최대 64KiB의 프로토콜 JSON 텍스트여야 합니다. 파일 업로드 메커니즘으로 조각화를 사용하지 마십시오. JSON 깊이 제한도 적용됩니다.

대기 시간을 둔 뒤 다시 연결하고 인증과 구독을 복원하세요. terminal_input, ssh_input 또는 HTTP 제어 요청을 자동으로 반복하지 마세요. 마지막 갱신 이후 시간과 데이터 오래됨·연결 끊김 상태를 표시하여 이전 값이 현재 값처럼 보이지 않도록 하세요.

동반된 subscribe.js 예제에서는 장치에 연결할 수 있고 타사 라이브러리가 필요하지 않은 브라우저를 사용합니다.

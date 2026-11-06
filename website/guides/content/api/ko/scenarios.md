# 작업별 예제

예제는 [빠른 시작](quickstart.md)의 TS_BASE 및 TS_TOKEN을 사용합니다. 주소, 개체 ID, 구성 버전 및 작업 접수 정보를 실제 값으로 바꿉니다. 제어 예제에는 실제 효과가 있습니다. 수행하려는 작업만 사용하십시오.

## 장치 모니터링

온도, 냉각, 전원 및 컴퓨터 상태를 모니터링 시스템으로 읽어옵니다. 읽기 기능을 이용하려면 로그인하세요. 일부 개요 엔드포인트는 공개됩니다.

```sh
curl -H "Authorization: Bearer $TS_TOKEN" "$TS_BASE/api/v1/temp/read"
curl -H "Authorization: Bearer $TS_TOKEN" "$TS_BASE/api/v1/fan/status"
curl -H "Authorization: Bearer $TS_TOKEN" "$TS_BASE/api/v1/power/status"
curl -H "Authorization: Bearer $TS_TOKEN" "$TS_BASE/api/v1/device/status?device=agx"
```

온도의 valid, 팬의 duty_valid, 전원의 valid/crc_valid와 마지막 갱신 시간을 보관하세요. 값이 유효하지 않거나 연결이 끊긴 상태를 명확히 표시하세요. duty는 출력 비율이고 rpm은 회전 속도입니다. 컴퓨터의 state=on만으로 애플리케이션 준비가 완료되었다고 판단하지 마세요. [응답 모델](response-models.md)을 참고하세요.

성공적인 모니터링은 계속 업데이트되는 유효한 판독값을 의미합니다. 지속적인 대시보드를 위해 WebSocket을 사용하세요. 잘못된 온도의 경우 temp.sources를 검사하세요. 컴퓨팅 원격 측정 문제의 경우 monitor.status를 검사하세요. 누락된 값을 0으로 바꾸지 마십시오. 제공된 Python 예제는 로그인, 읽기 및 로그아웃만 수행합니다.

## 컴퓨터 제어

ADMIN이 필요합니다. 먼저 device.status를 읽어 대상이 agx인지 lpmu인지, 현재 상태가 무엇인지 확인하세요. 시간 초과 후 toggle을 반복하지 말고 on/off처럼 원하는 상태를 명시하는 동작을 사용하세요.

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary '{"device":"agx","action":"on"}' \
  "$TS_BASE/api/v1/device/power"
```

그다음 device.status를 GET하고 state/power_good을 확인하세요. 대상 컴퓨터나 애플리케이션 상태 확인용 엔드포인트에서 준비 상태를 확인하세요. 정상 종료에는 off를 사용하세요. force_off/reset은 작업을 중단하고 데이터 손실을 일으킬 수 있으므로 먼저 대상 시스템의 유지보수를 준비하세요.

USB 경로를 바꾸려면 `{"target":"agx"}`로 device.usb.set에 POST한 뒤 device.usb.status를 GET하세요. 다른 대상은 esp32/lpmu/disconnect입니다. 전환 중 이전 경로가 끊길 수 있으며 이것만으로 장치 고장이라고 판단해서는 안 됩니다.

시간 초과 후 재시도하기 전에 상태를 쿼리합니다. 대상이 예상 상태에 도달하지 못한 경우 오류 상태, 전원 표시 및 세부 정보를 보존합니다.

## 조명 및 팬 조정

일상적인 LED 작동에는 ADMIN이 필요합니다. GET led.list를 사용하여 장치 이름을 얻은 후 입력하세요.

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary '{"device":"board","color":"#00A0FF"}' \
  "$TS_BASE/api/v1/led/fill"
```

led.list를 다시 읽으십시오. 다시 시작한 후 디스플레이를 사용하려면 `{"device":"board"}` 를 사용하여 별도로 POST led.save를 검사하고 저장했는지 확인하세요. 시작 설정 표시 및 저장은 다른 단계입니다.

팬은 먼저 fan.status/config를 읽으세요. 실제 팬 ID를 확인한 뒤에만 `{"id":0,"duty":50}`로 fan.set에 POST하세요. fan.mode는 off/manual/auto/curve를 선택합니다. 곡선, 제한값, 저장 권한은 [팬 참고](reference/fan.md)에 나와 있습니다.

출력을 변경한 뒤 duty_valid/duty/target_duty, 온도, 오류 상태를 확인하세요. 임시 수동 조정이 끝나면 원래 사용하려던 제어 모드로 되돌리세요.

## 원격 작업 관리

일회성 명령에는 ssh.exec/exec_stream을 사용하십시오. 저장된 SSH 명령을 사용하고 지속적으로 관리되는 서비스에 대한 기록을 실행합니다. 원시 명령을 실행하려면 ROOT가 필요합니다. 기존 관리형 서비스를 시작하려면 최소한 ADMIN이 필요합니다.

시작 전에 접속 가능 여부, 확인된 호스트 지문, 유효한 SSH 키를 참조하는 저장 호스트를 확인하세요. 처음 보는 지문이나 변경된 지문은 ssh.test와 신뢰할 수 있는 정보로 확인하세요. 신뢰 기록을 지우거나 지문을 자동 수락하는 방식으로 대체하지 마세요.

1. root로 ssh.hosts 및 ssh.commands를 읽으십시오. 호스트, 명령, service_mode 및 준비 일치를 확인하십시오. [구성 모델](configuration-models.md)을 참조하세요.
2. 최신 active_version을 읽고 저장된 서비스를 시작합니다.

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary '{"command_id":"YOUR_SERVICE_COMMAND_ID","active_version":"CURRENT_VERSION"}' \
  "$TS_BASE/api/v1/ssh/services/start"
```

3. run_id와 operation_id를 보관하세요. `{"run_id":"YOUR_RUN_ID","verify":true}`를 본문으로 automation.services.status에 POST하세요. operation_phase, busy, state를 확인하세요. verify는 원래 호스트에 연결하므로 단순한 로컬 캐시 조회가 아닙니다.
4. 애플리케이션의 정상 동작과 준비 상태를 확인하세요. 중지하려면 원래 run_id로 automation.services.stop에 POST하고 이후에도 상태를 조회하세요.

run_id는 준비 표시가 아닙니다. last_known은 이전 관찰입니다. 구성이나 로컬 키를 삭제해도 원격 프로세스는 중지되지 않습니다. 이름으로 프로세스를 추측하는 대신 원래 실행 ID를 사용하십시오.

일회성 스트림의 경우 POST ssh.exec_stream 전에 WebSocket을 인증합니다. 전체 작업 접수 정보를 보관하고 중단 후 ssh.exec_status를 사용하세요. 단지 누락된 출력을 검색하기 위해 명령을 다시 실행하지 마십시오. 실행, 일치, 출력 완성도는 [SSH 스트리밍](websocket.md#http-started-streaming-ssh)을 참조하세요.

## 자동화 구성

흐름은 다음과 같습니다. 데이터를 획득하고 이를 변수에 매핑한 다음 조건이 유지되면 작업을 실행합니다. root에서는 먼저automation.status/config.status를 읽어보세요. 편집하기 전에 로드, 활성화, 일시 중지 또는 SD 소스 선택 문제를 해결하세요.

저장된 사용자 변수로 시작:

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/automation/config/status"
```

다음 요청에서 active_version을 사용합니다.

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary '{"name":"example.temperature","value":42.5,"active_version":"CURRENT_VERSION"}' \
  "$TS_BASE/api/v1/automation/variables/set"
```

root로 automation.variables.get을 읽어 value, readonly, source_id를 확인하세요. 새 active_version을 보관하세요. [규칙 모델](configuration-models.md#automation-rules)에 따라 enabled:false인 규칙을 만들고, 전원 제어나 원격 실행을 추가하기 전에 로그 동작으로 먼저 확인하세요.

필요할 때만 실제 데이터 소스를 추가하세요. 규칙을 활성화하기 전에 데이터 도착, 변수 업데이트 및 오래된 상태를 확인하세요. 정의 저장, 구성 활성화, 엔진 시작 및 작업 실행은 별도의 상태입니다. save:true만으로는 충분하지 않습니다.

충돌 후에는 새로 읽고 병합하세요. 삭제 영향을 미리 확인하고, SD 또는 백업 선택은 미리보기 후 적용하세요. 관리 파일을 덮어쓰기보다 일시 중지·busy 결과에 맞춰 처리하세요.

## 장치 유지 관리

한 번에 하나의 유지 관리 목표를 선택하여 그 효과를 확인할 수 있습니다.

| 목표 | 절차 | 완료 확인 |
| --- | --- | --- |
| 객체 백업 | 해당 객체에 필요한 역할로 내보내고 tscfg를 저장합니다. 나중에 가져올 때는 먼저 미리보기를 수행합니다. | 완전하고 검증 가능한 패키지를 보관합니다. 내보내기는 복구 완료를 뜻하지 않습니다. |
| 파일 저장 | 파일을 업로드하고 속성을 확인한 뒤 다운로드하여 비교 | 의도된 경로, 길이 및 바이트 |
| 펌웨어 업데이트/WWW | 일치하는 이미지 확인, 전송, 전체 진행 상황 읽기, 상태 확인, 필요한 경우 다시 시작 | 올바른 실행 ID·버전과 애플리케이션의 정상 동작 |
| 네트워킹 변경 | 기존 접속 경로·설정을 기록하고 변경·저장한 뒤 다시 연결합니다. | 관리 및 대상 네트워킹 모두 작동 |
| 비밀번호 변경 | change_password, 다시 로그인, 클라이언트 세션 업데이트 | 새로운 자격 증명이 작동합니다. 이전 세션은 더 이상 유효한 것으로 간주되지 않습니다. |
| 신원 인증서 설치 | CSR과 키의 일치를 확인하고 설치한 뒤 cert.status와 클라이언트 신뢰 여부를 확인합니다. | 올바른 자료, 실제 로드된 ID 및 클라이언트 연결 확인 |

전체 요청 및 용량 제한은 [전송 및 업데이트](transfers.md)를 참조하세요. cert.*는 장치 ID를 관리하고, key.*는 SSH 키를 관리하고, 호스트.*는 원격 지문을 관리합니다. 실패 후 재시도 또는 복구 전에 적용된 단계를 설정합니다.

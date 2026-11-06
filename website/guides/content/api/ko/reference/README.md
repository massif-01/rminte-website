# API 색인

28개 그룹의 등록 이름 277개를 다룹니다. 별칭을 포함해 실제 처리 함수가 있는 항목은 276개이며, 지원되지 않지만 이름을 유지한 항목이 1개입니다. 이름이 등록되어 있다는 사실만으로 의존 대상이 준비되었다고 판단하지 마세요. 전용 바이너리 경로와 WebSocket은 별도 장에서 설명합니다.

## 예시 보내기

대상 API의 JSON을 request.json으로 저장하고 자리 표시자를 실제 값으로 바꾸세요. 명시된 경로에 POST하세요. 공개 인터페이스에서는 Authorization 헤더를 생략할 수 있습니다.

```sh
curl --connect-timeout 5 --max-time 60 \
  -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' --data-binary @request.json \
  "$TS_BASE/api/v1/PATH_FROM_REFERENCE"
```

빈 {}는 조회하거나 기능별 인수를 사용하지 않는다는 뜻입니다. 쓰기 작업은 실제 영향을 줍니다. 먼저 필요한 버전, 객체 ID, 인증서, 릴리스 자료를 준비하세요. GET은 명시된 인터페이스에서만 사용할 수 있으며 복잡한 매개변수에는 POST JSON을 사용하세요.

## 그룹

| 그룹 | 개수 |
| --- | --- |
| [계정 및 세션](auth.md) | 7 |
| [컨트롤러 상태](system.md) | 8 |
| [팬](fan.md) | 8 |
| [온도](temp.md) | 6 |
| [전원 및 보호](power.md) | 13 |
| [컴퓨터 및 USB](device.md) | 9 |
| [일반 및 모듈 구성](config.md) | 10 |
| [네트워크](network.md) | 9 |
| [와이파이 관리](wifi.md) | 4 |
| [네트워크 전달](nat.md) | 4 |
| [주소 할당](dhcp.md) | 4 |
| [시간](time.md) | 5 |
| [장치 파일](storage.md) | 9 |
| [컨트롤러 서비스](service.md) | 5 |
| [컴퓨팅 모니터링](monitor.md) | 6 |
| [모니터링 레이아웃](ui.md) | 2 |
| [로그](log.md) | 5 |
| [SSH 지문](hosts.md) | 5 |
| [SSH 키](key.md) | 6 |
| [장치 인증서](cert.md) | 7 |
| [조명 및 매트릭스](led.md) | 24 |
| [핀 유지 관리](gpio.md) | 4 |
| [애플리케이션 컴퓨터 네트워크 설정](lpmu_access.md) | 3 |
| [SSH 연결 및 명령](ssh.md) | 23 |
| [원격 파일](sftp.md) | 6 |
| [자동화 및 관리형 서비스](automation.md) | 56 |
| [구성 패키지](config_pack.md) | 8 |
| [업데이트 및 복구](ota.md) | 21 |

## 모든 이름

| 이름 | 목적 | 최소 접근 권한 | 메서드 | 가용성 |
| --- | --- | --- | --- | --- |
| [auth.admin.reset_password](auth.md#authadminreset_password) | 관리자 기본 비밀번호 복원 | ROOT | POST | 조건부; 세부정보 보기 |
| [auth.admin.set_password](auth.md#authadminset_password) | root는 관리자 비밀번호를 설정합니다 | ROOT | POST | 조건부; 세부정보 보기 |
| [auth.change_password](auth.md#authchange_password) | 비밀번호 변경 | 요청 본문 토큰(인증 API 전용) | POST | 조건부; 세부정보 보기 |
| [auth.login](auth.md#authlogin) | 사용자 로그인 | 공개 | POST | 조건부; 세부정보 보기 |
| [auth.logout](auth.md#authlogout) | 사용자 로그아웃 | 요청 본문 토큰(인증 API 전용) | POST | 조건부; 세부정보 보기 |
| [auth.root.set_password](auth.md#authrootset_password) | root는 root 비밀번호를 설정합니다. | ROOT | POST | 조건부; 세부정보 보기 |
| [auth.status](auth.md#authstatus) | 인증 상태 확인 | 요청 본문 토큰(인증 API 전용) | POST | 조건부; 세부정보 보기 |
| [automation.action.stats](automation.md#automationactionstats) | 작업 실행 통계 가져오기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [automation.action.stats.reset](automation.md#automationactionstatsreset) | 작업 통계 재설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.actions.add](automation.md#automationactionsadd) | 새 작업 템플릿 만들기 | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.actions.delete](automation.md#automationactionsdelete) | 작업 템플릿 삭제 | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.actions.execute](automation.md#automationactionsexecute) | 작업 템플릿 실행 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.actions.export](automation.md#automationactionsexport) | 작업 템플릿을 구성 팩(.tscfg)으로 내보내기 | ROOT | POST | 조건부; 세부정보 보기 |
| [automation.actions.get](automation.md#automationactionsget) | ID로 작업 템플릿 가져오기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [automation.actions.import](automation.md#automationactionsimport) | 구성 팩에서 작업 템플릿 가져오기 | ROOT | POST | 조건부; 세부정보 보기 |
| [automation.actions.list](automation.md#automationactionslist) | 모든 작업 템플릿 나열 | READ | GET/POST | 조건부; 세부정보 보기 |
| [automation.actions.update](automation.md#automationactionsupdate) | 기존 작업 템플릿 업데이트 | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.config.apply](automation.md#automationconfigapply) | 확인된 복원 또는 소스 선택을 적용합니다. | ROOT | POST | 조건부; 세부정보 보기 |
| [automation.config.backup](automation.md#automationconfigbackup) | 전체 비상 구성 저장 | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.config.enable](automation.md#automationconfigenable) | 현재 구성을 명시적으로 활성화하거나 일시 중지합니다. | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.config.preview](automation.md#automationconfigpreview) | 구성 복원 또는 소스 선택 미리보기 | ROOT | POST | 조건부; 세부정보 보기 |
| [automation.config.refresh](automation.md#automationconfigrefresh) | 사용자 선택을 변경하지 않고 SD 카드를 한 번 확인하십시오. | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.config.status](automation.md#automationconfigstatus) | 현재 자동화 저장 및 백업 상태 | READ | GET/POST | 조건부; 세부정보 보기 |
| [automation.pause](automation.md#automationpause) | 자동화 엔진 일시 중지 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.proxy.fetch](automation.md#automationproxyfetch) | 외부 REST API 프록시 요청 | READ | POST | 조건부; 세부정보 보기 |
| [automation.proxy.socketio_test](automation.md#automationproxysocketio_test) | Socket.IO 연결 테스트(v4 프로토콜) | ROOT | POST | 조건부; 세부정보 보기 |
| [automation.proxy.websocket_test](automation.md#automationproxywebsocket_test) | WebSocket 연결 테스트 | ROOT | POST | 조건부; 세부정보 보기 |
| [automation.reload](automation.md#automationreload) | 구성 다시 로드 | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.resume](automation.md#automationresume) | 자동화 엔진 재개 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.rules.add](automation.md#automationrulesadd) | 새 규칙 추가 | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.rules.delete](automation.md#automationrulesdelete) | 규칙 삭제 | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.rules.disable](automation.md#automationrulesdisable) | 규칙 비활성화 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.rules.enable](automation.md#automationrulesenable) | 규칙 활성화 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.rules.export](automation.md#automationrulesexport) | 구성 팩(.tscfg)으로 규칙 내보내기 | ROOT | POST | 조건부; 세부정보 보기 |
| [automation.rules.get](automation.md#automationrulesget) | ID로 규칙 세부정보 가져오기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [automation.rules.import](automation.md#automationrulesimport) | 구성 팩에서 규칙 가져오기 | ROOT | POST | 조건부; 세부정보 보기 |
| [automation.rules.list](automation.md#automationruleslist) | 모든 규칙 나열 | READ | GET/POST | 조건부; 세부정보 보기 |
| [automation.rules.trigger](automation.md#automationrulestrigger) | 규칙을 수동으로 트리거 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.rules.update](automation.md#automationrulesupdate) | 예상 리비전을 지정하여 규칙 업데이트 | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.services.list](automation.md#automationserviceslist) | 독립적인 원격 서비스 제어 나열 | READ | GET/POST | 조건부; 세부정보 보기 |
| [automation.services.status](automation.md#automationservicesstatus) | 관리형 원격 프로세스 상태 확인 | READ | GET/POST | 조건부; 세부정보 보기 |
| [automation.services.stop](automation.md#automationservicesstop) | 검증된 관리형 원격 프로세스 중지 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.sources.add](automation.md#automationsourcesadd) | 새 데이터 소스 추가 | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.sources.add_mapping](automation.md#automationsourcesadd_mapping) | 기존 데이터 소스에 필드 매핑 추가 | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.sources.delete](automation.md#automationsourcesdelete) | 데이터 소스 삭제 | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.sources.disable](automation.md#automationsourcesdisable) | 데이터 소스 비활성화 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.sources.enable](automation.md#automationsourcesenable) | 데이터 소스 활성화 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.sources.export](automation.md#automationsourcesexport) | 데이터 소스를 구성 팩(.tscfg)으로 내보내기 | ROOT | POST | 조건부; 세부정보 보기 |
| [automation.sources.import](automation.md#automationsourcesimport) | 구성 팩에서 데이터 소스 가져오기 | ROOT | POST | 조건부; 세부정보 보기 |
| [automation.sources.list](automation.md#automationsourceslist) | 모든 데이터 소스 나열 | READ | GET/POST | 조건부; 세부정보 보기 |
| [automation.sources.remove_mapping](automation.md#automationsourcesremove_mapping) | 데이터 소스에서 필드 매핑 제거 | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.sources.update](automation.md#automationsourcesupdate) | 기존 데이터 소스 업데이트 | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.start](automation.md#automationstart) | 자동화 엔진 시작 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.status](automation.md#automationstatus) | 자동화 엔진 상태 가져오기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [automation.stop](automation.md#automationstop) | 자동화 엔진 중지 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.test.device](automation.md#automationtestdevice) | 장치 제어 동작 테스트 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.test.gpio](automation.md#automationtestgpio) | GPIO 동작 테스트 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.test.led](automation.md#automationtestled) | LED 동작 테스트 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.test.ssh](automation.md#automationtestssh) | SSH 명령 실행 테스트 | ROOT | POST | 조건부; 세부정보 보기 |
| [automation.variables.delete](automation.md#automationvariablesdelete) | 저장된 사용자 변수 삭제 | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [automation.variables.get](automation.md#automationvariablesget) | 변수 값 가져오기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [automation.variables.list](automation.md#automationvariableslist) | 모든 변수 나열 | READ | GET/POST | 조건부; 세부정보 보기 |
| [automation.variables.set](automation.md#automationvariablesset) | 변수 값 설정 | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [cert.delete](cert.md#certdelete) | 모든 PKI 자격 증명 삭제 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [cert.generate_csr](cert.md#certgenerate_csr) | 인증서 서명 요청 생성 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [cert.generate_keypair](cert.md#certgenerate_keypair) | ECDSA P-256 키 쌍 생성 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [cert.get_certificate](cert.md#certget_certificate) | 장치 인증서 PEM 가져오기 | 공개 | GET/POST | 조건부; 세부정보 보기 |
| [cert.install](cert.md#certinstall) | 서명된 인증서 설치 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [cert.install_ca](cert.md#certinstall_ca) | CA 인증서 체인 설치 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [cert.status](cert.md#certstatus) | 인증서 및 진단 서비스 상태 읽기 | 공개 | GET/POST | 조건부; 세부정보 보기 |
| [config.delete](config.md#configdelete) | 구성 값 삭제 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [config.get](config.md#configget) | 구성 값 가져오기 | 공개 | GET/POST | 조건부; 세부정보 보기 |
| [config.list](config.md#configlist) | 설정 키 나열 | ADMIN | GET/POST | 조건부; 세부정보 보기 |
| [config.module.list](config.md#configmodulelist) | 모든 구성 모듈 나열 | READ | GET/POST | 조건부; 세부정보 보기 |
| [config.module.reset](config.md#configmodulereset) | 모듈 구성 재설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [config.module.save](config.md#configmodulesave) | 모듈 구성을 NVS에 저장 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [config.module.set](config.md#configmoduleset) | 모듈 구성 설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [config.module.show](config.md#configmoduleshow) | 모듈 구성 표시 | READ | GET/POST | 조건부; 세부정보 보기 |
| [config.pack.apply](config_pack.md#configpackapply) | 지원되지 않는 일반 구성 애플리케이션 | ADMIN | POST/PUT/DELETE | 지원되지 않음 |
| [config.pack.content](config_pack.md#configpackcontent) | 가져온 구성 팩의 내용을 해독하고 가져옵니다. | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [config.pack.export](config_pack.md#configpackexport) | 암호화된 .tscfg로 구성 내보내기 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [config.pack.export_cert](config_pack.md#configpackexport_cert) | 암호화를 위한 장치 인증서 내보내기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [config.pack.import](config_pack.md#configpackimport) | 업로드된 .tscfg 파일의 유효성을 검사합니다. | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [config.pack.info](config_pack.md#configpackinfo) | 구성 팩 시스템 정보 가져오기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [config.pack.list](config_pack.md#configpacklist) | 디렉토리의 .tscfg 파일 나열 | READ | GET/POST | 조건부; 세부정보 보기 |
| [config.pack.verify](config_pack.md#configpackverify) | .tscfg 패키지 서명 확인 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [config.save](config.md#configsave) | 구성을 스토리지에 저장 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [config.set](config.md#configset) | 구성 값 설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [device.fan.set](device.md#devicefanset) | 팬 모드 및 듀티 설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [device.fan.status](device.md#devicefanstatus) | 팬 상태 가져오기 | 공개 | GET/POST | 조건부; 세부정보 보기 |
| [device.ping](device.md#deviceping) | 네트워크 연결 테스트(TCP 포트 확인) | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [device.power](device.md#devicepower) | 장치 전원 제어(on/off/force_off) | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [device.power.status](device.md#devicepowerstatus) | 전력 측정 가져오기 | 공개 | GET/POST | 조건부; 세부정보 보기 |
| [device.reset](device.md#devicereset) | 장치 리셋 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [device.status](device.md#devicestatus) | 장치 전원 상태 가져오기 | 공개 | GET/POST | 조건부; 세부정보 보기 |
| [device.usb.set](device.md#deviceusbset) | USB MUX 대상 설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [device.usb.status](device.md#deviceusbstatus) | USB MUX 상태 가져오기 | 공개 | GET/POST | 조건부; 세부정보 보기 |
| [dhcp.clients](dhcp.md#dhcpclients) | DHCP 클라이언트 나열 | READ | GET/POST | 조건부; 세부정보 보기 |
| [dhcp.start](dhcp.md#dhcpstart) | DHCP 서버 시작 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [dhcp.status](dhcp.md#dhcpstatus) | DHCP 서버 상태 가져오기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [dhcp.stop](dhcp.md#dhcpstop) | DHCP 서버 중지 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [fan.config](fan.md#fanconfig) | 곡선을 포함한 팬 구성 가져오기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [fan.curve](fan.md#fancurve) | 팬의 온도 곡선 설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [fan.enable](fan.md#fanenable) | 팬 활성화 또는 비활성화 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [fan.limits](fan.md#fanlimits) | 듀티 사이클 한도 설정(min/max) | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [fan.mode](fan.md#fanmode) | 팬 작동 모드 설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [fan.save](fan.md#fansave) | 팬 구성을 NVS에 저장 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [fan.set](fan.md#fanset) | 팬 속도 설정(수동 모드) | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [fan.status](fan.md#fanstatus) | 팬 상태 가져오기 | 공개 | GET/POST | 조건부; 세부정보 보기 |
| [gpio.info](gpio.md#gpioinfo) | GPIO 핀 정보 가져오기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [gpio.list](gpio.md#gpiolist) | 제어 가능한 모든 GPIO 핀 나열 | READ | GET/POST | 조건부; 세부정보 보기 |
| [gpio.set](gpio.md#gpioset) | GPIO 레벨 설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [gpio.toggle](gpio.md#gpiotoggle) | GPIO 레벨 전환 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [hosts.clear](hosts.md#hostsclear) | 알려진 모든 호스트 지우기 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [hosts.info](hosts.md#hostsinfo) | 알려진 호스트 정보 얻기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [hosts.list](hosts.md#hostslist) | 알려진 모든 SSH 호스트 나열 | READ | GET/POST | 조건부; 세부정보 보기 |
| [hosts.remove](hosts.md#hostsremove) | 알려진 호스트 제거 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [hosts.update](hosts.md#hostsupdate) | 호스트 지문 강제 업데이트 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [key.delete](key.md#keydelete) | 키 삭제 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [key.export](key.md#keyexport) | 공개 키 내보내기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [key.exportPrivate](key.md#keyexportprivate) | 개인 키 내보내기(내보낼 수 있는 키에만 해당) | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [key.generate](key.md#keygenerate) | 새 키 생성 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [key.info](key.md#keyinfo) | 키 정보 가져오기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [key.list](key.md#keylist) | 저장된 모든 키 나열 | READ | GET/POST | 조건부; 세부정보 보기 |
| [led.boot.config](led.md#ledbootconfig) | LED 부팅 구성 가져오기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [led.brightness](led.md#ledbrightness) | 장치 밝기 조회·설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [led.clear](led.md#ledclear) | 장치의 모든 LED 지우기 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [led.color.hsv](led.md#ledcolorhsv) | HSV를 RGB로 변환 | READ | GET/POST | 조건부; 세부정보 보기 |
| [led.color.parse](led.md#ledcolorparse) | 색상 문자열을 RGB로 구문 분석 | READ | GET/POST | 조건부; 세부정보 보기 |
| [led.color_correction.export](led.md#ledcolor_correctionexport) | 색상 보정 구성을 SD 카드로 내보내기 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [led.color_correction.get](led.md#ledcolor_correctionget) | 색상 보정 구성 가져오기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [led.color_correction.import](led.md#ledcolor_correctionimport) | SD 카드에서 색상 보정 구성 가져오기 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [led.color_correction.reset](led.md#ledcolor_correctionreset) | 색상 보정을 기본값으로 재설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [led.color_correction.set](led.md#ledcolor_correctionset) | 색상 보정 구성 설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [led.effect.list](led.md#ledeffectlist) | 사용 가능한 효과 목록 | READ | GET/POST | 조건부; 세부정보 보기 |
| [led.effect.start](led.md#ledeffectstart) | 장치에서 효과 시작 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [led.effect.stop](led.md#ledeffectstop) | 장치에 대한 효과 중지 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [led.fill](led.md#ledfill) | 모든 LED를 색상으로 채우기 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [led.filter.list](led.md#ledfilterlist) | 사용 가능한 후처리 필터 목록 | READ | GET/POST | 조건부; 세부정보 보기 |
| [led.filter.start](led.md#ledfilterstart) | 후처리 필터 적용 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [led.filter.stop](led.md#ledfilterstop) | 후처리 필터 중지 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [led.image](led.md#ledimage) | 매트릭스에 이미지 표시 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [led.list](led.md#ledlist) | LED 장치 나열 | 공개 | GET/POST | 조건부; 세부정보 보기 |
| [led.qrcode](led.md#ledqrcode) | QR 코드 생성 및 표시 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [led.save](led.md#ledsave) | 현재 상태를 부팅 구성으로 저장 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [led.set](led.md#ledset) | LED 픽셀 범위 설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [led.text](led.md#ledtext) | 매트릭스에 텍스트 표시 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [led.text.stop](led.md#ledtextstop) | 텍스트 오버레이 중지 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [log.capture](log.md#logcapture) | ESP_LOG 수집 활성화·비활성화 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [log.clear](log.md#logclear) | 로그 버퍼 지우기 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [log.list](log.md#loglist) | 필터링을 통해 로그 항목 가져오기 | ADMIN | GET/POST | 조건부; 세부정보 보기 |
| [log.setLevel](log.md#logsetlevel) | 로그 수준 설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [log.stats](log.md#logstats) | 로그 시스템 통계 가져오기 | ADMIN | GET/POST | 조건부; 세부정보 보기 |
| [monitor.config](monitor.md#monitorconfig) | 컴퓨팅 모니터 구성 가져오기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [monitor.data](monitor.md#monitordata) | 최신 컴퓨팅 원격 측정 데이터 가져오기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [monitor.set_server](monitor.md#monitorset_server) | 컴퓨팅 모니터링 서버 IP 및 포트 설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [monitor.start](monitor.md#monitorstart) | 컴퓨팅 모니터링 시작 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [monitor.status](monitor.md#monitorstatus) | 컴퓨팅 모니터 상태 가져오기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [monitor.stop](monitor.md#monitorstop) | 컴퓨팅 모니터링 중지 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [nat.disable](nat.md#natdisable) | NAT 게이트웨이 비활성화 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [nat.enable](nat.md#natenable) | NAT 게이트웨이 활성화 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [nat.save](nat.md#natsave) | NAT 구성 저장 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [nat.status](nat.md#natstatus) | NAT 게이트웨이 상태 가져오기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [network.eth.status](network.md#networkethstatus) | 이더넷 상태 가져오기 | 공개 | GET/POST | 조건부; 세부정보 보기 |
| [network.hostname](network.md#networkhostname) | 호스트 이름 조회·설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [network.lpmu_access.log](lpmu_access.md#networklpmu_accesslog) | 애플리케이션 컴퓨터 네트워크 접속 실행에 대한 실행 로그를 가져옵니다. | ADMIN | GET/POST | 조건부; 세부정보 보기 |
| [network.lpmu_access.start](lpmu_access.md#networklpmu_accessstart) | 애플리케이션 컴퓨터의 업스트림 네트워크 접속 설정 시작 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [network.lpmu_access.status](lpmu_access.md#networklpmu_accessstatus) | 애플리케이션 컴퓨터 업스트림 네트워크 액세스 설정 상태 가져오기 | ADMIN | GET/POST | 조건부; 세부정보 보기 |
| [network.status](network.md#networkstatus) | 전체 네트워크 상태 가져오기 | 공개 | GET/POST | 조건부; 세부정보 보기 |
| [network.wifi.ap.config](network.md#networkwifiapconfig) | WiFi AP 구성 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [network.wifi.ap.stations](network.md#networkwifiapstations) | 연결된 AP 스테이션 가져오기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [network.wifi.connect](network.md#networkwificonnect) | WiFi 네트워크에 연결 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [network.wifi.disconnect](network.md#networkwifidisconnect) | WiFi 연결 끊기 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [network.wifi.mode](network.md#networkwifimode) | Wi-Fi 모드 조회·설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [network.wifi.scan](network.md#networkwifiscan) | WiFi 네트워크 검색 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ota.abort](ota.md#otaabort) | 펌웨어 업데이트 취소 요청 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ota.partitions](ota.md#otapartitions) | 업데이트 파티션 검사 | READ | GET/POST | 조건부; 세부정보 보기 |
| [ota.progress](ota.md#otaprogress) | 펌웨어 업데이트 진행 상황 읽기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [ota.rollback](ota.md#otarollback) | 펌웨어 롤백 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ota.server.get](ota.md#otaserverget) | 업데이트 서버 구성 읽기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [ota.server.set](ota.md#otaserverset) | 업데이트 서버 구성 설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ota.start_file](ota.md#otastart_file) | SD에서 펌웨어 업데이트 시작 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ota.start_url](ota.md#otastart_url) | URL에서 펌웨어 업데이트 시작 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ota.status](ota.md#otastatus) | 펌웨어 업데이트 상태 읽기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [ota.test_connection](ota.md#otatest_connection) | 업데이트 URL 조사 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ota.upgrade_file](ota.md#otaupgrade_file) | ota.start_file의 호환 별칭입니다. | ADMIN | POST/PUT/DELETE | 별칭 |
| [ota.upgrade_url](ota.md#otaupgrade_url) | ota.start_url의 호환 별칭입니다. | ADMIN | POST/PUT/DELETE | 별칭 |
| [ota.upload_abort](ota.md#otaupload_abort) | 펌웨어 업로드 제어 중단 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ota.upload_begin](ota.md#otaupload_begin) | 펌웨어 업로드 제어 시작 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ota.upload_end](ota.md#otaupload_end) | 펌웨어 업로드 제어 완료 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ota.validate](ota.md#otavalidate) | 정상적으로 실행 중인 펌웨어 확인 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ota.version](ota.md#otaversion) | 펌웨어 버전 읽기 | 공개 | GET/POST | 조건부; 세부정보 보기 |
| [ota.www.abort](ota.md#otawwwabort) | WWW 업데이트 취소 요청 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ota.www.progress](ota.md#otawwwprogress) | WWW 업데이트 진행 상황 읽기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [ota.www.start](ota.md#otawwwstart) | URL에서 WWW 업데이트 시작 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ota.www.start_sdcard](ota.md#otawwwstart_sdcard) | SD에서 WWW 업데이트 시작 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [power.chip](power.md#powerchip) | 전원 칩 데이터 가져오기 | 공개 | GET/POST | 조건부; 세부정보 보기 |
| [power.debug](power.md#powerdebug) | 디버그 모드 설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [power.interval.set](power.md#powerintervalset) | 샘플링 간격 설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [power.monitor.start](power.md#powermonitorstart) | 전력 모니터링 시작 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [power.monitor.stop](power.md#powermonitorstop) | 전력 모니터링 중지 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [power.protection.config](power.md#powerprotectionconfig) | 전압 보호 구성 가져오기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [power.protection.set](power.md#powerprotectionset) | 전압 보호 구성 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [power.protection.status](power.md#powerprotectionstatus) | 전압 보호 상태 가져오기 | 공개 | GET/POST | 조건부; 세부정보 보기 |
| [power.stats](power.md#powerstats) | 모니터링 통계 가져오기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [power.stats.reset](power.md#powerstatsreset) | 모니터링 통계 재설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [power.status](power.md#powerstatus) | 전력 모니터링 상태 가져오기 | 공개 | GET/POST | 조건부; 세부정보 보기 |
| [power.threshold.set](power.md#powerthresholdset) | 전압 임계값 설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [power.voltage](power.md#powervoltage) | 현재 전압 읽기 | 공개 | GET/POST | 조건부; 세부정보 보기 |
| [service.list](service.md#servicelist) | 모든 서비스 나열 | 공개 | GET/POST | 조건부; 세부정보 보기 |
| [service.restart](service.md#servicerestart) | 서비스 다시 시작 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [service.start](service.md#servicestart) | 서비스 시작 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [service.status](service.md#servicestatus) | 서비스 상태 가져오기 | 공개 | GET/POST | 조건부; 세부정보 보기 |
| [service.stop](service.md#servicestop) | 서비스 중지 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [sftp.get](sftp.md#sftpget) | SFTP를 통해 파일 다운로드 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [sftp.ls](sftp.md#sftpls) | SFTP를 통해 원격 디렉토리 나열 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [sftp.mkdir](sftp.md#sftpmkdir) | SFTP를 통해 원격 디렉토리 생성 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [sftp.put](sftp.md#sftpput) | SFTP를 통해 파일 업로드 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [sftp.rm](sftp.md#sftprm) | SFTP를 통해 원격 파일 삭제 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [sftp.stat](sftp.md#sftpstat) | SFTP를 통해 원격 파일 정보 가져오기 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ssh.cancel](ssh.md#sshcancel) | SSH exec 세션 실행 취소 | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ssh.commands.add](ssh.md#sshcommandsadd) | SSH 명령 구성 추가 또는 업데이트 | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ssh.commands.export](ssh.md#sshcommandsexport) | SSH 명령 구성을 .tscfg로 내보내기 | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ssh.commands.get](ssh.md#sshcommandsget) | ID로 SSH 명령 구성 가져오기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [ssh.commands.import](ssh.md#sshcommandsimport) | .tscfg에서 SSH 명령 구성 가져오기 | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ssh.commands.list](ssh.md#sshcommandslist) | 모든 SSH 명령 구성 나열 | READ | GET/POST | 조건부; 세부정보 보기 |
| [ssh.commands.remove](ssh.md#sshcommandsremove) | SSH 명령 구성 제거 | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ssh.commands.update](ssh.md#sshcommandsupdate) | 기존 SSH 명령 구성 업데이트 | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ssh.copyid](ssh.md#sshcopyid) | 원격 서버에 공개 키 배포 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ssh.exec](ssh.md#sshexec) | SSH를 통해 원격 명령 실행 | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ssh.exec_status](ssh.md#sshexec_status) | 소유한 현재 또는 최신 SSH 결과 읽기 | ROOT | GET/POST | 조건부; 세부정보 보기 |
| [ssh.exec_stream](ssh.md#sshexec_stream) | WebSocket을 통한 스트리밍 출력으로 원격 명령 실행 | ROOT | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ssh.hosts.add](ssh.md#sshhostsadd) | SSH 호스트 구성 추가 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ssh.hosts.export](ssh.md#sshhostsexport) | SSH 호스트 구성을 .tscfg로 내보내기 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ssh.hosts.get](ssh.md#sshhostsget) | ID로 SSH 호스트 구성 가져오기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [ssh.hosts.import](ssh.md#sshhostsimport) | .tscfg에서 SSH 호스트 구성 가져오기 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ssh.hosts.list](ssh.md#sshhostslist) | 모든 SSH 호스트 구성 나열 | READ | GET/POST | 조건부; 세부정보 보기 |
| [ssh.hosts.remove](ssh.md#sshhostsremove) | SSH 호스트 구성 제거 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ssh.hosts.update](ssh.md#sshhostsupdate) | 기존 SSH 호스트 구성 업데이트 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ssh.keygen](ssh.md#sshkeygen) | SSH 키 쌍 생성 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ssh.revoke](ssh.md#sshrevoke) | 원격 서버에 배포한 공개 키 폐기(제거) | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ssh.services.start](ssh.md#sshservicesstart) | 저장된 관리형 서비스 시작 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ssh.test](ssh.md#sshtest) | SSH 연결 테스트 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [storage.delete](storage.md#storagedelete) | 파일 또는 디렉토리 삭제 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [storage.info](storage.md#storageinfo) | 파일 정보 가져오기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [storage.list](storage.md#storagelist) | 디렉터리 내용 나열 | READ | GET/POST | 조건부; 세부정보 보기 |
| [storage.mkdir](storage.md#storagemkdir) | 디렉토리 생성 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [storage.mount](storage.md#storagemount) | SD 카드 마운트 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [storage.read](storage.md#storageread) | 파일 내용 읽기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [storage.rename](storage.md#storagerename) | 파일 이름 변경·이동 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [storage.status](storage.md#storagestatus) | 저장 상태 가져오기 | 공개 | GET/POST | 조건부; 세부정보 보기 |
| [storage.unmount](storage.md#storageunmount) | SD 카드 마운트 해제 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [system.apis](system.md#systemapis) | 등록된 모든 API 나열 | READ | GET/POST | 조건부; 세부정보 보기 |
| [system.cpu](system.md#systemcpu) | CPU 코어 통계 가져오기 | 공개 | GET/POST | 조건부; 세부정보 보기 |
| [system.info](system.md#systeminfo) | 시스템 정보 가져오기 | 공개 | GET/POST | 조건부; 세부정보 보기 |
| [system.log.level](system.md#systemloglevel) | 로그 수준 조회·설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [system.memory](system.md#systemmemory) | 메모리 정보 가져오기 | 공개 | GET/POST | 조건부; 세부정보 보기 |
| [system.memory_detail](system.md#systemmemory_detail) | 자세한 메모리 분석 가져오기 | ADMIN | GET/POST | 조건부; 세부정보 보기 |
| [system.reboot](system.md#systemreboot) | 시스템 재부팅 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [system.tasks](system.md#systemtasks) | 작업 목록 가져오기 | ADMIN | GET/POST | 조건부; 세부정보 보기 |
| [temp.bind](temp.md#tempbind) | 온도와 시스템 변수의 바인딩 설정·해제 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [temp.manual](temp.md#tempmanual) | 수동 온도 모드 조회·설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [temp.read](temp.md#tempread) | 현재 온도 읽기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [temp.select](temp.md#tempselect) | 우선 온도 소스 조회·설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [temp.sources](temp.md#tempsources) | 모든 온도 소스 정보 가져오기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [temp.status](temp.md#tempstatus) | 온도 시스템 상태 가져오기 | 공개 | GET/POST | 조건부; 세부정보 보기 |
| [time.force_sync](time.md#timeforce_sync) | 강제 NTP 동기화 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [time.info](time.md#timeinfo) | 시간 동기화 정보 가져오기 | 공개 | GET/POST | 조건부; 세부정보 보기 |
| [time.set_ntp](time.md#timeset_ntp) | NTP 서버 설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [time.set_timezone](time.md#timeset_timezone) | 시간대 설정 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [time.sync](time.md#timesync) | 브라우저에서 시간 동기화 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [ui.widgets.get](ui.md#uiwidgetsget) | 데이터 위젯 구성 가져오기 | READ | GET/POST | 조건부; 세부정보 보기 |
| [ui.widgets.set](ui.md#uiwidgetsset) | 데이터 위젯 구성 저장 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [wifi.connect](wifi.md#wificonnect) | WiFi 네트워크에 연결 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [wifi.disconnect](wifi.md#wifidisconnect) | WiFi 연결 끊기 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [wifi.scan](wifi.md#wifiscan) | WiFi 네트워크 검색 | ADMIN | POST/PUT/DELETE | 조건부; 세부정보 보기 |
| [wifi.status](wifi.md#wifistatus) | WiFi 상태 가져오기 | 공개 | GET/POST | 조건부; 세부정보 보기 |

## 기타 표면

[파일/이미지 전송](../transfers.md) | [웹소켓](../websocket.md) | [mTLS 진단](../compatibility.md#mtls-diagnostic-service)

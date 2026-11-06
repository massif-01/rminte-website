# 빠른 시작

연결하고 로그인하여 보호된 측정값을 읽습니다. 로그인 세션을 만들고 닫는 것 외에 이 시퀀스는 상태만 읽습니다.

## 장치 주소 설정

장치의 현재 IP 주소를 사용합니다. WebUI 및 장치 관리 API는 기본적으로 HTTP 포트 80을 사용하므로 일반적으로 명시적인 포트가 필요하지 않습니다. API 접두사는 `/api/v1` 입니다. 예시 주소를 자신의 장치 주소로 바꿉니다.

```sh
export TS_BASE='http://10.10.99.97'
```

연결 문제가 있는 경우 IP 주소, 네트워크, 서비스 상태를 확인하세요. [문제 해결](troubleshooting.md#cannot-connect)을 참조하세요.

## 컨트롤러 정보 읽기

```sh
curl --connect-timeout 5 --max-time 15 \
  "$TS_BASE/api/v1/system/info"
```

예시 응답 발췌:

```json
{"code":0,"data":{"app":{"name":"TianShanOS","version":"0.6.4","compile_date":"Nov 5 2026","compile_time":"10:00:00"},"chip":{"model":"ESP32-S3","cores":2},"uptime_ms":123456}}
```

HTTP 상태를 확인한 다음 code 값을 확인하세요. 버전은 data.app.version에 있으며 uptime_ms의 단위는 밀리초입니다. 최상위에 data.version 필드가 있다고 가정하지 마세요.

## 로그인 및 세션 유지

기본 계정은 `admin` 및 `root` 이며 둘 다 초기 비밀번호는 `rm01` 입니다. 로그인하여 해당 계정에 허용된 API를 사용하세요. 비밀번호를 변경한 경우 현재 비밀번호를 사용하세요.

login.json을 생성하기 전에 `umask 077` 를 설정하고 파일에 대한 접근을 제한합니다. 이 예에서는 기본 관리자 계정을 사용합니다.

```json
{"username":"admin","password":"rm01"}
```

```sh
umask 077
curl --connect-timeout 5 --max-time 15 \
  -H 'Content-Type: application/json' --data-binary @login.json \
  "$TS_BASE/api/v1/auth/login" > login-response.json
export TS_TOKEN="$(python3 -c 'import json; r=json.load(open("login-response.json")); assert r["code"] == 0; print(r["data"]["token"])')"
```

성공 시 data에는 token, session_id, username, level, expires_in(초), password_changed가 포함됩니다. 인증에는 token을 사용하세요. session_id는 식별자일 뿐입니다.

후속 호출에 반환된 토큰을 사용합니다. 액세스는 data.level 및 엔드포인트 인증을 따릅니다. 비밀번호 변경은 auth.change_password를 통한 선택적 계정 관리 작업입니다.

비밀번호 파일, 로그인 응답 및 토큰을 자격 증명으로 처리합니다. 사용 후 임시 자격 증명 파일을 제거합니다.

## 보호된 온도를 읽으십시오

```sh
curl --connect-timeout 5 --max-time 15 \
  -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/temp/read"
```

예시 발췌:

```json
{"code":0,"data":{"temperature_c":42.5,"temperature_01c":425,"source":"variable","timestamp_ms":120000,"valid":true}}
```

temperature_c는 섭씨 온도이고 temperature_01c는 0.1도 단위 값입니다. valid:true인 경우에만 측정값을 유효하게 사용하세요. 모니터링 시스템에서 누락되거나 유효하지 않은 값을 0도로 바꾸지 마세요.

## 로그아웃

```sh
curl --connect-timeout 5 --max-time 15 \
  -X POST -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/auth/logout"
unset TS_TOKEN
```

POST 로그아웃은 일반적인 code/data 구조가 아닌 `{"success":true}`를 반환합니다. 해당 세션을 사용하던 스크립트와 연결은 다시 유효한 세션을 확보해야 합니다.

다음으로 [작업 시나리오](scenarios.md)를 선택하거나 편집 가능한 문서와 함께 제공되는 읽기 전용 Python 예제를 사용합니다.

# 계정 및 세션 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [auth.admin.reset_password](#authadminreset_password) | 관리자 기본 비밀번호 복원 |
| [auth.admin.set_password](#authadminset_password) | root는 관리자 비밀번호를 설정합니다 |
| [auth.change_password](#authchange_password) | 비밀번호 변경 |
| [auth.login](#authlogin) | 사용자 로그인 |
| [auth.logout](#authlogout) | 사용자 로그아웃 |
| [auth.root.set_password](#authrootset_password) | root는 root 비밀번호를 설정합니다. |
| [auth.status](#authstatus) | 인증 상태 확인 |

<a id="authadminreset_password"></a>

## auth.admin.reset_password

관리자 기본 비밀번호 복원

**방법**: POST
**경로**: `/api/v1/auth/admin/reset_password`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `token` | string | 필수 | JSON의 유효한 로그인 토큰. session_id는 대체가 아닙니다. | 기본값 없음 |

### 요청 예시

```json
{
  "token": "ROOT_TOKEN"
}
```

### 응답 및 완료

data.success/username/password_changed가 반환됩니다. 성공 후 admin은 기본 비밀번호 rm01로 로그인합니다.

### 사용 참고 사항

root는 관리자 비밀번호를 rm01로 복원합니다. 재설정 후 해당 기본 비밀번호를 사용하십시오.

<a id="authadminset_password"></a>

## auth.admin.set_password

root는 관리자 비밀번호를 설정합니다

**방법**: POST
**경로**: `/api/v1/auth/admin/set_password`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `token` | string | 필수 | JSON의 유효한 로그인 토큰. session_id는 대체가 아닙니다. | 기본값 없음 |
| `new_password` | string | 필수 | 새 비밀번호, 4-64바이트. | 기본값 없음 |

### 요청 예시

```json
{
  "token": "ROOT_TOKEN",
  "new_password": "NEW_PASSWORD"
}
```

### 응답 및 완료

data.success/sessions_revoked/reauth_required/username/password_changed가 반환됩니다. 해당 계정의 세션은 취소됩니다.

### 사용 참고 사항

Authorization의 인증 정보와 JSON의 token 모두 root 검사를 통과해야 합니다. 두 필드는 각각 필요합니다.

<a id="authchange_password"></a>

## auth.change_password

비밀번호 변경

**방법**: POST
**경로**: `/api/v1/auth/change_password`
**최소 접근 조건**: 요청 본문의 토큰으로 인증(인증 API 전용)

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `token` | string | 필수 | JSON의 유효한 로그인 토큰. session_id는 대체가 아닙니다. | 기본값 없음 |
| `old_password` | string | 필수 | 현재 비밀번호입니다. | 기본값 없음 |
| `new_password` | string | 필수 | 새 비밀번호, 4-64바이트. | 기본값 없음 |

### 요청 예시

```json
{
  "token": "YOUR_TOKEN",
  "old_password": "CURRENT_PASSWORD",
  "new_password": "NEW_PASSWORD"
}
```

### 응답 및 완료

data.success/sessions_revoked/reauth_required. 성공 후 다시 로그인하세요.

### 사용 참고 사항

계정 소유자는 비밀번호 변경 시기를 선택합니다. 이전 세션은 성공 후 무효화됩니다.

<a id="authlogin"></a>

## auth.login

사용자 로그인

**방법**: POST
**경로**: `/api/v1/auth/login`
**최소 액세스**: 공개

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `username` | string | 필수 | 설정된 admin 또는 root 계정입니다. | 기본값 없음 |
| `password` | string | 필수 | 해당 계정의 현재 비밀번호입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "username": "admin",
  "password": "rm01"
}
```

### 응답 및 완료

POST 성공은 code=0과 data.token/session_id/username/level/expires_in(초)/password_changed.

### 사용 참고 사항

5회 연속 실패하면 로그인이 300초 동안 잠깁니다. 로그인은 WebSocket 구독을 설정하지 않습니다.

<a id="authlogout"></a>

## auth.logout

사용자 로그아웃

**방법**: POST
**경로**: `/api/v1/auth/logout`
**최소 접근 조건**: 요청 본문의 토큰으로 인증(인증 API 전용)

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

전용 POST가 {성공:true}를 반환합니다. 또한 클라이언트 토큰을 삭제합니다.

### 사용 참고 사항

Authorization으로 종료할 세션을 지정하며 JSON 본문은 필요하지 않습니다. 내부 처리 함수의 본문 token 형식을 전용 HTTP POST의 요청 규약으로 사용하지 마세요.

<a id="authrootset_password"></a>

## auth.root.set_password

root는 root 비밀번호를 설정합니다.

**방법**: POST
**경로**: `/api/v1/auth/root/set_password`
**최소 액세스**: ROOT

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `token` | string | 필수 | JSON의 유효한 로그인 토큰. session_id는 대체가 아닙니다. | 기본값 없음 |
| `new_password` | string | 필수 | 새 비밀번호, 4-64바이트. | 기본값 없음 |

### 요청 예시

```json
{
  "token": "ROOT_TOKEN",
  "new_password": "NEW_PASSWORD"
}
```

### 응답 및 완료

data.success/sessions_revoked/reauth_required/username/password_changed가 반환됩니다. 해당 계정의 세션은 취소됩니다.

### 사용 참고 사항

Authorization의 인증 정보와 JSON의 token 모두 root 검사를 통과해야 합니다. 두 필드는 각각 필요합니다.

<a id="authstatus"></a>

## auth.status

인증 상태 확인

**방법**: POST
**경로**: `/api/v1/auth/status`
**최소 접근 조건**: 요청 본문의 토큰으로 인증(인증 API 전용)

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `token` | string | 필수 | JSON의 유효한 로그인 토큰. session_id는 대체가 아닙니다. | 기본값 없음 |

### 요청 예시

```json
{
  "token": "YOUR_TOKEN"
}
```

### 응답 및 완료

data.valid가 유효성을 나타냅니다. 유효한 세션에는 username/level/expires_in/password_changed가 포함됩니다. code=0이어도 valid=false일 수 있습니다.

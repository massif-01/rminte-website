# 원격 파일 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [sftp.get](#sftpget) | SFTP를 통해 파일 다운로드 |
| [sftp.ls](#sftpls) | SFTP를 통해 원격 디렉토리 나열 |
| [sftp.mkdir](#sftpmkdir) | SFTP를 통해 원격 디렉토리 생성 |
| [sftp.put](#sftpput) | SFTP를 통해 파일 업로드 |
| [sftp.rm](#sftprm) | SFTP를 통해 원격 파일 삭제 |
| [sftp.stat](#sftpstat) | SFTP를 통해 원격 파일 정보 가져오기 |

<a id="sftpget"></a>

## sftp.get

SFTP를 통해 파일 다운로드

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/sftp/get`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `host` | string | 필수 | SSH 호스트 주소입니다. | 기본값 없음 |
| `user` | string | 필수 | 원격 사용자 이름. | 기본값 없음 |
| `port` | integer | 선택 사항 | 포트 1-65535. | 22 |
| `password` | string | 인증 대안 | TianshanOS 계정이 아닌 이 원격 로그인을 위한 비밀번호입니다. | 없음 |
| `keyid` | string | 인증 대안 | 장치에 저장된 SSH 개인 키 ID입니다. | 없음 |
| `keypath` | string | 즉시 호출에서 지원하는 대체 인증 방식 | 장치 개인 키 경로. 지원은 진입점에 따라 다릅니다. | 없음 |
| `remote` | string | 필수 | 절대 원격 파일 경로입니다. | 기본값 없음 |
| `local` | string | 필수 | 절대 로컬 장치 파일 경로입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "remote": "/tmp/example.txt",
  "local": "/sdcard/example.txt"
}
```

### 응답 및 완료

data.remote/local/success; 로컬 장치 파일을 씁니다.

### 사용 참고 사항

검증된 원격 호스트 신뢰 및 인증이 필요합니다. 실패하면 지문이 자동으로 승인되지 않습니다. get에는 로컬 쓰기 제한이 있습니다. put은 로컬 콘텐츠를 원격으로 보냅니다.

<a id="sftpls"></a>

## sftp.ls

SFTP를 통해 원격 디렉토리 나열

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/sftp/ls`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `host` | string | 필수 | SSH 호스트 주소입니다. | 기본값 없음 |
| `user` | string | 필수 | 원격 사용자 이름. | 기본값 없음 |
| `port` | integer | 선택 사항 | 포트 1-65535. | 22 |
| `password` | string | 인증 대안 | TianshanOS 계정이 아닌 이 원격 로그인을 위한 비밀번호입니다. | 없음 |
| `keyid` | string | 인증 대안 | 장치에 저장된 SSH 개인 키 ID입니다. | 없음 |
| `keypath` | string | 즉시 호출에서 지원하는 대체 인증 방식 | 장치 개인 키 경로. 지원은 진입점에 따라 다릅니다. | 없음 |
| `path` | string | 필수 | 원격 디렉터리 또는 파일 경로입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "path": "/tmp"
}
```

### 응답 및 완료

data.path/files가 반환되며 항목에는 name/size/is_dir/mtime/permissions가 포함됩니다.

### 사용 참고 사항

검증된 원격 호스트 신뢰 및 인증이 필요합니다. 실패하면 지문이 자동으로 승인되지 않습니다. get에는 로컬 쓰기 제한이 있습니다. put은 로컬 콘텐츠를 원격으로 보냅니다.

<a id="sftpmkdir"></a>

## sftp.mkdir

SFTP를 통해 원격 디렉토리 생성

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/sftp/mkdir`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `host` | string | 필수 | SSH 호스트 주소입니다. | 기본값 없음 |
| `user` | string | 필수 | 원격 사용자 이름. | 기본값 없음 |
| `port` | integer | 선택 사항 | 포트 1-65535. | 22 |
| `password` | string | 인증 대안 | TianshanOS 계정이 아닌 이 원격 로그인을 위한 비밀번호입니다. | 없음 |
| `keyid` | string | 인증 대안 | 장치에 저장된 SSH 개인 키 ID입니다. | 없음 |
| `keypath` | string | 즉시 호출에서 지원하는 대체 인증 방식 | 장치 개인 키 경로. 지원은 진입점에 따라 다릅니다. | 없음 |
| `path` | string | 필수 | 원격 디렉터리 또는 파일 경로입니다. | 기본값 없음 |
| `mode` | integer | 선택 사항 | 십진수 JSON 정수로서의 권한 비트. 8진수 0755는 10진수 493입니다. | 493 |

### 요청 예시

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "path": "/tmp"
}
```

### 응답 및 완료

data.path/created.

### 사용 참고 사항

검증된 원격 호스트 신뢰 및 인증이 필요합니다. 실패하면 지문이 자동으로 승인되지 않습니다. get에는 로컬 쓰기 제한이 있습니다. put은 로컬 콘텐츠를 원격으로 보냅니다.

<a id="sftpput"></a>

## sftp.put

SFTP를 통해 파일 업로드

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/sftp/put`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `host` | string | 필수 | SSH 호스트 주소입니다. | 기본값 없음 |
| `user` | string | 필수 | 원격 사용자 이름. | 기본값 없음 |
| `port` | integer | 선택 사항 | 포트 1-65535. | 22 |
| `password` | string | 인증 대안 | TianshanOS 계정이 아닌 이 원격 로그인을 위한 비밀번호입니다. | 없음 |
| `keyid` | string | 인증 대안 | 장치에 저장된 SSH 개인 키 ID입니다. | 없음 |
| `keypath` | string | 즉시 호출에서 지원하는 대체 인증 방식 | 장치 개인 키 경로. 지원은 진입점에 따라 다릅니다. | 없음 |
| `remote` | string | 필수 | 절대 원격 파일 경로입니다. | 기본값 없음 |
| `local` | string | 필수 | 절대 로컬 장치 파일 경로입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "remote": "/tmp/example.txt",
  "local": "/sdcard/example.txt"
}
```

### 응답 및 완료

data.remote/local/success가 반환됩니다. 원격 파일에 쓰는 작업입니다.

### 사용 참고 사항

검증된 원격 호스트 신뢰 및 인증이 필요합니다. 실패하면 지문이 자동으로 승인되지 않습니다. get에는 로컬 쓰기 제한이 있습니다. put은 로컬 콘텐츠를 원격으로 보냅니다.

<a id="sftprm"></a>

## sftp.rm

SFTP를 통해 원격 파일 삭제

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/sftp/rm`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `host` | string | 필수 | SSH 호스트 주소입니다. | 기본값 없음 |
| `user` | string | 필수 | 원격 사용자 이름. | 기본값 없음 |
| `port` | integer | 선택 사항 | 포트 1-65535. | 22 |
| `password` | string | 인증 대안 | TianshanOS 계정이 아닌 이 원격 로그인을 위한 비밀번호입니다. | 없음 |
| `keyid` | string | 인증 대안 | 장치에 저장된 SSH 개인 키 ID입니다. | 없음 |
| `keypath` | string | 즉시 호출에서 지원하는 대체 인증 방식 | 장치 개인 키 경로. 지원은 진입점에 따라 다릅니다. | 없음 |
| `path` | string | 필수 | 원격 디렉터리 또는 파일 경로입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "path": "/tmp"
}
```

### 응답 및 완료

data.path/deleted.

### 사용 참고 사항

검증된 원격 호스트 신뢰 및 인증이 필요합니다. 실패하면 지문이 자동으로 승인되지 않습니다. get에는 로컬 쓰기 제한이 있습니다. put은 로컬 콘텐츠를 원격으로 보냅니다.

<a id="sftpstat"></a>

## sftp.stat

SFTP를 통해 원격 파일 정보 가져오기

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/sftp/stat`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `host` | string | 필수 | SSH 호스트 주소입니다. | 기본값 없음 |
| `user` | string | 필수 | 원격 사용자 이름. | 기본값 없음 |
| `port` | integer | 선택 사항 | 포트 1-65535. | 22 |
| `password` | string | 인증 대안 | TianshanOS 계정이 아닌 이 원격 로그인을 위한 비밀번호입니다. | 없음 |
| `keyid` | string | 인증 대안 | 장치에 저장된 SSH 개인 키 ID입니다. | 없음 |
| `keypath` | string | 즉시 호출에서 지원하는 대체 인증 방식 | 장치 개인 키 경로. 지원은 진입점에 따라 다릅니다. | 없음 |
| `path` | string | 필수 | 원격 디렉터리 또는 파일 경로입니다. | 기본값 없음 |

### 요청 예시

```json
{
  "host": "192.0.2.20",
  "user": "YOUR_USER",
  "keyid": "example-key",
  "path": "/tmp"
}
```

### 응답 및 완료

data.path/size/is_dir/is_link/uid/gid/permissions/atime/mtime.

### 사용 참고 사항

검증된 원격 호스트 신뢰 및 인증이 필요합니다. 실패하면 지문이 자동으로 승인되지 않습니다. get에는 로컬 쓰기 제한이 있습니다. put은 로컬 콘텐츠를 원격으로 보냅니다.

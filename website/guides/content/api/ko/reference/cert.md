# 장치 인증서 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [cert.delete](#certdelete) | 모든 PKI 자격 증명 삭제 |
| [cert.generate_csr](#certgenerate_csr) | 인증서 서명 요청 생성 |
| [cert.generate_keypair](#certgenerate_keypair) | ECDSA P-256 키 쌍 생성 |
| [cert.get_certificate](#certget_certificate) | 장치 인증서 PEM 가져오기 |
| [cert.install](#certinstall) | 서명된 인증서 설치 |
| [cert.install_ca](#certinstall_ca) | CA 인증서 체인 설치 |
| [cert.status](#certstatus) | 인증서 및 진단 서비스 상태 읽기 |

<a id="certdelete"></a>

## cert.delete

모든 PKI 자격 증명 삭제

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/cert/delete`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `confirm` | boolean | 필수 | 명시적 true는 로컬 PKI 자료 삭제를 확인합니다. | 기본값 없음 |

### 요청 예시

```json
{
  "confirm": true
}
```

### 응답 및 완료

data.success/message.

### 사용 참고 사항

별도의 HTTPS 진단 서비스 ID를 변경하거나 초기 인증서 상태로 되돌릴 수 있습니다. 발급자에서 인증서를 취소하지 않습니다.

<a id="certgenerate_csr"></a>

## cert.generate_csr

인증서 서명 요청 생성

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/cert/generate_csr`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `device_id` | string | 선택 사항 | 인증서 주체의 장치 식별자입니다. | 빌드 구성 장치 ID |
| `organization` | string | 선택 사항 | 조직 이름입니다. | RMinte |
| `org_unit` | string | 선택 사항 | 조직 단위. | Device |

### 요청 예시

```json
{
  "device_id": "YOUR_DEVICE_ID",
  "organization": "YOUR_ORG",
  "org_unit": "Device"
}
```

### 응답 및 완료

data.success/csr_pem. CSR을 신뢰할 수 있는 발급자에게 제공합니다. 개인 키가 없습니다.

<a id="certgenerate_keypair"></a>

## cert.generate_keypair

ECDSA P-256 키 쌍 생성

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/cert/generate_keypair`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `force` | boolean | 선택 사항 | ID 자료가 이미 존재하는 경우 재생성을 요청합니다. | false |

### 요청 예시

```json
{}
```

### 응답 및 완료

data.success/message.

### 사용 참고 사항

장치 인증용 키를 교체하면 기존 인증서와의 일치가 깨질 수 있습니다. 먼저 유지보수를 계획하세요. key.*에서 관리하는 SSH 키와는 다릅니다.

<a id="certget_certificate"></a>

## cert.get_certificate

장치 인증서 PEM 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/cert/get_certificate`
**최소 액세스**: 공개

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.cert_pem은 개인 키가 없는 장치 인증서 PEM입니다.

<a id="certinstall"></a>

## cert.install

서명된 인증서 설치

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/cert/install`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `cert_pem` | string | 필수 | PEM 인증서, 최대 3999 콘텐츠 바이트; 기존 장치 개인 키와 일치해야 합니다. | 기본값 없음 |

### 요청 예시

```json
{
  "cert_pem": "-----BEGIN CERTIFICATE-----\nYOUR_CERTIFICATE\n-----END CERTIFICATE-----"
}
```

### 응답 및 완료

data.success/message/cert_info가 반환됩니다. cert_info에는 subject_cn/issuer_cn/not_before/not_after/validity/time_ready와 만료 정보가 포함됩니다.

### 사용 참고 사항

별도의 HTTPS 진단 서비스를 통해 인증서 저장, 유효성, 로딩 등을 독립적으로 확인합니다. 장치 관리 API는 HTTP80에 남아 있습니다. 설치 후 cert.status를 읽으십시오.

<a id="certinstall_ca"></a>

## cert.install_ca

CA 인증서 체인 설치

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/cert/install_ca`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `ca_pem` | string | 필수 | 신뢰할 수 있는 CA 체인 PEM; 구문 분석 및 용량 확인이 적용됩니다. | 기본값 없음 |

### 요청 예시

```json
{
  "ca_pem": "-----BEGIN CERTIFICATE-----\nYOUR_CA_CERTIFICATE\n-----END CERTIFICATE-----"
}
```

### 응답 및 완료

data.success/message.

### 사용 참고 사항

CA 자료는 신뢰에 영향을 미칩니다. 관리자가 확인한 체인만 설치하십시오.

<a id="certstatus"></a>

## cert.status

인증서 및 진단 서비스 상태 읽기

**메서드**: GET / POST
**경로**: `/api/v1/cert/status`
**최소 액세스**: 공개

### 매개변수

기능별 매개변수는 없습니다.

공유 [데이터 모델](../response-models.md#certificate)을 참조하세요.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.has_private_key/has_certificate/has_ca_chain, 인증서 정보, time_ready/validity/blocked_by, 별도 HTTPS 진단 서비스의 실행 상태가 각각 보고됩니다. 인증서 응답 모델을 참고하세요.

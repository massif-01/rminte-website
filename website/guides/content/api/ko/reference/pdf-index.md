# API 색인

등록된 API 이름 277개를 모두 수록했습니다. 이름을 선택하면 해당 항목으로 이동합니다. 각 항목에는 허용되는 메서드, 필요한 최소 권한, 매개변수, 작업 완료 여부를 확인하는 방법이 나와 있습니다.

레퍼런스의 요청 예제는 POST로 JSON을 보내는 형식입니다. 예제를 request.json으로 저장하고 자리표시자를 실제 값으로 바꾼 뒤, 명시된 경로로 요청하세요. 인증이 필요 없는 API에서는 Authorization을 생략할 수 있습니다.

```sh
curl --connect-timeout 5 --max-time 60 \
  -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' --data-binary @request.json \
  "$TS_BASE/api/v1/PATH_FROM_REFERENCE"
```

쓰기 작업은 실제 장치나 설정에 영향을 줍니다. 필요한 버전, 객체 ID, 인증서 또는 릴리스 파일 등을 먼저 준비하세요. GET은 명시적으로 허용된 API에서만 사용하고, 복잡한 매개변수는 POST JSON으로 보내세요.

## 이름순으로 찾기

권한 표시는 각 API를 호출하는 데 필요한 최소 권한입니다. 리소스, 세션, 기능에 관한 조건도 충족해야 합니다. 등록은 유지되지만 지원되지 않는 API는 해당 항목에 별도로 표시했습니다.

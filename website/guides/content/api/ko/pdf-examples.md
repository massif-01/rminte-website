# 제공 예제

PDF에는 read_status.py 및 subscribe.js가 첨부 파일로 포함되어 있습니다. 첨부 파일을 지원하는 PDF 리더를 사용하여 저장하세요. 편집 가능한 컴패니언에는 동일한 파일이 포함되어 있습니다. 자리 표시자 주소, 토큰 및 인증서 경로는 실제 장치 설정이 아닙니다.

## 코드 예제 복사

코드 상자에는 코드에 줄 번호가 혼합되어 있지 않은 선택 가능한 텍스트가 포함되어 있습니다. 들여쓰기와 줄 끝을 정확하게 유지하려면 오른쪽 상단 모서리에 있는 클립을 사용하여 명명된 소스 파일을 저장하거나 PDF 리더의 첨부 파일 패널에서 저장하세요.

PDF 리더가 첨부 파일을 지원하지 않는 경우에는 다운로드 패키지의 code-examples/en 폴더를 사용하세요. 같은 파일 이름으로 모든 원본 예제가 들어 있습니다. API 요청 JSON을 해당 엔드포인트에 대한 request.json으로 저장합니다. 응답 예제와 WebSocket 메시지는 해당 장에 설명된 목적을 수행합니다. 사용하기 전에 주소, 토큰 및 기타 자리 표시자를 입력하세요.

## Python 읽기 전용 쿼리

Python 3 및 해당 표준 라이브러리로 충분합니다. 장치 주소를 사용하여 다음을 실행하십시오.

```sh
python3 read_status.py --base 'http://10.10.99.97' \
  --user admin
```

명령 기록이 아닌 숨겨진 프롬프트에 비밀번호를 입력하세요. 스크립트는 로그인하고, 상태를 읽고, 로그아웃을 시도합니다. 하드웨어를 제어하거나 원격 작업을 실행하거나 업그레이드하지 않습니다. 리디렉션을 따르지 않으며 자동 재시도를 수행하지 않습니다. 출력에서 valid/duty_valid 및 기타 측정 플래그를 확인하세요.

## 브라우저 구독

subscribe.js는 watchTianShan을 타사 라이브러리 없이 ES 모듈로 내보냅니다. 장치에 접근할 수 있는 브라우저를 사용하십시오. 먼저 HTTP 로그인을 통해 토큰을 얻으세요.

```javascript
import {watchTianShan} from './subscribe.js';
const close = watchTianShan({
  baseUrl: 'http://10.10.99.97',
  token: yourLoginToken,
  onData: message => renderYourDashboard(message.data),
  onState: state => showConnectionState(state)
});
```

renderYourDashboard/showConnectionState는 페이지에서 구현해야 합니다. 페이지를 떠날 때 close()를 호출하세요. 연결이 끊기면 인증과 구독을 복원하기 전에 측정값을 오래된 데이터로 표시하세요. 토큰을 소스 코드, URL 또는 일반 로그에 기록하지 마세요. 예제는 자동 재연결이나 동작 재실행을 수행하지 않습니다.

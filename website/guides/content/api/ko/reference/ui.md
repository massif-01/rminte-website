# 모니터링 화면 레이아웃 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [ui.widgets.get](#uiwidgetsget) | 데이터 위젯 구성 가져오기 |
| [ui.widgets.set](#uiwidgetsset) | 데이터 위젯 구성 저장 |

<a id="uiwidgetsget"></a>

## ui.widgets.get

데이터 위젯 구성 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/ui/widgets/get`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.widgets/refresh_interval/source; 레이아웃은 장치 구성에 저장됩니다.

<a id="uiwidgetsset"></a>

## ui.widgets.set

데이터 위젯 구성 저장

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/ui/widgets/set`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `widgets` | array | 필수 | 위젯 구성 배열; 위젯 모델을 참조하세요. | 기본값 없음 |
| `refresh_interval` | integer | 선택 사항 | 새로 고침 간격(밀리초)입니다. | 5000 |

공유 [데이터 모델](../configuration-models.md#monitoring-widgets)을 참조하세요.

### 요청 예시

```json
{
  "widgets": [],
  "refresh_interval": 5000
}
```

### 응답 및 완료

data.nvs_saved가 반환됩니다. ui.widgets.get으로 레이아웃을 다시 읽어 확인하세요.

### 사용 참고 사항

직렬화된 구성은 4000바이트로 제한됩니다.

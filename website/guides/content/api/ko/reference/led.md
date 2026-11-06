# LED 및 매트릭스 API

[전체 색인](README.md) | [공통규칙](../conventions.md) | [문제 해결](../troubleshooting.md)

예제는 설명용 값을 사용한 POST JSON 요청 본문입니다. 별도 설명이 없으면 응답 설명은 data 내부를 가리킵니다.

| API | 목적 |
| --- | --- |
| [led.boot.config](#ledbootconfig) | LED 부팅 구성 가져오기 |
| [led.brightness](#ledbrightness) | 장치 밝기 조회·설정 |
| [led.clear](#ledclear) | 장치의 모든 LED 지우기 |
| [led.color.hsv](#ledcolorhsv) | HSV를 RGB로 변환 |
| [led.color.parse](#ledcolorparse) | 색상 문자열을 RGB로 구문 분석 |
| [led.color_correction.export](#ledcolor_correctionexport) | 색상 보정 구성을 SD 카드로 내보내기 |
| [led.color_correction.get](#ledcolor_correctionget) | 색상 보정 구성 가져오기 |
| [led.color_correction.import](#ledcolor_correctionimport) | SD 카드에서 색상 보정 구성 가져오기 |
| [led.color_correction.reset](#ledcolor_correctionreset) | 색상 보정을 기본값으로 재설정 |
| [led.color_correction.set](#ledcolor_correctionset) | 색상 보정 구성 설정 |
| [led.effect.list](#ledeffectlist) | 사용 가능한 효과 목록 |
| [led.effect.start](#ledeffectstart) | 장치에서 효과 시작 |
| [led.effect.stop](#ledeffectstop) | 장치에 대한 효과 중지 |
| [led.fill](#ledfill) | 모든 LED를 색상으로 채우기 |
| [led.filter.list](#ledfilterlist) | 사용 가능한 후처리 필터 목록 |
| [led.filter.start](#ledfilterstart) | 후처리 필터 적용 |
| [led.filter.stop](#ledfilterstop) | 후처리 필터 중지 |
| [led.image](#ledimage) | 매트릭스에 이미지 표시 |
| [led.list](#ledlist) | LED 장치 나열 |
| [led.qrcode](#ledqrcode) | QR 코드 생성 및 표시 |
| [led.save](#ledsave) | 현재 상태를 부팅 구성으로 저장 |
| [led.set](#ledset) | LED 픽셀 범위 설정 |
| [led.text](#ledtext) | 매트릭스에 텍스트 표시 |
| [led.text.stop](#ledtextstop) | 텍스트 오버레이 중지 |

<a id="ledbootconfig"></a>

## led.boot.config

LED 부팅 구성 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/led/boot/config`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `device` | string | 선택 사항 | LED 장치 이름은 touch/board/matrix입니다. 실제 지원 목록은 led.list로 확인하세요. | 모든 LED 장치 |

### 요청 예시

```json
{
  "device": "matrix"
}
```

### 응답 및 완료

data.boot_config 배열: 장치/enabled/animation/speed/brightness/filter/filter_speed/image_path/qrcode_text.

<a id="ledbrightness"></a>

## led.brightness

장치 밝기 조회·설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/led/brightness`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `device` | string | 선택 사항 | LED 장치 이름은 touch/board/matrix입니다. 실제 지원 목록은 led.list로 확인하세요. | 모든 LED 장치 |
| `brightness` | integer | 선택 사항 | 밝기, 0-255. | 쿼리 전용 |

### 요청 예시

```json
{
  "device": "matrix",
  "brightness": 64
}
```

### 응답 및 완료

data.device/brightness.

<a id="ledclear"></a>

## led.clear

장치의 모든 LED 지우기

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/led/clear`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `device` | string | 선택 사항 | LED 장치 이름은 touch/board/matrix입니다. 실제 지원 목록은 led.list로 확인하세요. | 모든 LED 장치 |
| `off` | boolean | 선택 사항 | 클리어 후 출력을 비활성화합니다. | false |

### 요청 예시

```json
{
  "device": "matrix"
}
```

### 응답 및 완료

data.device/cleared.

### 사용 참고 사항

관련 기사/replaces 현재 전시. 저축 시작 윤곽은 분리됩니다.

<a id="ledcolorhsv"></a>

## led.color.hsv

HSV를 RGB로 변환

**메서드**: GET / POST
**경로**: `/api/v1/led/color/hsv`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `h` | integer | 필수 | 정수 색조, 0-359도. | 기본값 없음 |
| `s` | integer | 필수 | 정수 채도, 0-255. | 기본값 없음 |
| `v` | integer | 필수 | 명도(value/brightness)이며 0~255의 정수입니다. | 기본값 없음 |

공유 [데이터 모델](../response-models.md#color)을 참조하세요.

### 요청 예시

```json
{
  "h": 200,
  "s": 255,
  "v": 255
}
```

### 응답 및 완료

data.hsv/rgb/hex가 반환됩니다. 범위는 색상 모델을 참고하세요.

<a id="ledcolorparse"></a>

## led.color.parse

색상 문자열을 RGB로 구문 분석

**메서드**: GET / POST
**경로**: `/api/v1/led/color/parse`
**최소 액세스**: READ

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `color` | string | 필수 | 지원되는 색상 문자열(예: #00A0FF). | 기본값 없음 |

### 요청 예시

```json
{
  "color": "#00A0FF"
}
```

### 응답 및 완료

data.input/rgb(r/g/b)/hex/value.

<a id="ledcolor_correctionexport"></a>

## led.color_correction.export

색상 보정 구성을 SD 카드로 내보내기

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/led/color_correction/export`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `path` | string | 선택 사항 | 절대 SD 대상 경로입니다. | /sdcard/config/led_color_correction.json |

### 요청 예시

```json
{
  "path": "/sdcard/example-color.json"
}
```

### 응답 및 완료

data.path/success.

<a id="ledcolor_correctionget"></a>

## led.color_correction.get

색상 보정 구성 가져오기

**메서드**: GET / POST
**경로**: `/api/v1/led/color_correction/get`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

공유 [데이터 모델](../response-models.md#color)을 참조하세요.

### 요청 예시

```json
{}
```

### 응답 및 완료

Color-correction 구성: 활성화/brightness/gamma/saturation/white_point; 색깔 모형을 보십시오.

<a id="ledcolor_correctionimport"></a>

## led.color_correction.import

SD 카드에서 색상 보정 구성 가져오기

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/led/color_correction/import`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `path` | string | 필수 | 절대 장치 경로; 관리되는 구성 및 민감한 파일에는 추가 제한사항이 있습니다. | 기본값 없음 |

### 요청 예시

```json
{
  "path": "/sdcard/example-color.json"
}
```

### 응답 및 완료

data.success.

### 사용 참고 사항

파일 읽기는 현재 세션을 사용합니다. 관리 경로나 민감한 경로에는 ADMIN이 필요할 수 있습니다.

<a id="ledcolor_correctionreset"></a>

## led.color_correction.reset

색상 보정을 기본값으로 재설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/led/color_correction/reset`
**최소 액세스**: ADMIN

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.success.

<a id="ledcolor_correctionset"></a>

## led.color_correction.set

색상 보정 구성 설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/led/color_correction/set`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | 선택 사항 | 색상 교정을 활성화합니다. | 변경되지 않음 |
| `brightness` | object | 선택 사항 | {enabled:boolean,factor:number} 형식이며 factor의 범위는 0~2입니다. | 변경되지 않음 |
| `gamma` | object | 선택 사항 | {enabled:boolean,gamma:number} 형식이며 gamma의 범위는 0.1~4입니다. value는 gamma의 별칭입니다. | 변경되지 않음 |
| `saturation` | object | 선택 사항 | {enabled:boolean,factor:number} 형식이며 factor의 범위는 0~2입니다. | 변경되지 않음 |
| `white_point` | object | 선택 사항 | 화이트 포인트 RGB 이득; 색상 모델을 참조하세요. | 변경되지 않음 |

공유 [데이터 모델](../response-models.md#color)을 참조하세요.

### 요청 예시

```json
{
  "enabled": true
}
```

### 응답 및 완료

data.success.

### 사용 참고 사항

현재 설정을 읽고 원하는 필드만 변경합니다. 보정은 장치별 밝기 0~255와 다릅니다.

<a id="ledeffectlist"></a>

## led.effect.list

사용 가능한 효과 목록

**메서드**: GET / POST
**경로**: `/api/v1/led/effect/list`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.effects가 반환됩니다. led.list는 장치의 지원 여부도 보고합니다.

<a id="ledeffectstart"></a>

## led.effect.start

장치에서 효과 시작

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/led/effect/start`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `device` | string | 선택 사항 | LED 장치 이름은 touch/board/matrix입니다. 실제 지원 목록은 led.list로 확인하세요. | 모든 LED 장치 |
| `effect` | string | 필수 | 효과 이름입니다. | 기본값 없음 |
| `speed` | integer | 선택 사항 | 애니메이션 속도, 1-100. | 50 |
| `color` | string / object / integer | 선택 사항 | 색상 문자열, {r,g,b} 또는 10진수 0xRRGGBB 정수. 구성 요소 0-255. | 효과의 기본 색상 |

### 요청 예시

```json
{
  "device": "matrix",
  "effect": "rainbow",
  "speed": 50
}
```

### 응답 및 완료

data.device/effect/speed/started.

### 사용 참고 사항

예시 효과가 지원되는지 확인하세요. 새로운 효과가 현재 효과를 대체합니다.

<a id="ledeffectstop"></a>

## led.effect.stop

장치에 대한 효과 중지

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/led/effect/stop`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `device` | string | 선택 사항 | LED 장치 이름은 touch/board/matrix입니다. 실제 지원 목록은 led.list로 확인하세요. | 모든 LED 장치 |

### 요청 예시

```json
{
  "device": "matrix"
}
```

### 응답 및 완료

data.device/stopped.

<a id="ledfill"></a>

## led.fill

모든 LED를 색상으로 채우기

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/led/fill`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `device` | string | 선택 사항 | LED 장치 이름은 touch/board/matrix입니다. 실제 지원 목록은 led.list로 확인하세요. | 모든 LED 장치 |
| `color` | string / object / integer | 필수 | 색상 문자열, {r,g,b} 또는 10진수 0xRRGGBB 정수. 구성 요소 0-255. | 기본값 없음 |

### 요청 예시

```json
{
  "device": "board",
  "color": "#00A0FF"
}
```

### 응답 및 완료

data.device/color(r/g/b)/success.

<a id="ledfilterlist"></a>

## led.filter.list

사용 가능한 후처리 필터 목록

**메서드**: GET / POST
**경로**: `/api/v1/led/filter/list`
**최소 액세스**: READ

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.filters에 name/description이 포함됩니다.

<a id="ledfilterstart"></a>

## led.filter.start

후처리 필터 적용

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/led/filter/start`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `device` | string | 선택 사항 | LED 장치 이름은 touch/board/matrix입니다. 실제 지원 목록은 led.list로 확인하세요. | 모든 LED 장치 |
| `filter` | string | 필수 | led.filter.list에서 선택합니다. | 기본값 없음 |
| `speed` | integer | 선택 사항 | 필터 속도. | 50 |
| `intensity` | number | 선택 사항 | 강도. | 필터 기본값 |
| `amount` | number | 선택 사항 | 효과량. | 필터 기본값 |
| `scale` | number | 선택 사항 | 공간 규모. | 필터 기본값 |
| `angle` | number | 선택 사항 | 각도. | 필터 기본값 |
| `frequency` | number | 선택 사항 | 주파수. | 필터 기본값 |
| `amplitude` | number | 선택 사항 | 진폭. | 필터 기본값 |
| `wavelength` | number | 선택 사항 | 파장. | 필터 기본값 |
| `width` | number | 선택 사항 | 너비. | 필터 기본값 |
| `saturation` | number | 선택 사항 | 채도. | 필터 기본값 |
| `levels` | number | 선택 사항 | 레벨 수. | 필터 기본값 |
| `decay` | number | 선택 사항 | 감쇠 | 필터 기본값 |
| `density` | number | 선택 사항 | 밀도. | 필터 기본값 |

### 요청 예시

```json
{
  "device": "matrix",
  "filter": "YOUR_FILTER",
  "speed": 50
}
```

### 응답 및 완료

data.device/filter/speed/applied.

### 사용 참고 사항

옵션은 이를 사용하는 필터에만 영향을 미칩니다. 모든 옵션을 무분별하게 적용하기보다는 선택한 필터를 구성하세요.

<a id="ledfilterstop"></a>

## led.filter.stop

후처리 필터 중지

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/led/filter/stop`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `device` | string | 선택 사항 | LED 장치 이름은 touch/board/matrix입니다. 실제 지원 목록은 led.list로 확인하세요. | 모든 LED 장치 |

### 요청 예시

```json
{
  "device": "matrix"
}
```

### 응답 및 완료

data.device/stopped.

<a id="ledimage"></a>

## led.image

매트릭스에 이미지 표시

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/led/image`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `device` | string | 선택 사항 | 대상 디스플레이 장치. | matrix |
| `path` | string | 필수 | 절대 장치 경로; 관리되는 구성 및 민감한 파일에는 추가 제한사항이 있습니다. | 기본값 없음 |
| `center` | boolean | 선택 사항 | 이미지를 중앙에 배치합니다. | true |

### 요청 예시

```json
{
  "device": "matrix",
  "path": "/sdcard/example.png",
  "center": true
}
```

### 응답 및 완료

data.device/path/displayed/width/height/animated/frames.

### 사용 참고 사항

지원되는 이미지 형식과 유효한 파일이 필요합니다. 민감한 읽기는 경로 확인을 유지합니다.

<a id="ledlist"></a>

## led.list

LED 장치 나열

**메서드**: GET / POST
**경로**: `/api/v1/led/list`
**최소 액세스**: 공개

### 매개변수

기능별 매개변수는 없습니다.

### 요청 예시

```json
{}
```

### 응답 및 완료

data.devices에 name/count/brightness/layout/effects/current가 포함됩니다. current에는 animation/speed/on/color가 포함됩니다.

<a id="ledqrcode"></a>

## led.qrcode

QR 코드 생성 및 표시

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/led/qrcode`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `device` | string | 선택 사항 | 대상 디스플레이 장치. | matrix |
| `text` | string | 필수 | 인코딩할 콘텐츠입니다. | 기본값 없음 |
| `ecc` | string | 선택 사항 | 오류 수정 수준 L/M/Q/H. | L |
| `bg_image` | string | 선택 사항 | 선택적 절대 배경 이미지 경로입니다. | 없음 |
| `color` | string / object / integer | 선택 사항 | 색상 문자열, {r,g,b} 또는 10진수 0xRRGGBB 정수. 구성 요소 0-255. | 기본 전경 |

### 요청 예시

```json
{
  "device": "matrix",
  "text": "https://example.com",
  "ecc": "L"
}
```

### 응답 및 완료

data.device/text/version/size/capacity/displayed.

### 사용 참고 사항

용량은 텍스트 길이, 매트릭스 크기 및 ECC에 따라 다릅니다. 백그라운드 읽기에는 경로 확인이 있습니다.

<a id="ledsave"></a>

## led.save

현재 상태를 부팅 구성으로 저장

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/led/save`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `device` | string | 선택 사항 | LED 장치 이름은 touch/board/matrix입니다. 실제 지원 목록은 led.list로 확인하세요. | 모든 LED 장치 |

### 요청 예시

```json
{
  "device": "board"
}
```

### 응답 및 완료

data.device/saved/animation/brightness/speed가 반환됩니다. 저장이 성공한 경우에만 시작 설정으로 간주하세요.

<a id="ledset"></a>

## led.set

LED 픽셀 범위 설정

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/led/set`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `device` | string | 필수 | LED 장치 이름은 touch/board/matrix입니다. 실제 지원 목록은 led.list로 확인하세요. | 기본값 없음 |
| `color` | string / object / integer | 필수 | 색상 문자열, {r,g,b} 또는 10진수 0xRRGGBB 정수. 구성 요소 0-255. | 기본값 없음 |
| `index` | integer | 선택 사항 | 0 기반 첫 번째 픽셀; 장치 픽셀 수보다 작아야 합니다. | 0 |
| `count` | integer | 선택 사항 | 양수 연속 픽셀; 범위는 장치에 맞아야 합니다. | index 지정 시 1, 그 외에는 모든 픽셀 |

### 요청 예시

```json
{
  "device": "board",
  "index": 0,
  "count": 1,
  "color": {
    "r": 0,
    "g": 64,
    "b": 128
  }
}
```

### 응답 및 완료

data.device/start/count/color(r/g/b)/success.

### 사용 참고 사항

Target-layer 애니메이션을 중지하고 장치를 활성화합니다. Omitting 색인/count 전체적인 장치를 채우십시오; 혼자 색인은 1개의 화소를 씁니다. 전체 채우기 업데이트 현재 단색 미리 설정. Persistent 저축은 분리되는 점화 구성 단계입니다.

<a id="ledtext"></a>

## led.text

매트릭스에 텍스트 표시

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/led/text`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `device` | string | 선택 사항 | 대상 장치. | matrix |
| `text` | string | 필수 | 표시 텍스트. | 기본값 없음 |
| `font` | string | 선택 사항 | 지원되는 글꼴 이름입니다. | cjk; /sdcard/fonts/<font>.fnt 로드 |
| `x` | integer | 선택 사항 | 수평 좌표 시작. | 기본 위치 |
| `y` | integer | 선택 사항 | 수직 좌표 시작. | 기본 위치 |
| `align` | string | 선택 사항 | left/center/right입니다. | left |
| `scroll` | string | 선택 사항 | none/left/right/up/down. | none |
| `speed` | integer | 선택 사항 | 스크롤 속도. | 30 |
| `loop` | boolean | 선택 사항 | 스크롤 텍스트를 반복합니다. | false |
| `invert` | boolean | 선택 사항 | 겹치는 출력을 반전시킵니다. | false |
| `color` | string / object / integer | 선택 사항 | 색상 문자열, {r,g,b} 또는 10진수 0xRRGGBB 정수. 구성 요소 0-255. | 화이트 |

### 요청 예시

```json
{
  "device": "matrix",
  "text": "Ready",
  "scroll": "none"
}
```

### 응답 및 완료

data.device/text/font/displayed.

### 사용 참고 사항

문자 사용 가능 여부는 선택한 글꼴에 따라 다릅니다.

<a id="ledtextstop"></a>

## led.text.stop

텍스트 오버레이 중지

**방법**: POST / PUT / DELETE
**경로**: `/api/v1/led/text/stop`
**최소 액세스**: ADMIN

### 매개변수

| 필드 | 유형 | 요구 사항 | 의미 | 생략 시 |
| --- | --- | --- | --- | --- |
| `device` | string | 선택 사항 | 대상 장치. | matrix |

### 요청 예시

```json
{
  "device": "matrix"
}
```

### 응답 및 완료

data.device/stopped.

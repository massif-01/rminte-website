# LED とマトリクス API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [led.boot.config](#ledbootconfig) | LED 起動時設定の取得 |
| [led.brightness](#ledbrightness) | 機器の明るさを取得・設定する |
| [led.clear](#ledclear) | デバイス上のすべての LED をクリアします |
| [led.color.hsv](#ledcolorhsv) | HSV を RGB に変換 |
| [led.color.parse](#ledcolorparse) | カラー文字列を RGB に解析します |
| [led.color_correction.export](#ledcolor_correctionexport) | 色補正設定を SD カードにエクスポート |
| [led.color_correction.get](#ledcolor_correctionget) | 色補正設定の取得 |
| [led.color_correction.import](#ledcolor_correctionimport) | SD カードから色補正設定をインポート |
| [led.color_correction.reset](#ledcolor_correctionreset) | 色補正をデフォルトにリセットする |
| [led.color_correction.set](#ledcolor_correctionset) | 色補正設定を設定する |
| [led.effect.list](#ledeffectlist) | 利用可能なエフェクトのリスト |
| [led.effect.start](#ledeffectstart) | デバイス上のエフェクトを開始します |
| [led.effect.stop](#ledeffectstop) | デバイス上の効果を停止します |
| [led.fill](#ledfill) | すべての LED を色で塗りつぶします |
| [led.filter.list](#ledfilterlist) | 利用可能な後処理フィルターをリストします。 |
| [led.filter.start](#ledfilterstart) | 後処理フィルターを適用する |
| [led.filter.stop](#ledfilterstop) | 後処理フィルターを停止します |
| [led.image](#ledimage) | マトリックス上に画像を表示 |
| [led.list](#ledlist) | LED デバイスのリスト |
| [led.qrcode](#ledqrcode) | QRコードの生成と表示 |
| [led.save](#ledsave) | 現在の状態を起動時設定として保存します |
| [led.set](#ledset) | LED ピクセル範囲を設定します |
| [led.text](#ledtext) | マトリックス上にテキストを表示 |
| [led.text.stop](#ledtextstop) | テキストオーバーレイを停止します |

<a id="ledbootconfig"></a>

## led.boot.config

LED 起動時設定の取得

**メソッド**: GET / POST
**パス**: `/api/v1/led/boot/config`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `device` | string | 任意 | LED 機器名：touch/board/matrix。led.list の結果を基準に指定してください。 | すべての LED デバイス |

### リクエストの例

```json
{
  "device": "matrix"
}
```

### 応答と完了

data.boot_config 配列に device/enabled/animation/speed/brightness/filter/filter_speed/image_path/qrcode_text が含まれます。

<a id="ledbrightness"></a>

## led.brightness

機器の明るさを取得・設定する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/led/brightness`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `device` | string | 任意 | LED 機器名：touch/board/matrix。led.list の結果を基準に指定してください。 | すべての LED デバイス |
| `brightness` | integer | 任意 | 明るさ、0 ～ 255。 | クエリのみ |

### リクエストの例

```json
{
  "device": "matrix",
  "brightness": 64
}
```

### 応答と完了

data.device/brightness.

<a id="ledclear"></a>

## led.clear

デバイス上のすべての LED をクリアします

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/led/clear`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `device` | string | 任意 | LED 機器名：touch/board/matrix。led.list の結果を基準に指定してください。 | すべての LED デバイス |
| `off` | boolean | 任意 | クリア後の出力を無効にします。 | false |

### リクエストの例

```json
{
  "device": "matrix"
}
```

### 応答と完了

data.device/cleared.

### 使用上の注意

現在の表示を停止または置き換えます。起動時の設定を保存する操作は別です。

<a id="ledcolorhsv"></a>

## led.color.hsv

HSV を RGB に変換

**メソッド**: GET / POST
**パス**: `/api/v1/led/color/hsv`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `h` | integer | 必須 | 整数の色相、0 ～ 359 度。 | 既定値なし |
| `s` | integer | 必須 | 彩度の整数値。範囲は 0〜255。 | 既定値なし |
| `v` | integer | 必須 | 明度の整数値。範囲は 0〜255。 | 既定値なし |

共有 [データ モデル](../response-models.md#color) を参照してください。

### リクエストの例

```json
{
  "h": 200,
  "s": 255,
  "v": 255
}
```

### 応答と完了

data.hsv/rgb/hex; 範囲のカラーモデルを参照してください。

<a id="ledcolorparse"></a>

## led.color.parse

カラー文字列を RGB に解析します

**メソッド**: GET / POST
**パス**: `/api/v1/led/color/parse`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `color` | string | 必須 | サポートされている色の文字列 (#00A0FF など)。 | 既定値なし |

### リクエストの例

```json
{
  "color": "#00A0FF"
}
```

### 応答と完了

data.input/rgb(r/g/b)/hex/value.

<a id="ledcolor_correctionexport"></a>

## led.color_correction.export

色補正設定を SD カードにエクスポート

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/led/color_correction/export`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `path` | string | 任意 | SD 宛先の絶対パス。 | /sdcard/config/led_color_correction.json |

### リクエストの例

```json
{
  "path": "/sdcard/example-color.json"
}
```

### 応答と完了

data.path/success.

<a id="ledcolor_correctionget"></a>

## led.color_correction.get

色補正設定の取得

**メソッド**: GET / POST
**パス**: `/api/v1/led/color_correction/get`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

共有 [データ モデル](../response-models.md#color) を参照してください。

### リクエストの例

```json
{}
```

### 応答と完了

色補正の設定として enabled/brightness/gamma/saturation/white_point を返します。色のモデルを参照してください。

<a id="ledcolor_correctionimport"></a>

## led.color_correction.import

SD カードから色補正設定をインポート

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/led/color_correction/import`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `path` | string | 必須 | 絶対デバイスパス。管理対象の構成ファイルと機密ファイルには追加の制限があります。 | 既定値なし |

### リクエストの例

```json
{
  "path": "/sdcard/example-color.json"
}
```

### 応答と完了

data.success.

### 使用上の注意

ファイルの読み取りには現在のセッションを使用します。管理対象・機密性の高いパスには ADMIN が必要な場合があります。

<a id="ledcolor_correctionreset"></a>

## led.color_correction.reset

色補正をデフォルトにリセットする

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/led/color_correction/reset`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.success.

<a id="ledcolor_correctionset"></a>

## led.color_correction.set

色補正設定を設定する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/led/color_correction/set`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | 任意 | 色補正を有効にします。 | 変更なし |
| `brightness` | object | 任意 | {enabled:boolean,factor:number}。factor は 0〜2。 | 変更なし |
| `gamma` | object | 任意 | {enabled:boolean,gamma:number}。gamma は 0.1〜4。value は gamma の別名です。 | 変更なし |
| `saturation` | object | 任意 | {enabled:boolean,factor:number}。factor は 0〜2。 | 変更なし |
| `white_point` | object | 任意 | 白色点 RGB ゲイン。カラーモデルを参照してください。 | 変更なし |

共有 [データ モデル](../response-models.md#color) を参照してください。

### リクエストの例

```json
{
  "enabled": true
}
```

### 応答と完了

data.success.

### 使用上の注意

現在の設定を読み取り、目的のフィールドのみを変更します。補正はデバイスごとの明るさ0〜255とは異なります。

<a id="ledeffectlist"></a>

## led.effect.list

利用可能なエフェクトのリスト

**メソッド**: GET / POST
**パス**: `/api/v1/led/effect/list`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.effects を返します。led.list では機器の対応状況も確認できます。

<a id="ledeffectstart"></a>

## led.effect.start

デバイス上のエフェクトを開始します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/led/effect/start`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `device` | string | 任意 | LED 機器名：touch/board/matrix。led.list の結果を基準に指定してください。 | すべての LED デバイス |
| `effect` | string | 必須 | サポートされているリストのエフェクト名。 | 既定値なし |
| `speed` | integer | 任意 | アニメーション速度、1 ～ 100。 | 50 |
| `color` | string / object / integer | 任意 | カラー文字列、{r,g,b}、または 10 進数の 0xRRGGBB 整数。コンポーネント 0 ～ 255。 | 効果のデフォルト色 |

### リクエストの例

```json
{
  "device": "matrix",
  "effect": "rainbow",
  "speed": 50
}
```

### 応答と完了

data.device/effect/speed/started.

### 使用上の注意

サンプルエフェクトがサポートされていることを確認します。新しいエフェクトが現在のエフェクトを置き換えます。

<a id="ledeffectstop"></a>

## led.effect.stop

デバイス上の効果を停止します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/led/effect/stop`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `device` | string | 任意 | LED 機器名：touch/board/matrix。led.list の結果を基準に指定してください。 | すべての LED デバイス |

### リクエストの例

```json
{
  "device": "matrix"
}
```

### 応答と完了

data.device/stopped.

<a id="ledfill"></a>

## led.fill

すべての LED を色で塗りつぶします

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/led/fill`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `device` | string | 任意 | LED 機器名：touch/board/matrix。led.list の結果を基準に指定してください。 | すべての LED デバイス |
| `color` | string / object / integer | 必須 | カラー文字列、{r,g,b}、または 10 進数の 0xRRGGBB 整数。コンポーネント 0 ～ 255。 | 既定値なし |

### リクエストの例

```json
{
  "device": "board",
  "color": "#00A0FF"
}
```

### 応答と完了

data.device/color(r/g/b)/success.

<a id="ledfilterlist"></a>

## led.filter.list

利用可能な後処理フィルターをリストします。

**メソッド**: GET / POST
**パス**: `/api/v1/led/filter/list`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.filters お名前 (必須)/description.

<a id="ledfilterstart"></a>

## led.filter.start

後処理フィルターを適用する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/led/filter/start`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `device` | string | 任意 | LED 機器名：touch/board/matrix。led.list の結果を基準に指定してください。 | すべての LED デバイス |
| `filter` | string | 必須 | led.filter.list から選択します。 | 既定値なし |
| `speed` | integer | 任意 | フィルター速度。 | 50 |
| `intensity` | number | 任意 | 強度。 | フィルターのデフォルト |
| `amount` | number | 任意 | エフェクト量。 | フィルターのデフォルト |
| `scale` | number | 任意 | 空間スケール。 | フィルターのデフォルト |
| `angle` | number | 任意 | 角度。 | フィルターのデフォルト |
| `frequency` | number | 任意 | 周波数。 | フィルターのデフォルト |
| `amplitude` | number | 任意 | 振幅。 | フィルターのデフォルト |
| `wavelength` | number | 任意 | 波長。 | フィルターのデフォルト |
| `width` | number | 任意 | 幅。 | フィルターのデフォルト |
| `saturation` | number | 任意 | 彩度。 | フィルターのデフォルト |
| `levels` | number | 任意 | レベルの数。 | フィルターのデフォルト |
| `decay` | number | 任意 | 減衰。 | フィルターのデフォルト |
| `density` | number | 任意 | 密度。 | フィルターのデフォルト |

### リクエストの例

```json
{
  "device": "matrix",
  "filter": "YOUR_FILTER",
  "speed": 50
}
```

### 応答と完了

data.device/filter/speed/applied.

### 使用上の注意

オプションは、それを使用するフィルターにのみ影響します。すべてのオプションを無差別に適用するのではなく、選択したフィルターを構成します。

<a id="ledfilterstop"></a>

## led.filter.stop

後処理フィルターを停止します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/led/filter/stop`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `device` | string | 任意 | LED 機器名：touch/board/matrix。led.list の結果を基準に指定してください。 | すべての LED デバイス |

### リクエストの例

```json
{
  "device": "matrix"
}
```

### 応答と完了

data.device/stopped.

<a id="ledimage"></a>

## led.image

マトリックス上に画像を表示

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/led/image`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `device` | string | 任意 | ターゲットの表示デバイス。 | matrix |
| `path` | string | 必須 | 絶対デバイスパス。管理対象の構成ファイルと機密ファイルには追加の制限があります。 | 既定値なし |
| `center` | boolean | 任意 | 画像を中央に配置します。 | true |

### リクエストの例

```json
{
  "device": "matrix",
  "path": "/sdcard/example.png",
  "center": true
}
```

### 応答と完了

data.device/path/displayed/width/height/animated/frames.

### 使用上の注意

サポートされている画像形式と有効なファイルが必要です。機密読み取りではパス チェックが保持されます。

<a id="ledlist"></a>

## led.list

LED デバイスのリスト

**メソッド**: GET / POST
**パス**: `/api/v1/led/list`
**最低権限**: パブリック

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.devices に name/count/brightness/layout/effects/current が含まれ、current には animation/speed/on/color があります。

<a id="ledqrcode"></a>

## led.qrcode

QRコードの生成と表示

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/led/qrcode`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `device` | string | 任意 | ターゲットの表示デバイス。 | matrix |
| `text` | string | 必須 | エンコードするコンテンツ。 | 既定値なし |
| `ecc` | string | 任意 | 誤り訂正レベル L/M/Q/H。 | L |
| `bg_image` | string | 任意 | オプションの背景画像の絶対パス。 | なし |
| `color` | string / object / integer | 任意 | カラー文字列、{r,g,b}、または 10 進数の 0xRRGGBB 整数。コンポーネント 0 ～ 255。 | デフォルトの前景 |

### リクエストの例

```json
{
  "device": "matrix",
  "text": "https://example.com",
  "ecc": "L"
}
```

### 応答と完了

data.device/text/version/size/capacity/displayed.

### 使用上の注意

容量はテキストの長さ、マトリックスのサイズ、ECC によって変わります。背景画像の読み取りにもパスの確認が適用されます。

<a id="ledsave"></a>

## led.save

現在の状態を起動時設定として保存します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/led/save`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `device` | string | 任意 | LED 機器名：touch/board/matrix。led.list の結果を基準に指定してください。 | すべての LED デバイス |

### リクエストの例

```json
{
  "device": "board"
}
```

### 応答と完了

data.device/saved/animation/brightness/speed を返します。保存の成功を確認してから、起動時の設定として扱ってください。

<a id="ledset"></a>

## led.set

LED ピクセル範囲を設定します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/led/set`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `device` | string | 必須 | LED 機器名：touch/board/matrix。led.list の結果を基準に指定してください。 | 既定値なし |
| `color` | string / object / integer | 必須 | カラー文字列、{r,g,b}、または 10 進数の 0xRRGGBB 整数。コンポーネント 0 ～ 255。 | 既定値なし |
| `index` | integer | 任意 | ゼロベースの最初のピクセル。デバイスのピクセル数を下回る必要があります。 | 0 |
| `count` | integer | 任意 | 連続ピクセルの正の数。範囲はデバイスに適合する必要があります。 | index 指定時は 1。それ以外は全ピクセル |

### リクエストの例

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

### 応答と完了

data.device/start/count/color (r/g/b)/success.

### 使用上の注意

対象レイヤーのアニメーションを停止し、機器を有効にします。index/count を省略すると機器全体を塗りつぶし、index だけを指定すると 1 ピクセルに書き込みます。全体の塗りつぶしでは、現在の単色プリセットも更新されます。永続化は、照明設定を保存する別の手順です。

<a id="ledtext"></a>

## led.text

マトリックス上にテキストを表示

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/led/text`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `device` | string | 任意 | ターゲットデバイス。 | matrix |
| `text` | string | 必須 | テキストを表示します。 | 既定値なし |
| `font` | string | 任意 | サポートされているフォント名。 | cjk; /sdcard/fonts/<font>.fnt をロードします |
| `x` | integer | 任意 | 開始水平座標。 | デフォルトの位置 |
| `y` | integer | 任意 | 開始垂直座標。 | デフォルトの位置 |
| `align` | string | 任意 | left/center/right。 | left |
| `scroll` | string | 任意 | none/left/right/up/down。 | none |
| `speed` | integer | 任意 | スクロール速度。 | 30 |
| `loop` | boolean | 任意 | スクロールするテキストをループします。 | false |
| `invert` | boolean | 任意 | オーバーラップ出力を反転します。 | false |
| `color` | string / object / integer | 任意 | カラー文字列、{r,g,b}、または 10 進数の 0xRRGGBB 整数。コンポーネント 0 ～ 255。 | ホワイト |

### リクエストの例

```json
{
  "device": "matrix",
  "text": "Ready",
  "scroll": "none"
}
```

### 応答と完了

data.device/text/font/displayed.

### 使用上の注意

使用できる文字は、選択したフォントによって異なります。

<a id="ledtextstop"></a>

## led.text.stop

テキストオーバーレイを停止します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/led/text/stop`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `device` | string | 任意 | ターゲットデバイス。 | matrix |

### リクエストの例

```json
{
  "device": "matrix"
}
```

### 応答と完了

data.device/stopped.

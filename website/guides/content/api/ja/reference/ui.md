# 監視画面のレイアウト API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [ui.widgets.get](#uiwidgetsget) | データウィジェットの設定を取得する |
| [ui.widgets.set](#uiwidgetsset) | データウィジェットの設定を保存する |

<a id="uiwidgetsget"></a>

## ui.widgets.get

データウィジェットの設定を取得する

**メソッド**: GET / POST
**パス**: `/api/v1/ui/widgets/get`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.widgets/refresh_interval/source;レイアウトは機器設定に保存されます。

<a id="uiwidgetsset"></a>

## ui.widgets.set

データウィジェットの設定を保存する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/ui/widgets/set`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `widgets` | array | 必須 | ウィジェット設定配列。ウィジェットモデルを参照してください。 | 既定値なし |
| `refresh_interval` | integer | 任意 | ミリ秒単位の更新間隔。 | 5000 |

共有 [データ モデル](../configuration-models.md#monitoring-widgets) を参照してください。

### リクエストの例

```json
{
  "widgets": [],
  "refresh_interval": 5000
}
```

### 応答と完了

data.nvs_saved. レイアウトを読んでください。 ui.widgets.get.

### 使用上の注意

シリアライズ後の設定は 4000 バイトに制限されます。

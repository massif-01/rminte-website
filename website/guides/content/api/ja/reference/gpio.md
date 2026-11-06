# GPIO API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [gpio.info](#gpioinfo) | GPIO ピン情報の取得 |
| [gpio.list](#gpiolist) | 制御可能な GPIO ピンをすべてリストします。 |
| [gpio.set](#gpioset) | GPIO レベルの設定 |
| [gpio.toggle](#gpiotoggle) | GPIO レベルの切り替え |

<a id="gpioinfo"></a>

## gpio.info

GPIO ピン情報の取得

**メソッド**: GET / POST
**パス**: `/api/v1/gpio/info`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `pin` | integer | ピンまたは名前が必要です | gpio.list のホワイトリストに登録された GPIO 番号。 | なし |
| `name` | string | ピンまたは名前が必要です | gpio.list のピン名。 | なし |

### リクエストの例

```json
{
  "name": "AGX_RESET"
}
```

### 応答と完了

data.gpio/name/description/level/default/modified.

<a id="gpiolist"></a>

## gpio.list

制御可能な GPIO ピンをすべてリストします。

**メソッド**: GET / POST
**パス**: `/api/v1/gpio/list`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.count/pins を返します。各項目には gpio/name/description/level/default/modified が含まれます。

### 使用上の注意

任意の GPIO アクセスではなく、ホワイトリストに登録されたピンのみを使用した高度なメンテナンス。

<a id="gpioset"></a>

## gpio.set

GPIO レベルの設定

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/gpio/set`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `pin` | integer | ピンまたは名前が必要です | gpio.list のホワイトリストに登録された GPIO 番号。 | なし |
| `name` | string | ピンまたは名前が必要です | gpio.list のピン名。 | なし |
| `level` | integer | 必須 | 0か1。 | 既定値なし |

### リクエストの例

```json
{
  "name": "AGX_RESET",
  "level": 0
}
```

### 応答と完了

data.gpio/name/level.

### 使用上の注意

ピンによってリセット、強制シャットダウン、USB 経路を操作できます。先に物理的な機能を確認してください。

<a id="gpiotoggle"></a>

## gpio.toggle

GPIO レベルの切り替え

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/gpio/toggle`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `pin` | integer | ピンまたは名前が必要です | gpio.list のホワイトリストに登録された GPIO 番号。 | なし |
| `name` | string | ピンまたは名前が必要です | gpio.list のピン名。 | なし |

### リクエストの例

```json
{
  "name": "AGX_RESET"
}
```

### 応答と完了

data.gpio/name/previous/level.

### 使用上の注意

再度トグルを繰り返します。ネットワークタイムアウト後にむやみに再実行しないでください。

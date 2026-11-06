# コントローラーの状態 API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [system.apis](#systemapis) | 登録されているすべての API をリストします |
| [system.cpu](#systemcpu) | CPU コア統計の取得 |
| [system.info](#systeminfo) | システム情報の取得 |
| [system.log.level](#systemloglevel) | ログレベルを取得・設定する |
| [system.memory](#systemmemory) | メモリ情報の取得 |
| [system.memory_detail](#systemmemory_detail) | 詳細なメモリ分析を取得する |
| [system.reboot](#systemreboot) | システムを再起動します |
| [system.tasks](#systemtasks) | タスクリストの取得 |

<a id="systemapis"></a>

## system.apis

登録されているすべての API をリストします

**メソッド**: GET / POST
**パス**: `/api/v1/system/apis`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.apis は API 名の文字列配列で、total も返されます。従来の監視機能の有無を示すフラグが含まれる場合もあります。

### 使用上の注意

名前リストはパラメータを置換しません/access ドキュメント。

<a id="systemcpu"></a>

## system.cpu

CPU コア統計の取得

**メソッド**: GET / POST
**パス**: `/api/v1/system/cpu`
**最低権限**: パブリック

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.total_usage/cores を返し、各コアには id/usage が含まれます。管理コントローラーの情報であり、推論コンピューターの情報ではありません。

<a id="systeminfo"></a>

## system.info

システム情報の取得

**メソッド**: GET / POST
**パス**: `/api/v1/system/info`
**最低権限**: パブリック

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.app には name/version/idf_version/compile_time/compile_date、chip には model/cores/revision/features が含まれます。flash_size の単位はバイト、uptime_ms はミリ秒です。

<a id="systemloglevel"></a>

## system.log.level

ログレベルを取得・設定する

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/system/log/level`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `level` | integer | 任意 | 0=NONE,1=ERROR,2=WARN,3=INFO,4=DEBUG,5=VERBOSE。 | 変更なし |
| `tag` | string | 任意 | このモジュールのログ レベルのみを変更します。省略するとすべてのモジュールに影響します。 | グローバル |

### リクエストの例

```json
{
  "level": 3
}
```

### 応答と完了

data.status を返します。変更時は level/tag も含まれます。

### 使用上の注意

一時的な診断を目的としています。永続的なファイルのログ記録は約束されていません。

<a id="systemmemory"></a>

## system.memory

メモリ情報の取得

**メソッド**: GET / POST
**パス**: `/api/v1/system/memory`
**最低権限**: パブリック

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.free_heap/min_free_heap はバイトです。内部および使用可能な psram には、total/free/allocated/largest_block (すべてバイト単位) が含まれます。

<a id="systemmemory_detail"></a>

## system.memory_detail

詳細なメモリ分析を取得する

**メソッド**: GET / POST
**パス**: `/api/v1/system/memory_detail`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.dram/psram/iram/dma/static/rtc/nvs/tasks/history/tips 診断グループ。 total/free/used はメモリ統計です。 stack_allocation_estimated は推定を識別します。

### 使用上の注意

一回の診断で得られる推定値は、物理メモリの正確な内訳や、メモリリークの証拠ではありません。

<a id="systemreboot"></a>

## system.reboot

システムを再起動します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/system/reboot`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `delay` | integer | 任意 | ミリ秒単位の遅延。最終的には 100 ～ 10000 に制限されます。 | 500 |

### リクエストの例

```json
{
  "delay": 500
}
```

### 応答と完了

data.status=rebooting、delay_ms、waiting_for_maintenance=false を返します。指定時間の経過後に再起動を要求します。更新完了を待つ API ではありません。

### 使用上の注意

管理接続を中断します。必要な設定を保存し、回復を待って、再度ログインします。

<a id="systemtasks"></a>

## system.tasks

タスクリストの取得

**メソッド**: GET / POST
**パス**: `/api/v1/system/tasks`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.tasks/count を返します。各タスクには name/state/priority/core/stack_hwm が含まれます。stack_hwm は実行環境のスタックの最小空き量を示し、空きメモリ全体ではありません。

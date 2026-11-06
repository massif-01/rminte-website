# 計算リソースの監視 API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [monitor.config](#monitorconfig) | コンピューティング モニター構成の取得 |
| [monitor.data](#monitordata) | 最新の計算リソースのテレメトリ データを取得する |
| [monitor.set_server](#monitorset_server) | コンピューティング監視サーバーの IP とポートを設定します |
| [monitor.start](#monitorstart) | コンピューティング監視の開始 |
| [monitor.status](#monitorstatus) | コンピューティング監視ステータスの取得 |
| [monitor.stop](#monitorstop) | コンピューティング監視の停止 |

<a id="monitorconfig"></a>

## monitor.config

コンピューティング モニター構成の取得

**メソッド**: GET / POST
**パス**: `/api/v1/monitor/config`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.server/port/reconnect_ms/heartbeat_timeout_ms/startup_delay_ms/auto_start/update_temp_source.

<a id="monitordata"></a>

## monitor.data

最新の計算リソースのテレメトリ データを取得する

**メソッド**: GET / POST
**パス**: `/api/v1/monitor/data`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.timestamp、cpu の cores/data（id/usage/freq）、memory の ram/swap の used/total（MB）、temperature の cpu/soc0/soc1/soc2/tj（摂氏）、power の gpu_soc/cpu_cv/sys_5v の current/average（mW）、gpu.gr3d_freq_pct を返します。

### 使用上の注意

有効な計算リソースのデータがない場合は処理エラーになります。これらは計算ホストの測定値です。

<a id="monitorset_server"></a>

## monitor.set_server

コンピューティング監視サーバーの IP とポートを設定します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/monitor/set_server`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `server` | string | 必須 | 監視サーバーのアドレス。 | 既定値なし |
| `port` | integer | 任意 | ポート 1-65535;省略はドライバーのデフォルトに従います。 | 0 はデフォルトの処理を選択します |

### リクエストの例

```json
{
  "server": "192.0.2.20",
  "port": 58090
}
```

### 応答と完了

data.server/port/saved.(練語版)

<a id="monitorstart"></a>

## monitor.start

コンピューティング監視の開始

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/monitor/start`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.started.

<a id="monitorstatus"></a>

## monitor.status

コンピューティング監視ステータスの取得

**メソッド**: GET / POST
**パス**: `/api/v1/monitor/status`
**最低権限**: READ

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.initialized/running/connection/reconnects/messages/errors/reliability/connected_time_ms; last_error が表示される場合があります。

<a id="monitorstop"></a>

## monitor.stop

コンピューティング監視の停止

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/monitor/stop`
**最低権限**: ADMIN

### パラメーター

操作固有のパラメーターはありません。

### リクエストの例

```json
{}
```

### 応答と完了

data.stopped.

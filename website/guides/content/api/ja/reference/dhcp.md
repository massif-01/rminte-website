# アドレス割り当て API

[API 索引](README.md) | [共通ルール](../conventions.md) | [トラブルシューティング](../troubleshooting.md)

例は、説明用の値を使った POST の JSON 本文です。特に断りがない限り、応答の説明は data 内のフィールドを指します。

| API | 目的 |
| --- | --- |
| [dhcp.clients](#dhcpclients) | DHCP クライアントの一覧表示 |
| [dhcp.start](#dhcpstart) | DHCPサーバーを起動します |
| [dhcp.status](#dhcpstatus) | DHCP サーバーのステータスを取得する |
| [dhcp.stop](#dhcpstop) | DHCP サーバーを停止します |

<a id="dhcpclients"></a>

## dhcp.clients

DHCP クライアントの一覧表示

**メソッド**: GET / POST
**パス**: `/api/v1/dhcp/clients`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `interface` | string | 任意 | ap/wifi または eth/ethernet。 | 照会時は全体を集計。開始・停止時は AP |

### リクエストの例

```json
{
  "interface": "ap"
}
```

### 応答と完了

data.clients/count を返します。リースには mac/ip/hostname/lease_start/lease_expire/is_static が含まれます。

<a id="dhcpstart"></a>

## dhcp.start

DHCPサーバーを起動します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/dhcp/start`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `interface` | string | 任意 | ap/wifi または eth/ethernet。 | 照会時は全体を集計。開始・停止時は AP |

### リクエストの例

```json
{
  "interface": "ap"
}
```

### 応答と完了

data.interface/started.

<a id="dhcpstatus"></a>

## dhcp.status

DHCP サーバーのステータスを取得する

**メソッド**: GET / POST
**パス**: `/api/v1/dhcp/status`
**最低権限**: READ

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `interface` | string | 任意 | ap/wifi または eth/ethernet。 | 照会時は全体を集計。開始・停止時は AP |

### リクエストの例

```json
{
  "interface": "ap"
}
```

### 応答と完了

data.interfaces または単一インターフェースに、state/running、pool、gateway/dns/netmask/lease_min、統計情報が含まれます。interface_present/restore_error/apply_error も返されます。eth では want_running/link_up/resume_error が追加されます。エラーコード 0 は、その段階でエラーが報告されなかったことを示します。

### 使用上の注意

want_running は要求された状態であり、実際の running ではありません。インターフェースの存在、リンク、復旧エラーを別々に確認してください。アドレスを取得できただけでは不十分です。

<a id="dhcpstop"></a>

## dhcp.stop

DHCP サーバーを停止します

**メソッド**: POST / PUT / DELETE
**パス**: `/api/v1/dhcp/stop`
**最低権限**: ADMIN

### パラメーター

| フィールド | 型 | 要件 | 意味 | 省略時 |
| --- | --- | --- | --- | --- |
| `interface` | string | 任意 | ap/wifi または eth/ethernet。 | 照会時は全体を集計。開始・停止時は AP |

### リクエストの例

```json
{
  "interface": "ap"
}
```

### 応答と完了

data.interface/stopped.

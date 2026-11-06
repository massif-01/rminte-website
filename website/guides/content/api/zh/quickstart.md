# 快速接入

本节完成三件事：连接设备、登录、读取一条受保护的状态。除建立和退出登录会话外，只执行查询，不改变设备设置。

## 准备设备地址

使用设备当前的 IP 地址访问。默认通过 HTTP 80 端口提供 WebUI 和业务 API，一般无需额外填写端口号。API 路径前缀为 `/api/v1`。下面以 `10.10.99.97` 为例，实际使用时替换成你的设备地址：

```sh
export TS_BASE='http://10.10.99.97'
```

无法连接时先核对 IP、网络连通性和服务状态，见[连接问题](troubleshooting.md#无法连接设备)。

## 查询控制器信息

```sh
curl --connect-timeout 5 --max-time 15 \
  "$TS_BASE/api/v1/system/info"
```

响应示例节选如下。字段结构按实现整理，数值用于演示：

```json
{
  "code": 0,
  "data": {
    "app": {
      "name": "TianShanOS",
      "version": "0.6.4",
      "compile_date": "Nov 5 2026",
      "compile_time": "10:00:00"
    },
    "chip": {"model": "ESP32-S3", "cores": 2},
    "uptime_ms": 123456
  }
}
```

先检查 HTTP 状态，再检查 `code`。`code:0` 表示本次接口层调用成功；版本在 `data.app.version`，运行时间 `uptime_ms` 的单位为毫秒。不要假设版本号一定处于 `data.version`。

## 登录并保存会话

默认账户为 `admin` 和 `root`，初始默认密码均为 `rm01`。使用相应账户登录后即可按其权限调用 API；若你已修改密码，使用当前密码。

先设置 `umask 077`，再创建只供自己读取的 `login.json` 文件。下面以默认 admin 账户为例：

```json
{"username":"admin","password":"rm01"}
```

```sh
umask 077
curl --connect-timeout 5 --max-time 15 \
  -H 'Content-Type: application/json' \
  --data-binary @login.json \
  "$TS_BASE/api/v1/auth/login" > login-response.json
```

成功响应的 `data` 包含 `token`、`session_id`、`username`、`level`、`expires_in` 和 `password_changed`。`token` 是后续请求使用的会话凭据；`session_id` 是编号，不能代替 Token。`expires_in` 以秒表示。

```sh
export TS_TOKEN="$(python3 -c 'import json; r=json.load(open("login-response.json")); assert r["code"] == 0; print(r["data"]["token"])')"
```

登录后使用返回的 Token 继续调用接口，权限以 `data.level` 及接口授权结果为准。更改密码是按需执行的账户管理操作，使用 `auth.change_password`。

密码文件、登录响应和 Token 都应按凭据管理；示例使用结束后删除临时凭据文件。

## 查询受保护的温度读数

```sh
curl --connect-timeout 5 --max-time 15 \
  -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/temp/read"
```

```json
{
  "code": 0,
  "data": {
    "temperature_c": 42.5,
    "temperature_01c": 425,
    "source": "variable",
    "timestamp_ms": 120000,
    "valid": true
  }
}
```

这是响应节选。`temperature_c` 是摄氏度；`temperature_01c` 是十分之一摄氏度，二者表示同一读数。仅在 `valid:true` 时将其作为有效温度。无有效数据时先查看温度源，不要把缺失或无效读数当作 0°C。

## 退出

```sh
curl --connect-timeout 5 --max-time 15 \
  -X POST -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/auth/logout"
unset TS_TOKEN
```

POST 退出返回 `{"success":true}`，与通用接口的 `code/data` 包装不同。退出后已有脚本和长连接需重新取得有效会话。

下一步：选一个[完整场景](scenarios.md)，或使用[Python 只读示例](examples/read_status.py)。

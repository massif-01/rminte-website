# 升级与恢复接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [ota.abort](#otaabort) | 请求取消固件升级 |
| [ota.partitions](#otapartitions) | 读取升级分区 |
| [ota.progress](#otaprogress) | 读取固件升级进度 |
| [ota.rollback](#otarollback) | 回滚至另一固件 |
| [ota.server.get](#otaserverget) | 读取升级服务器配置 |
| [ota.server.set](#otaserverset) | 配置升级服务器 |
| [ota.start_file](#otastart_file) | 从SD卡启动固件升级 |
| [ota.start_url](#otastart_url) | 从服务器启动固件升级 |
| [ota.status](#otastatus) | 读取固件升级总览 |
| [ota.test_connection](#otatest_connection) | 测试升级文件连接 |
| [ota.upgrade_file](#otaupgrade_file) | 从SD卡启动固件升级 |
| [ota.upgrade_url](#otaupgrade_url) | 从服务器启动固件升级 |
| [ota.upload_abort](#otaupload_abort) | 中止固件上传控制 |
| [ota.upload_begin](#otaupload_begin) | 开始固件上传控制 |
| [ota.upload_end](#otaupload_end) | 结束固件上传控制 |
| [ota.validate](#otavalidate) | 确认当前固件 |
| [ota.version](#otaversion) | 读取固件版本 |
| [ota.www.abort](#otawwwabort) | 请求取消网页资源升级 |
| [ota.www.progress](#otawwwprogress) | 读取网页资源升级进度 |
| [ota.www.start](#otawwwstart) | 从服务器启动网页资源升级 |
| [ota.www.start_sdcard](#otawwwstart_sdcard) | 从SD卡启动网页资源升级 |

<a id="otaabort"></a>

## ota.abort

请求取消固件升级

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ota/abort`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.aborted=true；继续读取对应进度确认状态。

### 使用要点

作用于当前升级；不要把它当作仅取消某个私有任务。不要在状态未明确时马上开始新升级。

<a id="otapartitions"></a>

## ota.partitions

读取升级分区

**方法**：GET / POST
**路径**：`/api/v1/ota/partitions`
**最低权限**：READ

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.running/next各含label/address/size/is_bootable；可启动时有version/project，另含can_rollback。

<a id="otaprogress"></a>

## ota.progress

读取固件升级进度

**方法**：GET / POST
**路径**：`/api/v1/ota/progress`
**最低权限**：READ

### 参数

无业务参数。

共享字段或返回说明见[数据模型](../response-models.md#ota).

### 请求示例

```json
{}
```

### 返回与完成条件

data.state/percent/total_size/received_size/message。state为idle/checking/downloading/verifying/writing/pending_reboot/error。

### 使用要点

这是设备全局进度，不按登录会话区分任务。启动成功后继续查询状态；100%不单独证明设备已运行新版本。

<a id="otarollback"></a>

## ota.rollback

回滚至另一固件

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ota/rollback`
**最低权限**：ADMIN

### 参数

无业务参数。

共享字段或返回说明见[数据模型](../response-models.md#ota).

### 请求示例

```json
{}
```

### 返回与完成条件

尝试选择回滚分区并重启；连接可能先于响应中断。若有返回，data.rolling_back=true。

### 使用要点

先查ota.partitions的can_rollback；回滚后重新登录，核对版本和配置兼容性。不支持no_reboot参数。

<a id="otaserverget"></a>

## ota.server.get

读取升级服务器配置

**方法**：GET / POST
**路径**：`/api/v1/ota/server/get`
**最低权限**：READ

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

ADMIN可读data.url/configured；较低角色只获得configured。

<a id="otaserverset"></a>

## ota.server.set

配置升级服务器

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ota/server/set`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `url` | string | 必填 | 升级服务器URL，最多255字符；空字符串清除地址。 | 无默认值 |
| `save` | boolean | 可选 | 是否持久保存服务器地址。 | false |

### 请求示例

```json
{
  "url": "http://updates.example.com/firmware.bin",
  "save": true
}
```

### 返回与完成条件

data.url/saved。

### 使用要点

设置地址不会开始升级；网页镜像URL可由此地址推导。

<a id="otastart_file"></a>

## ota.start_file

从SD卡启动固件升级

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ota/start_file`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `file` | string | file/path至少一个 | 固件文件绝对路径；推荐file。 | 无默认值 |
| `path` | string | 可选 | file的兼容名称。 | 不提供 |
| `auto_reboot` | boolean | 可选 | 固件完成后是否自动重启。 | true |
| `no_reboot` | boolean | 可选 | auto_reboot的反向兼容选项；提供时覆盖auto_reboot。 | 不覆盖 |
| `allow_downgrade` | boolean | 可选 | 允许安装较旧版本；仍需通过镜像检查。 | false |
| `skip_verify` | boolean | 可选 | SD文件流程的兼容选项；没有TLS连接，不能用它跳过固件完整性检查。 | false |

共享字段或返回说明见[数据模型](../response-models.md#ota).

### 请求示例

```json
{
  "file": "/sdcard/firmware.bin",
  "no_reboot": true
}
```

### 返回与完成条件

data.started/path。

### 使用要点

启动成功只表示请求已开始；读取ota.progress并在重启后核对ota.status。使用适合本硬件和分区的完整镜像。

<a id="otastart_url"></a>

## ota.start_url

从服务器启动固件升级

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ota/start_url`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `url` | string | 必填 | 完整固件文件的HTTP或HTTPS地址，最多2048字节。 | 无默认值 |
| `auto_reboot` | boolean | 可选 | 固件完成后是否自动重启。 | true |
| `no_reboot` | boolean | 可选 | auto_reboot的反向兼容选项；提供时覆盖auto_reboot。 | 不覆盖 |
| `allow_downgrade` | boolean | 可选 | 允许安装较旧版本；仍需通过镜像检查。 | false |
| `skip_verify` | boolean | 可选 | 请求放宽HTTPS服务器校验，受固件TLS配置限制，仍可能连接失败；不影响镜像完整性检查。一般保持false。 | false |

共享字段或返回说明见[数据模型](../response-models.md#ota).

### 请求示例

```json
{
  "url": "http://updates.example.com/firmware.bin",
  "no_reboot": true
}
```

### 返回与完成条件

data.started/url。

### 使用要点

启动成功只表示请求已开始；读取ota.progress并在重启后核对ota.status。使用适合本硬件和分区的完整镜像。

<a id="otastatus"></a>

## ota.status

读取固件升级总览

**方法**：GET / POST
**路径**：`/api/v1/ota/status`
**最低权限**：READ

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.state/running/next/pending_verify；待验证时含rollback_timeout。分区含label/address/size及可用的版本信息。

### 使用要点

size单位为字节；成功写入后仍需重启并核对运行版本。

<a id="otatest_connection"></a>

## ota.test_connection

测试升级文件连接

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ota/test_connection`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `url` | string | 必填 | 要探测的升级文件URL。 | 无默认值 |

### 请求示例

```json
{
  "url": "http://updates.example.com/firmware.bin"
}
```

### 返回与完成条件

data为连接探测结果，含success及诊断信息。

### 使用要点

探测会进行真实网络访问；可连接不代表镜像可安装。

<a id="otaupgrade_file"></a>

## ota.upgrade_file

从SD卡启动固件升级

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ota/upgrade_file`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `file` | string | file/path至少一个 | 固件文件绝对路径；推荐file。 | 无默认值 |
| `path` | string | 可选 | file的兼容名称。 | 不提供 |
| `auto_reboot` | boolean | 可选 | 固件完成后是否自动重启。 | true |
| `no_reboot` | boolean | 可选 | auto_reboot的反向兼容选项；提供时覆盖auto_reboot。 | 不覆盖 |
| `allow_downgrade` | boolean | 可选 | 允许安装较旧版本；仍需通过镜像检查。 | false |
| `skip_verify` | boolean | 可选 | SD文件流程的兼容选项；没有TLS连接，不能用它跳过固件完整性检查。 | false |

共享字段或返回说明见[数据模型](../response-models.md#ota).

### 请求示例

```json
{
  "file": "/sdcard/firmware.bin",
  "no_reboot": true
}
```

### 返回与完成条件

data.started/path。

### 使用要点

兼容名称，参数、权限和结果与 ota.start_file 相同。

<a id="otaupgrade_url"></a>

## ota.upgrade_url

从服务器启动固件升级

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ota/upgrade_url`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `url` | string | 必填 | 完整固件文件的HTTP或HTTPS地址，最多2048字节。 | 无默认值 |
| `auto_reboot` | boolean | 可选 | 固件完成后是否自动重启。 | true |
| `no_reboot` | boolean | 可选 | auto_reboot的反向兼容选项；提供时覆盖auto_reboot。 | 不覆盖 |
| `allow_downgrade` | boolean | 可选 | 允许安装较旧版本；仍需通过镜像检查。 | false |
| `skip_verify` | boolean | 可选 | 请求放宽HTTPS服务器校验，受固件TLS配置限制，仍可能连接失败；不影响镜像完整性检查。一般保持false。 | false |

共享字段或返回说明见[数据模型](../response-models.md#ota).

### 请求示例

```json
{
  "url": "http://updates.example.com/firmware.bin",
  "no_reboot": true
}
```

### 返回与完成条件

data.started/url。

### 使用要点

兼容名称，参数、权限和结果与 ota.start_url 相同。

<a id="otaupload_abort"></a>

## ota.upload_abort

中止固件上传控制

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ota/upload_abort`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.aborted。

<a id="otaupload_begin"></a>

## ota.upload_begin

开始固件上传控制

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ota/upload_begin`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `size` | integer | 必填 | 完整固件总字节数，正整数；还受备用分区容量限制。 | 无默认值 |

### 请求示例

```json
{
  "size": 1048576
}
```

### 返回与完成条件

data.ready/expected_size。

### 使用要点

这是上传控制接口；公开API未提供upload_write数据写入名称，不能只用begin/end传输固件。普通集成使用完整文件直传路由。

<a id="otaupload_end"></a>

## ota.upload_end

结束固件上传控制

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ota/upload_end`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `auto_reboot` | boolean | 可选 | 完成后是否自动重启。 | true |

### 请求示例

```json
{
  "auto_reboot": false
}
```

### 返回与完成条件

data.completed/reboot_pending。

### 使用要点

仅适用于已有且已写入完整数据的上传；无活动上传会失败。

<a id="otavalidate"></a>

## ota.validate

确认当前固件

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ota/validate`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.validated。

### 使用要点

确认会改变回滚状态；先确认当前运行版本及业务健康。

<a id="otaversion"></a>

## ota.version

读取固件版本

**方法**：GET / POST
**路径**：`/api/v1/ota/version`
**最低权限**：无需登录

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.version/project/compile_date/compile_time/idf_version。

<a id="otawwwabort"></a>

## ota.www.abort

请求取消网页资源升级

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ota/www/abort`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.aborted=true；继续读取对应进度确认状态。

### 使用要点

作用于当前升级；不要把它当作仅取消某个私有任务。不要在状态未明确时马上开始新升级。

<a id="otawwwprogress"></a>

## ota.www.progress

读取网页资源升级进度

**方法**：GET / POST
**路径**：`/api/v1/ota/www/progress`
**最低权限**：READ

### 参数

无业务参数。

共享字段或返回说明见[数据模型](../response-models.md#ota).

### 请求示例

```json
{}
```

### 返回与完成条件

data.state/percent/total/received/message/running。完成时state=completed且running=false。

### 使用要点

这是设备全局进度，不按登录会话区分任务。启动成功后继续查询状态；100%不单独证明设备已运行新版本。

<a id="otawwwstart"></a>

## ota.www.start

从服务器启动网页资源升级

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ota/www/start`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `url` | string | 可选 | www.bin文件的HTTP或HTTPS地址。集成时限制在255字节内，较长输入可能无法完整保留。 | 由已配置升级服务器地址推导 |
| `skip_verify` | boolean | 可选 | 请求放宽HTTPS服务器校验，受固件TLS配置限制，仍可能连接失败；不影响镜像完整性检查。一般保持false。 | false |

共享字段或返回说明见[数据模型](../response-models.md#ota).

### 请求示例

```json
{
  "url": "http://updates.example.com/www.bin"
}
```

### 返回与完成条件

data.status=started/url。

### 使用要点

使用与固件配套的完整www.bin；它不是可单独上传的HTML文件。随后读取ota.www.progress。

<a id="otawwwstart_sdcard"></a>

## ota.www.start_sdcard

从SD卡启动网页资源升级

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/ota/www/start_sdcard`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `file` | string | 必填 | 网页资源镜像的绝对文件路径。集成时限制在255字节内，较长输入可能无法完整保留。 | 无默认值 |

共享字段或返回说明见[数据模型](../response-models.md#ota).

### 请求示例

```json
{
  "file": "/sdcard/www.bin"
}
```

### 返回与完成条件

data.status=started/file。

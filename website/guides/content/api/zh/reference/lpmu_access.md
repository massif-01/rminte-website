# 应用计算机网络配置接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [network.lpmu_access.log](#networklpmu_accesslog) | 分段读取网络配置日志 |
| [network.lpmu_access.start](#networklpmu_accessstart) | 启动应用计算机网络接入配置 |
| [network.lpmu_access.status](#networklpmu_accessstatus) | 查询网络配置任务 |

<a id="networklpmu_accesslog"></a>

## network.lpmu_access.log

分段读取网络配置日志

**方法**：GET / POST
**路径**：`/api/v1/network/lpmu_access/log`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `run_id` | integer | 必填 | start或status返回的当前运行编号。 | 无默认值 |
| `offset` | integer | 必填 | 非负字节偏移；首次0。 | 无默认值 |

### 请求示例

```json
{
  "run_id": 1,
  "offset": 0
}
```

### 返回与完成条件

data.run_id/output/next_offset/done；下一次使用next_offset。

### 使用要点

每块最多1024字节；旧run_id会拒绝，done表示当前日志已读到末尾，仍要检查任务状态。

<a id="networklpmu_accessstart"></a>

## network.lpmu_access.start

启动应用计算机网络接入配置

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/network/lpmu_access/start`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `sudo_password` | string | 可选 | 远端需要的sudo密码，仅用于本次执行。 | 空 |

### 请求示例

```json
{}
```

### 返回与完成条件

data.run_id/running/stage；继续查询status与log。

### 使用要点

固定目标10.10.99.99:22，依赖已保存主机和SSH密钥；同一时间一个任务。会实际修改远端网络。

<a id="networklpmu_accessstatus"></a>

## network.lpmu_access.status

查询网络配置任务

**方法**：GET / POST
**路径**：`/api/v1/network/lpmu_access/status`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `diagnostics` | boolean | 可选 | 是否带额外耗时/资源统计。 | false |

### 请求示例

```json
{}
```

### 返回与完成条件

data.run_id/running/stage、传输字节、exit_code/reason/failure_stage、internet_confirmed/configuration_complete、output_tail/output_truncated；诊断字段仅在请求时提供。

### 使用要点

成功需最终阶段及脚本确认；排队或脚本退出0不能单独代替网络配置完成。

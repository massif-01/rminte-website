# 供电和保护接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [power.chip](#powerchip) | 读取电源芯片数据 |
| [power.debug](#powerdebug) | 开关供电调试 |
| [power.interval.set](#powerintervalset) | 设置电压采样间隔 |
| [power.monitor.start](#powermonitorstart) | 启动供电采样 |
| [power.monitor.stop](#powermonitorstop) | 停止供电采样 |
| [power.protection.config](#powerprotectionconfig) | 读取电压保护配置 |
| [power.protection.set](#powerprotectionset) | 配置电压保护 |
| [power.protection.status](#powerprotectionstatus) | 读取保护运行状态 |
| [power.stats](#powerstats) | 读取采样统计 |
| [power.stats.reset](#powerstatsreset) | 清零供电统计 |
| [power.status](#powerstatus) | 读取供电总览 |
| [power.threshold.set](#powerthresholdset) | 设置电压监测阈值 |
| [power.voltage](#powervoltage) | 读取供电电压 |

<a id="powerchip"></a>

## power.chip

读取电源芯片数据

**方法**：GET / POST
**路径**：`/api/v1/power/chip`
**最低权限**：无需登录

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.voltage_v/current_a/power_w、valid、crc_valid、timestamp_ms、raw_data。只用有效且校验通过的数据。

<a id="powerdebug"></a>

## power.debug

开关供电调试

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/power/debug`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `enable` | boolean | 必填 | 是否打开调试输出。 | 无默认值 |

### 请求示例

```json
{
  "enable": false
}
```

### 返回与完成条件

data.debug_enabled。

<a id="powerintervalset"></a>

## power.interval.set

设置电压采样间隔

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/power/interval/set`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `interval_ms` | integer | 必填 | 采样间隔，毫秒；以设备接受范围为准，过小值会被拒绝。 | 无默认值 |

### 请求示例

```json
{
  "interval_ms": 1000
}
```

### 返回与完成条件

data.interval_ms。

<a id="powermonitorstart"></a>

## power.monitor.start

启动供电采样

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/power/monitor/start`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.running。

### 使用要点

停止采样会影响后续读数更新；应同时检查保护策略所需数据。

<a id="powermonitorstop"></a>

## power.monitor.stop

停止供电采样

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/power/monitor/stop`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.running。

### 使用要点

停止采样会影响后续读数更新；应同时检查保护策略所需数据。

<a id="powerprotectionconfig"></a>

## power.protection.config

读取电压保护配置

**方法**：GET / POST
**路径**：`/api/v1/power/protection/config`
**最低权限**：READ

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.low_voltage_threshold/recovery_voltage_threshold（V）、shutdown_delay_sec/recovery_hold_sec/fan_stop_delay_sec（秒），以及 defaults。

<a id="powerprotectionset"></a>

## power.protection.set

配置电压保护

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/power/protection/set`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `enable` | boolean | 可选 | 启动或停止保护；出现该字段时总会保存启用状态。 | 省略时不修改 |
| `low_threshold` | number | 可选 | 低压阈值，V。 | 省略时不修改 |
| `recovery_threshold` | number | 可选 | 恢复阈值，V。 | 省略时不修改 |
| `shutdown_delay` | integer | 可选 | 低压关机等待，秒。 | 省略时不修改 |
| `recovery_hold` | integer | 可选 | 恢复条件持续时间，秒。 | 省略时不修改 |
| `fan_stop_delay` | integer | 可选 | 设备关闭后风扇延迟，秒。 | 省略时不修改 |
| `persist` | boolean | 可选 | 仅修改参数时设true保存；仅enable变更也会自动保存。 | false |

### 请求示例

```json
{
  "persist": true
}
```

### 返回与完成条件

data.low_threshold_v/recovery_threshold_v/running/persisted。

### 使用要点

会影响保护及自动关机行为。设置可能部分生效后失败，先回读配置与状态。

<a id="powerprotectionstatus"></a>

## power.protection.status

读取保护运行状态

**方法**：GET / POST
**路径**：`/api/v1/power/protection/status`
**最低权限**：无需登录

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.initialized/running/state/current_voltage_v/countdown_remaining_sec/recovery_timer_sec/protection_count/uptime_ms；devices 含 agx_powered/lpmu_powered/agx_connected。

### 使用要点

initialized=false 时不能假定保护已启动。

<a id="powerstats"></a>

## power.stats

读取采样统计

**方法**：GET / POST
**路径**：`/api/v1/power/stats`
**最低权限**：READ

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.voltage_samples/power_chip_packets/crc_errors/timeout_errors/threshold_violations/avg_voltage_v/avg_current_a/avg_power_w/uptime_ms。

<a id="powerstatsreset"></a>

## power.stats.reset

清零供电统计

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/power/stats/reset`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.reset。

### 使用要点

只重置统计，不等于重新校准传感器。

<a id="powerstatus"></a>

## power.status

读取供电总览

**方法**：GET / POST
**路径**：`/api/v1/power/status`
**最低权限**：无需登录

### 参数

无业务参数。

共享字段或返回说明见[数据模型](../response-models.md#power).

### 请求示例

```json
{}
```

### 返回与完成条件

data.voltage 为电压；power_chip 含 voltage_v/current_a/power_w/valid/crc_valid；protection 为保护状态；stats 为汇总；monitoring_active 为采样状态。

<a id="powerthresholdset"></a>

## power.threshold.set

设置电压监测阈值

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/power/threshold/set`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `min_v` | number | 必填 | 最小电压，V。 | 无默认值 |
| `max_v` | number | 必填 | 最大电压，V；须大于最小值。 | 无默认值 |

### 请求示例

```json
{
  "min_v": 12,
  "max_v": 24
}
```

### 返回与完成条件

data.min_v/max_v。

### 使用要点

监测阈值与电压保护策略分别管理，后者使用 power.protection.set。

<a id="powervoltage"></a>

## power.voltage

读取供电电压

**方法**：GET / POST
**路径**：`/api/v1/power/voltage`
**最低权限**：无需登录

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `now` | boolean | 可选 | true 请求立即采样；false 读取最近值。 | false |

### 请求示例

```json
{}
```

### 返回与完成条件

data.voltage_v（V）、voltage_mv（mV）、adc_raw、timestamp_ms。

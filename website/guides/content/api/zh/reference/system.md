# 控制器状态接口

[全部接口](README.md) · [调用规则](../conventions.md) · [故障处理](../troubleshooting.md)

以下示例作为POST JSON body发送；占位内容需替换。返回说明均指外层data（另有明确说明除外）。

| 接口 | 功能 |
| --- | --- |
| [system.apis](#systemapis) | 读取当前注册名称 |
| [system.cpu](#systemcpu) | 读取控制器 CPU 使用情况 |
| [system.info](#systeminfo) | 读取管理控制器信息 |
| [system.log.level](#systemloglevel) | 调整系统日志级别 |
| [system.memory](#systemmemory) | 读取控制器内存 |
| [system.memory_detail](#systemmemory_detail) | 读取内存诊断明细 |
| [system.reboot](#systemreboot) | 重启管理控制器 |
| [system.tasks](#systemtasks) | 查看控制器任务 |

<a id="systemapis"></a>

## system.apis

读取当前注册名称

**方法**：GET / POST
**路径**：`/api/v1/system/apis`
**最低权限**：READ

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.apis 是名称字符串数组，total 是数量；还可能附兼容的 monitor 存在标记。

### 使用要点

名称清单不能代替本稿的参数和权限说明。

<a id="systemcpu"></a>

## system.cpu

读取控制器 CPU 使用情况

**方法**：GET / POST
**路径**：`/api/v1/system/cpu`
**最低权限**：无需登录

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.total_usage、cores；每核含 id、usage 等统计。它们属于管理控制器，不是推理计算机指标。

<a id="systeminfo"></a>

## system.info

读取管理控制器信息

**方法**：GET / POST
**路径**：`/api/v1/system/info`
**最低权限**：无需登录

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.app 含 name/version/idf_version/compile_time/compile_date；data.chip 含 model/cores/revision/features；另有 flash_size（字节）、uptime_ms。

<a id="systemloglevel"></a>

## system.log.level

调整系统日志级别

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/system/log/level`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `level` | integer | 可选 | 0=NONE，1=ERROR，2=WARN，3=INFO，4=DEBUG，5=VERBOSE。 | 省略时不修改 |
| `tag` | string | 可选 | 只调整指定模块日志；省略影响全局。 | 全局 |

### 请求示例

```json
{
  "level": 3
}
```

### 返回与完成条件

data 含 status，调整时附 level/tag。

### 使用要点

适合临时诊断；并不承诺将日志持久保存到文件。

<a id="systemmemory"></a>

## system.memory

读取控制器内存

**方法**：GET / POST
**路径**：`/api/v1/system/memory`
**最低权限**：无需登录

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.free_heap、min_free_heap 是字节数；internal 与存在时的 psram 分别含 total/free/allocated/largest_block，单位均为字节。

<a id="systemmemory_detail"></a>

## system.memory_detail

读取内存诊断明细

**方法**：GET / POST
**路径**：`/api/v1/system/memory_detail`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data 含 dram/psram/iram/dma/static/rtc/nvs、tasks、history 与 tips 等诊断分组。各组的 total/free/used 等为内存统计，估算字段同时提供 stack_allocation_estimated。

### 使用要点

诊断快照的估算值不是物理内存使用的精确分解，避免据单次读数判断泄漏。

<a id="systemreboot"></a>

## system.reboot

重启管理控制器

**方法**：POST / PUT / DELETE
**路径**：`/api/v1/system/reboot`
**最低权限**：ADMIN

### 参数

| 字段 | 类型 | 要求 | 含义 | 省略时 |
| --- | --- | --- | --- | --- |
| `delay` | integer | 可选 | 延迟毫秒，最终限制在100–10000。 | 500 |

### 请求示例

```json
{
  "delay": 500
}
```

### 返回与完成条件

data.status=rebooting、delay_ms、waiting_for_maintenance=false；本接口按延迟请求重启，不等待升级流程结束。

### 使用要点

会中断管理连接。先保存需要的配置；返回后等待设备恢复并重新登录。

<a id="systemtasks"></a>

## system.tasks

查看控制器任务

**方法**：GET / POST
**路径**：`/api/v1/system/tasks`
**最低权限**：ADMIN

### 参数

无业务参数。

### 请求示例

```json
{}
```

### 返回与完成条件

data.tasks 数组及 count；各任务含 name/state/priority/core/stack_hwm。stack_hwm 是固件原生栈水位统计，不要直接当剩余总内存。

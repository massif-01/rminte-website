# 常用返回模型

下面描述 `data` 内的字段；外层 HTTP 状态与 `code` 的处理见[通用规则](conventions.md)。字段随设备状态、功能初始化和调用者角色变化。没有读到字段时保留“未知”，不要自动补成 `0` 或 `false`。

## temperature

| 字段 | 读法 |
| --- | --- |
| `temperature_c`、`temperature_01c` | 摄氏度、十分之一摄氏度，表示同一个量 |
| `valid` | 当前值是否可用；为 `false` 时，不作为正常温度参与判断 |
| `source`、`active_source`、`preferred_source` | 分别表示本次来源、实际来源、首选来源；具体接口命名不同 |
| `timestamp_ms`、`last_update_ms` | 本次设备启动后的时间，不是 Unix 时间 |
| `stale`、`age_ms` | 分别表示数据是否陈旧、已经过的毫秒数；`null` 可能表示从未更新 |
| `partial_stale`、`valid_count`、`stale_count` | 多变量绑定中部分来源失效；不能只看平均数 |

系统会限制有效温度范围。温度输入可来自本地传感器、算力遥测、变量或手动测试。读到手动值，不证明物理温度就是该值。

## fan

调用 `fan.status` 时，指定 `id` 返回一个风扇对象；省略 `id` 返回含有 `fans`、`temperature`、`temp_valid`、`temp_source` 的对象，其中 `fans` 是风扇列表。

| 字段 | 类型、单位与读法 |
| --- | --- |
| `id` | 风扇编号 |
| `mode` | 模式：`off`、`manual`、`auto`、`curve` |
| `duty_valid`、`duty` | 分别表示输出有效性、实际已知占空比（%）；未知时 `duty` 为 `null` |
| `target_duty` | 控制器目标输出（%），可能与实际输出不同 |
| `rpm` | 转速，转/分钟；要结合测速能力和故障状态判断 |
| `enabled`、`running`、`fault` | 分别表示启用、运行、故障；未知运行状态可以是 `null` |
| `temperature` | 此风扇控制相关温度，°C |
| `control_temperature`、`guard_temperature`、`predicted_temperature` | 分别表示控制、保护、预测使用的温度，°C |
| `slope_c_per_min` | 温度变化率，°C/分钟 |
| `auto_state`、`guard_active`、`temp_stale` | 分别表示自动控制阶段、保护是否生效、温度是否陈旧 |
| `controller_gain`、`cooling_response` | 控制器诊断量；不将其当作转速或温度 |

写配置返回的 `applied`、`persisted` 分别表示应用和保存。请求 50% 不能当作硬件已经产生 50% 的有效输出。

## power

`power.status` 聚合电压、电源芯片、保护和统计。查看细节时，分别使用 `power.voltage`、`power.chip`、`power.protection.status`。

| 字段 | 单位或意义 |
| --- | --- |
| `voltage_v`、`current_a`、`power_w` | 分别为 V、A、W |
| `voltage_mv` | mV，数值不能直接与 V 比较 |
| `valid`、`crc_valid` | 分别表示数据有效、通信校验有效；电源芯片数据需同时检查两项 |
| `timestamp_ms` | 启动后毫秒数 |
| `state`、`countdown_remaining_sec` | 分别表示保护阶段、保护倒计时秒数 |
| `initialized`、`running` | 分别表示保护是否完成初始化、是否正在运行 |

`device.power.status` 使用另一种电源轨模型：

| 字段 | 单位或意义 |
| --- | --- |
| `rails` 中的 `voltage_mv`、`current_ma`、`power_mw` | 分别为 mV、mA、mW |
| `total_power_mw` | 汇总功率，mW |

算力监控的 `power` 同样可能采用 mW，以字段页标注为准。

## config-result

对象保存、配置来源切换等操作会返回一组状态。并非每个接口每次都返回全部字段。

| 字段 | 意义 |
| --- | --- |
| `active_version` | 当前配置版本；下一次修改使用本次返回的新值 |
| `source` | 当前活动配置来源 |
| `loaded`、`configured`、`enabled`、`paused` | 分别表示已加载、已有配置、已启用、已暂停，是不同状态 |
| `saved`、`uncertain` | 分别表示是否完成保存、保存结果是否不确定 |
| `load_error`、`internal_error` | 活动配置或内部备份的错误 |
| `sd_available`、`internal_exists`、`internal_valid` | 分别表示 SD 可用、内部备份存在、内部备份有效 |
| `comparison_known`、`backup_matches` | 分别表示是否能比较、备份是否相同；比较结果未知时，不能当作相同 |
| `awaiting_sd_choice` | 需要选择是否采用 SD 配置 |
| `internal_saved_at` | 内部备份的保存时间信息 |
| `collection`、`id`、`dependency` | 操作关联的集合、对象、依赖位置 |
| `impact` | 删除或替换会影响的引用与运行记录 |

导入预览的 `package_digest`、`credential_generation` 是正式应用的校验条件，不是可复用的全局授权。`restart_required=false` 也不能替代对 `loaded`、`enabled` 和运行任务状态的确认。

## variable

变量返回对象包含以下字段，部分字段可能不返回：

| 字段 | 读法 |
| --- | --- |
| `name` | 变量名 |
| `type`、`value_type` | 类型字段，具体命名随接口而定 |
| `value` | 变量值 |
| `source_id`、`persistent`、`readonly`、`flags` | 可能附带的来源、持久化、只读和标志信息 |
| `last_change_ms`、`last_update_ms`、`age_ms`、`stale` | 可能附带的变更、更新、数据年龄和陈旧状态信息 |

调用 `variables.list` 时，`include_value` 选择是否返回值，`include_meta` 选择是否返回元数据。不要因为 `value` 字段没有返回，就推断变量值为 `null`。

## certificate

`cert.status` 分开报告证书材料、设备证书信息和独立 HTTPS 诊断服务状态：

| 字段或信息 | 读法 |
| --- | --- |
| `has_private_key` | 是否有设备私钥 |
| `has_certificate` | 是否有设备证书 |
| `has_ca_chain` | 是否有 CA 证书链 |
| 设备证书信息、独立 HTTPS 诊断服务状态 | 分开报告，不能互相替代 |
| `time_ready` | 证书有效性可能依赖可信时间；尚未建立可信时间时，不能把“未判定”当作有效 |

设备证书、独立 HTTPS 诊断服务实际加载的身份、诊断客户端是否信任它，是三个问题。安装后读取服务状态；需要重载时，按维护流程处理。业务 API 仍通过 HTTP 访问，其 Bearer 角色与 mTLS 诊断角色分开。

## color

RGB 分量范围为 0–255。`led.fill` 等直接颜色参数接受以下形式：

- 支持的颜色字符串。
- 含有 `r`、`g`、`b` 的对象。
- `0xRRGGBB` 对应的十进制整数；JSON 不能直接写十六进制数字。

`led.color.hsv` 的 `h` 为 0–359 度，`s`、`v` 为 0–255，均不是百分比。

颜色校正返回一个配置对象。修改时使用相同的子对象结构：

| 字段或子对象 | 内容与限制 |
| --- | --- |
| `enabled` | 颜色校正的启用状态 |
| `white_point` | 包含 `enabled`、`red_scale`、`green_scale`、`blue_scale` |
| `gamma` | 包含 `enabled`、`gamma`；`gamma` 范围为 0.1–4 |
| `brightness`、`saturation` | 均包含 `enabled`、`factor` |
| 比例值 | 范围为 0–2 |

普通设备 `brightness` 的 0–255 与校正 `factor` 不是一种单位。

## ota

通过 URL 或 SD 启动更新后，读取 `ota.progress`。它是设备全局状态，没有每个会话独立的操作回执。

| 对象 | 字段与完成条件 |
| --- | --- |
| APP 进度 | 包含 `state`、`percent`、`total_size`、`received_size`、`message`；`pending_reboot` 表示等待重启 |
| WWW 进度 | 包含 `state`、`percent`、`total`、`received`、`message`、`running`；完成时 `state=completed` 且 `running=false` |

进度达到 100%，不能单独证明设备已运行新版本。

| 分区或取消信息 | 读法 |
| --- | --- |
| `label`、`address`、`size` | 分区信息，还包括可启动状态 |
| `version`、`project` | 可用时返回的版本和项目信息 |
| `can_rollback` | 当前是否具备回滚条件 |
| `aborted` | 本次取消调用的反馈；随后继续确认进度与现状 |

直传使用独立响应。若 HTTP 409 返回以下字段，表示 Flash 已写入，但 SD 恢复缓存未完整保存：

| 字段 | 值 |
| --- | --- |
| `status` | `partial` |
| `error` | `recovery_cache_failed` |
| `flash_written` | `true` |

此时先核对分区和恢复文件，不能当作未写入而自动重试。

## network

以太网接口和 DHCP 服务的状态要分别判断。

| 字段 | 读法 |
| --- | --- |
| `interface_present` | 以太网接口是否存在 |
| `link_up` | 物理链路状态 |
| `config_error`、`config_error_name` | 配置应用错误 |
| DHCP 的 `running` | 实际运行状态 |
| `eth` 的 `want_running` | 期望状态 |
| `restore_error`、`apply_error`、`resume_error` | 分别用于定位配置恢复、应用及断线后恢复服务的问题；`0` 表示该步骤未报告错误 |

已连线不等于已成功获得或应用 IP 配置。先结合接口与链路状态，再判断服务是否应当运行。

# WebSocket 实时接入

入口为 `ws://设备地址/ws`，例如 `ws://10.10.99.97/ws`。它提供状态订阅、日志、控制器命令终端和交互SSH。连接成功只表示通道建立，私有功能仍需要有效会话与对应角色。

## 认证与第一条订阅

先通过HTTP登录取得token，再发送：

```json
{"type":"auth","token":"YOUR_TOKEN"}
```

收到 `{"type":"auth_ok"}` 后订阅需要的topic；认证失败为auth_error。普通遥测topic当前可匿名订阅，推荐集成仍建立认证流程，以便后续使用受保护能力。auth不能把READ会话提升成root。

```json
{"type":"subscribe","topic":"fan.status","params":{"interval":5000}}
```

确认示例：

```json
{"type":"subscribed","topic":"fan.status","success":true}
```

数据格式如下，示例只展示包装和部分数据字段：

```json
{"type":"data","topic":"fan.status","timestamp":123,"data":{"fans":[]}}
```

timestamp是设备启动后**秒**；HTTP温度、日志等字段可能是毫秒，不应直接混算。订阅确认成功不代表首条数据已经送达。若一段时间无更新，检查连接和数据来源，必要时HTTP回读。

## 可订阅主题

| topic | 默认/最低显示间隔 | 内容 |
| --- | --- | --- |
| system.dashboard | 1000ms | cpu/memory/info/network/power/fan/services组合；部分项不可用时可能省略 |
| system.info | 5000ms | 控制器基本信息 |
| system.memory | 5000ms | 控制器内存 |
| system.cpu | 1000ms | 控制器CPU |
| network.status | 5000ms | 网络状态 |
| power.status | 5000ms | 供电状态 |
| fan.status | 5000ms | 风扇状态 |
| service.list | 5000ms | 控制器内部服务 |
| device.status | 事件触发；默认间隔2000ms | 计算机状态事件，不能当定期完整快照 |
| ota.progress | 事件触发；默认间隔1000ms | 全局升级进度提示；通过HTTP进度和升级后版本确认 |
| config.pack.validated | 事件触发；默认0 | 上传配置包的验证提示，不表示已应用 |

params.interval为非负整数毫秒；前8个周期主题不得为0，低于表内最低值会提升到最低值。后三个事件主题不会因填写interval而变成轮询。无订阅不保证推送；同连接同topic再次订阅更新该订阅设置，不生成可累积的历史队列。

取消使用 `{"type":"unsubscribe","topic":"fan.status"}`，确认type=unsubscribed并检查success。心跳使用 `{"type":"ping"}`，响应type=pong；pong不表示会话仍获授权，也不证明遥测来源正常。

## 日志流

至少ADMIN角色。先auth，再发送log_subscribe；log_get_history同样需要ADMIN。

| 发送type | 其他字段 | 返回或作用 |
| --- | --- | --- |
| log_subscribe | minLevel，默认VERBOSE | log_subscribed/minLevel；随后接收type=log |
| log_set_level | minLevel | 调整本连接日志过滤，不等于修改所有模块输出级别 |
| log_get_history | limit默认500，minLevel默认ERROR，maxLevel默认VERBOSE | log_history，含logs/total；数量不超过设备日志缓冲容量 |
| log_unsubscribe | 无 | 停止本连接日志流 |

日志项含timestamp（启动后毫秒）、level、levelName、tag、message、task。级别0–5依次NONE/ERROR/WARN/INFO/DEBUG/VERBOSE。日志保留有限，重连不会自动补齐历史。

## 控制器命令终端

此终端操作管理控制器，不是推理/应用计算机的Linux Shell。需要ROOT；命令可能改变硬件或配置。

| 发送type | 字段 | 结果 |
| --- | --- | --- |
| terminal_start | token | 绑定并申请终端；成功返回connected（含prompt）；占用返回terminal_busy/retry_after |
| terminal_input | data：完整命令字符串 | 输出消息type=output、data文本；结束type=done，含code/output_incomplete/stopped |
| terminal_interrupt | 无 | 请求中断；可能返回command_stopping，随后等待done |
| terminal_stop | 无 | 释放本连接终端；不等于所有外部副作用已经撤销 |

同一时间只有一个控制器终端所有者，不能接管别人的活跃终端。输出不完整时不能从最后一行缺失推断命令失败。初次集成状态查询优先用结构化HTTP接口，避免解析终端文本。

## 交互 SSH Shell

需要ROOT；ssh_connect在消息中带token并绑定当前连接。远端主机指纹需已经核验；此Shell不提供自动接受未知指纹的开关。

| 发送type | 字段 | 结果 |
| --- | --- | --- |
| ssh_connect | token、host、user、可选port（22）、password（本次远端密码） | ssh_status：connecting/connected/error；此入口使用密码认证 |
| ssh_input | data | 向已连接的远端终端输入文本；换行由客户端显式提供 |
| ssh_resize | width、height | 整数1–65535，按终端列/行调整 |
| ssh_signal | signal | 请求发送SSH支持的信号；不支持则返回错误 |
| ssh_disconnect | 无 | 断开当前连接拥有的Shell，观察ssh_status最终关闭 |

输出为 `{"type":"ssh_output","data":"…"}`，状态为ssh_status/status/message。当前连接只能操作自己的Shell。断线或控制请求失败后，不要自动重发上一段输入；远端可能已接收。

## HTTP 启动的流式 SSH

`ssh.exec_stream`通过HTTP启动，返回session_id/boot_id/result_key；它与交互Shell是两条不同流程。先建立并认证WebSocket，再启动任务，以免漏掉开头结果。事件只向发起会话获准的连接发送，不应监听别人的执行编号。

| 接收type | 关键字段与判断 |
| --- | --- |
| ssh_exec_start | session_id、command与配置的模式；表示已开始，不是完成 |
| ssh_exec_output | session_id、output_offset、output_length、is_stderr、data_b64 |
| ssh_exec_match | session_id、expect_matched/fail_matched、可选extracted/is_final |
| ssh_exec_running | 通过HTTP状态查询得到的进行中结果 |
| ssh_exec_done | session_id、execution_status、exit_code、status/success及匹配结果 |
| ssh_exec_cancelled | session_id、execution_status；取消不证明远端程序已成功退出 |
| ssh_exec_error | session_id、error，可能附stage/detail |

输出按字节偏移拼接：Base64解码data_b64，长度核对output_length，并以output_offset识别遗漏/重复。UTF-8字符可能跨消息，应流式解码，不能逐帧独立转字符串。

终态可能附output_bytes、output_incomplete、collection_truncated、conditions_complete。**执行完成、条件匹配、输出完整是三件事。** exit_code=0可以与输出缺失同时出现；匹配未完成也不能硬判成功。断线后用完整回执查询ssh.exec_status，查询不会重新执行；历史输出不保证全部重放。

## 容量与重连

当前构建最多8个WebSocket客户端，全服务最多32项topic订阅；大帧、慢客户端、独占任务和服务停止可能拒绝新工作。输入仅接受符合协议的JSON文本消息，最多64KiB，不依赖分片上传；通用JSON深度限制仍适用。

断线后按延迟重连，重新auth、重新订阅；恢复私有功能前确认会话仍有效。不要自动再次执行terminal_input、ssh_input或HTTP控制请求。需要持久监控时，以“最后更新时间+有效状态”表示断流，避免界面保留旧值却看起来正常。

[浏览器只读订阅示例](examples/subscribe.js)可在能够访问设备的浏览器环境使用，不需要第三方库。

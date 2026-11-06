# 按任务接入

以下示例沿用[快速接入](quickstart.md)的TS_BASE、TS_TOKEN。每个任务先说明目标和权限，再给出操作与完成条件。地址、对象ID、版本与回执都须换成实际值；控制示例会改变状态，请选择自己确实要执行的任务。

## 监测设备

目标是把温度、散热、供电和计算机状态接入自己的监控系统。完成登录后可用READ能力；部分总览本身公开。

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/temp/read"
curl -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/fan/status"
curl -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/power/status"
curl -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/device/status?device=agx"
```

记录温度valid、风扇duty_valid、供电valid/crc_valid与最后更新时间，显示无效或断流状态。风扇duty是输出百分比，rpm才是转速；计算机state=on也不证明其应用服务就绪。字段单位见[返回模型](response-models.md)。

一次有效查询并在后续保持更新，才完成监测接入。持续仪表盘使用[WebSocket](websocket.md)；温度无效时查temp.sources，算力遥测异常时查monitor.status，不用0代替缺失值。可运行[Python只读示例](examples/read_status.py)完成登录、读取和退出。

## 控制设备

目标是让推理计算机agx或应用计算机lpmu上电/关机。需要ADMIN。先读取device.status确认对象与现状，再发明确的on/off动作，避免超时后重复toggle。

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary '{"device":"agx","action":"on"}' \
  "$TS_BASE/api/v1/device/power"
```

调用成功后继续GET device.status，检查state与power_good；再从目标计算机或业务健康入口确认应用可用。需要正常关机时action改off。force_off与reset可能中断工作或造成数据丢失，先完成目标系统维护安排。

切换USB使用POST device.usb.set，body如 `{"target":"agx"}`，之后GET device.usb.status。其他目标为esp32/lpmu/disconnect；切换会中断原通道，不能把当前连接暂时掉线解释成设备故障。

请求超时先查询现状；明确没有执行后再重发。若状态error、power_good不成立或长时间未到预期，保留原状态与错误供设备维护人员核查。

## 调整显示与风扇

LED日常操作需要ADMIN。先GET led.list取得设备名，再填色：

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary '{"device":"board","color":"#00A0FF"}' \
  "$TS_BASE/api/v1/led/fill"
```

GET led.list确认当前状态。若希望重启后仍采用该显示，再POST led.save，body为 `{"device":"board"}`，检查saved。显示成功和保存启动配置是两步。

风扇日常输出与配置分开。先读fan.status/config；手动控制用POST fan.set，body为 `{"id":0,"duty":50}`，编号必须来自当前设备。切换模式用fan.mode，模式为off/manual/auto/curve；配置曲线、限制与保存的角色见[风扇参考](reference/fan.md)。

不要仅凭请求成功判断散热正常；回读duty_valid/duty/target_duty、温度和故障状态。改完临时手动设置后，按原维护策略恢复模式，避免遗留手动散热配置。

## 管理远端任务

先分清两种目标：只执行一次命令，用ssh.exec/exec_stream；需要启动后持续管理进程，用已保存SSH命令和服务运行记录。原始命令执行需要ROOT；启动已保存的受管服务至少ADMIN。

准备条件：远端可连接；主机指纹已通过可信渠道核实；保存的主机配置引用有效SSH密钥。未知或变化指纹先走ssh.test核验，不通过清空known hosts或自动接受来绕过。

受管服务流程：

1. root读取ssh.hosts与ssh.commands，确认主机、命令、service_mode及就绪匹配；保存配置的模型见[配置模型](configuration-models.md)。
2. 读取最新active_version，再启动指定命令：

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary '{"command_id":"YOUR_SERVICE_COMMAND_ID","active_version":"CURRENT_VERSION"}' \
  "$TS_BASE/api/v1/ssh/services/start"
```

3. 保存data.run_id与operation_id。POST automation.services.status，body为 `{"run_id":"YOUR_RUN_ID","verify":true}`，观察operation_phase、busy和state。verify会连接原主机核验，不是纯本地读缓存。
4. 确认进程运行后，再检查应用健康或就绪条件。停止用POST automation.services.stop携带原run_id，继续status确认结束。

启动返回run_id不等于服务已经ready；last_known是之前观察到的状态。配置或密钥删除不会自动停止远端进程，停服务应使用原运行记录，不按名称猜测进程。

单次流式命令先连接并认证WebSocket，再POST ssh.exec_stream。保存完整回执；断流后用ssh.exec_status查询，不重跑命令来取回输出。执行、匹配与输出完整性的判定见[流式SSH](websocket.md#http-启动的流式-ssh)。

## 配置自动化

目标是“取得一个数据→映射变量→满足条件时执行动作”。先用root读取automation.status与automation.config.status，了解当前是否已加载、启用、暂停，是否需要选择SD配置。配置状态异常时先解决来源与备份问题。

初次可从保存一个用户变量开始：

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/automation/config/status"
```

把其中active_version写入本次请求：

```sh
curl -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary '{"name":"example.temperature","value":42.5,"active_version":"CURRENT_VERSION"}' \
  "$TS_BASE/api/v1/automation/variables/set"
```

成功后以root读取automation.variables.get，确认value和readonly/source_id；保存返回的新active_version。随后按[规则模型](configuration-models.md#自动化规则)创建enabled=false的规则，先使用日志动作验证条件，不立即挂接电源或远端执行。

需要真实采集时再建立数据源，确认数据抵达、映射变量有更新且未stale，然后启用规则。**保存定义、启用配置、启动引擎、触发动作各自独立。** 不能只看saved=true。

修改冲突时重新读取，避免覆盖另一位管理者的改动。删除前preview=true看impact；切换SD/内部备份先preview再apply。引擎暂停或运行任务忙时按返回原因处理，不强行覆盖受管配置文件。

## 维护设备

先选择具体维护目标，避免把多个高影响动作打包成不可核对的一次调用：

| 目标 | 操作顺序 | 完成条件 |
| --- | --- | --- |
| 备份单个配置对象 | 按对象接口权限导出→客户端保存tscfg→需要时预览导入 | 保存了完整包，接收方能验证；导出不是已恢复 |
| 保存普通文件 | 上传→读属性/下载核对 | 路径、字节数和内容符合预期 |
| 更新固件/网页 | 确认配套镜像→选择传送方式→读取全局进度→确认状态→按需要重启 | 重连后分区/版本身份与业务正常 |
| 调整网络 | 记录旧配置/访问方式→修改→保存→按新地址连接 | 管理与目标网络功能均可用 |
| 更改密码 | auth.change_password→重新登录→更新脚本会话 | 新凭据可用，旧会话不再被当作有效 |
| 安装证书 | admin或root核对CSR/证书匹配→安装→读cert.status→确认客户端信任 | 材料存在、运行服务身份正确、访问端验证通过 |

文件与升级的完整请求、容量和完成条件见[文件传输与升级](transfers.md)。证书与密钥是不同对象：cert.*是设备身份，key.*是远端SSH密钥，hosts.*是主机指纹。维护失败先核对已经完成了哪些步骤，再决定重试或恢复。

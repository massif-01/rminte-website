# 接口索引

本稿覆盖277个源码注册名称：276个有对应业务处理的入口（含兼容名称），1个保留但不支持的入口。另有文件/镜像专用路由、WebSocket消息与mTLS诊断，分别见对应页面。注册不保证当前硬件、存储或远端依赖已经就绪。

从任务开始请读[场景](../scenarios.md)；这里只查具体接口。角色是最低入口要求，敏感资源、会话归属、版本与功能能力仍可能增加限制。

## 如何使用参数示例

以下各页请求示例是JSON对象，以POST发送到列出的路径：

```sh
curl --connect-timeout 5 --max-time 60 \
  -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/json' --data-binary @request.json \
  "$TS_BASE/api/v1/PATH_FROM_REFERENCE"
```

将该接口JSON保存为request.json并替换占位值；空对象{}表示无参数或仅查询。无需登录的接口可省略Authorization。受保护调用应使用所需角色。登录/退出采用专用响应，见[快速接入](../quickstart.md)。

**写操作的示例会产生实际作用。** 示例说明请求格式。需要前序版本、ID、证书或发布材料的例子，先完成对应流程。

GET可用于各页明确允许GET的接口，将简单参数放query；复杂参数用POST JSON。不要把这里统一的POST示例推导成只允许POST。

## 功能分组

| 分组 | 数量 |
| --- | --- |
| [账户和会话](auth.md) | 7 |
| [控制器状态](system.md) | 8 |
| [风扇](fan.md) | 8 |
| [温度](temp.md) | 6 |
| [供电和保护](power.md) | 13 |
| [计算机与USB](device.md) | 9 |
| [普通与模块配置](config.md) | 10 |
| [网络](network.md) | 9 |
| [WiFi管理](wifi.md) | 4 |
| [网络转发](nat.md) | 4 |
| [地址分配](dhcp.md) | 4 |
| [时间](time.md) | 5 |
| [设备文件](storage.md) | 9 |
| [控制器服务](service.md) | 5 |
| [算力监控](monitor.md) | 6 |
| [监控布局](ui.md) | 2 |
| [日志](log.md) | 5 |
| [SSH主机指纹](hosts.md) | 5 |
| [SSH密钥](key.md) | 6 |
| [设备证书](cert.md) | 7 |
| [灯光与矩阵](led.md) | 24 |
| [引脚维护](gpio.md) | 4 |
| [应用计算机网络配置](lpmu_access.md) | 3 |
| [SSH连接与命令](ssh.md) | 23 |
| [远端文件](sftp.md) | 6 |
| [自动化与受管服务](automation.md) | 56 |
| [配置包](config_pack.md) | 8 |
| [升级与恢复](ota.md) | 21 |

## 全部名称

| 名称 | 功能 | 最低权限 | 方法 | 状态 |
| --- | --- | --- | --- | --- |
| [auth.admin.reset_password](auth.md#authadminreset_password) | 恢复 admin 默认密码 | ROOT | POST | 可调用，依赖条件见详情 |
| [auth.admin.set_password](auth.md#authadminset_password) | 由 root 设置 admin 密码 | ROOT | POST | 可调用，依赖条件见详情 |
| [auth.change_password](auth.md#authchange_password) | 更改本账户密码 | 参数 Token（认证专用） | POST | 可调用，依赖条件见详情 |
| [auth.login](auth.md#authlogin) | 登录并取得会话 | 无需登录 | POST | 可调用，依赖条件见详情 |
| [auth.logout](auth.md#authlogout) | 退出当前会话 | 参数 Token（认证专用） | POST | 可调用，依赖条件见详情 |
| [auth.root.set_password](auth.md#authrootset_password) | 由 root 设置 root 密码 | ROOT | POST | 可调用，依赖条件见详情 |
| [auth.status](auth.md#authstatus) | 检查一个 Token | 参数 Token（认证专用） | POST | 可调用，依赖条件见详情 |
| [automation.action.stats](automation.md#automationactionstats) | 读取动作执行统计 | READ | GET/POST | 可调用，依赖条件见详情 |
| [automation.action.stats.reset](automation.md#automationactionstatsreset) | 清零动作统计 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.actions.add](automation.md#automationactionsadd) | 新建动作模板 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.actions.delete](automation.md#automationactionsdelete) | 预览或删除动作模板 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.actions.execute](automation.md#automationactionsexecute) | 执行一个动作模板 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.actions.export](automation.md#automationactionsexport) | 导出动作模板配置包 | ROOT | POST | 可调用，依赖条件见详情 |
| [automation.actions.get](automation.md#automationactionsget) | 读取动作模板 | READ | GET/POST | 可调用，依赖条件见详情 |
| [automation.actions.import](automation.md#automationactionsimport) | 预览或导入动作模板配置包 | ROOT | POST | 可调用，依赖条件见详情 |
| [automation.actions.list](automation.md#automationactionslist) | 列出动作模板 | READ | GET/POST | 可调用，依赖条件见详情 |
| [automation.actions.update](automation.md#automationactionsupdate) | 修改动作模板 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.config.apply](automation.md#automationconfigapply) | 应用已确认的配置切换 | ROOT | POST | 可调用，依赖条件见详情 |
| [automation.config.backup](automation.md#automationconfigbackup) | 保存内部应急备份 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.config.enable](automation.md#automationconfigenable) | 启用或暂停当前配置 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.config.preview](automation.md#automationconfigpreview) | 预览配置来源切换或恢复 | ROOT | POST | 可调用，依赖条件见详情 |
| [automation.config.refresh](automation.md#automationconfigrefresh) | 重新检查配置存储 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.config.status](automation.md#automationconfigstatus) | 读取配置来源与备份状态 | READ | GET/POST | 可调用，依赖条件见详情 |
| [automation.pause](automation.md#automationpause) | 暂停自动化引擎 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.proxy.fetch](automation.md#automationproxyfetch) | 由设备获取 HTTP 数据 | READ | POST | 可调用，依赖条件见详情 |
| [automation.proxy.socketio_test](automation.md#automationproxysocketio_test) | 测试外部 Socket.IO 事件 | ROOT | POST | 可调用，依赖条件见详情 |
| [automation.proxy.websocket_test](automation.md#automationproxywebsocket_test) | 测试外部 WebSocket 数据 | ROOT | POST | 可调用，依赖条件见详情 |
| [automation.reload](automation.md#automationreload) | 重新加载自动化配置 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.resume](automation.md#automationresume) | 恢复自动化引擎 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.rules.add](automation.md#automationrulesadd) | 新建自动化规则 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.rules.delete](automation.md#automationrulesdelete) | 预览或删除规则 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.rules.disable](automation.md#automationrulesdisable) | 禁用一条规则 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.rules.enable](automation.md#automationrulesenable) | 启用一条规则 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.rules.export](automation.md#automationrulesexport) | 导出规则配置包 | ROOT | POST | 可调用，依赖条件见详情 |
| [automation.rules.get](automation.md#automationrulesget) | 读取一条规则 | READ | GET/POST | 可调用，依赖条件见详情 |
| [automation.rules.import](automation.md#automationrulesimport) | 预览或导入规则包 | ROOT | POST | 可调用，依赖条件见详情 |
| [automation.rules.list](automation.md#automationruleslist) | 列出自动化规则 | READ | GET/POST | 可调用，依赖条件见详情 |
| [automation.rules.trigger](automation.md#automationrulestrigger) | 手动触发一条规则 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.rules.update](automation.md#automationrulesupdate) | 修改自动化规则 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.services.list](automation.md#automationserviceslist) | 列出受管远端服务记录 | READ | GET/POST | 可调用，依赖条件见详情 |
| [automation.services.status](automation.md#automationservicesstatus) | 核验受管远端服务 | READ | GET/POST | 可调用，依赖条件见详情 |
| [automation.services.stop](automation.md#automationservicesstop) | 停止受管远端服务 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.sources.add](automation.md#automationsourcesadd) | 新建数据源 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.sources.add_mapping](automation.md#automationsourcesadd_mapping) | 添加数据字段映射 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.sources.delete](automation.md#automationsourcesdelete) | 预览或删除数据源 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.sources.disable](automation.md#automationsourcesdisable) | 停用数据源 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.sources.enable](automation.md#automationsourcesenable) | 启用数据源 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.sources.export](automation.md#automationsourcesexport) | 导出数据源配置包 | ROOT | POST | 可调用，依赖条件见详情 |
| [automation.sources.import](automation.md#automationsourcesimport) | 预览或导入数据源配置包 | ROOT | POST | 可调用，依赖条件见详情 |
| [automation.sources.list](automation.md#automationsourceslist) | 列出数据源 | READ | GET/POST | 可调用，依赖条件见详情 |
| [automation.sources.remove_mapping](automation.md#automationsourcesremove_mapping) | 删除数据字段映射 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.sources.update](automation.md#automationsourcesupdate) | 修改数据源 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.start](automation.md#automationstart) | 启动自动化引擎 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.status](automation.md#automationstatus) | 读取自动化运行概况 | READ | GET/POST | 可调用，依赖条件见详情 |
| [automation.stop](automation.md#automationstop) | 停止自动化引擎 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.test.device](automation.md#automationtestdevice) | 立即测试设备控制 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.test.gpio](automation.md#automationtestgpio) | 立即测试引脚动作 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.test.led](automation.md#automationtestled) | 立即测试 LED 动作 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.test.ssh](automation.md#automationtestssh) | 立即测试已配置主机命令 | ROOT | POST | 可调用，依赖条件见详情 |
| [automation.variables.delete](automation.md#automationvariablesdelete) | 删除保存的用户变量 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [automation.variables.get](automation.md#automationvariablesget) | 读取一个变量 | READ | GET/POST | 可调用，依赖条件见详情 |
| [automation.variables.list](automation.md#automationvariableslist) | 列出变量 | READ | GET/POST | 可调用，依赖条件见详情 |
| [automation.variables.set](automation.md#automationvariablesset) | 新建或修改用户变量 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [cert.delete](cert.md#certdelete) | 删除本地设备身份材料 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [cert.generate_csr](cert.md#certgenerate_csr) | 生成设备证书申请 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [cert.generate_keypair](cert.md#certgenerate_keypair) | 生成设备身份密钥 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [cert.get_certificate](cert.md#certget_certificate) | 读取设备公有证书 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |
| [cert.install](cert.md#certinstall) | 安装设备证书 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [cert.install_ca](cert.md#certinstall_ca) | 安装并批准 CA 链 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [cert.status](cert.md#certstatus) | 读取设备证书与诊断服务状态 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |
| [config.delete](config.md#configdelete) | 删除一个配置键 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [config.get](config.md#configget) | 读取一个配置值 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |
| [config.list](config.md#configlist) | 读取配置键统计 | ADMIN | GET/POST | 可调用，依赖条件见详情 |
| [config.module.list](config.md#configmodulelist) | 读取模块配置索引 | READ | GET/POST | 可调用，依赖条件见详情 |
| [config.module.reset](config.md#configmodulereset) | 恢复模块默认配置 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [config.module.save](config.md#configmodulesave) | 保存模块配置 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [config.module.set](config.md#configmoduleset) | 修改模块中的配置键 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [config.module.show](config.md#configmoduleshow) | 读取模块配置 | READ | GET/POST | 可调用，依赖条件见详情 |
| [config.pack.apply](config_pack.md#configpackapply) | 旧通用配置应用入口 | ADMIN | POST/PUT/DELETE | 不支持 |
| [config.pack.content](config_pack.md#configpackcontent) | 读取包内解密内容 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [config.pack.export](config_pack.md#configpackexport) | 生成加密配置包 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [config.pack.export_cert](config_pack.md#configpackexport_cert) | 读取配置接收证书 | READ | GET/POST | 可调用，依赖条件见详情 |
| [config.pack.import](config_pack.md#configpackimport) | 验证已上传配置包 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [config.pack.info](config_pack.md#configpackinfo) | 读取配置包能力 | READ | GET/POST | 可调用，依赖条件见详情 |
| [config.pack.list](config_pack.md#configpacklist) | 列出目录中的配置包 | READ | GET/POST | 可调用，依赖条件见详情 |
| [config.pack.verify](config_pack.md#configpackverify) | 验证配置包信任 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [config.save](config.md#configsave) | 保存普通配置 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [config.set](config.md#configset) | 设置一个配置值 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [device.fan.set](device.md#devicefanset) | 通过兼容入口设置风扇 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [device.fan.status](device.md#devicefanstatus) | 读取兼容风扇状态 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |
| [device.ping](device.md#deviceping) | 从设备诊断网络连通 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [device.power](device.md#devicepower) | 控制计算机电源 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [device.power.status](device.md#devicepowerstatus) | 读取电源轨状态 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |
| [device.reset](device.md#devicereset) | 复位计算机 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [device.status](device.md#devicestatus) | 读取一台计算机状态 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |
| [device.usb.set](device.md#deviceusbset) | 切换 USB 连接目标 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [device.usb.status](device.md#deviceusbstatus) | 读取 USB 连接目标 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |
| [dhcp.clients](dhcp.md#dhcpclients) | 读取 DHCP 租约 | READ | GET/POST | 可调用，依赖条件见详情 |
| [dhcp.start](dhcp.md#dhcpstart) | 启动 DHCP 服务 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [dhcp.status](dhcp.md#dhcpstatus) | 读取 DHCP 状态 | READ | GET/POST | 可调用，依赖条件见详情 |
| [dhcp.stop](dhcp.md#dhcpstop) | 停止 DHCP 服务 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [fan.config](fan.md#fanconfig) | 读取风扇配置 | READ | GET/POST | 可调用，依赖条件见详情 |
| [fan.curve](fan.md#fancurve) | 设置温度调速曲线 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [fan.enable](fan.md#fanenable) | 启用或停用风扇 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [fan.limits](fan.md#fanlimits) | 设置风扇输出上下限 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [fan.mode](fan.md#fanmode) | 切换风扇控制模式 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [fan.save](fan.md#fansave) | 保存风扇配置 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [fan.set](fan.md#fanset) | 设置手动输出 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [fan.status](fan.md#fanstatus) | 读取风扇状态 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |
| [gpio.info](gpio.md#gpioinfo) | 读取一个引脚状态 | READ | GET/POST | 可调用，依赖条件见详情 |
| [gpio.list](gpio.md#gpiolist) | 列出可操作引脚 | READ | GET/POST | 可调用，依赖条件见详情 |
| [gpio.set](gpio.md#gpioset) | 设置引脚电平 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [gpio.toggle](gpio.md#gpiotoggle) | 翻转引脚电平 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [hosts.clear](hosts.md#hostsclear) | 清空已记住的主机指纹 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [hosts.info](hosts.md#hostsinfo) | 查看主机指纹 | READ | GET/POST | 可调用，依赖条件见详情 |
| [hosts.list](hosts.md#hostslist) | 列出已记住的主机指纹 | READ | GET/POST | 可调用，依赖条件见详情 |
| [hosts.remove](hosts.md#hostsremove) | 删除一条指纹记录 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [hosts.update](hosts.md#hostsupdate) | 从主机重新取得指纹 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [key.delete](key.md#keydelete) | 检查引用或删除密钥 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [key.export](key.md#keyexport) | 读取 SSH 公钥 | READ | GET/POST | 可调用，依赖条件见详情 |
| [key.exportPrivate](key.md#keyexportprivate) | 导出可导出的 SSH 私钥 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [key.generate](key.md#keygenerate) | 生成 SSH 密钥 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [key.info](key.md#keyinfo) | 查看密钥元信息 | READ | GET/POST | 可调用，依赖条件见详情 |
| [key.list](key.md#keylist) | 列出可见密钥 | READ | GET/POST | 可调用，依赖条件见详情 |
| [led.boot.config](led.md#ledbootconfig) | 读取启动显示配置 | READ | GET/POST | 可调用，依赖条件见详情 |
| [led.brightness](led.md#ledbrightness) | 查询或修改亮度 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [led.clear](led.md#ledclear) | 清空显示 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [led.color.hsv](led.md#ledcolorhsv) | 将 HSV 转换为 RGB | READ | GET/POST | 可调用，依赖条件见详情 |
| [led.color.parse](led.md#ledcolorparse) | 解析颜色表示 | READ | GET/POST | 可调用，依赖条件见详情 |
| [led.color_correction.export](led.md#ledcolor_correctionexport) | 保存颜色校正文件 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [led.color_correction.get](led.md#ledcolor_correctionget) | 读取颜色校正 | READ | GET/POST | 可调用，依赖条件见详情 |
| [led.color_correction.import](led.md#ledcolor_correctionimport) | 从文件导入颜色校正 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [led.color_correction.reset](led.md#ledcolor_correctionreset) | 恢复默认颜色校正 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [led.color_correction.set](led.md#ledcolor_correctionset) | 修改颜色校正 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [led.effect.list](led.md#ledeffectlist) | 列出动画名称 | READ | GET/POST | 可调用，依赖条件见详情 |
| [led.effect.start](led.md#ledeffectstart) | 启动灯光动画 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [led.effect.stop](led.md#ledeffectstop) | 停止灯光动画 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [led.fill](led.md#ledfill) | 设置整灯颜色 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [led.filter.list](led.md#ledfilterlist) | 列出显示滤镜 | READ | GET/POST | 可调用，依赖条件见详情 |
| [led.filter.start](led.md#ledfilterstart) | 应用显示滤镜 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [led.filter.stop](led.md#ledfilterstop) | 停止显示滤镜 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [led.image](led.md#ledimage) | 在矩阵上显示图片 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [led.list](led.md#ledlist) | 列出灯光和矩阵设备 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |
| [led.qrcode](led.md#ledqrcode) | 显示二维码 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [led.save](led.md#ledsave) | 把当前显示保存为启动配置 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [led.set](led.md#ledset) | 设置灯光像素范围 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [led.text](led.md#ledtext) | 显示矩阵文字 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [led.text.stop](led.md#ledtextstop) | 停止滚动文字 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [log.capture](log.md#logcapture) | 控制系统日志捕获 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [log.clear](log.md#logclear) | 清空日志缓冲 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [log.list](log.md#loglist) | 查询系统日志 | ADMIN | GET/POST | 可调用，依赖条件见详情 |
| [log.setLevel](log.md#logsetlevel) | 设置日志输出级别 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [log.stats](log.md#logstats) | 读取日志缓冲统计 | ADMIN | GET/POST | 可调用，依赖条件见详情 |
| [monitor.config](monitor.md#monitorconfig) | 读取算力监控配置 | READ | GET/POST | 可调用，依赖条件见详情 |
| [monitor.data](monitor.md#monitordata) | 读取算力主机最新遥测 | READ | GET/POST | 可调用，依赖条件见详情 |
| [monitor.set_server](monitor.md#monitorset_server) | 配置算力监控地址 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [monitor.start](monitor.md#monitorstart) | 启动算力监控 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [monitor.status](monitor.md#monitorstatus) | 读取算力监控连接状态 | READ | GET/POST | 可调用，依赖条件见详情 |
| [monitor.stop](monitor.md#monitorstop) | 停止算力监控 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [nat.disable](nat.md#natdisable) | 关闭 NAT 网关 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [nat.enable](nat.md#natenable) | 启用 NAT 网关 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [nat.save](nat.md#natsave) | 保存 NAT 配置 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [nat.status](nat.md#natstatus) | 读取网关状态 | READ | GET/POST | 可调用，依赖条件见详情 |
| [network.eth.status](network.md#networkethstatus) | 读取以太网状态 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |
| [network.hostname](network.md#networkhostname) | 查询或修改设备主机名 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [network.lpmu_access.log](lpmu_access.md#networklpmu_accesslog) | 分段读取网络配置日志 | ADMIN | GET/POST | 可调用，依赖条件见详情 |
| [network.lpmu_access.start](lpmu_access.md#networklpmu_accessstart) | 启动应用计算机网络接入配置 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [network.lpmu_access.status](lpmu_access.md#networklpmu_accessstatus) | 查询网络配置任务 | ADMIN | GET/POST | 可调用，依赖条件见详情 |
| [network.status](network.md#networkstatus) | 读取网络总览 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |
| [network.wifi.ap.config](network.md#networkwifiapconfig) | 配置设备无线热点 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [network.wifi.ap.stations](network.md#networkwifiapstations) | 读取热点关联终端 | READ | GET/POST | 可调用，依赖条件见详情 |
| [network.wifi.connect](network.md#networkwificonnect) | 连接无线网络 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [network.wifi.disconnect](network.md#networkwifidisconnect) | 断开无线接入 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [network.wifi.mode](network.md#networkwifimode) | 查询或切换 WiFi 模式 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [network.wifi.scan](network.md#networkwifiscan) | 扫描附近无线网络 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ota.abort](ota.md#otaabort) | 请求取消固件升级 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ota.partitions](ota.md#otapartitions) | 读取升级分区 | READ | GET/POST | 可调用，依赖条件见详情 |
| [ota.progress](ota.md#otaprogress) | 读取固件升级进度 | READ | GET/POST | 可调用，依赖条件见详情 |
| [ota.rollback](ota.md#otarollback) | 回滚至另一固件 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ota.server.get](ota.md#otaserverget) | 读取升级服务器配置 | READ | GET/POST | 可调用，依赖条件见详情 |
| [ota.server.set](ota.md#otaserverset) | 配置升级服务器 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ota.start_file](ota.md#otastart_file) | 从SD卡启动固件升级 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ota.start_url](ota.md#otastart_url) | 从服务器启动固件升级 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ota.status](ota.md#otastatus) | 读取固件升级总览 | READ | GET/POST | 可调用，依赖条件见详情 |
| [ota.test_connection](ota.md#otatest_connection) | 测试升级文件连接 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ota.upgrade_file](ota.md#otaupgrade_file) | 从SD卡启动固件升级 | ADMIN | POST/PUT/DELETE | 兼容名称 |
| [ota.upgrade_url](ota.md#otaupgrade_url) | 从服务器启动固件升级 | ADMIN | POST/PUT/DELETE | 兼容名称 |
| [ota.upload_abort](ota.md#otaupload_abort) | 中止固件上传控制 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ota.upload_begin](ota.md#otaupload_begin) | 开始固件上传控制 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ota.upload_end](ota.md#otaupload_end) | 结束固件上传控制 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ota.validate](ota.md#otavalidate) | 确认当前固件 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ota.version](ota.md#otaversion) | 读取固件版本 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |
| [ota.www.abort](ota.md#otawwwabort) | 请求取消网页资源升级 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ota.www.progress](ota.md#otawwwprogress) | 读取网页资源升级进度 | READ | GET/POST | 可调用，依赖条件见详情 |
| [ota.www.start](ota.md#otawwwstart) | 从服务器启动网页资源升级 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ota.www.start_sdcard](ota.md#otawwwstart_sdcard) | 从SD卡启动网页资源升级 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [power.chip](power.md#powerchip) | 读取电源芯片数据 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |
| [power.debug](power.md#powerdebug) | 开关供电调试 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [power.interval.set](power.md#powerintervalset) | 设置电压采样间隔 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [power.monitor.start](power.md#powermonitorstart) | 启动供电采样 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [power.monitor.stop](power.md#powermonitorstop) | 停止供电采样 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [power.protection.config](power.md#powerprotectionconfig) | 读取电压保护配置 | READ | GET/POST | 可调用，依赖条件见详情 |
| [power.protection.set](power.md#powerprotectionset) | 配置电压保护 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [power.protection.status](power.md#powerprotectionstatus) | 读取保护运行状态 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |
| [power.stats](power.md#powerstats) | 读取采样统计 | READ | GET/POST | 可调用，依赖条件见详情 |
| [power.stats.reset](power.md#powerstatsreset) | 清零供电统计 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [power.status](power.md#powerstatus) | 读取供电总览 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |
| [power.threshold.set](power.md#powerthresholdset) | 设置电压监测阈值 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [power.voltage](power.md#powervoltage) | 读取供电电压 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |
| [service.list](service.md#servicelist) | 列出控制器内部服务 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |
| [service.restart](service.md#servicerestart) | 重启控制器内部服务 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [service.start](service.md#servicestart) | 启动控制器内部服务 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [service.status](service.md#servicestatus) | 读取一个内部服务状态 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |
| [service.stop](service.md#servicestop) | 停止控制器内部服务 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [sftp.get](sftp.md#sftpget) | 下载远端文件到设备 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [sftp.ls](sftp.md#sftpls) | 列出远端目录 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [sftp.mkdir](sftp.md#sftpmkdir) | 建立远端目录 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [sftp.put](sftp.md#sftpput) | 上传设备文件到远端 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [sftp.rm](sftp.md#sftprm) | 删除远端文件 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [sftp.stat](sftp.md#sftpstat) | 读取远端文件属性 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ssh.cancel](ssh.md#sshcancel) | 请求取消自己的流式执行 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ssh.commands.add](ssh.md#sshcommandsadd) | 新建SSH命令 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ssh.commands.export](ssh.md#sshcommandsexport) | 导出SSH命令配置包 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ssh.commands.get](ssh.md#sshcommandsget) | 读取SSH命令 | READ | GET/POST | 可调用，依赖条件见详情 |
| [ssh.commands.import](ssh.md#sshcommandsimport) | 预览或导入SSH命令配置包 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ssh.commands.list](ssh.md#sshcommandslist) | 列出SSH命令 | READ | GET/POST | 可调用，依赖条件见详情 |
| [ssh.commands.remove](ssh.md#sshcommandsremove) | 预览或删除SSH命令 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ssh.commands.update](ssh.md#sshcommandsupdate) | 修改SSH命令 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ssh.copyid](ssh.md#sshcopyid) | 向远端安装公钥 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ssh.exec](ssh.md#sshexec) | 执行并等待一条远端命令 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ssh.exec_status](ssh.md#sshexec_status) | 查询自己的流式执行结果 | ROOT | GET/POST | 可调用，依赖条件见详情 |
| [ssh.exec_stream](ssh.md#sshexec_stream) | 启动流式远端命令 | ROOT | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ssh.hosts.add](ssh.md#sshhostsadd) | 新建SSH主机 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ssh.hosts.export](ssh.md#sshhostsexport) | 导出SSH主机配置包 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ssh.hosts.get](ssh.md#sshhostsget) | 读取SSH主机 | READ | GET/POST | 可调用，依赖条件见详情 |
| [ssh.hosts.import](ssh.md#sshhostsimport) | 预览或导入SSH主机配置包 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ssh.hosts.list](ssh.md#sshhostslist) | 列出SSH主机 | READ | GET/POST | 可调用，依赖条件见详情 |
| [ssh.hosts.remove](ssh.md#sshhostsremove) | 预览或删除SSH主机 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ssh.hosts.update](ssh.md#sshhostsupdate) | 修改SSH主机 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ssh.keygen](ssh.md#sshkeygen) | 兼容 SSH 密钥生成 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ssh.revoke](ssh.md#sshrevoke) | 撤销远端公钥 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ssh.services.start](ssh.md#sshservicesstart) | 启动已保存的受管服务 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ssh.test](ssh.md#sshtest) | 测试远端 SSH 连接 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [storage.delete](storage.md#storagedelete) | 删除文件或目录 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [storage.info](storage.md#storageinfo) | 读取文件信息 | READ | GET/POST | 可调用，依赖条件见详情 |
| [storage.list](storage.md#storagelist) | 列出目录 | READ | GET/POST | 可调用，依赖条件见详情 |
| [storage.mkdir](storage.md#storagemkdir) | 建立目录 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [storage.mount](storage.md#storagemount) | 挂载 SD 卡 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [storage.read](storage.md#storageread) | 读取小文本或 JSON 文件 | READ | GET/POST | 可调用，依赖条件见详情 |
| [storage.rename](storage.md#storagerename) | 移动或重命名文件 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [storage.status](storage.md#storagestatus) | 读取存储挂载状态 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |
| [storage.unmount](storage.md#storageunmount) | 卸载 SD 卡 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [system.apis](system.md#systemapis) | 读取当前注册名称 | READ | GET/POST | 可调用，依赖条件见详情 |
| [system.cpu](system.md#systemcpu) | 读取控制器 CPU 使用情况 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |
| [system.info](system.md#systeminfo) | 读取管理控制器信息 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |
| [system.log.level](system.md#systemloglevel) | 调整系统日志级别 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [system.memory](system.md#systemmemory) | 读取控制器内存 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |
| [system.memory_detail](system.md#systemmemory_detail) | 读取内存诊断明细 | ADMIN | GET/POST | 可调用，依赖条件见详情 |
| [system.reboot](system.md#systemreboot) | 重启管理控制器 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [system.tasks](system.md#systemtasks) | 查看控制器任务 | ADMIN | GET/POST | 可调用，依赖条件见详情 |
| [temp.bind](temp.md#tempbind) | 绑定温度变量 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [temp.manual](temp.md#tempmanual) | 设置手动测试温度 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [temp.read](temp.md#tempread) | 读取当前温度 | READ | GET/POST | 可调用，依赖条件见详情 |
| [temp.select](temp.md#tempselect) | 选择首选温度源 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [temp.sources](temp.md#tempsources) | 查看所有温度来源 | READ | GET/POST | 可调用，依赖条件见详情 |
| [temp.status](temp.md#tempstatus) | 查看温度输入状态 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |
| [time.force_sync](time.md#timeforce_sync) | 请求重新同步时间 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [time.info](time.md#timeinfo) | 读取时间与同步状态 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |
| [time.set_ntp](time.md#timeset_ntp) | 配置 NTP 服务端 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [time.set_timezone](time.md#timeset_timezone) | 设置显示时区 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [time.sync](time.md#timesync) | 设置设备时间 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [ui.widgets.get](ui.md#uiwidgetsget) | 读取监控组件布局 | READ | GET/POST | 可调用，依赖条件见详情 |
| [ui.widgets.set](ui.md#uiwidgetsset) | 保存监控组件布局 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [wifi.connect](wifi.md#wificonnect) | 连接无线网络 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [wifi.disconnect](wifi.md#wifidisconnect) | 断开无线接入 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [wifi.scan](wifi.md#wifiscan) | 扫描附近无线网络 | ADMIN | POST/PUT/DELETE | 可调用，依赖条件见详情 |
| [wifi.status](wifi.md#wifistatus) | 读取 WiFi 管理状态 | 无需登录 | GET/POST | 可调用，依赖条件见详情 |

## 其他入口

[文件上传下载与镜像直传](../transfers.md) · [WebSocket协议](../websocket.md) · [mTLS诊断](../compatibility.md#mtls-诊断服务)

# 版本与兼容性

本手册基于 **TianshanOS 0.6.4** 编写。后续版本中未变化的接口与操作仍可参考本手册；如接口、参数或返回结果发生变化，请以所用版本的说明为准。

## 连接与账户

| 项目 | 使用方式 |
| --- | --- |
| 业务 API | HTTP，默认端口80，路径前缀/api/v1；例如http://10.10.99.97 |
| 实时消息 | WebSocket，默认地址ws://设备地址/ws |
| 默认账户 | admin / root，初始默认密码均为rm01；已改密时使用当前密码 |
| 会话认证 | 登录返回的token用于Authorization: Bearer请求头 |
| 权限 | 各接口列出最低角色；敏感资源、配置版本与任务所有权另有检查 |

## 功能依赖

接口已经提供，并不表示设备当前满足全部运行条件。调用前通过相应状态接口确认。

| 功能 | 使用前确认 |
| --- | --- |
| 温度、风扇、供电、设备控制 | 对应驱动已初始化，目标对象存在，读数有效 |
| 算力遥测 | monitor已启动，目标服务可达，有最新有效数据 |
| 文件与SD升级 | 所需存储已挂载、文件存在且容量足够；镜像直传另有流程 |
| SSH/SFTP与受管服务 | 网络、身份、主机指纹、密钥、保存配置与任务槽可用 |
| 自动化 | 配置已加载并按预期启用，引擎状态正确，引用对象有效，写入版本匹配 |
| 配置包 | 设备证书、接收方材料和发布信任有效；导出还需要Developer能力 |
| 设备PKI与升级 | 证书诊断需材料与有效时间；升级需完整且适配硬件和分区的APP/WWW镜像 |
| 矩阵文字和图片 | 目标支持矩阵功能，字体或图片文件存在且格式可用 |

## 兼容名称与不支持的入口

config.pack.apply保留名称但不支持通用配置应用；使用对应对象的import接口。led.set可写入像素范围。ota.upload_begin/end/abort为上传控制入口，但没有公开upload_write数据接口；普通集成使用完整镜像直传路由。

OTA仍支持upgrade_url/start_url与upgrade_file/start_file两组兼容名称。新集成推荐start_url与start_file。

## mTLS 诊断服务

这是独立的证书认证服务，默认端口443，不是业务/api/v1的另一端口。运行与否依赖设备PKI材料、配置和服务状态。Bearer Token不能替代客户端证书。

| 方法、路径 | 最低证书角色 | 功能 |
| --- | --- | --- |
| GET / | anonymous | 健康检查 |
| GET /api/auth/whoami | viewer | 证书身份信息 |
| GET /api/test/viewer | viewer | 读取权限测试 |
| GET /api/test/operator | operator | 操作角色测试 |
| GET /api/test/admin | admin | 管理角色读取测试 |
| POST /api/test/admin-action | admin | 管理角色写权限测试 |

这些端点用于健康、身份和权限诊断，不执行设备业务动作。证书角色viewer/operator/admin与业务READ/ADMIN/ROOT属于两套身份体系，不能自行互换。

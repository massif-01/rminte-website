# 文件传输与升级

普通文件使用专用文件路由，固件与网页镜像使用专用升级路由。请求体是原始文件字节；成功响应不一定带code。下面这些专用路由不计入277个逻辑API名称。

## 普通文件

| 路由 | 方法与权限 | 请求和结果 |
| --- | --- | --- |
| /api/v1/file/download | GET，READ；敏感路径需要ADMIN | query的path为绝对路径；响应为文件字节，不能下载目录 |
| /api/v1/file/upload | POST，ADMIN | query的path指定目标；body为原始字节；成功返回path/size/status=uploaded |

HTTP上传只允许 `/sdcard/` 下通过路径检查的普通文件。`storage.rename/delete`等文件操作支持的路径范围与上传不同，不能据此向 `/spiffs/` 或 `/www/` 上传。敏感配置和私钥读取要求ADMIN；自动化受管目录及其别名、备份、临时文件仍受到保护，应使用对象配置接口修改。

上传上限16 MiB，接收期限300秒；实际还受内存、可用空间和存储状态限制。文件必须非空且完整，不能靠重复请求拼接。上传会替换同名文件，先保留需要的内容。路径只URL编码一次。

下面需要已配置TS_BASE和TS_TOKEN：

```sh
curl --connect-timeout 5 --max-time 330 \
  -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/octet-stream' \
  --data-binary @example.txt \
  "$TS_BASE/api/v1/file/upload?path=/sdcard/example.txt"

curl --connect-timeout 5 --max-time 60 \
  -H "Authorization: Bearer $TS_TOKEN" \
  --get --data-urlencode 'path=/sdcard/example.txt' \
  "$TS_BASE/api/v1/file/download" -o downloaded-example.txt
```

上传 `.tscfg` 后会附config_pack.valid/reason/signature等验证信息。uploaded只表示文件已保存，不表示包可信或配置已应用。按对应对象的import接口先预览、再应用；config.pack.apply不支持通用配置应用。普通数据包与包含命令的规则包有不同的签名用途检查，不能用一次普通包验证代替规则导入检查。

收到file_replace_uncertain或连接中断时，先读文件属性、下载核对内容，再决定是否重传。

## 升级前准备

取得适合目标硬件、分区布局和固件版本的完整APP固件与配套www.bin。网页资源镜像不是单个HTML文件。升级前备份配置，保证供电和维护窗口，并准备恢复途径。

升级下载支持HTTP和HTTPS。HTTPS默认使用系统证书信任；skip_verify是该下载流程的选项，不能解决损坏镜像、容量不足或不兼容问题。一般保持false；当前启动接口不接收私有CA的cert_pem参数。

## 选择传送方式

| 方式 | 接口 | 使用条件 |
| --- | --- | --- |
| 设备下载 | ota.start_url / ota.www.start | 设备能访问镜像服务器；先确认网络与存储条件 |
| 从SD读取 | ota.start_file / ota.www.start_sdcard | SD已挂载且完整镜像存在 |
| 客户端直传 | 下表专用二进制路由 | 客户端有完整文件，设备有可写SD用于暂存及恢复缓存 |

| 专用路由 | 方法与权限 | 参数与成功响应 |
| --- | --- | --- |
| /api/v1/ota/firmware | POST，ADMIN | body为完整APP镜像；query的auto_reboot默认true；响应status=success、size、message、reboot_pending、auto_reboot_requested |
| /api/v1/ota/www | POST，ADMIN | body为完整www.bin；响应status=success、size、message；不自动重启 |

两路请求上限16 MiB，接收期限300秒；还受目标分区容量和内存限制。固件会检查镜像头并由安装流程检查完整性。直传成功后保存SD恢复文件和关闭自动恢复的清单；这不表示重启后业务已验收。

直传固件示例禁止自动重启，便于核对结果后安排重启：

```sh
curl --connect-timeout 5 --max-time 600 \
  -H "Authorization: Bearer $TS_TOKEN" \
  -H 'Content-Type: application/octet-stream' \
  --data-binary @firmware.bin \
  "$TS_BASE/api/v1/ota/firmware?auto_reboot=false"
```

firmware.bin是客户端本地文件名，替换为实际完整固件。此请求会写入设备。auto_reboot=true时，成功响应后约2秒请求重启，客户端可能随之断线。

## 确认进度与完成

URL和SD方式启动后，读取ota.progress；WWW使用ota.www.progress。这些是设备全局进度，不返回每个登录会话独立的任务回执；应由一个维护流程协调升级，避免并发开始或取消其他升级。

```sh
curl --connect-timeout 5 --max-time 15 \
  -H "Authorization: Bearer $TS_TOKEN" \
  "$TS_BASE/api/v1/ota/progress"
```

APP进度含state/percent/received_size/total_size/message；WWW使用received/total并附running。pending_reboot表示等待重启，error表示失败。100%不能单独证明设备已运行新版本。取消时POST空对象给ota.abort或ota.www.abort，再确认状态，不要立即开始新升级。

直传使用本次HTTP响应判断，不依赖全局进度显示本次上传。若HTTP409返回status=partial、error=recovery_cache_failed、flash_written=true，Flash已写入但SD恢复缓存未完整保存；先核对分区与恢复文件。传输中断或结果不明时，也不能自动按“尚未写入”重试。

固件写入后按计划重启，重新登录，读取ota.status/partitions并验证业务。ota.validate会确认当前固件，完成健康检查后再调用。

## 回滚与SD恢复

ota.rollback使用可回滚分区，先查看ota.partitions的can_rollback；调用可能立即重启。重连后核对版本、配置兼容性及业务状态。

SD恢复使用 `/sdcard/recovery/` 下的TianShanOS.bin、www.bin和manifest.json。清单中的armed控制是否允许恢复，force控制版本比较；材料存在不等于恢复已启用。恢复涉及下次启动和持久写入，应按发行方的恢复流程准备，不能仅上传文件后就假定恢复成功。

当前没有对外的恢复准备、状态或授权API。不要构造未列出的路径，也不要把ota.upload_begin/end/abort当作完整分块传输流程；普通集成采用本节专用上传路由。

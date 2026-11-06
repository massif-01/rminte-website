# 接入示例

两个示例只登录、查询/订阅和退出，不控制硬件、不连接远端SSH、不升级。使用者运行时仍会建立真实设备连接；

## Python

需要Python 3，使用标准库，无需安装依赖。使用设备当前地址：

```sh
python3 docs/api/examples/read_status.py \
  --base 'http://10.10.99.97' --user admin
```

在提示处输入密码，不把密码写进命令历史。输出是各接口data的实际JSON；读数还要检查有效标志。脚本不跟随HTTP跳转，不自动重试。网络或业务错误会停止本轮读取，已建立会话会尝试退出。

## 浏览器 JavaScript

subscribe.js导出watchTianShan。把它作为ES模块纳入你的前端，在同源或已允许的环境使用。浏览器需要能够访问设备地址。取得HTTP登录token后调用：

```javascript
import {watchTianShan} from './subscribe.js';
const close = watchTianShan({
  baseUrl: 'http://10.10.99.97',
  token: yourLoginToken,
  onData: message => renderYourDashboard(message.data),
  onState: state => showConnectionState(state)
});
// 页面离开或不再显示时调用close()。
```

renderYourDashboard/showConnectionState由你的页面提供。示例没有自动重连；连接关闭时由应用明确标记数据陈旧，再按[持续运行](../operations.md)恢复认证与订阅。不要把Token写入源码、URL或普通日志。

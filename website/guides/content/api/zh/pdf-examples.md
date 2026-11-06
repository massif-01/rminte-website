# 随附示例与使用方式

PDF 附件中包含 read_status.py 和 subscribe.js，可从支持附件的 PDF 阅读器保存到本地。配套可编辑文档也提供相同文件。不要把示例中的占位地址、Token 或证书路径当成设备配置。

## 复制代码示例

代码框内是可选择的文字，可直接选择并复制，没有行号混入代码。需要完整保留缩进和换行时，点击代码框右上角的回形针，保存同编号的原始代码文件；也可以从PDF阅读器的附件面板保存。

如果阅读器不支持附件，下载包的code-examples/zh目录提供全部原始示例，文件名与代码框一致。接口请求JSON可另存为request.json，按对应接口发送；响应示例和WebSocket消息按所在章节使用。Shell中的地址、Token和其他占位值仍需按上下文填写。

## Python 只读查询

Python 3 标准库即可运行，无需第三方依赖。使用设备地址执行，密码在提示处输入，不写在命令行中：

```sh
python3 read_status.py --base 'http://10.10.99.97' \
  --user admin
```

脚本只登录、读取状态并尝试退出，不控制设备、不执行远端任务、不升级。它不跟随跳转，不自动重试。输出仍需结合 valid、duty_valid 等判断。

## 浏览器状态订阅

subscribe.js 导出 watchTianShan，在能够访问设备的浏览器中作为 ES 模块使用，不需要第三方库。先从 HTTP 登录取得 Token：

```javascript
import {watchTianShan} from './subscribe.js';
const close = watchTianShan({
  baseUrl: 'http://10.10.99.97',
  token: yourLoginToken,
  onData: message => renderYourDashboard(message.data),
  onState: state => showConnectionState(state)
});
```

页面自行提供 renderYourDashboard/showConnectionState。离开页面时调用 close()；连接关闭后标记读数陈旧，再恢复认证和订阅。不要将 Token 写入源码、URL 或普通日志。示例没有自动重连和操作重放。

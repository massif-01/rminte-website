# 案例演示服务

为官网各案例提供私有静态演示。官网的 `services/case-access` 网关负责登录及权限校验，此服务只提供资源，不管理账户。禁止为此 Worker 开启公开 workers.dev、预览地址或公开路由。

## 目录职责

```text
case-demos/
  worker.mjs                  共享资源服务，仅响应 /<case-id>/public/ 下的资源
  wrangler.jsonc              共享部署配置
  cases/
    <case-id>/
      README.md               此案例的说明、接入与使用方式
      public/                 HTML、CSS、脚本、模型与素材
  tests/                      共享服务的测试
```

每个案例的名称、内容、使用方式和限制写在各自 README，不写入本目录说明或全站设计规范。开发过程及本地验收结果记录在 PR/CI artifact，不作为永久源码文档。

## 接入一个案例

1. 在 `cases/<case-id>/public/` 放置演示文件，引用使用相对路径。脚本模块优先使用 `.mjs`；由模块显式导入的桥接文件也可使用 `.js`，不能再重复 classic 加载。
2. 在 `services/case-access/resources.mjs` 注册该案例的 `demoPath: '/<case-id>/public/'` 和 `demoEntry: 'index.html?embed=1'`。只提供给已授权账户的入口应通过此网关，不使用公开旁路 URL。
3. 官网通过 `GET /api/resources/:caseId/preview` 读取入口，在唯一大型预览窗口展示；不再在前端单独登记入口或按内容高度调整外窗。
4. 子页面在可操作首屏完成后发送 `case-demo-ready`，通过 `case-demo-close` 请求关闭；按下文协议接入。外窗尺寸固定，不再接受高度消息。

## 生产自动部署

组织上游 `RMinte/rminte-website:main` 同时驱动两个 Cloudflare Git 集成项目：

| 项目 | 发布内容 | 配置 |
| --- | --- | --- |
| Pages `rminte-website` | 官网 `website/`，包括案例入口与账号网关 | 生产分支 `main`，保留原有自动部署 |
| Worker `rminte-case-demos` | 全部案例的私有演示资源与共享资源服务 | 生产分支 `main`，仓库根目录 `/`，部署命令见下文 |

Worker 构建由 Cloudflare 按仓库 lockfile 自动安装依赖，部署命令使用已锁定的 Wrangler：

```sh
npx --no-install wrangler deploy --config services/case-demos/wrangler.jsonc
```

构建监视路径为 `*`，覆盖新增案例、共享服务和依赖变更；关闭分支预览构建。`workers_dev: false`、`preview_urls: false` 和空 routes 保持生效，只允许官网网关通过 Service Binding 调用。

Pages 生产环境保留 `CASE_DEMOS` → `rminte-case-demos` 绑定，以及既有 `CASE_DB`、`CASE_SECRET`。此绑定首次配置后需要一次新的 Pages 部署才能生效，以后更新同名 Worker 无需重复绑定。新增案例仍按上文登记资源、官网入口及相应验收流程，合并后自动更新，不逐个创建新服务或手动发布。

合并 `main` 即授权官网及案例演示自动上线，不增加部署审批。两个项目独立构建，分别核对当前提交的部署结果；主站成功不代表演示 Worker 成功。发布后从正式官网的已授权账号验证演示，不能把部署成功或本地测试当成生产交互通过。生产回退也应核对两个项目的版本及接口匹配；账号服务的初始化、迁移和发布验收见 [账号服务说明](../case-access/README.md#部署方式)。独立 OTA 不在此链路内。

需要人工恢复时，从确定的提交检出，在仓库根安装依赖后执行上面的部署命令；只在 Cloudflare 管理已有生产凭据，不把凭据写入仓库或 PR。Cloudflare Git 构建参数在平台管理，不由 PR 检查工作流发布服务。

## 本地联调

按 [账号服务说明](../case-access/README.md) 准备本地测试库，在两个终端分别运行：

```sh
npx wrangler@4.151.0 dev --config services/case-demos/wrangler.jsonc --port 8789 --inspector-port 9231 --ip 127.0.0.1
npx wrangler@4.151.0 dev --config services/case-access/wrangler.jsonc --port 8788 --ip 127.0.0.1
```

访问 `http://127.0.0.1:8788/cases/`。纯静态预览不模拟账号及权限。账号与私有字节鉴权统一由 `services/case-access/tests/integration.mjs` 及公共浏览器流程验收；各案例仅在 `tests/browser/demos/<case-id>.mjs` 维护业务操作。

## 开发商网站与嵌入协议

网站在账号服务的资源表登记固定 HTTPS `demoUrl`，与 `demoPath` 互斥，不需要部署本服务。网站不会被本站代理；官网账号权限只管理入口，不替代开发商自己的访问控制。正式卡片名称、案例 ID 与各语言外层文案由 Owner 确定；测试页不作为正式内容登记。网站通用验收由 behavior.spec.mjs 拦截登记入口，使用自包含的跨源 fixture；不为 website 要求私有演示的业务脚本。真实网站业务另做联调。

私有演示必须支持 `case-demo-ready` 与 `case-demo-close`。先注册嵌入操作，再在可操作首屏完成时发送 ready；有自身登录的可操作登录页也可报告 ready。CAD 在 HTML 页头先设置嵌入布局，再加载样式与三维模块；桥接由 app.mjs 显式导入，reset() 和主要绑定完成后再通知；内部 dialog 优先处理 Escape，没有内部弹窗才请求关闭外层。不要发送高度消息。

外站无需实现消息协议即可嵌入操作；鉴权通过后直接显示网页，由网页管理自身加载状态，外层关闭按钮始终可用。若外站需要请求关闭外窗或报告就绪，可采用同一消息格式，并把父站 origin 固定为双方登记的精确值，例如 `parent.postMessage({type:'case-demo-ready'}, 'https://rminte.com')`；不能反射任意消息来源。父站只接收当前 iframe、精确 origin 和当前操作的 ready/close。iframe 初始 sandbox 为 `allow-scripts allow-same-origin allow-forms`，referrerPolicy 为 no-referrer；不透传本站用户、角色、cookie 或 token，不默认允许顶层跳转、弹窗、相机或麦克风。保留外站 origin 不代表绕过第三方 Cookie 限制，有实际登录需求时另验对应浏览器。

私有演示就绪等待上限为 30 秒；不以 load 代替 ready。外站不等待该通知，也不以 iframe load 声称网站业务已初始化成功。超时销毁该次 iframe，原窗口提供重试与关闭，不断言网站宕机或禁止嵌入。真实开发商构建接入时，记录构建标识、最终 sandbox、实际加载与主要操作；采用消息协议时另记录父站 origin。

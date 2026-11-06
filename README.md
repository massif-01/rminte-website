# RMinte 网站

[正式官网](https://rminte.com) · [组织上游](https://github.com/RMinte/rminte-website) · [贡献指南](CONTRIBUTING.md)

RMinte RM-01 官网源码。页面使用原生 HTML、CSS 和 JavaScript，正式站点目录为 `website/`，由 Cloudflare Pages 托管。`website/_worker.js` 提供访客语言与案例账号 API，账号数据保存在 Cloudflare D1；OTA 使用独立 Worker 和 R2。

样机借用的前后端、隔离本地预览、数据库迁移与云端接入说明见 [样机借用模块](services/sample-loan/README.md)。

## 网站与服务

- 主站：首页、图册、模型、应用案例、下载中心与多语言指南。
- [应用案例](https://rminte.com/cases/)与[管理后台](https://rminte.com/admin/)：账号登录、演示与下载的独立授权、账号管理和软件合作申请。
- [灯板工具](https://rminte.com/tools/emoji2pixel/)与 [TianshanOS 界面演示](https://rminte.com/tianshanos-demo/)。
- [OTA 服务](https://ota.rminte.com)：固件与 WebUI 成对发布、版本信息及下载，独立部署。

案例演示按可点击的前端模拟网页接入，沿用现有账号权限；接入与验证要求见 [CONTRIBUTING.md](CONTRIBUTING.md)。实际演示和资料以 [资源配置](services/case-access/resources.mjs) 为准，未接入的内容不会因账号已授权而自动可用。

## 目录

| 路径 | 用途 |
| --- | --- |
| [`website/`](website/) | 正式页面、静态资源与 Pages Worker 入口 |
| [`website/assets/`](website/assets/) | 共享品牌样式、交互、字体与媒体 |
| [`website/guides/content/`](website/guides/content/) | 在线指南的 Markdown 源稿 |
| [`services/case-access/`](services/case-access/) | 案例账号 API、权限、D1 迁移与资源接入配置 |
| [`services/case-demos/`](services/case-demos/) | 各案例的私有静态演示，随组织 `main` 自动部署 |
| [`services/tianshanos-ota/`](services/tianshanos-ota/) | 独立 OTA Worker 与发布同步说明 |
| [`scripts/`](scripts/)、[`website/scripts/`](website/scripts/) | CI、指南／翻译／字体生成及共享品牌资源同步 |
| [`tests/browser/`](tests/browser/) | 浏览器操作与截图证据检查 |
| [`.github/workflows/`](.github/workflows/) | 组织上游的 GitHub Actions 门禁 |
| [`docs/design-system-v2/`](docs/design-system-v2/) | 设计系统细则与参考材料 |

`design-preview/`、`copy-review/`、`output/` 是本地讨论或验证材料，可能不在其他贡献者的检出中，不作为生产页面依赖。

## 本地开发

需要 Node.js 22 或更高版本、Python 3 和 Git。所有命令从仓库根目录运行：

```sh
npm ci
npm run preview:ci
```

预览地址：`http://127.0.0.1:8788/`；案例与后台分别位于 `/cases/` 和 `/admin/`。该预览运行实际 Pages 路由，创建隔离的本地 D1 和临时管理员，不使用生产账号或数据库。管理员凭据位于 `output/ci/runtime-*/services/case-access/.local/admin-login.txt`；停止服务后临时数据会清理。需要保留本地数据库进行持续调试时，见 [案例服务说明](services/case-access/README.md)。

只查看静态页面排版时，也可以使用：

```sh
python3 -m http.server 4174 --directory website
```

静态预览地址为 `http://127.0.0.1:4174/`。登录、权限、访客语言接口和 Pages 路由需要使用上述本地 Pages 服务验证。

## 验证与贡献

修改前阅读 [AGENTS.md](AGENTS.md)；界面设计遵循 [DESIGN.md](DESIGN.md)。完整协作流程和验收范围见 [CONTRIBUTING.md](CONTRIBUTING.md)。

首次运行浏览器验证前安装 Chromium，再检查当前改动：

```sh
npx playwright install chromium
npm run verify
```

Linux 缺少浏览器系统依赖时使用 `npx playwright install --with-deps chromium`。默认与 `origin/main` 比较并包含本地改动；个人 fork 如何指定组织上游基线，见贡献指南。

验证按实际差异选择源码、密钥、生成资源、配置构建、账号服务与浏览器检查。报告在 `output/ci/report.md`，浏览器过程在 `output/ci/playwright-report/index.html`；PR 的 Checks 中可下载对应提交的截图与诊断材料。测试使用隔离的本地数据，不作为生产服务或设备验收。

新增或修改中文页面文案后运行 `python3 website/scripts/build-fonts.py --check`；需要重建字体时按 AGENTS.md 操作，额外依赖 `fonttools` 和 `brotli`。

PR 目标为 `RMinte/rminte-website:main`。普通贡献者需要必要 CI 和 Owner `massif-01` 批准；Owner 本人保留审批、AI 审查、材料例外与原生绕过权限，自行决定合并。Codex 自动审查要求位于 AGENTS.md 的 `Code Review Rules`。

## 部署

| 配置 | 当前值 |
| --- | --- |
| Pages 项目 | `rminte-website` |
| Git 仓库与生产分支 | `RMinte/rminte-website` 的 `main` |
| 构建根目录 | 仓库根目录 |
| 构建命令 | `exit 0` |
| 输出目录 | `website` |
| 正式域名 | [rminte.com](https://rminte.com)、[www.rminte.com](https://www.rminte.com) |

Pages 从完整仓库构建并编译 `website/_worker.js`，其账号 API 依赖 `services/case-access/` 中的模块。生产 D1、密钥和私有资源绑定由 Cloudflare 管理，不将本地凭据或数据库复制到生产。新增静态案例复用现有演示服务及绑定；生产自动部署、首次绑定与恢复方式统一见 [案例演示服务说明](services/case-demos/README.md#生产自动部署)；账号服务的初始化、后续更新和发布验收见 [账号服务说明](services/case-access/README.md#部署方式)。

合并到组织 `main` 即触发主站 Pages 和已接入的案例演示 Worker 自动部署，不增加单独的部署或上线审批；两项构建分别确认成功。独立 OTA 仍按明确授权单独发布，不随主站合并自动部署。

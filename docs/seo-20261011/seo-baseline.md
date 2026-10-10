# SEO 技术基线（2026-10-11）

实现基线为个人仓库 `massif-01/rminte-website` 的 `main`，提交 `62a50423072e5d955d7605d1ad1122023f6bb357`。在 `/private/tmp/rminte-seo-worktree` 创建 `seo/technical-20261011` 独立检出；原工作区 `ui/refinement-20261008` 的设计、案例、指南及下载资料修改没有纳入本次 PR。

已完整阅读交接包全部 12 个文件，11 个清单项的 SHA-256 均匹配。交接包的历史搜索观察仅作为核查线索。

## 架构与范围

生产目录是 `website/`，静态 HTML/CSS/JS，无前端框架或 SEO 插件。指南由 Markdown 和 `website/scripts/build-guides.mjs` 生成，四个非中英语言目录由 `build-translations.mjs` 生成。`_worker.js` 只处理地区默认语言；`_routes.json` 将其他请求交给 Pages 静态资源路由。没有修改 Worker、业务 API、路由 include/exclude 或 `_headers`。

README 记载 Pages 项目 `rminte-website`，构建根为仓库根，构建命令 `exit 0`，输出 `website`，生产分支 `main`。当前 Pages 管理 API 的只读请求未成功取得配置，故不将这份 README 信息冒充当前平台配置证明。两个 GitHub 仓库实际 API/ls-remote 核实：个人仓库可写，上游 `lilbear000001-ui/rminte-website` 只读。

## 完整页面清单

| HTML 文件/家族 | Pages 规范访问路径 | SEO 决策 |
| --- | --- | --- |
| `index.html` | `/` | 优化元数据，Organization/WebSite/Product/WebPage |
| `models/index.html` | `/models/` | 优化元数据，WebPage；不拆分模型页面 |
| `gallery/index.html` | `/gallery/` | 优化元数据，WebPage，图片 sitemap |
| `downloads/index.html` | `/downloads/` | 优化元数据，WebPage |
| `guides/index.html` | `/guides/` | 优化元数据，WebPage |
| `guides/admin.html` | `/guides/admin` | 优化元数据，WebPage，同步指南生成器 |
| `guides/root.html` | `/guides/root` | 同上 |
| `guides/security.html` | `/guides/security` | 同上 |
| `guides/network.html` | `/guides/network` | 同上 |
| `tianshanos-demo/index.html` | `/tianshanos-demo/` | 原有 meta refresh 到 system.html，保留 |
| `tianshanos-demo/{system,network,files,terminal,commands,automation,security}.html` | 同目录下对应无扩展名路径 | 七个既有演示页，中文，保留独立演示内容和 head，不混入主站产品 sitemap |
| `tools/emoji2pixel/index.html` | `/tools/emoji2pixel/` | 合作商独立工具，中英自己的翻译机制；保留既有 head 和功能，不混入主站产品 sitemap |

共 18 个既有 HTML 文档，没有增加内容页面。新增 `404.html` 为 **0 字节** 的 HTTP 错误响应资源，只关闭 Pages 的隐式 SPA 回退，没有正文、标题、导航或可见设计。原工作区的 `cases` 和 `admin` 属于另一分支的未发布工作，两页源码已有 noindex，本次不带入或修改。

每个主站页面都有 zh/en/ja/ko/es/fr 六种前端语言状态；指南把六种正文放在同一文档内。匿名 GET 的初始 head/body 是中文；`?lang=en` 不在服务端生成英文 HTML，浏览器由现有 JS 切换。`/zh/` 没有源文件或独立语言路由，线上看到的中文源码来自首页回退。故不制造 hreflang、新语言 URL 或新的 SSR 架构；sitemap 每个内容文档列一条规范 URL。

## 已确认事实

对 apex 和 www 各执行 32 个真实 GET，共 64 个；原始响应头/正文留在本地 `output/seo-20261011`。逐项元数据与跳转记录见同目录报告附件。

- 9 类主站页面原有 title/description；仅模型页有 Canonical。所有页面没有 JSON-LD，模型页也没有 OG 信息。
- apex 与 www 均可返回 200；现有模型 Canonical、README 正式域名、站内资源身份均使用 `https://rminte.com`。保留 apex；不进行域名迁移或 CDN 级重定向。
- `.html` 与目录 `index.html` 的别名已由 Pages 永久跳转到无扩展名/目录路径。沿用这些行为，不增加重复 `_redirects`。
- 两个随机路径、缺失 SVG、`/zh/`、`/contact`、`/waitlist`、`/privacy-policy`、`/zh/blog` 均 200 返回首页。仓库不存在对应内容文件，也没有对应业务路由，确认根因为没有顶层 404 文件触发的 Pages SPA fallback。
- `robots.txt` 与 `sitemap.xml` 原来也是 200 首页 HTML，不是真实机器可读资源。
- 真实 SVG/CSS/JS/字体/PDF/图片 MIME 正确；不重写本来正确的资源路由。
- 图册由 `gallery.js` 管理 11 张照片，首张在原 HTML 中；全部已有准确双语 Alt。11 张照片线上均 GET 200、image/jpeg。保留 Alt、DOM、预加载和画质，通过 sitemap 提供发现线索。

`/privacy-policy` 和 `/waitlist` 没有发现实际法律/报名内容。本次没有添加针对它们的删除、410 或首页重定向规则；关闭全站错误回退后，无源路径自然返回 404。这不代表已补齐法律或报名业务；若业务另有未入库路由，生产发布前应由负责人确认。没有声称此类业务要求已解决。

规范依据：Pages 的无 404 文件 SPA 回退与自动 HTML 别名见 [Cloudflare Serving Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/)；当前同 URL 前端语言状态不伪造独立语言页，参照 [Google 本地化版本规范](https://developers.google.com/search/docs/specialty/international/localized-versions)。对 JS 图册使用机器可读图片索引而不加 DOM/加载，参照 [Google 图片 sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps)。

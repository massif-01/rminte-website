# SEO 实施与交付报告（2026-10-11）

已完成九类现有主站页面的中文/英文 SEO Title、Description、OG 标题/摘要、绝对图片 URL、og:url 与 Canonical；保留日/韩/西/法语原有准确元数据文案，并添加新英文元数据键对应的目录条目，避免六语言切换发生缺失翻译。正文和界面翻译原有键值均保持不变。

## 实际修改

- `website/scripts/seo-metadata.json`：交接包中文/英文元数据的唯一配置。
- `website/scripts/seo.mjs`：无需依赖的静态 head/robots/sitemap 生成；指南生成器直接复用 head 函数，不新增浏览器脚本或请求。
- `website/scripts/build-guides.mjs`：只替换 head 的 SEO 输出；用于页面正文、面包屑、搜索索引的原有 title/description 配置不变。
- `website/index.html`、`models/index.html`、`gallery/index.html`、`downloads/index.html`、`guides/index.html`、`guides/{admin,root,security,network}.html`：只改 head。
- `website/locales/{source,ja,ko,es,fr}.json` 与 `website/assets/translations/{ja,ko,es,fr}.js`：加入元数据键，保留所有既有翻译。
- `website/robots.txt`：不封锁内容及渲染资源，引用规范 sitemap。
- `website/sitemap.xml`：9 条规范页面 URL、图册 11 张现有图片，无伪造 lastmod 或 hreflang。
- `website/404.html`：0 字节，关闭已证实错误的 Pages SPA 回退。
- `scripts/check-seo.mjs`：对真实 Pages 资源路由执行 GET 回归、规范路径/查询参数、schema、404、MIME 和媒体字节检查。
- `docs/seo-20261011/`：基线、跳转矩阵、元数据证据、验证与本报告；不在生产目录公开审计页面。

JSON-LD 只记录可核实的 RMinte 公司身份、RM-01 基本产品身份及 WebSite/WebPage 关系。没有价格、库存、评分、评论、出版时间或未经证实的参数；不承诺 Google Product 富结果。

交接包的全角标题分隔符改为 ASCII ` | `，“涵盖”改为“包括”：语义一致，复用现有字体子集，无需新增字形、重建字体或改变加载策略。

## 未实施与限制

- 不创建独立语言页，不添加不真实的 hreflang；浏览器英语状态可以验证，但匿名 HTTP 仍是中文初始 HTML，这是原有架构边界。
- 不迁移 apex 到 www，也不添加域名重定向；用一致 Canonical、OG、schema 和 sitemap 收敛到原有 apex。
- 不猜测 `/contact` 应跳到弹窗、不猜测旧博客文章映射、不创建隐私页或报名页；空 404 只修复无源路径的错误成功响应。
- 不新增 Rich Results 所需的虚构 Product offers/reviews，不生成 SEO 隐藏正文、图片或关键词。
- 独立演示及合作商工具不改造元数据/翻译架构；它们未被 robots 阻止或 noindex，未进 sitemap 不代表禁止索引。
- 无 Search Console 权限；未运行 Google Rich Results Test、真实 Googlebot 渲染、生产发布后验证或排名/收录验证。当前 Pages 管理 API 配置未取得。

## 维护与发布

编辑元数据后运行 `node website/scripts/seo.mjs`；修改相关英文键时同步四语言 JSON 并运行 `node website/scripts/build-translations.mjs`。指南重建仍运行 `node website/scripts/build-guides.mjs`，不会覆盖 SEO 配置。交付的是已生成静态资源，无需改变现有生产构建命令或引入依赖。

使用 `wrangler pages dev website --port 4189 --inspector-port 9237 --compatibility-date 2026-10-06` 验证路由，再运行 `node scripts/check-seo.mjs http://127.0.0.1:4189`。普通 preview 对 `.html` 别名和 XML MIME 的行为不能替代 Pages 路由证明。

本任务仅提交功能分支和 PR，未合并、未执行生产部署命令、未更改平台配置。README 记载推送 main 会部署，后续合并/发布须有对应授权；发布后还需检查两个正式域名、全部 Canonical、robots/sitemap、404 与核心交互。

## 回滚

合并前关闭/不合并 PR 即可；代码已经进入 main 后，以 `git revert <本 PR 的提交 SHA>` 创建回退提交，检查本报告列出的文件后依原发布流程发布。此次没有新增永久重定向规则或迁域；现有平台别名规则没有改变。撤销空 `404.html` 会重新启用 SPA 回退、恢复已确认的软 404 风险；应明确接受这一后果。未部署时 Git 回退不会改变线上状态。

# SEO 回归验证

验证对象是隔离分支的本地代码；线上 GET 用于修改前事实基线，没有执行生产发布后测试。

## 已通过

- 交接包 SHA-256 清单 11/11；附带探测工具离线 unittest 3/3。初始 Python 线上探测遇到不完整 chunked 响应而中断，未计为通过；改用 curl HTTP/1.1 完成两个域名 64 个 GET，保存原始头和正文。
- `scripts/check-seo.mjs`：真实 Wrangler Pages dev 执行 45 个页面/别名/机器资源/负例 GET，加 16 个图片与静态文件字节检查。覆盖九类页面、显式 zh/en、UTM、九个 `.html`/index.html 别名、7 个随机/缺失资源、robots/sitemap、11 张图片和 SVG/CSS/JS/字体/PDF。
- 九类页面 title/description/canonical 唯一，schema JSON 可解析，Canonical 与 sitemap 一致；sitemap XML 已解析，9 URL + 11 图像，无虚构 lastmod/hreflang。
- 线上全部 11 个图册图片 GET 200 + image/jpeg。
- `node --check website/scripts/seo.mjs`、`node --check website/scripts/build-guides.mjs`、`node --check scripts/check-seo.mjs`、四份生成翻译目录的语法检查及 `git diff --check`。
- SEO、指南、翻译构建可重复运行，生成产物哈希相同；指南 search-index 未发生变化。
- `python3 website/scripts/build-fonts.py --check`：站内 1389 个中文字符均在现有子集中，未改变字体文件。
- 18 个原 HTML 文档的 body 逐字节不变。九个修改页面的可执行 head 脚本，以及 script/style/preload/icon 的引用顺序和属性也逐项相同。原有四语言翻译键的值全部不变；页面 CSS、图片、视频、字体、加载/预加载/缓存配置、业务和交互脚本均无 diff。
- Playwright/Chrome 在同一浏览器、相同 reduced-motion 设置、视频固定在首帧的测试条件下，九类页面 × 中英 × 1440/390 = 36 组状态，各保存修改前/后截图。36/36 可见正文哈希、主要布局与计算样式哈希、html lang、资源 URL 集合均相同，翻译缺失为 0。
- 截图比较：34/36 逐像素相同；首页英文桌面有 8 个像素差异（每通道最大 1），下载页中文手机有 121 个像素差异（351000 像素中约 0.0345%）。这些状态的文本、元素矩形、字体和颜色计算样式都相同，不宣称全部截图逐像素相等。

- 在修改前和修改后两份代码上，均通过图册全 11 张切换/循环、方向键、滑动手势、手机菜单 Escape、语言菜单、指南搜索结果跳转、手机目录锚点，以及一次实际 PDF 下载（671671 字节）。首页视频可播放，分解与工艺章节可滚动访问；两次交互检查 pageerror 为 0。

- 日/韩/西/法语九类页面，修改前后共 72 次浏览器加载：字体与本地化完成后，Title、Description、语言标记、可见正文逐项相同，缺失翻译为 0。早期过早取样的正文差异未计为通过，等待字体与异步内容稳定后重新验证。

- 普通动效模式下，在两份代码上分别验证分解起点/中点/终点及向上回退、宝石滚动亮度、工艺四个步骤。测试用 instant 滚动固定观测位置，原站的 smooth-scroll 策略不变；工艺 active 面板均为 0/1/2/3。

## 证据

- 本目录 `seo-metadata-audit.json`、`seo-redirect-matrix.csv`：生产修改前与本地 Pages 修改后事实。
- 本地 `output/seo-20261011/`：原始 curl 头/正文、`before-browser.json`、`after-browser.json`、72 张截图、`browser-differences.json`、`pixel-differences.json`、`http-checks.json`、资源哈希及交互日志。截图和原始大文件不纳入代码提交。
- Pages dev 启动曾遇到缓存目录写权限、系统文件监听上限和占用端口；最终使用任务专属配置目录、4189 端口及 9237 inspector 运行，实际 HTTP 回归成功。监听警告不作为路由通过证据，真实 GET 才是依据。

## 未执行/未证明

未执行生产部署、Search Console 提交/索引验证、真实 Googlebot 渲染、Google Rich Results Test、排名比较、性能评分或 HDR 硬件显示验收。没有宣称元数据已上线、已收录或提升排名。资源 URL 集合一致及源代码不变证明加载策略未改；不把网络时序噪声解释为严格相同的传输时间。

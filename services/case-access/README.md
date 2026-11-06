# 案例账号后台

案例访问服务；本地配置使用占位数据库，生产数据库见 `production.jsonc`，网站继续部署到现有 Pages 项目。正式站点源码在 `website/cases/`、`website/admin/`；旧 `design-preview/cases/` 仍是独立静态讨论稿。

## 架构和费用

保持现有 Cloudflare Pages，扩展其 `_worker.js`，将 `/api/*` 纳入 `_routes.json`。使用 D1（SQLite）保存账号、会话、成功登录记录、软件合作伙伴申请和接口限流计数。静态页面无需逐次运行 Worker。无需外部数据库服务或常驻服务器。

官方文档于 2026-09-26 核对：D1 Free 每天 500 万行读取、10 万行写入、总计 5GB 存储；Workers Free 动态请求每天 10 万次、每次 10ms CPU。免费额度为账户共享资源，实际占用需部署前核对。不能将本地测试当成生产 CPU 和流量验收；超出免费额度会影响可用性，不保证任何访问量都永久免费。

- https://developers.cloudflare.com/d1/platform/pricing/
- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/pages/functions/bindings/

## 账号与权限

- 用户名：`rminte-` + 10 位随机小写字母/数字。
- 密码：12 位大小写字母和数字，保证三类均存在。Web Crypto 安全随机数、拒绝采样。账号仅由管理员生成，没有自助注册或修改用户名/密码接口。
- 生成普通用户账号只产生凭据，案例权限为空；生成后在列表中选择案例。创建接口不接受角色或提前授权。
- 管理员独立于普通用户案例授权；完成首次改密后可使用全部案例。普通用户按 `case_grants` 授权，演示与下载同时开放，对现有会话后续请求生效。
- 分发密码按用户身份作为附加认证数据，用 AES-256-GCM 加密保存。验证使用独立 HKDF 子密钥的 HMAC-SHA256，适用于**仅允许系统随机生成的高熵密码**；管理员修改密码后，升级为每账号独立随机盐的 PBKDF2-SHA256（100,000 次迭代，先用服务端独立 HMAC 密钥加 pepper）；新密码至少 15 个字符。管理员密码不保存可解密副本。此路径需要单独验收生产 CPU 配额。
- `CASE_SECRET` 为随机 32 字节的 base64，由 Cloudflare Secret 管理，不存入 D1 或代码。验证和加密使用不同子密钥。丢失或直接更换主密钥会使既有密码失效；上线前需备份密钥，轮换需要专门迁移。
- 密码列表默认遮蔽，管理员可查看或复制。管理员密码本身不保存在可解密列表中。
- 登录 cookie 在 HTTPS 上为 `__Host-rminte_session; Secure; HttpOnly; SameSite=Strict; Path=/`；会话有效期 24 小时。D1 只保存会话令牌散列。退出删除对应会话；删除用户级联删除会话和登录记录。
- 变更请求必须同源；登录有 IP 和用户名双层频率限制。公开申请按 IP 限流。所有接口响应禁止缓存。

## 登录记录与申请

成功登录时取 Cloudflare 的 `CF-Connecting-IP` 和 `request.cf.country/region/city`，记录时间，并显示距今多少分钟。历史保留 90 天，在后续成功登录时清理过期记录。**只记录，不比较跨地区、不自动封禁。** 本地运行若没有边缘地区数据，显示“地区未知”；不伪造真实定位。

收件箱只接收软件合作伙伴申请，字段为姓名、公司、邮箱、合作构想、产品理解与开发经验，提供已读标记和分页。不会自动发邮件，也不会自动开通账号。数据以文本渲染，避免将申请内容执行为 HTML。

## 本地运行

所有命令从仓库根目录执行，使用仓库锁定的 Wrangler 版本：

```sh
CASE_ADMIN_PASSWORD="<管理员初始密码>" node services/case-access/bootstrap.mjs
npx wrangler d1 migrations apply CASE_DB --local --config services/case-access/wrangler.jsonc
npx wrangler d1 execute CASE_DB --local --config services/case-access/wrangler.jsonc --file services/case-access/.local/bootstrap.sql
npx wrangler dev --config services/case-access/wrangler.jsonc --port 8788 --ip 127.0.0.1
```

- 案例：`http://127.0.0.1:8788/cases/`
- 后台：`http://127.0.0.1:8788/admin/`
- 本地管理员账号：`services/case-access/.local/admin-login.txt`。只用于本地，文件权限 0600，目录和密钥均已 gitignore。
- bootstrap 不能重复覆盖已有初始化文件；不要为重复运行而清除现有数据库。
- `node services/case-access/tests/integration.mjs`：要求本地服务已启动。建立并删除测试用户，会留下显式标注的本地测试合作申请。
- `tests/crypto.test.mjs`：独立密码格式、加密和绑定验证。

## 部署方式

`wrangler.jsonc` 是 **Workers 本地模拟配置**，数据库 ID 是本地占位符，不能直接执行 `wrangler deploy` 来替代现有 Pages。生产自动部署项目、命令和演示绑定统一见 [案例演示服务说明](../case-demos/README.md#生产自动部署)。

初始化、后续更新和发布验收是不同职责。首次初始化完成后仍须构建、发布并验收；已有生产环境更新时不重复建库或导入初始管理员。

### 首次初始化

1. 核实当前 Pages 项目、账户套餐、D1 剩余额度，创建 `rminte-case-access` D1 数据库。保持 Preview 与 Production 数据隔离。
2. 在 Pages 的 Production 绑定中添加 `CASE_DB`（D1）和 `CASE_SECRET`（Secret），记录真实数据库 ID。管理员用户名固定为 `admin`，初始密码通过私有环境变量 `CASE_ADMIN_PASSWORD` 注入；未提供时生成随机密码。指定密码使用加盐 PBKDF2 验证值，明文不写入仓库或静态站点。生产密钥独立于其他环境，不能复制本地测试数据库。
3. 对准确的远端 D1 应用全部 migrations（已有数据库按下文 0002 流程升级），再导入与生产 `CASE_SECRET` 对应的管理员初始化 SQL。禁止将明文账号、`.dev.vars` 或 `.local` 放入 `website/`。

### 构建发布（首次上线与后续更新）

1. 已有环境涉及数据库 schema 变更时，使用 `production.jsonc` 指向准确的远端 D1，仅执行所需迁移，按变更的兼容性安排迁移与代码发布顺序；没有 schema 变更不要求重复迁移。
2. 从确定的仓库提交构建 Pages Worker。`website/_worker.js` 引用了仓库内的 `services/case-access/` 模块，打包必须在包含这些模块的快照里完成；可用 `wrangler pages functions build --build-output-directory website --outdir <临时输出目录>` 验证打包。生产由 Git 集成从完整仓库编译并发布，不能单独复制未打包的入口文件后丢掉其依赖。
3. 合并到组织 `main` 后，按演示服务说明核对 Pages 与演示 Worker 的构建和部署提交、状态。发布自动进行，不再另行审批；构建失败或某一项目成功不代表整个发布已完成。首次配置或绑定有变化时，确认新的部署已使其生效。

### 发布验收

首次上线与后续更新都须确认部署结果，并按实际影响验收；自动部署不代替验收。非生产文档修改按 AGENTS.md 检查文档和链接，不额外要求业务测试。

- 核对正式域名的版本和受影响页面／接口。路由、权限或配置有变化时，确认 `_routes.json` 仍包含 `/api/*` 和 `/visitor-language.js`，Production／Preview 数据隔离，Functions failure mode 为 fail closed；受限内容仍位于私有服务／R2。
- 首次上线应覆盖管理员与普通用户流程、逐案例权限、退出与删除失效、D1 持久化、真实 IP／地区和 Worker CPU 限制；后续按变更影响选择对应项目。演示变更从官网授权入口验证主要流程及关闭／返回和重开；生产资源交付不能用本地合成文件测试代替。
- 记录部署提交、实际操作结果及未覆盖项。只完成迁移、CI 或自动部署，不宣称用户流程已验收；已有生产验收的证据范围见下文。

## 演示与下载接入契约

当前接入项以 [资源配置](resources.mjs) 为准。`industrial-modeling` 静态模拟演示已通过官网账号网关接入生产，服务及绑定的维护方式见 [案例演示服务说明](../case-demos/README.md#生产自动部署)。其他案例或资料没有登记资源时，已授权请求仍返回 503；这不是接入了真实软件单点登录。 经销商资料独立于案例清单，按下节接入。

`resources.mjs` 是服务端唯一登记表。演示配置恰选一种：私有 `demoPath`（例如 `/<case-id>/public/`）加该目录内相对 `demoEntry`（例如 `index.html?embed=1`）；或固定 HTTPS `demoUrl`，不得含用户名/密码。入口越出本案例网关、两种来源同时存在或地址无效时明确返回 503。只有下载的条目可以不配演示。

`GET /api/resources/:caseId/preview` 要求该案例授权，返回 `{kind:'private'|'website',src}`。匿名 401，无权限 403，未接入/配置错误 503。私有演示缺 CASE_DEMOS 返回 503；网站不依赖该绑定。客户端不提交任意目标地址。网站分支不代理第三方内容，不逐次 HEAD 外站，不向其发送本站身份。

私有 `/api/resources/:caseId/demo/…` 仍逐个请求鉴权，内部 Service Binding 传入 X-RMinte-User / X-RMinte-Role；不复制到外站。私有 Worker 禁止 workers.dev、preview URL 与公开 routes，响应 private,no-store。`fileKey/fileName` 与 CASE_FILES R2 决定资料是否已接入；访问权限与该案例演示共用案例授权。账号权限按下文 0002 迁移，不新增 SSO 或公开旁路。私有演示复用既有 `rminte-case-demos` Worker 与 Pages 的 CASE_DEMOS 绑定；外站预览无需这个 Worker。

大型预览、外站直接展示及私有演示 ready/close 协议见 [演示服务说明](../case-demos/README.md)。

本地 `npm run preview:ci` 使用临时 Pages 源码树、D1、私有 Worker 与合成 R2；测试资源位于 `tests/resources.json`，同一资源表被临时 Worker 和 integration.mjs 实际读取，不改正式卡片或生产登记。测试仅在本地目录中生成账号与密钥。`npm run verify -- --base=<main SHA>` 执行既有 integration 入口，额外启用缺私有绑定的独立本地 Pages 实例，验证网站依然可用。

## 验收边界

本地 workerd + D1 HTTP 集成与浏览器测试验证隔离的测试环境。2026-10-19 已完成官网及演示 Worker 的生产部署、绑定与工业建模演示联调，证据见 [PR #21](https://github.com/RMinte/rminte-website/pull/21)。

- 已验证的生产范围：使用已有管理员会话从官网打开演示，完成尺寸选择、模型展示与版本回看、关闭和重开；匿名访问演示 HTML、脚本和样式被拒绝，Worker 的独立公开地址不可用；主线提交自动触发两个项目并部署成功。
- 本次未覆盖的生产验收：普通用户授权及撤权、退出与删除后的会话失效、D1 数据持久化专项检查、真实 IP／地区定位、CPU 配额，以及真实下载资源交付。本地测试和管理员演示成功不能替代这些验收，也不能证明未来新增案例已验证。

后台仅中文；官网案例外层提供六种语言，各演示内部语言与能力以其案例 README 为准。

管理员在后台登录状态旁点击「修改密码」，验证当前密码后设置新密码。普通用户没有此入口，接口也拒绝普通用户。修改成功会撤销该管理员的全部会话；初始密码文件不会同步更新，之后应使用自己设置的新密码。

生产 D1 运维使用 `--config services/case-access/production.jsonc --remote`；该配置仅供数据库命令，不用于 `wrangler deploy`。Preview 不绑定生产 D1 或 CASE_SECRET；两种 Pages 环境均 fail closed。

## 账号与案例权限升级（0002）

本节描述待部署实现，不表示生产迁移已执行。`users.role` 仍为 `admin/user`，`is_owner=1` 标识唯一主管理员。仅该身份可调用 `/api/admin/admins`；普通管理员可管理所有普通用户，所有用户管理目标必须为 `role=user`。主管理员不能由接口创建、转让、停用或删除。

普通用户使用 `case_grants(user_id,case_id)`，一个案例授权同时开放演示和资料下载。共用的公开案例清单在 `website/assets/case-catalog.mjs`；私有服务与文件映射仍在服务端。`GET/PUT /api/admin/users/:id/cases` 读取／整体替换授权，PUT 提交 `{case_ids,dealer_download,version}`。并发版本冲突返回 409，所有写操作在同一 D1 batch 中按版本条件执行，不会部分覆盖。旧 PATCH 总开关接口已移除；旧字段仅为迁移核对保留，不参与新权限判断。

主管理员可通过 `POST /api/admin/admins` 创建普通管理员（仅接受可选 label），初始密码随机生成 24 位，仅返回一次，数据库不保存可解密副本；首次登录仅允许会话查询、退出及自己的密码修改。完成修改后所有会话撤销，重新登录后获得管理权限。`PATCH /api/admin/admins/:id` 仅接受 `{enabled:boolean}`，停用及启用都会撤销旧会话。普通用户的密码分发功能保持不变。管理员密码丢失时本次不提供找回／重置接口；Owner 可停用旧账号后分发独立账号。创建超时不自动重试，应先核对管理员列表。

权限变更、管理员创建和状态变化写入 `permission_events`，记录操作者、目标、变更及时间，不存密码／令牌。前端隐藏入口不是安全边界；每次请求读取有效会话和账号状态，演示子路径、HEAD 和资料下载都检查案例权限。撤权影响后续请求，不能回收已下载的文件。

### 迁移与切换

1. 在明确的发布授权下核实当前部署代码、数据库和备份。先在隔离数据库演练。启用账号服务维护窗口，阻断旧版本对账号及私有资源的读写；公开站点仍可访问。数据库迁移本身不能让仍运行的旧代码理解新规则。
2. 导出最小账号清单：`SELECT id,username,role,can_demo,can_download FROM users ORDER BY id;`，保存为 JSON 数组（不要包含密码字段）。明确核实唯一现有 `admin` 的 ID。存在额外管理员则停止自动迁移并核对。
3. 生成 SQL：`node services/case-access/upgrade.mjs inventory.json OWNER_ID upgrade.sql decisions.json`。decisions 可省略；单项旧权限必须提供明确的用户 ID 到案例 ID 数组映射。双开映射为当前所有案例，双关映射为空。不得静默扩大单项旧权限。
4. 在维护窗口中应用 0002 schema，再将生成的升级语句作为**一个原子数据库事务／D1 batch**执行；不能逐条独立提交。生成器只写文件，从不连接数据库。可在持有目标 D1 binding 的受控维护执行器中调用 `applyUpgrade(db, inventory, ownerId, decisions)`，该函数使用单次 D1 batch；不要逐条执行 SQL 文件。生成 SQL 对清单数量、角色、旧权限及未迁移状态做断言；任何不一致都中止。迁移撤销旧会话，完成后设置 `access_settings.ready=1`。
5. 部署当前代码，核对只有一个 Owner、各类账号与案例授权、备份和迁移版本。未 ready 的新服务对账号请求返回 503。完成新版本角色／撤权／登录验收后解除维护窗口。
6. 禁止回退到不识别 is_owner、disabled_at 或 case_grants 的旧代码。恢复版本必须保留新权限校验；如需数据恢复，单独评估备份之后新增的数据，不直接覆盖。

新环境先应用全部 migrations，再使用更新后的 bootstrap.sql；bootstrap 指定唯一 Owner 并启用新权限，不覆盖现有账号。生产账号迁移未在本次开发中执行。

### 新增验证

`node --test services/case-access/tests/*.test.mjs` 包含加密、SQLite 迁移事务、本地 D1 原子迁移与权限代理测试（Node 22.13+ 或 24）。资源测试使用明确的隔离演示／文件 fixture，不能证明真实私有服务可用。既有 `integration.mjs` 扩展了真实本地 Pages/D1 上的管理员与案例权限矩阵。浏览器 `account-permissions.spec.mjs` 覆盖创建、首次改密、跨管理员管理普通用户、授权保存、取消与停用，使用 CI 临时数据库和账号。

## 经销商资料

后台以列表管理多份 PDF：添加、修改名称、替换文件、删除。`dealer_materials` 表保存标题、实际文件语言、原文件名、大小、状态、版本和私有 R2 对象位置；文件不放在 `website/` 或公开下载域名中。目录只读取 D1，不逐次查询 R2；文件信息由上传或下述一次性迁移核实后写入。

每份资料至少填写一种网站语言的名称，支持 zh/en/ja/ko/es/fr，各语言最多一行。名称完全由管理员手工填写，与原文件名分开保存；不自动翻译标题或 PDF。当前语言没有名称时不展示，不回退到其他语言。文件实际语言可选上述六种或 multi；不同内容语言的 PDF 可作为独立资料登记。

| 接口 | 用途 |
| --- | --- |
| `GET /api/dealer-materials?lang=zh` | 公开元信息，只返回该语言已发布且大小已记录的资料，不返回私有对象位置 |
| `GET/HEAD /api/dealer-materials/:id/download` | 按当前会话及独立下载权限读取 PDF；附件使用原文件名，禁止缓存 |
| `GET /api/admin/dealer-materials` | 管理员列表，包含草稿、删除未完成、旧文件待清理状态及版本 |
| `POST /api/admin/dealer-materials` | JSON `{titles:{zh:"名称"},fileLanguage:"zh"}`，创建待上传草稿，返回 id/version |
| `PATCH /api/admin/dealer-materials/:id` | 同上并携带 expectedVersion，修改名称及实际文件语言 |
| `PUT /api/admin/dealer-materials/:id` | PDF 二进制，`If-Match` 传版本，`X-File-Name` 传 encodeURIComponent 后的原文件名，最大 20 MiB |
| `POST /api/admin/dealer-materials/:id` | `If-Match` 传版本，清理替换后遗留的旧对象 |
| `DELETE /api/admin/dealer-materials/:id` | `If-Match` 传版本，停止展示/下载后删除文件和资料记录 |

所有写操作要求同源、有效且完成首次改密的管理员；数据库写入再次核对当前会话与权限，版本冲突返回 409。原有普通用户下载授权语义不变。

上传先校验 PDF 和大小，再写新对象，数据库原子切换指向后发布；失败不覆盖原 PDF。替换后旧对象位置保存在 obsolete_key，后台立即清理；失败明确展示“旧文件待清理”，管理员可继续处理，清理前不能再次替换。删除先将状态变为 deleting，再清理当前/旧对象，最后移除记录；中途失败保留“删除未完成”，可按列表最新版本继续删除。上传失败的新增草稿可继续编辑上传或删除。

R2 写入与 D1 更新不属于同一事务。进程若在写入新对象后、更新数据库前终止，可能留下未引用的私有文件；目录不会展示它，但它仍占用存储。需要处理时，在暂停资料写入的维护窗口核对 `dealer/` 下对象与表内全部 `object_key`、`obsolete_key` 引用，确认无引用后人工删除，不能按文件年龄直接删除；当前没有自动清扫任务。

### 旧资料迁移与发布顺序

`0006_dealer_materials.sql` 尚未应用到生产，需在上线新代码前应用。它保留原资料 ID、六语言名称、文件名和对象位置，先登记为 `draft`、`size=NULL`；未知大小不填 0，也不提前发布。

在已授权的发布维护窗口，关联备份 D1/R2，依次应用 0005、0006 并核对结果；单个迁移失败应停止后续发布，不能把前一文件成功当作全部迁移成功。然后一次性核实生产 `CASE_FILES` 实际绑定的私有 bucket 中的 `dealer/rm01-product-comparison.pdf`：

- 对象存在：核对其内容和精确字节数，用下列 SQL 模板回填并发布。将 `<VERIFIED_BYTES>` 替换为核实后的正整数字节数，不能直接执行占位模板；核对恰好更新一行，再查询确认 ID、对象位置、大小、状态及原六语言名称。
- 对象不存在：保留待上传草稿，公开目录及下载不发布它；部署后由管理员上传真实 PDF，上传操作会记录真实大小并发布。不伪造大小、不将读取失败当作对象不存在。
- R2 核实失败或更新行数不符：停止发布并查明原因，不能跳过核实，也不能覆盖已经被修改的记录。

```sql
UPDATE dealer_materials
SET size=<VERIFIED_BYTES>, status='published', row_version=row_version+1,
    updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now')
WHERE id='rm01-product-comparison'
  AND object_key='dealer/rm01-product-comparison.pdf'
  AND status='draft' AND size IS NULL AND row_version=1;
```

上述步骤完成后才合并 main 并让自动部署运行，避免新接口先于表结构上线；验证目录显示、原下载链接与授权。开发、验证只用隔离本地 D1/R2；本 PR 未执行生产回填、迁移或发布。

### 独立经销商下载权限（0003）

`0003_dealer_download_permission.sql` 新增 `users.can_download_dealer`，默认 0；已有普通用户也保持未授权，不复用旧 `can_download`，不从 `case_grants` 自动继承。管理员完成首次改密后保留资源管理与访问能力。

管理后台的用户授权面板增加“经销商资料下载”单个复选项，统一控制全部经销商资料；案例搜索、全选与清空只影响案例。选中仅是草稿，保存后才生效。`GET/PUT /api/admin/users/:id/cases` 现在读写 `{case_ids,dealer_download,version}`，其中 `dealer_download` 必须为布尔值。两类授权共用 `permissions_version`，同一个 D1 batch 完成更新与审计，过期版本拒绝覆盖任何一类权限。

`GET/HEAD` 每次读取当前会话及权限。未登录返回 401；已登录但没有经销商下载权限返回 403 与 `dealer_download_forbidden`；初始密码未修改的 403 使用 `password_change_required`。下载页分别显示“未登录”“没有权限”和首次改密提示，所有公开提示覆盖六语言。授予和撤销对现有会话的后续请求生效，不要求重新登录。

生产需先在备份及明确发布授权下应用 0003，再部署对应代码；本次只在隔离本地 D1 应用。不得回退到忽略该权限、仅检查登录的下载实现。

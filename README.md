# RMinte 网站

`main` 是正式代码分支，网站源码位于 [`website/`](website/)。目录名与 Git 分支是两个不同概念。

## 目录

- `website/`：正式网站，包含首页、图册、模型、下载、指南及灯板工具。
- `services/tianshanos-ota/`：独立 OTA 服务，单独部署。
- `scripts/`：共享资源生成脚本。
- `design-preview/`、`copy-review/`、`output/`：设计讨论、文案与验证材料，不属于正式站点发布目录。

修改前阅读 [AGENTS.md](AGENTS.md)；界面设计遵循 [DESIGN.md](DESIGN.md)。

## 本地预览

```sh
python3 -m http.server 4174 --directory website
```

普通静态服务器不模拟 Cloudflare Pages 的访问地区接口。

## 部署

Cloudflare Pages 项目为 `rminte-website`，连接本仓库的 `main` 分支。仓库根目录为构建根目录，构建命令为 `exit 0`，输出目录为 `website`。正式域名为 [rminte.com](https://rminte.com)。

推送 `main` 会触发网站部署；独立 OTA 服务不会因此自动发布。

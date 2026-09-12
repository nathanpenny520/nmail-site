# nmail-site — Nmail 官网

nmail.whizzzest.com 的静态官网（REDESIGN_PLAN §10，D6=A：**Astro + Cloudflare Pages + 独立仓库**）。
零框架 CSS、零客户端 JS（下载页复制按钮除外）；版本徽章与更新日志在**构建期**从
GitHub Releases 拉取（单一来源，离线构建自动回退本地常量，不阻塞出站）。

## 本地开发

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # 产物 dist/
npm run preview
```

## 页面

| 路径 | 内容 |
|------|------|
| `/` | Hero + 六特性卡 + 最新版本徽章 + 三步开始 |
| `/download/` | PyPI / winget / Homebrew 一键命令（复制按钮）+ GitHub 二进制 + 系统要求 |
| `/features/` | 用户视角功能页（随版本迭代补充） |
| `/changelog/` | 构建期渲染 GitHub Releases（单源） |
| `/posts/` | 版本动态/博客（`src/content/posts/*.md`） |
| `/projects.json` | **与个人站 whizzzest.com 共享的项目区块内容源**（`src/content/projects/*.md`） |

## 部署（Cloudflare Pages）

**当前状态（2026-09-12）**：仓库 `github.com/nathanpenny520/nmail-site`（public）；
Pages 项目 `nmail-site` 已建，直部署完成，线上 <https://nmail-site.pages.dev>。

日常更新任选其一：

- **直部署（当前在用）**：`npm run build && npx wrangler pages deploy dist --project-name=nmail-site`
- **Git 集成**：Cloudflare Dashboard → Workers & Pages → nmail-site → 连接 GitHub 仓库后 push 即自动部署（与直部署二选一即可）

### 自定义域名（待做，需 Dashboard 一次点击）

CLI 不支持 Pages 自定义域管理。到 Cloudflare Dashboard → Workers & Pages → `nmail-site`
→ Custom domains → 添加 `nmail.whizzzest.com`——同账户下会自动创建 CNAME 与证书，
之后 <https://nmail.whizzzest.com> 即上线。

### CI 直部署（可选）

`.github/workflows/deploy.yml` 已备好：在仓库 Secrets 配 `CLOUDFLARE_API_TOKEN`（权限：
Account · Cloudflare Pages · Edit）与 `CLOUDFLARE_ACCOUNT_ID` 后，push 到 main 即自动部署。

## 与个人站同步（REDESIGN_PLAN §10.3）

- 项目内容源：`src/content/projects/`（每个项目一个 md：name/description/status/url/repo/order）。
- 个人站构建时 `fetch('https://nmail.whizzzest.com/projects.json')` 即得项目列表；其他项目同格式加 md 即可，Nmail 不是特例。
- 发版一条龙：Nmail 主仓 `release.sh` 打 tag → 本仓库补一篇动态（`src/content/posts/`）→ 两站构建自动更新。

## 备注与后续

- OG 图暂用应用图标（`public/icon-512.png`）；有了应用截图后放 `public/screenshot.png` 并在首页 hero 引用。
- 「文档」按方案不双维护：站内仅三步快速开始，详细文档链 GitHub `docs/` 目录。
- 博客按发布节奏手写；构建期拉不到 Releases 时 changelog 页有优雅回退提示。

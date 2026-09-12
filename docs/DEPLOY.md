# nmail-site 部署说明（docs/DEPLOY.md）

线上 **<https://nmail.whizzzest.com>**，托管 Cloudflare Workers 静态资产。
2026-09-12 由 Pages 迁到 Workers（CF 官方推荐新项目用 Workers，Pages 功能基本冻结；
且 Workers 自定义域名可在 wrangler.toml 声明，`wrangler deploy` 全自动建 DNS+证书，
Pages 只能 Dashboard 手点）。

## wrangler.toml 要点

| 配置 | 值 | 说明 |
|---|---|---|
| `name` | `nmail-site` | Worker 名 |
| `[assets].directory` | `./dist` | astro build 产物 |
| `not_found_handling` | `404-page` | 未命中返回 `/404.html`（404 状态码） |
| `html_handling` | `auto-trailing-slash` | `/download` 与 `/download/` 都命中 |
| `workers_dev` | `true` | 兜底入口 `nmail-site.<子域>.workers.dev`（大陆常不可直连，仅备用） |
| `routes.custom_domain` | `nmail.whizzzest.com` | 部署时自动建 CNAME+证书；要求 whizzzest.com 区域在同一 CF 账户下 |

## 日常发版

```bash
npm run build          # prebuild 同步主仓文档 + 构建期拉 Releases
npx wrangler deploy    # 静态资产 + 域名按 wrangler.toml 自动生效
```

## CI 自动部署（已配好，push main 即发）

`.github/workflows/deploy.yml`：Actions checkout → `npm ci` → `npm run build` → `wrangler-action@v3 deploy`。

需要仓库 Secrets（Settings → Secrets and variables → Actions）：

- `CLOUDFLARE_API_TOKEN`：权限 **Account · Workers Scripts · Edit** + **Zone · DNS · Edit**
- `CLOUDFLARE_ACCOUNT_ID`

构建期拉 GitHub Releases 用 **`GITHUB_TOKEN`**——Actions 自动注入，无需配置；
deploy.yml 的 build 步骤已 `env: GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}` 传给
releases.ts（匿名请求在 Actions 共享 IP 上必被限流，changelog 会退化为空态）。

## 与个人站同步（whizzzest.com）

- 内容源 `src/content/projects/*.md` → 构建产出 `/projects.json`；个人站构建时直接 fetch。
- 新项目照 nmail.md 格式加 md 即可。发版一条龙：主仓 `release.sh` 打 tag → 本仓库补一篇动态（`src/content/posts/`）→ 两站构建自动更新。

## 故障排查

- **changelog 空态 / 徽章显示旧版**：构建期 GitHub API 拉取失败（限流/离线）。CI 检查
  deploy.yml 是否注入 GITHUB_TOKEN；本地复现用 `npm run build` 看输出。
- **文档区缺篇**：sync-docs 来源全败时该篇跳过（warn 日志）；一篇都拉不到才构建失败。
  检查 `NMAIL_DOCS_DIR` / 仓库布局（本站应与主仓并列：`Nmail/nmail-site` + `Nmail/Nmail`）。
- **域名证书/DNS 异常**：custom_domain 由 `wrangler deploy` 全自动维护，重跑一次 deploy 即可。

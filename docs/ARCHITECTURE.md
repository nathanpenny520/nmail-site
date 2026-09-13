# nmail-site 架构说明（docs/ARCHITECTURE.md）

Nmail 官网（nmail.whizzzest.com）。Astro 5 纯静态站，唯一运行时依赖是构建期；
线上托管 Cloudflare Workers 静态资产（部署见 [DEPLOY.md](DEPLOY.md)）。
产品/方案语境见主仓 `docs/REDESIGN_PLAN.md` §10（本站按 §10.2 D6=A 独立仓库）。

## 目录结构

```
nmail-site/
├── src/
│   ├── layouts/Base.astro      # 全站骨架：header 导航 + footer（响应式断点 720px）
│   ├── layouts/Docs.astro      # /docs 区布局（左侧目录 + 正文）
│   ├── lib/releases.ts         # GitHub Releases 构建期拉取（单源+回退）
│   ├── config/docs.ts          # /docs 区导航元数据（与 sync 白名单一一对应）
│   ├── pages/                  # 路由 = 文件名（/、/download/、/features/、/changelog/、/docs/[slug]、/posts/[id]、404）
│   ├── content/posts/          # 动态/博客（手写，入库）
│   ├── content/projects/       # projects.json 内容源（与个人站 whizzzest.com 共享）
│   └── content/docs/           # ⚠ 生成物，不入库（.gitignore）——勿手改
├── scripts/sync-docs.mjs       # prebuild：主仓 docs/ 白名单 → src/content/docs/
├── public/                     # 图标等静态资产
└── wrangler.toml               # Workers 静态资产配置
```

## 数据流（全部发生在构建期）

```
astro build（npm run build）
 ├─ prebuild: sync-docs.mjs ──主仓 docs/ 白名单──▶ src/content/docs/*.md ──▶ /docs/<slug>
 │    来源优先级：NMAIL_DOCS_DIR → 本地 ../Nmail/docs → GitHub raw main（全败则构建中止）
 └─ 各页面 frontmatter / Base.astro ──api.github.com/repos/.../releases──▶ 版本徽章 + /changelog
      （GITHUB_TOKEN 存在时带认证；失败回退 FALLBACK_VERSION + changelog 空态提示，不阻塞出站）
```

**单一来源原则**：版本信息只认 GitHub Releases；站上文档只认主仓 `docs/`。两者都只在
构建期拉取，运行时是纯静态文件，没有服务端逻辑。

## 关键机制

### releases.ts（版本单源）

- `fetchLatestRelease()` 供 Base.astro（导航栏徽章）与 download.astro 使用；`fetchReleases()` 供 changelog.astro。
- 认证：环境变量 `GITHUB_TOKEN` 存在时加 `Authorization: Bearer`（CI 匿名配额 60 次/时会被共享 IP 耗尽，Actions 自动注入 token 后 5000/时）；本地无 token 行为不变。
- 失败一律静默回退（`FALLBACK_VERSION` / 空数组），构建任何环境都能出站。

### sync-docs.mjs（文档同步管线）

- **白名单显式列举**（`MAP`）：主仓 `docs/` 有含凭据、被 gitignore 的内部文档，**严禁改成整目录拷贝**——这是安全红线，不是风格偏好。
- 同步时自动：白名单内相对 `.md` 链接 → 站内 `/docs/<slug>`；白名单外 → GitHub；剥掉主仓 H1 的「（docs/xxx.md）」路径注记。
- 生成的 md 不入库；改文档去主仓 `docs/` 改，本站构建自动跟上。

## 前端约定

- **零客户端 JS**（唯一例外：download.astro 的复制按钮）；交互一律 CSS 完成（如移动端导航横滑）。
- 零框架 CSS：`src/styles/global.css` 定义变量（`--ink/--line/--accent/--radius/--maxw` 等），组件样式内联在各 `.astro` 的 `<style>` 里；响应式目前仅 Base.astro 一处 `@media (max-width: 720px)`。
- 中文优先；页面 title/description 走 Base.astro 的 Props。
- SEO：Base.astro 输出 canonical / og:url / 绝对 og:image / twitter:card（`noindex` Prop 供 404 用，跳过 canonical 改输出 noindex）；首页带 SoftwareApplication JSON-LD；`@astrojs/sitemap` 构建期生成 `/sitemap-index.xml`，`public/robots.txt` 指向它。robots.txt 必须自建——Cloudflare 只在站点没有 robots.txt 时注入托管版，托管版会 Disallow 全部 AI 爬虫。

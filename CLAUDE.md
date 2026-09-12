# CLAUDE.md — nmail-site 工作规范

Nmail 官网（nmail.whizzzest.com）。Astro 5 纯静态 + Cloudflare Workers 静态资产托管。
架构细节：[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)；部署：[docs/DEPLOY.md](docs/DEPLOY.md)；变更记录：[docs/CHANGELOG.md](docs/CHANGELOG.md)。
主仓（应用本体）在同级 `../Nmail/`，其 `CLAUDE.md` / `docs/` 是产品语境的单一来源。

## 常用命令

```bash
npm run dev        # http://localhost:4321（构建期拉取同样会跑，本地离线也能起，走回退）
npm run build      # prebuild 同步主仓文档 + astro build —— 任何改动后必须执行验证
npm run preview    # 预览 dist/
npm run sync-docs  # 单独跑文档同步（调试 sync-docs.mjs 用）
npx wrangler deploy   # 发版（先 build；需 wrangler login，域名按 wrangler.toml 自动生效）
```

## 工作流规范（必须遵守）

1. **文档优先**：页面/管线改动先更新 `docs/`（本文件 / ARCHITECTURE / DEPLOY），写清要改什么；方案类改动先给方案再动手。
2. **变更必记**：改动与 `docs/CHANGELOG.md` 条目放同一个提交；架构/部署变化同步更 ARCHITECTURE / DEPLOY。
3. **验证后提交**：`npm run build` 必须通过（它同时验证 sync-docs 与 Releases 拉取/回退两条链路）；涉及 UI 的改动 `npm run preview` 过一眼再交。
4. **生成的文件不入库、不手改**：`src/content/docs/*.md` 是 sync-docs 产物（.gitignore）——改文档去主仓 `../Nmail/docs/` 改，站上构建自动跟上；导航元数据在 `src/config/docs.ts`。
5. **同步白名单是安全红线**：主仓 `docs/` 有含凭据、被 gitignore 的内部文档，`scripts/sync-docs.mjs` 的 `MAP` 严禁改成整目录拷贝。
6. **安装命令只抄主仓文档**：PyPI 包名 `nmail-app`、命令名 `nmail`（`uvx nmail` 会装到无关包）；下载页各渠道命令与 `../Nmail/docs/INSTALL.md` 保持一致，不引入文档外写法（如 pipx）。
7. **提交信息**：`<类型>: <一句话>`（fix / feat / docs / chore，参考 git log）；本仓库与主仓独立提交，互不代劳。

## 架构速览（详见 docs/ARCHITECTURE.md）

- 全部数据在**构建期**取得，运行时纯静态：`lib/releases.ts`（GitHub Releases 单源+回退）· `scripts/sync-docs.mjs`（主仓文档白名单同步）
- 页面在 `src/pages/`；全站骨架 `src/layouts/Base.astro`（导航/页脚/720px 断点）；/docs 区布局 `Docs.astro` + `config/docs.ts`
- 样式零框架：`styles/global.css` 变量 + 组件内联 `<style>`；**零客户端 JS**（唯一例外 download.astro 复制按钮）

## 关键决策（勿违背）

1. 零客户端 JS、零框架 CSS——交互优先 CSS 方案（移动端导航是横滑不是汉堡菜单）
2. 版本与文档单一来源（GitHub Releases / 主仓 docs/），构建期拉取，失败回退不阻塞出站
3. 托管用 Cloudflare Workers 静态资产（2026-09-12 由 Pages 迁入），域名写 wrangler.toml 自动维护
4. `GITHUB_TOKEN` 认证是 CI 构建的必要条件（匿名配额在 Actions 共享 IP 上必限流）
5. `/docs` 是给用户看的主仓文档镜像；本仓库 `docs/` 是开发文档，两者互不相干，勿混
6. `/projects.json` 是与个人站 whizzzest.com 的共享契约，格式变更需两侧同时改

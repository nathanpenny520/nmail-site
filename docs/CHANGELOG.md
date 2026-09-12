# nmail-site 更新日志（docs/CHANGELOG.md）

只记本仓库（官网）变更；产品变更看主仓 `Nmail/Nmail/docs/CHANGELOG.md`。
惯例：最新在上；条目 = `日期 类型: 一句话`，重要改动附动机。

## 2026-09-12

- `fix: 下载页安装命令对齐主仓文档`——`uvx nmail` 修正为 `uvx --from nmail-app nmail`（PyPI 包名 nmail-app，`nmail` 已被无关项目占用，原命令会装错包）；弃用文档外的 pipx 写法；winget id 对齐 `nathanpenny520.Nmail`；复制按钮改用每渠道显式 `copy` 字段，不再把「二选一」命令用 `&&` 串成无效命令。
- `fix: 更新日志/版本徽章 CI 限流退化`——releases.ts 支持 `GITHUB_TOKEN` 认证头；deploy.yml build 步骤注入 Actions 自动提供的 token（匿名配额 60 次/时在共享 IP 上必被耗尽 → 403 → changelog 空态、徽章退回 FALLBACK 0.2.0）。
- `fix: 移动端导航溢出`——Base.astro 新增 720px 断点：header 改两行，导航单行横滑（纯 CSS，维持零客户端 JS）。
- `chore: 页脚移除过期的「Cloudflare Pages 托管」字样`（2026-09-12 已迁 Workers）。
- `docs: 建立开发文档体系`——新增 `docs/`（ARCHITECTURE / DEPLOY / CHANGELOG）与 `CLAUDE.md`；README 去重过期的两段 CI 说明（原权限描述仍按 Pages 写）。

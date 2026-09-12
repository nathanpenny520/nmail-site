# nmail-site 更新日志（docs/CHANGELOG.md）

只记本仓库（官网）变更；产品变更看主仓 `Nmail/Nmail/docs/CHANGELOG.md`。
惯例：最新在上；条目 = `日期 类型: 一句话`，重要改动附动机。

## 2026-09-13

- `fix: v0.4 动态帖事实错误`——原帖宣称「v0.4 八个里程碑全部落地」并给 `pipx upgrade` 升级命令，但 v0.4 仅方案定稿（P1–P8 为进行中计划，最新发布仍是 v0.3.0），pipx 亦非文档内渠道；重写为「方案定稿并动工」定位，升级段删除；v0.3.0 帖升级命令同步修正（移除未上线的 winget upgrade，改单文件覆盖 + uv tool upgrade）。
- `feat: 下载页改版——uvx 一行命令为绝对主角`——用户反馈三卡并列「眼花缭乱」：uvx 大命令块 + 复制按钮独立成主角区，uv/brew 安装引导收进主角区小字，其余方式（单文件 / Homebrew / winget 审核中）降级为「其他方式」三张略写小卡，删除 pip 与 uv tool 命令块。

- `fix: 首页「三步开始」仍写 pipx`——09-12 下载页已弃用 pipx，首页漏改；统一为主仓文档口径 `uvx --from nmail-app nmail`。
- `fix: 下载页渠道与主仓 INSTALL.md 对齐`——brew tap 补全 URL（文档完整写法）；Python 要求 3.10+ → 3.11+（对齐 pyproject requires-python），注明 uvx 由 uv 自动准备运行时；winget 渠道标注「审核中，合入前暂不可用」（manifest 尚未合入 winget-pkgs，站上直接给可用命令会误导）；uv 卡补 pip 备选行；副标题与 meta description 同步（弱化 winget、补「下次使用再运行同一条命令」）。
- `feat: uv / Homebrew 缺失引导`——用户反馈「不知道 uv / brew 怎么装」：uv 卡补 astral.sh 官方安装器命令（macOS/Linux sh 脚本 + Windows PowerShell），brew 卡补 brew.sh 链接；首页三步步骤 1 加「没装 uv？下载页有官方安装命令」引导。

## 2026-09-12

- `feat: 站点内容自动化`——deploy.yml 增加每日定时构建（兜底主仓 docs/Releases 变更）与 workflow_dispatch（供主仓 release.sh 发版后触发，1-2 分钟内同步）；wrangler 入 devDependencies（修 CI 里 wrangler-action 的 npx 无 TTY 取消）。
- `fix: package-lock 两条损坏条目（rollup 嵌套可选依赖缺 version 字段）`——npm ci 全环境（本机 npm 11 / CI npm 10）秒败 `Invalid Version:` 的真正原因，此前误判为 Secrets 未配。
- `fix: 下载页安装命令对齐主仓文档`——`uvx nmail` 修正为 `uvx --from nmail-app nmail`（PyPI 包名 nmail-app，`nmail` 已被无关项目占用，原命令会装错包）；弃用文档外的 pipx 写法；winget id 对齐 `nathanpenny520.Nmail`；复制按钮改用每渠道显式 `copy` 字段，不再把「二选一」命令用 `&&` 串成无效命令。
- `fix: 更新日志/版本徽章 CI 限流退化`——releases.ts 支持 `GITHUB_TOKEN` 认证头；deploy.yml build 步骤注入 Actions 自动提供的 token（匿名配额 60 次/时在共享 IP 上必被耗尽 → 403 → changelog 空态、徽章退回 FALLBACK 0.2.0）。
- `fix: 移动端导航溢出`——Base.astro 新增 720px 断点：header 改两行，导航单行横滑（纯 CSS，维持零客户端 JS）。
- `chore: 页脚移除过期的「Cloudflare Pages 托管」字样`（2026-09-12 已迁 Workers）。
- `docs: 建立开发文档体系`——新增 `docs/`（ARCHITECTURE / DEPLOY / CHANGELOG）与 `CLAUDE.md`；README 去重过期的两段 CI 说明（原权限描述仍按 Pages 写）。

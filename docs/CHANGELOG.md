# nmail-site 更新日志（docs/CHANGELOG.md）

只记本仓库（官网）变更；产品变更看主仓 `Nmail/Nmail/docs/CHANGELOG.md`。
惯例：最新在上；条目 = `日期 类型: 一句话`，重要改动附动机。

## 2026-09-15

- `fix: /dl 支持 Range 断点续传 + 下载按钮突出化 + macOS 提示`——用户实测暴露三件事：①`/dl` 原实现不支持 Range，大文件断点续传（浏览器中断续传/下载管理器）会失败——worker 改用 R2 原生 Range 解析返回 206（多段 Range 等不支持形态回退全量），本地模拟+线上 206 双验证（ac429fa 下载按钮同步改主色实心+⬇ 图标提升可点性）；②macOS 裸二进制浏览器下载后无可执行权限，用户双击被编辑器打开「乱码」——单文件卡说明改「Windows 双击即用；macOS/Linux 首次运行需一条终端授权命令（见安装文档）」，macOS 按钮加悬停提示；③用户另报 Windows exe 双击闪退——版本读取打包兜底已核查无恙，待用户提供 cmd 运行报错定位。

- `feat: 安装包国内加速下载——R2 镜像 + /dl 路由`——国内用户直连 GitHub 不稳，且单文件最大 34.5MB 超 Workers 静态资产 25MiB/文件上限（打包进站不可行）：新建 R2 桶 `nmail-dl`，`scripts/sync-r2.mjs` 挂入 deploy.yml（continue-on-error）把最新 release 三平台资产覆盖式镜像进桶（键=资产文件名，标记对象 `_synced-tag` 去重，重复部署跳过）→ 桶内永远只保留最新版，历史版本引导去 GitHub Releases；新增 `src/worker.ts` 只拦 `/dl/*`（`run_worker_first`，其余请求照走免费静态资产管线）：R2 直读 + `Content-Disposition: attachment`，未命中 302 兜底 GitHub 最新直链，页面永不出现死链；下载页单文件卡改三平台直链按钮（构建期带体积，`releases.ts` 补 assets 字段），GitHub Releases 保留为历史版本入口。CI secrets 新增 `CLOUDFLARE_R2_API_TOKEN`（仅 R2 编辑权限，与 deploy token 分离做最小授权）。
- `feat: 下载页讲清「每次打开都运行同一条命令」`——用户反馈第二次使用该做什么没讲透：副标题点明 uvx 命令即启动命令（不是一次性安装包）；主命令区按时间线补三行小字——**下次打开**（重跑同一条命令，包已缓存秒级启动）、**更新版本**（应用内每日自动检查+通知中心提醒；uvx 升级 `uvx --refresh --from nmail-app nmail`，不刷新缓存会沿用首跑版本）、**常驻安装**（uv tool install 后任意目录敲 nmail，升级 uv tool upgrade）；单文件卡补「更新=下载新版覆盖」。uvx 升级命令为主仓 INSTALL.md 同步新增的官方口径（主仓提交 5cd023e），uv 缓存语义经 uv 官方文档核实。
- `feat: v0.4.0 发布对齐`——主仓 v0.4.0 已发布（Agent 化收官），官网全量跟上：新增动态帖 `posts/v0.4.0.md`（跨会话记忆/AI 晨报/触顶小结/澄清中断/技能包/CLI 总管家通道/安全加固 + 升级方式）；功能页 12→15 卡（AI 组补跨会话记忆、拿不准先问你、内置工作流技能；自动化组补 AI 晨报卡，对外 API 卡并入 CLI 通道），版本口径 v0.3.0→v0.4.0；首页特性卡文案更新（总管家卡补记忆与澄清、摘要卡并入晨报）；项目卡 `/projects.json` 描述更新至 v0.4.0（个人站下次构建带上）；Releases 拉取失败兜底版本 0.3.0→0.4.0。/docs 镜像（使用指南/FAQ/Agent 接入指南等）随构建从主仓自动同步。

## 2026-09-13

- `fix: robots.txt 正式生效`——用户在 Cloudflare Dashboard 关闭 whizzzest.com 区域的「AI 审计 → 托管 robots.txt」，线上验证自建版接管（`Allow: /` + Sitemap 行），主站回退到自己的源站 robots.txt（5 个 sitemap 完好、无 AI 爬虫 Disallow），两站 AI 爬虫全部放开；robots.txt 注释同步更新。
- `docs: robots.txt 实况修正`——部署后验证发现自建 robots.txt 线上不生效：whizzzest.com 区域开启了 Cloudflare「AI 审计 → 托管 robots.txt」，在边缘拦截所有子域名的 /robots.txt（连 Worker 资产都到不了），API 无写入端点（PUT/PATCH/POST 均 70001 not_found），只能在 Dashboard 编辑；robots.txt 注释改为记录该限制，主站与 nmail 的 AI 爬虫策略待用户在 Dashboard 调整。
- `feat: 补 favicon.ico`——此前仅 PNG 链接声明，根路径 /favicon.ico 404（旧工具/抓取器/订阅器按惯例直接请求它）；由 icon-512.png 缩 16+32 两尺寸打包成标准 ICO（PNG 条目，sips 缩放 + stdlib struct 封容器，无新依赖）；Base.astro head 补 `<link rel="icon" href="/favicon.ico">`，PNG 192 与 apple-touch-icon 保留。无 SVG 矢量源，暂不做 .svg 图标。
- `feat: SEO 基建——sitemap/robots.txt/canonical/OG 补全/JSON-LD/标题层级修复`——Lighthouse 实测 SEO 已 100，但站点 09-11 才建、尚未被搜索引擎收录且缺关键元数据：接 `@astrojs/sitemap`（构建出 /sitemap-index.xml，16 个页面，重定向页与 404 自动排除）；`public/robots.txt` 自建取代 CF 托管自动注入版（托管版 Allow 搜索但 Disallow 全部 AI 爬虫，产品站要被 AI 搜索引用故放开），带 Sitemap 行；Base.astro 补 canonical（构建期 /download 规范化为 /download/，与 Workers 307 一致）、og:url、绝对 og:image（原相对路径社交平台抓不到图）、og:image 尺寸/alt、twitter:card、og:locale，新增 `noindex` Prop（404 用，跳过 canonical）；首页加 SoftwareApplication JSON-LD（版本取 Releases 单源）争取搜索富摘要；修 Lighthouse 无障碍两项扣分：首页特性卡 h3 跳级改 h2、Docs.astro 侧栏分组标签 h3 改 div（原 h3 出现在正文 h1 前，9 个文档页全中）、pill/正列文字链接补下划线（link-in-text-block，.btn 按钮除外）。本地预览 Lighthouse：SEO / Best Practices / 无障碍 / Agentic 全 100。

- `docs: README 双语化`——主仓 README.md 转英文主文档（GitHub/PyPI 国际默认）、中文迁 README.zh-CN.md 后，本仓同步双语布局；INSTALL.md 引用的 `../README.zh-CN.md` 白名单外链接补入 sync-docs.mjs EXTRA_LINKS 映射（否则站上渲染成站内相对路径 404）。

- `fix: 版本口径对齐——功能页/项目卡改标 v0.3.0`——用户核对发现功能页副标题写「v0.4 主线能力」而站上最新版本是 v0.3.0；逐项核对功能页 12 项能力全部已在 v0.3.0 发布（v0.4 系改版计划代号，无 v0.4.0 发布）：功能页注释与副标题改「v0.3.0 已上线」，/projects.json 的 Nmail 描述同步改 v0.3.0（个人站下次构建带上），Releases 拉取失败兜底版本 0.2.0→0.3.0。主仓公开文档（OAuth2 指南 / 对外 API 指南 / PRODUCT_PLAN）同口径修正，/docs 镜像随构建自动跟上。
- `docs: CLAUDE.md 写入「及时提交」规则`——用户两次纠偏后明确：网站改动验证通过后当轮 commit + push，push main 即自动部署上线（1-2 分钟），「提交」不含「只落本地」这个选项；补入工作流规范第 3 条。
- `feat: 下载页视效重整`——用户反馈「视效差、不清晰、brew 命令在卡内折行断在 URL 中间」：改为主命令深色大块 + 主色复制按钮、辅助命令（uv 安装器 / brew）统一浅色单行组件并 `white-space: pre` 永不折行（窄屏横向滚动，删除 break-all）；「其他方式」三张不等高卡片改为全宽单列行（标题/说明左、动作右），brew 补复制按钮；修移动端 flex 子项 min-width 撑破卡片。
- `fix: 动态两帖合一`——用户反馈 v0.3.0 发布帖与「v0.4 改版（已随 v0.3.0 落地）」两帖同日发布、内容交叠，读者困惑；合并为一篇 `v0.3.0.md`（标题「v0.3.0 发布：从邮箱工具到 AI 总管家」，大改版 + 通讯录改版 + 体验修一次讲完），删除两旧帖；astro.config.mjs 加 redirects 把两旧帖新旧两套地址（默认 slugger 去点版 v04-gaizhang / v030-fabu 与文件名带点版）都指向新帖；posts 集合加 `generateId` 保留文件名原样做 id（默认 slugger 会删掉版本号里的点，URL 变成 /posts/v030/ 这类）。
- `fix: v0.4 动态帖版本表述与升级命令`——用户澄清：v0.4 改版内容即 v0.3.0 发布内容。原帖问题：独立宣称「v0.4 落地」与站上最新 v0.3.0 徽章打架、升级命令用了非文档渠道 `pipx upgrade`；改法：标题与正文明确「已随 v0.3.0 全部落地」，tags 归入 release/v0.3，升级段改 brew upgrade / uv tool upgrade / Windows 单文件覆盖；v0.3.0 帖同步移除未上线的 winget upgrade 行。
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

// Nmail 官网 Astro 配置（REDESIGN_PLAN §10.2，D6=A：Astro + Cloudflare Pages + 独立仓库）
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://nmail.whizzzest.com',
  // GitHub Releases 单一来源：构建期拉取版本与更新日志；内网/离线构建回退本地常量
  // （fetch 逻辑在各页面 frontmatter，超时 5s 兜底，不阻塞构建）
})

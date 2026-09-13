// Nmail 官网 Astro 配置（REDESIGN_PLAN §10.2，D6=A：Astro + Cloudflare Pages + 独立仓库）
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://nmail.whizzzest.com',
  integrations: [sitemap()], // 构建期生成 /sitemap-index.xml + /sitemap-0.xml（robots.txt 指向它）
  // 旧动态帖（v0.4 / v0.3.0 两帖已合并为一篇）重定向，外链不 404。
  // 两套旧地址都要接：默认 slugger 生成的是去点版（v04-gaizhang / v030-fabu），
  // 按文件名手拼的带点版也可能被人访问过。
  redirects: {
    '/posts/v04-gaizhang': '/posts/v0.3.0/',
    '/posts/v030-fabu': '/posts/v0.3.0/',
    '/posts/v0.4-gaizhang': '/posts/v0.3.0/',
    '/posts/v0.3.0-fabu': '/posts/v0.3.0/',
  },
  // GitHub Releases 单一来源：构建期拉取版本与更新日志；内网/离线构建回退本地常量
  // （fetch 逻辑在各页面 frontmatter，超时 5s 兜底，不阻塞构建）
})

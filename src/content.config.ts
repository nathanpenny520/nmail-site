// 内容集合定义（Astro 5 content layer）：动态（版本动态/博客）+ 项目（与个人站同步的单一内容源）
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.string(), // YYYY-MM-DD
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
})

// 文档（scripts/sync-docs.mjs 构建期从主仓白名单同步生成，不手改）：
// 元数据（标题/分组/顺序）在 src/config/docs.ts，正文自带 H1，无需 frontmatter
const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
})

// projects/*.md 是 nmail.whizzzest.com 与个人站 whizzzest.com 共享的「项目区块」
// 单一内容源（REDESIGN_PLAN §10.3）：构建产物 /projects.json 供个人站 fetch。
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    status: z.string().default('active'), // active | maintenance | archived
    url: z.string().optional(),           // 项目主页/下载
    repo: z.string().optional(),          // 源码仓库
    order: z.number().default(99),
  }),
})

export const collections = { posts, projects, docs }

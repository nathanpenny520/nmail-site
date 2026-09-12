// /projects.json —— 与个人站 whizzzest.com 共享的「项目区块」单一内容源
// （REDESIGN_PLAN §10.3）：个人站构建时 fetch 本端点即可带上 Nmail 等项目动态。
import { getCollection } from 'astro:content'

export async function GET() {
  const projects = (await getCollection('projects')).sort(
    (a, b) => a.data.order - b.data.order,
  )
  return new Response(
    JSON.stringify({
      updated_at: new Date().toISOString().slice(0, 10),
      projects: projects.map((p) => ({
        slug: p.id,
        name: p.data.name,
        description: p.data.description,
        status: p.data.status,
        url: p.data.url,
        repo: p.data.repo,
      })),
    }, null, 2),
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } },
  )
}

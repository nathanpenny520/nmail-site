// /dl/* 下载路由：R2 镜像桶（nmail-dl）直读最新版三平台安装包，键=资产文件名。
// CI 部署时 scripts/sync-r2.mjs 把 GitHub 最新 release 资产覆盖式镜像进桶（桶内永远只有最新版）。
// R2 未命中（首次部署前/同步失败）→ 302 兜底 GitHub 最新版直链，页面永不出现死链。
// 其余请求不会进本 Worker：wrangler.toml run_worker_first 仅拦 /dl/*，静态资产照走免费资产管线。
interface R2Like {
  get(key: string): Promise<{ body: ReadableStream; size: number; httpEtag: string } | null>
}
interface Env {
  DL_BUCKET: R2Like
  ASSETS: { fetch(request: Request): Promise<Response> }
}

// 资产白名单：把 /dl 收紧为「三个固定资产名」，防止被当成任意文件代理
const ASSET_NAMES = new Set(['nmail-windows-x64.exe', 'nmail-macos-arm64', 'nmail-linux-x64'])
const GITHUB_LATEST = 'https://github.com/nathanpenny520/Nmail/releases/latest/download/'

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url)
    const name = url.pathname.slice('/dl/'.length)
    if (url.pathname.startsWith('/dl/') && ASSET_NAMES.has(name)) {
      const obj = await env.DL_BUCKET.get(name)
      if (obj) {
        return new Response(obj.body, {
          headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Length': String(obj.size),
            'Content-Disposition': `attachment; filename="${name}"`,
            ETag: obj.httpEtag,
          },
        })
      }
      return Response.redirect(GITHUB_LATEST + name, 302)
    }
    return env.ASSETS.fetch(request)
  },
}

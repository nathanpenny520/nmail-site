// GitHub Releases 拉取（构建期）：单一来源=仓库 Releases；离线/限流时回退本地常量，
// 保证 `astro build` 任何环境都能出站（REDESIGN_PLAN §10.2）。
const REPO_API = 'https://api.github.com/repos/nathanpenny520/Nmail/releases'
export const FALLBACK_VERSION = '0.4.0'
export const REPO_URL = 'https://github.com/nathanpenny520/Nmail'

export interface Release {
  tag_name: string
  name: string | null
  published_at: string | null
  body: string | null
  html_url: string
}

async function getJson(url: string): Promise<unknown> {
  // CI（Actions 共享出口 IP）匿名配额 60 次/时常被耗尽 → 403 走回退分支；
  // 有 GITHUB_TOKEN 时带上认证（Actions 自动注入，配额升到 5000/时），本地无 token 行为不变。
  const token = process.env.GITHUB_TOKEN
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'nmail-site',
      Accept: 'application/vnd.github+json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok) throw new Error(`GitHub API ${res.status}`)
  return res.json()
}

export async function fetchLatestRelease(): Promise<Release | null> {
  try {
    const list = (await getJson(`${REPO_API}?per_page=1`)) as Release[]
    return list[0] ?? null
  } catch {
    return null
  }
}

export async function fetchReleases(perPage = 10): Promise<Release[]> {
  try {
    return ((await getJson(`${REPO_API}?per_page=${perPage}`)) as Release[]) ?? []
  } catch {
    return []
  }
}

/** tag_name（v0.4.0）→ 显示版本号（0.4.0） */
export function versionOf(tag: string | undefined | null): string {
  return (tag ?? FALLBACK_VERSION).replace(/^v/, '')
}

// /docs 区的导航元数据（与 scripts/sync-docs.mjs 的白名单一一对应）
export interface DocMeta {
  slug: string
  title: string
  desc: string
  group: '上手' | '了解' | '进阶' | '开发者'
}

export const DOCS: DocMeta[] = [
  { slug: 'install', title: '安装与更新', desc: '四种安装方式、首次使用五分钟、数据位置与备份', group: '上手' },
  { slug: 'guide', title: '使用指南', desc: '界面导览、文件夹管理、AI 总管家、写信草稿、设置速览', group: '上手' },
  { slug: 'faq', title: '常见问题', desc: '安装、网络代理、授权码、AI、同步的高频问题', group: '上手' },
  { slug: 'privacy', title: '隐私与安全', desc: '数据存哪、什么会外发、网络边界与 AI 安全设计', group: '了解' },
  { slug: 'oauth', title: 'OAuth2 登录配置', desc: 'Gmail/Outlook 授权登录：内置凭证零配置与自建客户端', group: '进阶' },
  { slug: 'agent', title: 'Agent / Skill 接入', desc: '把 Nmail 交给 Claude Code 等 agent：skill 一键安装、nmail-cli、两阶段确认与安全边界', group: '进阶' },
  { slug: 'api', title: '对外 API 指南', desc: 'API Key、scope 分级、nmail-cli、隧道接入、调用示例', group: '进阶' },
  { slug: 'changelog', title: '完整更新日志', desc: '提交级变更记录（与主仓 CHANGELOG 同源同步）', group: '开发者' },
  { slug: 'architecture', title: '架构说明', desc: '模块划分、数据表、同步管线与安全模型', group: '开发者' },
  { slug: 'plan', title: '产品方案与路线', desc: '产品定位、决策原则、路线图', group: '开发者' },
]

export const DOC_GROUPS: DocMeta['group'][] = ['上手', '了解', '进阶', '开发者']

export function docBySlug(slug: string): DocMeta | undefined {
  return DOCS.find((d) => d.slug === slug)
}

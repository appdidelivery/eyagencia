// Bounded extraction of links from approved industry news sources.
// Do not duplicate article bodies, copy images, or visit other domains.
export const NEWS_SOURCES = Object.freeze({
  eyagencia: {
    name: 'E-Commerce Brasil',
    host: 'www.ecommercebrasil.com.br',
    listUrl: 'https://www.ecommercebrasil.com.br/noticias',
    articlePrefix: '/noticias/',
  },
  'velo-delivery': {
    name: 'Abrasel',
    host: 'abrasel.com.br',
    listUrl: 'https://abrasel.com.br/noticias/noticias/',
    articlePrefix: '/noticias/noticias/',
  },
})
export function decodeHtml(value = '') {
  return String(value)
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Math.min(0x10ffff, Number(num))))
    .replace(/&#x([0-9a-f]+);/gi, (_, num) => String.fromCodePoint(Math.min(0x10ffff, parseInt(num,16))))
    .replace(/&(?:amp|quot|apos|lt|gt|nbsp|ndash|mdash);/gi, item => ({
      '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>',
      '&nbsp;': ' ', '&ndash;': '–', '&mdash;': '—',
    })[item.toLowerCase()] || item)
}
export function textFromHtml(markup) {
  return decodeHtml(String(markup || '')
    .replace(/<(?:script|style|svg)\b[^>]*>[\s\S]*?<\/(?:script|style|svg)>/gi, '')
    .replace(/<[^>]*>/g,' ')
    .replace(/\s+/g,' ')).trim()
}
export function safeArticleUrl(value, source) {
  try {
    const url = new URL(decodeHtml(value), source.listUrl)
    if (url.protocol !== 'https:' || url.hostname !== source.host ||
        !url.pathname.startsWith(source.articlePrefix) ||
        url.pathname.length < source.articlePrefix.length + 6 ||
        url.username || url.password) return null
    url.search = ''
    url.hash = ''
    return url.toString()
  } catch {return null}
}
export function extractNewsLinks(html, source) {
  const links = new Map()
  const regexp = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi
  let match
  while ((match = regexp.exec(String(html || ''))) !== null && links.size < 40) {
    const href = match[1].match(/\bhref\s*=\s*(["'])([\s\S]*?)\1/i)?.[2]
    const url = href && safeArticleUrl(href, source)
    const title = textFromHtml(match[2]).slice(0, 190)
    if (url && title.length >= 22 && !links.has(url)) links.set(url, {url,title})
  }
  return [...links.values()]
}
function attribute(tag, name) {
  const expression = new RegExp('\\b' + name + '\\s*=\\s*(["\\x27])([^"\\x27]*?)\\1', 'i')
  return tag.match(expression)?.[2] || ''
}
export function extractNewsDate(html) {
  const input = String(html || '').slice(0,110000)
  for (const tag of input.match(/<meta\b[^>]*>/gi) || []) {
    const property = (attribute(tag,'property') || attribute(tag,'name')).toLowerCase()
    if (['article:published_time','datepublished','date','publish_date'].includes(property)) {
      const value = attribute(tag,'content')
      const parsed = new Date(value)
      if (!Number.isNaN(parsed.getTime())) return parsed
    }
  }
  const jsonLd = input.match(/"datePublished"\s*:\s*"([^"]+)"/i)?.[1]
  if (jsonLd) {
    const parsed = new Date(jsonLd)
    if (!Number.isNaN(parsed.getTime())) return parsed
  }
  for (const tag of input.match(/<time\b[^>]*>/gi)||[]) {
    const value = attribute(tag,'datetime')
    if (value) {
      const parsed = new Date(value)
      if (!Number.isNaN(parsed.getTime())) return parsed
    }
  }
  // Short date near the article heading, never related-news cards.
  const h1 = input.search(/<h1\b/i)
  const section = h1 >= 0 ? input.slice(Math.max(0,h1-2500),h1+3500) : input.slice(0,6000)
  const date = textFromHtml(section).match(/(?:^|\s)(?:Publicado em:?\s*)?(\d{2})\/(\d{2})\/(20\d{2})\b/)
  return date ? new Date(Date.UTC(Number(date[3]),Number(date[2])-1,Number(date[1]),12)) : null
}
export function articleHeadline(html) {
  const match = String(html||'').match(/<h1\b[^>]*>([\s\S]{0,1100}?)<\/h1>/i)
  return match ? textFromHtml(match[1]).slice(0,180) : ''
}
export function isRecent(date, now = new Date(), days = 7) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return false
  const diff = now.getTime() - date.getTime()
  return diff >= -86400000 && diff <= days*86400000
}
const keywords = {
  eyagencia: [
    /e-commerce|ecommerce|com[eé]rcio eletr[oô]nico/i,
    /seo|busca|google|conte[uú]do/i,
    /intelig[eê]ncia artificial|\bIA\b|agentes/i,
    /marketplace|checkout|pagamento|whatsapp|convers[aã]o|marketing|social commerce/i,
    /black friday|vendas online|log[ií]stica|plataforma/i,
  ],
  'velo-delivery': [
    /delivery|restaurante|bares|aliment[aá]c[aã]o|foodservice/i,
    /pedido|pagamento|pix|cart[aã]o|vales|maquininha/i,
    /opera[cç][aã]o|gest[aã]o|consumidor|card[aá]pio|digital|tecnologia/i,
    /mercado|vendas|faturamento|custos|contrat|log[ií]stica/i,
  ],
}
export function rankHeadline(title,brand) {
  const text=String(title||'').trim()
  if(text.length<22||text.length>180||
    /elei[cç][aã]o|boicote|crime|viol[eê]ncia|opini[aã]o|editorial|publieditorial/i.test(text))return -1
  return (keywords[brand]||[]).reduce((acc,regex)=>acc+(regex.test(text)?2:0),0)
}

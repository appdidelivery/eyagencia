export const COVER_GENERATOR_VERSION = 'eyagencia/free-svg-v3'
type Article = {title?: string; excerpt?: string; seoDescription?: string; slug?: string}
function xml(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;')
}
function digest(input: string) {
  let n = 2166136261
  for (let i=0; i<input.length; i++) n = Math.imul(n ^ input.charCodeAt(i),16777619)
  return n >>> 0
}
function wrap(s: string, width = 26) {
  const out: string[] = []
  let line = ''
  for (const word of s.trim().split(/\s+/)) {
    const next = line ? line+' '+word : word
    if (line && next.length > width) {out.push(line); line=word} else line=next
  }
  if (line) out.push(line)
  return out.slice(0,6)
}
export function editorialTheme(article: Article) {
  const txt = [article.title, article.excerpt, article.seoDescription].join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  // Choose the specific editorial subject before a broad IA/e-commerce category.
  if (/lgpd|privacidade|protecao de dados|dados pessoais|conformidade/.test(txt)) return 'privacidade'
  if (/casos de uso|riscos|matriz de risco|ameaca|limites da ia/.test(txt)) return 'riscos'
  if (/experimento|teste controlado|teste a\/b|hipotese|piloto/.test(txt)) return 'experimentos'
  if (/como avaliar|avaliacao|auditoria|qualidade|validacao/.test(txt)) return 'avaliacao'
  if (/custo|orcamento|precificacao|despesa/.test(txt)) return 'custos'
  if (/atendimento|chatbot|crm|experiencia do cliente/.test(txt)) return 'atendimento'
  if (/metric|indicador|medicao|conversao|performance/.test(txt)) return 'analytics'
  if (/seo|geo|busca organica|google/.test(txt)) return 'busca'
  if (/trafego|ads|roas|midia paga|campanha/.test(txt)) return 'performance'
  if (/catalog|produto|estoque|classificac|cadastro/.test(txt)) return 'catalogo'
  return 'automacao'
}
const THEMES = {
  riscos: {label:'RISCOS E CASOS DE USO',bg:'#122d3b',bg2:'#315e65',accent:'#ffba87',motif:'risk'},
  experimentos: {label:'EXPERIMENTOS E TESTES',bg:'#12334a',bg2:'#306478',accent:'#b7e2e6',motif:'experiment'},
  avaliacao: {label:'AUDITORIA E QUALIDADE',bg:'#113b3a',bg2:'#376967',accent:'#bfeac8',motif:'checklist'},
  custos: {label:'CUSTOS E VIABILIDADE',bg:'#27323d',bg2:'#4d5266',accent:'#f3cb8e',motif:'budget'},
  privacidade: {label:'PRIVACIDADE E GOVERNANÇA',bg:'#102331',bg2:'#16434b',accent:'#93e2cf',motif:'shield'},
  atendimento: {label:'EXPERIÊNCIA E IA',bg:'#143847',bg2:'#11635d',accent:'#ffd29d',motif:'chat'},
  analytics: {label:'ANÁLISE E MÉTRICAS',bg:'#132735',bg2:'#224d66',accent:'#f6b47f',motif:'chart'},
  busca: {label:'SEO E DESCOBERTA',bg:'#0d2f36',bg2:'#186b68',accent:'#b9e6d0',motif:'search'},
  performance: {label:'PERFORMANCE DIGITAL',bg:'#221f34',bg2:'#55445a',accent:'#ffba91',motif:'growth'},
  catalogo: {label:'CATÁLOGO E OPERAÇÃO',bg:'#193e34',bg2:'#47704b',accent:'#f2d59c',motif:'grid'},
  automacao: {label:'IA E AUTOMAÇÃO',bg:'#0e2930',bg2:'#2b5d5e',accent:'#9ae4d7',motif:'nodes'},
} as const
function art(type: string, accent: string) {
  const line = `fill="none" stroke="${accent}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"`
  if (type==='risk') return '<rect x="45" y="73" width="445" height="455" rx="32" '+line+'/>'+'<path d="M45 225 H490 M45 378 H490 M192 73 V528 M340 73 V528" '+line+'/>'+'<path d="M99 173 L147 115 M99 115 L147 173" '+line+'/>'+'<path d="M240 299 L277 338 L320 270" '+line+'/>'+'<circle cx="418" cy="453" r="39" '+line+'/>'+'<path d="M418 431 V454 M418 477 V480" '+line+'/> '
  if (type==='experiment') return '<rect x="44" y="86" width="448" height="450" rx="35" '+line+'/>'+'<path d="M44 200 H492 M269 201 V536 M104 130 H207 M325 130 H427" '+line+'/>'+'<rect x="111" y="386" width="70" height="100" rx="13" fill="'+accent+'" opacity=".4"/>'+'<rect x="332" y="305" width="70" height="181" rx="13" fill="'+accent+'" opacity=".8"/>'+'<path d="M102 280 L179 257 L226 315 M313 284 L382 234 L448 257" '+line+'/>'
  if (type==='checklist') return '<rect x="78" y="59" width="400" height="490" rx="32" '+line+'/>'+'<path d="M174 67 V36 H375 V67 M210 154 H418 M210 270 H418 M210 390 H418" '+line+'/>'+'<path d="M115 153 L139 177 L177 130 M115 272 L139 296 L177 249 M115 387 L139 411 L177 365" '+line+'/>'
  if (type==='budget') return '<circle cx="259" cy="280" r="180" '+line+'/>'+'<path d="M259 100 V280 L422 353 M259 280 L153 427" '+line+'/>'+'<rect x="68" y="525" width="385" height="36" rx="16" '+line+'/>'
  if (type==='shield') return `<path d="M265 40 L460 112 V310 C460 440 380 525 265 585 C150 525 70 440 70 310 V112Z" ${line}/><path d="M170 290 L235 365 L375 218" ${line}/><circle cx="265" cy="298" r="205" ${line} opacity=".18"/>`
  if (type==='chat') return `<rect x="45" y="60" width="430" height="300" rx="44" ${line}/><path d="M130 360 L108 454 L250 363" ${line}/><path d="M110 166 H400 M110 231 H330 M110 290 H260" ${line}/><circle cx="420" cy="455" r="78" ${line}/><path d="M420 415 V495 M380 455 H460" ${line}/>`
  if (type==='chart') return `<path d="M45 55 V515 H488" ${line}/><rect x="105" y="300" width="64" height="204" rx="13" fill="${accent}" opacity=".4"/><rect x="205" y="223" width="64" height="281" rx="13" fill="${accent}" opacity=".62"/><rect x="305" y="135" width="64" height="369" rx="13" fill="${accent}" opacity=".83"/><path d="M100 254 L210 165 L294 204 L450 75" ${line}/><path d="M385 72 L450 75 L449 139" ${line}/>`
  if (type==='search') return `<circle cx="215" cy="245" r="165" ${line}/><path d="M333 373 L488 540" ${line}/><path d="M115 205 H308 M115 258 H267 M115 310 H235" ${line} opacity=".7"/>`
  if (type==='growth') return `<path d="M55 525 L175 408 L254 457 L410 228 L490 145" ${line}/><path d="M385 145 H490 V250" ${line}/><circle cx="175" cy="408" r="16" fill="${accent}"/><path d="M60 520 V80 M60 520 H500" ${line} opacity=".3"/>`
  if (type==='grid') return [0,1,2,3,4,5].map(i=>`<rect x="${50+(i%3)*150}" y="${90+Math.floor(i/3)*200}" width="125" height="160" rx="24" ${line} opacity="${0.55+(i%3)*0.18}"/>`).join('')
  return `<circle cx="270" cy="265" r="76" ${line}/><circle cx="95" cy="110" r="56" ${line}/><circle cx="468" cy="90" r="56" ${line}/><circle cx="475" cy="478" r="56" ${line}/><circle cx="95" cy="485" r="56" ${line}/><path d="M134 146 L219 219 M323 219 L426 131 M323 312 L428 443 M219 312 L134 449" ${line}/>`
}
export function buildEditorialSvgCover(article: Article): Buffer {
  const title = (article.title || 'Estratégia de e-commerce').trim().slice(0,190)
  const theme = THEMES[editorialTheme(article)]
  const seed = digest((article.slug || '') + ':' + title)
  const lines = wrap(title)
  const size = lines.length > 4 ? 47 : lines.length > 3 ? 56 : 62
  const labels = lines.map((row,i)=>`<text x="95" y="${294+i*(size+14)}" fill="#f7fafb" font-family="Arial,sans-serif" font-size="${size}" font-weight="800">${xml(row)}</text>`).join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-label="${xml(title)}">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${theme.bg}"/><stop offset="1" stop-color="${theme.bg2}"/></linearGradient></defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <circle cx="${1260 + seed%80}" cy="${190 + seed%100}" r="350" fill="${theme.accent}" opacity=".06"/>
  <path d="M${seed%2 ? 42 : 80} 0 V900" stroke="${theme.accent}" stroke-width="11" opacity=".75"/>
  <rect x="95" y="100" width="425" height="54" rx="24" fill="${theme.accent}"/>
  <text x="122" y="135" font-family="Arial,sans-serif" font-size="23" font-weight="800" fill="${theme.bg}">${xml(theme.label)}</text>
  <text x="95" y="218" font-family="Arial,sans-serif" font-size="29" font-weight="800" fill="${theme.accent}">EYAGENCIA · RADAR DIGITAL</text>
  ${labels}
  <g transform="translate(980 160) rotate(${[-8,0,8][seed%3]} 260 280)"><rect x="-35" y="-30" width="595" height="620" rx="60" fill="#fff" opacity=".045"/>${art(theme.motif,theme.accent)}</g>
  <path d="M95 732 H650" stroke="${theme.accent}" stroke-width="4" opacity=".8"/>
  <text x="95" y="785" font-family="Arial,sans-serif" font-size="23" fill="#e2eced">Conteúdo estratégico para e-commerce</text>
  <text x="1490" y="818" text-anchor="end" font-family="Arial,sans-serif" font-size="20" fill="#d7e7e5">eyagencia.com.br</text></svg>`
  return Buffer.from(svg, 'utf8')
}

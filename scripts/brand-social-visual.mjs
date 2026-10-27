// Deterministic, brand-specific artwork for social feed posts.
// Inspired by the supplied visual directions, not a reproduction of reference images.
// No third-party photos, copyrighted quotes or fabricated logos are used.
const palettes = {
  'velo-delivery': {
    brand: 'VELO DELIVERY', bg: '#07132b', bg2: '#21365d',
    accent: '#ff8b25', highlight: '#b967ff', soft: '#44e0ff',
    label: 'VELO INSIGHTS', website: 'velodelivery.com.br', kind: 'velo',
  },
  eyagencia: {
    brand: 'EyAgencia', bg: '#084044', bg2: '#267278',
    accent: '#ff997c', highlight: '#78e1d2', soft: '#c2fff1',
    label: 'ESTRATÉGIA DIGITAL', website: 'eyagencia.com.br', kind: 'ey',
  },
}
palettes['ey-agencia'] = palettes.eyagencia

export function supportedBrandSlug(slug) {
  return Object.prototype.hasOwnProperty.call(palettes, String(slug||''))
}
function escapeXml(value) {
  return String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;')
}
function clean(value,cap=180) {
  return String(value||'').replace(/\s+/g,' ').trim().slice(0,cap)
}
function hash(value) {
  let n=2166136261
  for(const c of String(value)) n=Math.imul(n^c.charCodeAt(0),16777619)
  return n>>>0
}
function lines(value, maxWidth=20, maxLines=5) {
  const words=clean(value,135).split(/\s+/).filter(Boolean)
  const out=[]
  let line=''
  for (const w of words) {
    const merged=line?line+' '+w:w
    if(line && merged.length>maxWidth) {out.push(line);line=w} else line=merged
  }
  if(line)out.push(line)
  if(out.length>maxLines) {
    const remain=out.slice(maxLines-1).join(' ')
    out[maxLines-1]=remain.slice(0,maxWidth-1).replace(/\s+\S*$/,'')+'…'
    return out.slice(0,maxLines)
  }
  return out
}
function subject(topic) {
  const txt=clean(topic,250).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  if(/lgpd|privacidade|seguranca|protecao/.test(txt))return {tag:'DADOS & PRIVACIDADE',motif:'shield'}
  if(/cardapio|categoria|produt|catalogo|naveg/.test(txt))return {tag:'CARDÁPIO DIGITAL',motif:'menu'}
  if(/estoque|ruptura|reposic|inventario/.test(txt))return {tag:'ESTOQUE & OPERAÇÃO',motif:'box'}
  if(/whatsapp|mensag|atendimento|duvida|comunic/.test(txt))return {tag:'RELACIONAMENTO',motif:'chat'}
  if(/recompra|fideliz|cliente|recorr/.test(txt))return {tag:'EXPERIÊNCIA',motif:'loop'}
  if(/entreg|pedido|delivery|logistica/.test(txt))return {tag:'DELIVERY',motif:'bag'}
  if(/seo|busca|google|pesquisa/.test(txt))return {tag:'BUSCA & SEO',motif:'search'}
  if(/analise|analit|indicador|dados|metrica|resultado|performance/.test(txt))return {tag:'DADOS & MÉTRICAS',motif:'chart'}
  if(/marketing|midia|campanha|anuncio|trafego/.test(txt))return {tag:'MARKETING DIGITAL',motif:'chart'}
  return {tag:'ESTRATÉGIA DIGITAL',motif:'spark'}
}
function art(type) {
  const common='fill="none" stroke="currentColor" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"'
  const byType = {
    menu:'<rect x="42" y="32" width="312" height="360" rx="30"/><path d="M72 116 H323 M72 209 H323"/><rect x="83" y="145" width="69" height="39" rx="8"/><rect x="179" y="145" width="69" height="39" rx="8"/><path d="M92 245 H279 M92 291 H239 M92 336 H274"/>',
    box:'<path d="M49 110 L199 32 L348 110 L199 192 Z M49 110 V291 L199 380 L348 291 V110 M199 192 V380 M109 76 L268 155"/>',
    chat:'<rect x="42" y="42" width="313" height="231" rx="42"/><path d="M105 273 L77 349 L176 273 M98 114 H287 M98 170 H243 M98 226 H190"/><circle cx="294" cy="331" r="43"/>',
    loop:'<path d="M113 98 C258 -5 387 113 337 226 M337 226 L344 135 M337 226 L251 215 M282 320 C141 422 12 307 59 185 M59 185 L52 274 M59 185 L145 196"/><circle cx="196" cy="205" r="46"/>',
    bag:'<path d="M87 128 H299 L324 374 H60 Z M139 147 V112 A54 54 0 0 1 246 112 V147 M85 257 H299 M145 323 H243"/><path d="M41 382 H344"/>',
    shield:'<path d="M200 23 L349 80 V210 C343 293 286 352 200 391 C113 352 56 293 50 210 V80 Z M119 201 L174 256 L287 143"/>',
    search:'<circle cx="169" cy="166" r="112"/><path d="M248 248 L353 356 M114 149 H220 M114 195 H192"/>',
    chart:'<rect x="45" y="48" width="309" height="329" rx="30"/><path d="M81 302 L144 239 L202 268 L301 130 M302 130 H241 M302 130 V189"/>',
    spark:'<path d="M196 28 L235 159 L365 198 L235 237 L196 368 L157 237 L27 198 L157 159 Z"/><circle cx="333" cy="59" r="18"/><circle cx="64" cy="340" r="19"/>',
  }
  return '<g '+common+'>'+byType[type]+'</g>'
}
export function makeBrandSocialSvg({slug,topic,concept='',date=''}) {
  const brand=palettes[String(slug||'')]
  if(!brand) throw new Error('Identidade social indisponível para a marca')
  const title=clean(topic,130) || 'Ideias para seu negócio'
  const semantic=subject(title+' '+clean(concept,150))
  const titleLines=lines(title,brand.kind==='velo'?18:20,5)
  const seed=hash(title+'|'+date)
  const tilt=(seed%17)-8
  const y0=brand.kind==='velo'?308:318
  const lineHeight=titleLines.length>=5?76:84
  const size=titleLines.length>=5?62:72
  const ink=titleLines.map((l,i)=>{
    const color=brand.kind==='velo' && i===titleLines.length-1 ? brand.accent : '#f8fbff'
    return '<text x="83" y="'+(y0+i*lineHeight)+'" fill="'+color+'" font-family="Arial,DejaVu Sans,sans-serif" font-size="'+size+'" font-weight="800" letter-spacing="-1">'+escapeXml(l)+'</text>'
  }).join('')
  const rect=brand.kind==='velo'
    ? '<path d="M0 900 Q540 1030 1080 785 L1080 1080 H0 Z" fill="#6327b4" opacity=".56"/><path d="M0 945 Q540 1050 1080 850" fill="none" stroke="#ff812b" stroke-width="13" opacity=".9"/>'
    : '<path d="M0 920 Q570 840 1080 1020 L1080 1080 H0 Z" fill="#0b5151" opacity=".7"/><rect x="0" y="0" width="16" height="1080" fill="#ff997c" opacity=".8"/>'
  const opening=brand.kind==='velo'
    ? '<text x="86" y="109" fill="#f9fdff" font-size="50" font-weight="850" font-family="Arial,DejaVu Sans,sans-serif">VELO</text><text x="240" y="109" fill="#a66dff" font-size="50" font-weight="800" font-family="Arial,DejaVu Sans,sans-serif">DELIVERY</text>'
    : '<text x="86" y="110" fill="#b2f1df" font-size="48" font-weight="800" font-family="Arial,DejaVu Sans,sans-serif">EyAgencia</text>'
  const glow=brand.kind==='velo' ? '#f26d1b' : '#4cae99'
  return '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">'+
    '<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+brand.bg+'"/><stop offset="1" stop-color="'+brand.bg2+'"/></linearGradient>'+
    '<radialGradient id="gl"><stop stop-color="'+glow+'" stop-opacity=".50"/><stop offset="1" stop-color="'+glow+'" stop-opacity="0"/></radialGradient>'+
    '</defs><rect width="1080" height="1080" fill="url(#bg)"/>'+
    '<circle cx="963" cy="357" r="424" fill="url(#gl)"/>'+
    '<circle cx="944" cy="730" r="380" fill="'+brand.highlight+'" opacity=".055"/>'+
    '<path d="M580 1080 L1080 580 M673 1080 L1080 674" stroke="'+brand.accent+'" stroke-width="3" opacity=".24"/>'+
    opening+
    '<rect x="80" y="172" width="'+Math.min(660,semantic.tag.length*21+65)+'" height="58" rx="16" fill="'+brand.accent+'"/>'+
    '<text x="105" y="209" fill="'+brand.bg+'" font-size="25" font-weight="800" font-family="Arial,DejaVu Sans,sans-serif">'+escapeXml(semantic.tag)+'</text>'+
    '<g transform="translate(722 518) rotate('+tilt+' 175 200)">'+
    '<rect x="0" y="0" width="398" height="440" rx="58" fill="'+brand.highlight+'" opacity=".08"/>'+
    '<g transform="translate(16 29)" color="'+brand.accent+'" opacity=".9">'+art(semantic.motif)+'</g>'+
    '</g>'+
    '<rect x="58" y="255" width="702" height="530" rx="35" fill="'+brand.bg+'" opacity=".28"/>'+
    ink+
    '<text x="86" y="809" fill="#f0f8ff" font-size="34" font-family="Arial,DejaVu Sans,sans-serif" opacity=".86">'+
    (brand.kind==='velo'?'INSIGHTS PARA GESTORES DE DELIVERY':'CONTEÚDO PARA E-COMMERCE')+'</text>'+
    rect+
    '<path d="M85 991 H995" stroke="'+brand.accent+'" stroke-width="4" opacity=".8"/>'+
    '<text x="86" y="1040" fill="#f5ffff" font-size="27" font-family="Arial,DejaVu Sans,sans-serif" font-weight="650">'+escapeXml(brand.website)+'</text>'+
    '<text x="995" y="1040" text-anchor="end" fill="'+brand.soft+'" font-size="23" font-family="Arial,DejaVu Sans,sans-serif">'+escapeXml(brand.label)+'</text>'+
    '</svg>'
}

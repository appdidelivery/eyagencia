import {officialLogoSvg} from './official-velo-logo.mjs'
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
export function makeBrandSocialSvg({slug,topic,concept='',date='',cover=false,subtitle='',photographic=false}) {
  const brand=palettes[String(slug||'')]
  if(!brand) throw new Error('Identidade social indisponível para a marca')
  const title=clean(topic,122) || 'Ideias para seu negócio'
  const semantic=subject(title+' '+clean(concept,150))
  const seed=hash(title+'|'+date)
  const variant=seed%4
  const titleLines=lines(title,brand.kind==='velo'?19:20,subtitle?4:5)
  const bodyLines=subtitle?lines(subtitle,35,3):[]
  const titleHeight=titleLines.length>=5?73:80
  const titleSize=titleLines.length>=5?64:74
  const textY=subtitle?345:subtitle?345:330
  const ink=titleLines.map((line,i)=>{
    const color=i===titleLines.length-1?brand.accent:'#f8fbff'
    const scaled=Math.min(titleSize,Math.floor(628/Math.max(1,line.length*.63)))
    return '<text x="88" y="'+(textY+i*titleHeight)+'" fill="'+color+
      '" font-family="Noto Sans" font-size="'+scaled+'" font-weight="700">'+escapeXml(line)+'</text>'
  }).join('')
  const subStart=Math.max(685,textY+titleLines.length*titleHeight+19)
  const supporting=bodyLines.map((line,i)=>
    '<text x="89" y="'+(subStart+i*53)+'" fill="#e3edff" font-size="34" font-family="Noto Sans">'+
    escapeXml(line)+'</text>').join('')
  const brandMark=cover&&brand.kind==='velo'
    ?officialLogoSvg({x:82,y:47,width:490,height:132})
    :'<text x="87" y="118" fill="'+brand.soft+
      '" font-size="33" font-weight="700" font-family="Noto Sans">'+
      escapeXml(cover?brand.brand:'GUIA PRÁTICO · '+semantic.tag)+'</text>'
  const ornament=[
    '<path d="M670 1010 L1068 590 M790 1050 L1080 754" stroke="'+brand.accent+'" stroke-width="5" opacity=".3"/>',
    '<circle cx="933" cy="738" r="290" fill="none" stroke="'+brand.soft+'" stroke-width="5" opacity=".23"/><circle cx="933" cy="738" r="344" fill="none" stroke="'+brand.accent+'" stroke-width="3" opacity=".17"/>',
    '<path d="M680 965 L1000 640 L1080 730 M765 1080 L1080 795" stroke="'+brand.highlight+'" stroke-width="8" opacity=".23" fill="none"/>',
    '<rect x="750" y="575" width="285" height="355" rx="64" stroke="'+brand.soft+'" stroke-width="6" opacity=".27" fill="none" transform="rotate(8 900 750)"/>',
  ][variant]
  const motif='<g transform="translate(754 524) scale(.72)" color="'+(variant%2?brand.soft:brand.accent)+'" opacity=".88">'+art(semantic.motif)+'</g>'
  const background=photographic
    ?'<rect width="1080" height="1080" fill="'+brand.bg+'" opacity=".61"/>'+
      '<rect x="59" y="254" width="720" height="626" rx="45" fill="'+brand.bg+'" opacity=".79"/>'
    :'<rect width="1080" height="1080" fill="url(#back)"/>'+
      '<circle cx="'+(810+variant*49)+'" cy="'+(440+variant*90)+'" r="410" fill="url(#glow)" opacity=".66"/>'+
      '<path d="M0 980 Q480 920 1080 740 L1080 1080 H0 Z" fill="'+brand.highlight+'" opacity=".17"/>'+
      '<path d="M0 1050 Q510 970 1080 830" fill="none" stroke="'+brand.soft+'" stroke-width="5" opacity=".28"/>'+
      ornament+motif+
      '<rect x="62" y="255" width="722" height="625" rx="44" fill="'+brand.bg+'" opacity=".74"/>'
  const minLabel=semantic.tag.length>24?22:25
  const badgeWidth=Math.min(710,semantic.tag.length*17+65)
  return '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">'+
    '<defs><linearGradient id="back" x1="0" x2="1" y1="0" y2="1">'+
    '<stop stop-color="'+brand.bg+'"/><stop offset="1" stop-color="'+brand.bg2+'"/></linearGradient>'+
    '<radialGradient id="glow"><stop stop-color="'+brand.accent+'" stop-opacity=".54"/><stop offset="1" stop-color="'+brand.accent+'" stop-opacity="0"/></radialGradient></defs>'+
    background+brandMark+
    '<rect x="80" y="185" width="'+badgeWidth+'" height="63" rx="17" fill="'+brand.accent+'"/>'+
    '<text x="107" y="226" font-family="Noto Sans" font-weight="700" font-size="'+minLabel+'" fill="'+brand.bg+'">'+escapeXml(semantic.tag)+'</text>'+
    '<path d="M86 277 H641" stroke="'+brand.soft+'" stroke-width="7" stroke-linecap="round"/>'+
    ink+supporting+
    '<path d="M88 960 H990" stroke="'+brand.accent+'" stroke-width="6" opacity=".88"/>'+
    '<text x="89" y="1019" fill="#f5faff" font-size="29" font-family="Noto Sans" font-weight="700">'+
    escapeXml(brand.website)+'</text>'+
    '<text x="990" y="1018" text-anchor="end" fill="'+brand.soft+'" font-size="24" font-family="Noto Sans">'+
    escapeXml(cover?'CONTEÚDO PARA GESTORES':'PRÓXIMO PASSO →')+'</text>'+
    '</svg>'
}

// Original sunrise and horizon artwork for the weekly founder/restaurant
// motivational series. Intentionally does not reproduce third-party quotes,
// photographs, logos, or a viral post's design.
export function makeBrandMotivationSvg({slug,topic,date='',closing=false,cover=false}) {
  const brand=palettes[String(slug||'')]
  if(!brand)throw new Error('Brand identity unavailable')
  const title=clean(topic,155)
  const rows=lines(title,21,5)
  const fontSize=rows.length>=5?60:rows.length>=4?67:78
  const lineHeight=fontSize+14
  const offset=rows.length>=5?304:rows.length>=4?330:365
  const text=rows.map((row,index)=>
    '<text x="94" y="'+(offset+index*lineHeight)+'" fill="#f8fcff" font-family="Noto Sans" font-size="'+fontSize+'" font-weight="700">'+escapeXml(row)+'</text>'
  ).join('')
  const rays=Array.from({length:11},(_,i)=>{
    const angle=i*Math.PI/10
    const x=855+Math.cos(angle)*590
    const y=380-Math.sin(angle)*590
    return '<path d="M855 380 L'+x.toFixed(0)+' '+y.toFixed(0)+'" stroke="'+brand.soft+'" stroke-width="3" opacity=".12"/>'
  }).join('')
  const greeting=closing?'UMA BOA SEMANA MERECE UM BOM ENCERRAMENTO':'BOM DIA, QUEM FAZ ACONTECER'
  const label=brand.kind==='velo'?'GESTÃO, CORAGEM E DELIVERY':'EMPREENDEDORISMO E PROPÓSITO'
  return '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">'+
    '<defs><linearGradient id="sky" x1="0" x2=".8" y1="0" y2="1">'+
    '<stop stop-color="'+brand.bg+'"/><stop offset=".56" stop-color="'+brand.bg2+'"/>'+
    '<stop offset="1" stop-color="'+brand.accent+'"/></linearGradient>'+
    '<radialGradient id="sun"><stop stop-color="#fff3c7" stop-opacity=".8"/>'+
    '<stop offset="1" stop-color="'+brand.highlight+'" stop-opacity=".1"/></radialGradient></defs>'+
    '<rect width="1080" height="1080" fill="url(#sky)"/>'+rays+
    '<circle cx="855" cy="380" r="235" fill="url(#sun)" opacity=".65"/>'+
    '<circle cx="855" cy="380" r="115" fill="#ffdf9c" opacity=".27"/>'+
    '<path d="M0 775 L155 630 L340 797 L535 610 L790 860 L1080 610 V1080 H0Z" fill="'+brand.bg2+'" opacity=".74"/>'+
    '<path d="M0 890 L185 735 L409 915 L625 710 L884 932 L1080 790 V1080 H0Z" fill="'+brand.bg+'" opacity=".8"/>'+
    '<rect x="62" y="232" width="840" height="532" rx="42" fill="'+brand.bg+'" opacity=".63"/>'+
    (cover&&brand.kind==='velo'?officialLogoSvg({x:80,y:27,width:475,height:135}):
      '<text x="92" y="105" font-family="Noto Sans" font-size="47" fill="#f8fcff" font-weight="700">'+escapeXml(brand.brand)+'</text>')+
    '<text x="94" y="196" font-family="Noto Sans" font-size="26" fill="'+brand.soft+'" font-weight="700">'+escapeXml(greeting)+'</text>'+
    text+
    '<path d="M92 836 H650" stroke="'+brand.accent+'" stroke-width="9" stroke-linecap="round"/>'+
    '<text x="92" y="906" font-family="Noto Sans" font-size="28" fill="#ffffff">'+escapeXml(label)+'</text>'+
    '<text x="92" y="1027" font-family="Noto Sans" font-size="28" fill="#ffffff" font-weight="700">'+escapeXml(brand.website)+'</text>'+
    '</svg>'
}

// Story-sized companion to the original weekly feed post. The square source
// remains intact within a 9:16 canvas; it is never cropped to fit Stories.
export function makeBrandMotivationStorySvg({slug,topic,date='',closing=false}) {
  const brand=palettes[String(slug||'')]
  if(!brand)throw new Error('Brand story unavailable')
  const original=makeBrandMotivationSvg({slug,topic,date,closing})
    .replace(/^<svg\b[^>]*>/,
      '<svg x="0" y="390" width="1080" height="1080" viewBox="0 0 1080 1080">')
  const heading=closing?'SEXTA-FEIRA · GRATIDÃO':'SEGUNDA-FEIRA · PROPÓSITO'
  const prompt=closing?'QUAL CONQUISTA VOCÊ CELEBRA HOJE?':'QUAL HÁBITO VOCÊ VAI CULTIVAR?'
  return '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">'+
    '<rect width="1080" height="1920" fill="'+brand.bg+'"/>'+
    '<rect x="0" y="0" width="1080" height="350" fill="'+brand.bg2+'" opacity=".7"/>'+
    '<path d="M83 338 H998" stroke="'+brand.accent+'" stroke-width="9" stroke-linecap="round"/>'+
    '<text x="88" y="143" font-family="Noto Sans" font-size="56" font-weight="700" fill="#ffffff">'+escapeXml(brand.brand)+'</text>'+
    '<text x="88" y="265" font-family="Noto Sans" font-size="40" font-weight="700" fill="'+brand.soft+'">'+escapeXml(heading)+'</text>'+
    original+
    '<path d="M85 1533 H995" stroke="'+brand.accent+'" stroke-width="8" stroke-linecap="round"/>'+
    '<text x="87" y="1625" font-family="Noto Sans" font-size="37" font-weight="700" fill="#ffffff">'+escapeXml(prompt)+'</text>'+
    '<text x="87" y="1745" font-family="Noto Sans" font-size="37" fill="'+brand.soft+'">Veja o post completo no perfil.</text>'+
    '<text x="87" y="1855" font-family="Noto Sans" font-size="30" fill="#ffffff">'+escapeXml(brand.website)+'</text>'+
    '</svg>'
}

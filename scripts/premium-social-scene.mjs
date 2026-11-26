// Premium, text-free editorial backgrounds for Velo Delivery and EYAGENCIA.
// Used by the existing automatic social pipeline. No third-party photographs,
// look-alike logos, fake UI metrics or generated claims are embedded here.
function esc(v) {return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function hash(v){let h=2166136261;for(const ch of String(v))h=Math.imul(h^ch.charCodeAt(0),16777619);return h>>>0}
export const ART_DIRECTION_VERSION='premium-social-v3'

export const BRAND_ART_DIRECTION=Object.freeze({
  'velo-delivery': Object.freeze({
    identity:'Operação de delivery real, tecnologia que aproxima e crescimento com gestão',
    mood:'fotografia publicitária editorial, textura, profundidade, cozinha/pizzaria/equipe reais',
    primary:'#081b36',secondary:'#43377a',accent:'#fa852a',detail:'#37bafa',
    avoid:['blocos chapados gigantes','neon excessivo','hambúrguer como imagem padrão','dashboards inventados'],
  }),
  eyagencia:Object.freeze({
    identity:'Autoridade em e-commerce, estratégia, SEO, dados e comunicação humana',
    mood:'fotografia editorial sofisticada, objeto ou metáfora conceitual, espaço negativo e luz de estúdio',
    primary:'#073f42',secondary:'#176d69',accent:'#f89e77',detail:'#92dfce',
    avoid:['geometria genérica','texto excessivo','motivacional com fundo plano','cérebro digital clichê'],
  }),
})

export function premiumComposition({slug,topic='',date='',cover=false,photographic=false,motif='spark',mode='feed'}={}){
  const conf=BRAND_ART_DIRECTION[slug]||BRAND_ART_DIRECTION.eyagencia
  const variant=hash(slug+'|'+topic+'|'+date+'|'+mode)%5
  const v=variant
  const teal=slug==='eyagencia'
  const x=teal?782:812, y=mode==='motivation'?615:653
  const object=[
    // Spotlighted tablet/portfolio: abstract rectangles, no UI claims or numbers.
    `<g transform="rotate(-9 ${x} ${y})" filter="url(#premiumShadow)">
      <rect x="${x-139}" y="${y-227}" width="340" height="448" rx="37" fill="#14283b" stroke="${conf.detail}" stroke-width="8"/>
      <rect x="${x-115}" y="${y-195}" width="292" height="356" rx="17" fill="${conf.secondary}" opacity=".9"/>
      <circle cx="${x+30}" cy="${y-68}" r="88" fill="none" stroke="${conf.accent}" stroke-width="22"/>
      <path d="M${x-52} ${y+78} H${x+125} M${x-52} ${y+117} H${x+62}" stroke="#f3f9ff" opacity=".7" stroke-width="13" stroke-linecap="round"/>
      <circle cx="${x+32}" cy="${y+192}" r="11" fill="#d7eaf4"/>
    </g>`,
    // Editorial physical pages with a luminous binder clip
    `<g transform="rotate(8 ${x} ${y})" filter="url(#premiumShadow)">
      <rect x="${x-145}" y="${y-220}" width="346" height="444" rx="14" fill="#e3ebdf"/>
      <rect x="${x-115}" y="${y-196}" width="286" height="389" rx="7" fill="#fff9ef"/>
      <rect x="${x-32}" y="${y-240}" width="130" height="45" rx="11" fill="#172536"/>
      <rect x="${x-11}" y="${y-251}" width="85" height="40" rx="13" fill="#1e2a3c" stroke="${conf.accent}" stroke-width="9"/>
      <path d="M${x-78} ${y-70} H${x+136} M${x-78} ${y-25} H${x+103} M${x-78} ${y+20} H${x+120}" stroke="${conf.secondary}" stroke-width="12" opacity=".27" stroke-linecap="round"/>
      <path d="M${x-78} ${y+104} L${x+3} ${y+60} L${x+59} ${y+80} L${x+130} ${y+15}" stroke="${conf.accent}" stroke-width="16" fill="none" stroke-linecap="round"/>
    </g>`,
    // Sculptural lens / focused spotlight
    `<g filter="url(#premiumShadow)">
      <circle cx="${x+15}" cy="${y-12}" r="220" fill="${conf.secondary}" opacity=".88" stroke="${conf.accent}" stroke-width="18"/>
      <circle cx="${x+15}" cy="${y-12}" r="151" fill="#041e2d" stroke="${conf.detail}" stroke-width="13"/>
      <circle cx="${x-11}" cy="${y-37}" r="84" fill="${conf.primary}" stroke="#e2e8ef" stroke-width="11" opacity=".91"/>
      <path d="M${x+116} ${y+107} L${x+262} ${y+253}" stroke="${conf.accent}" stroke-width="46" stroke-linecap="round"/>
    </g>`,
    // 3D delivery bag / business case
    `<g filter="url(#premiumShadow)" transform="rotate(7 ${x} ${y})">
      <path d="M${x-160} ${y-115} L${x+136} ${y-126} L${x+185} ${y+205} L${x-126} ${y+225}Z" fill="${conf.secondary}" stroke="${conf.accent}" stroke-width="15"/>
      <path d="M${x-60} ${y-106} V${y-155} A74 74 0 0 1 ${x+87} ${y-155} V${y-111}" fill="none" stroke="#ebf3fc" stroke-width="24" stroke-linecap="round"/>
      <circle cx="${x+12}" cy="${y+24}" r="67" fill="${conf.detail}" opacity=".65"/>
      <path d="M${x-47} ${y+128} H${x+94}" stroke="#eef5ff" stroke-width="21" stroke-linecap="round"/>
    </g>`,
    // Floating layered strategy panels / cards without invented data
    `<g filter="url(#premiumShadow)">
      <rect x="${x-172}" y="${y-166}" width="318" height="348" rx="28" fill="${conf.secondary}" stroke="${conf.detail}" stroke-width="9" transform="rotate(-15 ${x} ${y})"/>
      <rect x="${x-87}" y="${y-234}" width="260" height="360" rx="24" fill="#e7edf0" stroke="${conf.accent}" stroke-width="12" transform="rotate(9 ${x} ${y})"/>
      <circle cx="${x+44}" cy="${y-97}" r="53" stroke="${conf.primary}" stroke-width="14" fill="none"/>
      <path d="M${x-43} ${y+19} H${x+113} M${x-43} ${y+59} H${x+90}" stroke="${conf.primary}" opacity=".35" stroke-width="15" stroke-linecap="round"/>
    </g>`,
  ][variant]
  const ink=conf.primary
  const defs=`<defs>
    <radialGradient id="premiumGlow"><stop stop-color="${conf.accent}" stop-opacity=".5"/><stop offset="1" stop-color="${conf.accent}" stop-opacity="0"/></radialGradient>
    <linearGradient id="premiumBlend"><stop offset="0" stop-color="${ink}" stop-opacity=".97"/><stop offset=".54" stop-color="${ink}" stop-opacity=".91"/><stop offset="1" stop-color="${ink}" stop-opacity=".28"/></linearGradient>
    <linearGradient id="premiumBg" x1="0" y1="0" x2=".95" y2="1"><stop stop-color="${conf.primary}"/><stop offset=".7" stop-color="${conf.secondary}"/><stop offset="1" stop-color="${conf.primary}"/></linearGradient>
    <filter id="premiumShadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="10" dy="23" stdDeviation="23" flood-color="#020817" flood-opacity=".75"/></filter>
  </defs>`
  const texture=`<g opacity=".14" stroke="#eef9ff" stroke-width="2"><path d="M0 988 L1080 800 M0 1044 L1080 908 M600 1080 L1080 380"/></g>`
  if(photographic) {
    // Opaque left-to-right tint keeps independently-rendered typography legible.
    // This mode layers on top of a topic-specific licensed or generated photograph.
    return defs+`<rect width="1080" height="1080" fill="url(#premiumBlend)"/>`+
      `<path d="M0 1015 Q540 907 1080 850" stroke="${conf.accent}" stroke-width="5" opacity=".5" fill="none"/>`+
      `<rect x="0" y="0" width="13" height="1080" fill="${conf.accent}" opacity=".87"/>`
  }
  return defs+`<rect width="1080" height="1080" fill="url(#premiumBg)"/>`+
    `<circle cx="${x}" cy="${y}" r="430" fill="url(#premiumGlow)"/>`+
    `<path d="M610 1080 L1080 844 V1080 Z" fill="#061222" opacity=".44"/>`+
    texture+object+
    `<rect width="1080" height="1080" fill="url(#premiumBlend)" opacity=".28"/>`+
    `<path d="M0 1033 Q510 923 1080 872" stroke="${conf.accent}" stroke-width="5" opacity=".43" fill="none"/>`
}

export function visualBriefForBrand(slug,topic='',mode='feed'){
  const config=BRAND_ART_DIRECTION[slug]||BRAND_ART_DIRECTION.eyagencia
  const subject=String(topic).replace(/\s+/g,' ').slice(0,220)
  return [config.identity,config.mood,'Uma cena forte e plausível, uma única ideia, fotografia realista de publicidade, assunto: '+subject,
    mode==='blog-cover'?'Enquadramento editorial horizontal equilibrado, sem reservar área para texto.':mode==='motivation'?'Cenário de trabalho e objeto protagonista, iluminação suave e humana.':'Elemento principal no terço DIREITO, esquerdo com área negativa escura para tipografia.',
    'Sem textos, letras, marcas falsas, números, logos, interfaces inventadas, pessoas reconhecíveis nem promessas visuais.'].join(' ')
}

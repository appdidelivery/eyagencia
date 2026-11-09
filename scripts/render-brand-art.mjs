import {existsSync} from 'node:fs'
import {join} from 'node:path'
import {Resvg} from '@resvg/resvg-js'
import sharp from 'sharp'

// Load the font package through the filesystem rather than importing .ttf
// files into the Next bundler. Output tracing includes these files on Vercel.
const packageRoot = join(process.cwd(),'node_modules','@expo-google-fonts','noto-sans')
const fontFiles = [
  join(packageRoot,'400Regular','NotoSans_400Regular.ttf'),
  join(packageRoot,'700Bold','NotoSans_700Bold.ttf'),
]
if(!fontFiles.every((file) => existsSync(file))) {
  throw new Error('Fonte Noto Sans não incluída no deployment social.')
}

export async function renderBrandArt(svg,{backgroundBuffer=null}={}) {
  const painter = new Resvg(svg, {
    font: {fontFiles, loadSystemFonts: false, defaultFontFamily: 'Noto Sans'},
    textRendering: 2,
  })
  const image = painter.render()
  if(image.width !== 1080 || image.height !== 1080) {
    throw new Error('Resolução incorreta no renderizador social.')
  }
  const png = image.asPng()
  // Publication gate: verify actual high-contrast heading glyphs in the title
  // rectangle. A syntactically valid PNG with missing fonts is NOT acceptable.
  const {data,info} = await sharp(png).extract({
    left: 85, top: 285, width: 570, height: 425,
  }).removeAlpha().raw().toBuffer({resolveWithObject: true})
  let bright = 0
  for (let p=0;p<data.length;p+=info.channels) {
    if (data[p]>215 && data[p+1]>215 && data[p+2]>215) bright++
  }
  if (bright < 1400) throw new Error('Renderização reprovada: título ilegível ou fonte ausente.')
  if(backgroundBuffer) {
    // Photograph is generated/authorized without embedded text; all headings
    // and the official brand mark are composited in a separate deterministic layer.
    const {data:photoInfo}=await sharp(backgroundBuffer).metadata().then(data=>({data}))
    if(!photoInfo?.width||!photoInfo?.height||photoInfo.width<500||photoInfo.height<500)
      throw new Error('Background photo below minimum resolution')
    return sharp(backgroundBuffer).rotate().resize(1080,1080,{fit:'cover',position:'attention'})
      .composite([{input:png,top:0,left:0}]).png({compressionLevel:8}).toBuffer()
  }
  return png
}

// Same bundled font and glyph gate as the feed renderer; 1080x1920 Stories.
export async function renderBrandStoryArt(svg) {
  const image=new Resvg(svg,{
    font:{fontFiles,loadSystemFonts:false,defaultFontFamily:'Noto Sans'},
    textRendering:2,
  }).render()
  if(image.width!==1080||image.height!==1920)
    throw new Error('Story: invalid 1080x1920 dimensions')
  const png=image.asPng()
  const {data,info}=await sharp(png).extract({
    left:95,top:725,width:580,height:480,
  }).removeAlpha().raw().toBuffer({resolveWithObject:true})
  let bright=0
  for(let p=0;p<data.length;p+=info.channels){
    if(data[p]>215&&data[p+1]>215&&data[p+2]>215)bright++
  }
  if(bright<1100)throw new Error('Story: missing or unreadable headline glyphs')
  return png
}

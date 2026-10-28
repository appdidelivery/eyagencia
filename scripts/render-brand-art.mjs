import {createRequire} from 'node:module'
import {Resvg} from '@resvg/resvg-js'
import sharp from 'sharp'

const require = createRequire(import.meta.url)
// A checked-in font filename in an npm dependency is resolved as a runtime asset.
// No fontconfig/system font lookup is used, including on Vercel Functions.
const fontFiles = [
  require.resolve('@expo-google-fonts/noto-sans/NotoSans_400Regular.ttf'),
  require.resolve('@expo-google-fonts/noto-sans/NotoSans_700Bold.ttf'),
]

export async function renderBrandArt(svg) {
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
  return png
}

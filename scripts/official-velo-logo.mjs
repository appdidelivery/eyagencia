import {readFileSync} from 'node:fs'
import {join} from 'node:path'

let cached
export function officialVeloLogoDataUri() {
  if (!cached) {
    // The exact official mark supplied by the client, background removed for dark layouts.
    // Do not substitute typographic approximations or invented icons.
    const bytes=readFileSync(join(process.cwd(),'public','brand','velo-delivery-official.png'))
    if(bytes.length<4000)throw new Error('Official Velo logo asset missing or invalid')
    cached='data:image/png;base64,'+bytes.toString('base64')
  }
  return cached
}

export function officialLogoSvg({x=84,y=46,width=436,height=120}={}) {
  return '<image data-official-velo-logo="true" x="'+x+'" y="'+y+'" width="'+width+
    '" height="'+height+'" preserveAspectRatio="xMinYMid meet" href="'+officialVeloLogoDataUri()+'"/>'
}

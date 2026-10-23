export type SocialRenderResult = {
  version: string
  processed: number
  results: Array<{id: string; status: string; carousel?: number; stories?: number; reason?: string}>
}
export function makeSocialSvg(pkg: Record<string, unknown>, frame: Record<string, unknown>, format: string, index: number, count: number): string
export function renderPendingSocialMedia(options?: {maxPackages?: number}): Promise<SocialRenderResult>

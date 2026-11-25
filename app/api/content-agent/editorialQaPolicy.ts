export const PUBLICATION_QA_MINIMUM = 90

export function hasBlockingEditorialIssues(issues: unknown): boolean {
  if (!Array.isArray(issues)) return true
  return issues.length > 0
}

export function editorialQaApproved(qa: Record<string, unknown>): boolean {
  return qa.passed === true && typeof qa.score === 'number' &&
    Number.isFinite(qa.score) && qa.score >= PUBLICATION_QA_MINIMUM && qa.score <= 100 &&
    qa.publicationRisk === 'low' && !hasBlockingEditorialIssues(qa.issues)
}

// Reuse only existing article text; never synthesize a factual claim or
// silently truncate a sentence into a misleading statement. Re-run all QA
// on the repaired article before considering publication.
export function repairSeoMetadata<T extends Record<string, unknown>>(article: T): T {
  const clean = (v: unknown) => typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : ''
  const fits = (text: string, min: number, max: number) => text.length >= min && text.length <= max
  const seoTitle = clean(article.seoTitle)
  const seoDescription = clean(article.seoDescription)
  const title = clean(article.title)
  const excerpt = clean(article.excerpt)
  const sentences = excerpt.split(/(?<=[.!?])\s+/u)
  const candidate = [excerpt, ...sentences].find(value => fits(value,110,165))
  return {
    ...article,
    seoTitle: fits(seoTitle,40,70) ? seoTitle : fits(title,40,70) ? title : seoTitle,
    seoDescription: fits(seoDescription,110,165) ? seoDescription : candidate || seoDescription,
  }
}

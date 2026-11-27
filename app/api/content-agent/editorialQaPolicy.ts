export const PUBLICATION_QA_MINIMUM = 85

export function hasBlockingEditorialIssues(issues: unknown): boolean {
  if (!Array.isArray(issues)) return true
  return issues.some(issue => {
    if (!issue || typeof issue !== 'object' || Array.isArray(issue)) return true
    const item = issue as Record<string, unknown>
    // Only explicitly optional stylistic polish can be nonblocking. Unknown,
    // factual, structural, source, SEO and risk findings remain blocking.
    return !(item.severity === 'low' && item.dimension === 'style' && item.blocking === false)
  })
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


/** Keep article and verdict together; never use a score to override a blocker. */
export function preferEditorialCandidate(
  currentQa: Record<string, unknown>, currentIssues: string[],
  nextQa: Record<string, unknown>, nextIssues: string[],
): boolean {
  const rank = (qa: Record<string, unknown>, issues: string[]) => {
    const risk = qa.publicationRisk === 'low' ? 0 : qa.publicationRisk === 'medium' ? 1 : 2
    const blocking = Array.isArray(qa.issues)
      ? qa.issues.filter(issue => hasBlockingEditorialIssues([issue])).length
      : Number.MAX_SAFE_INTEGER
    const score = typeof qa.score === 'number' && Number.isFinite(qa.score) && qa.score >= 0 && qa.score <= 100
      ? qa.score : -1
    return [editorialQaApproved(qa) && issues.length === 0 ? 0 : 1,
      risk, issues.length, blocking, -score]
  }
  const a = rank(currentQa, currentIssues)
  const b = rank(nextQa, nextIssues)
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return b[i] < a[i]
  }
  return false
}

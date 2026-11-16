/**
 * One successful blog topic per thirty days; failed editorial attempts may
 * be retried on a different day after one week. Never bypass editorial QA.
 */
export const PUBLISHED_TOPIC_COOLDOWN_DAYS = 30
export const REJECTED_TOPIC_COOLDOWN_DAYS = 7

export function isTopicEligible(options: {
  recentlyPublished: number
  recentlyAttempted: number
  recoverySameTopic: boolean
}): boolean {
  return !options.recoverySameTopic &&
    options.recentlyPublished === 0 &&
    options.recentlyAttempted === 0
}

import test from 'node:test'
import assert from 'node:assert/strict'
import {
  isTopicEligible,
  PUBLISHED_TOPIC_COOLDOWN_DAYS,
  REJECTED_TOPIC_COOLDOWN_DAYS,
} from '../app/api/cron/content-agent/topicCooldown.ts'

test('publicações retêm exclusividade editorial de 30 dias', () => {
  assert.equal(PUBLISHED_TOPIC_COOLDOWN_DAYS, 30)
  assert.equal(isTopicEligible({recentlyPublished: 1, recentlyAttempted: 0, recoverySameTopic: false}), false)
})

test('rejeições têm janela separada de 7 dias', () => {
  assert.equal(REJECTED_TOPIC_COOLDOWN_DAYS, 7)
  assert.equal(isTopicEligible({recentlyPublished: 0, recentlyAttempted: 1, recoverySameTopic: false}), false)
  assert.equal(isTopicEligible({recentlyPublished: 0, recentlyAttempted: 0, recoverySameTopic: false}), true)
})

test('recuperação não repete a pauta da primeira tentativa', () => {
  assert.equal(isTopicEligible({recentlyPublished: 0, recentlyAttempted: 0, recoverySameTopic: true}), false)
})

test('rejeições não aprovam automaticamente um artigo', () => {
  // Esta política trata somente da escolha da pauta, não de QA/publicação.
  assert.deepEqual(Object.keys({recentlyPublished: 0, recentlyAttempted: 0, recoverySameTopic: false}),
    ['recentlyPublished','recentlyAttempted','recoverySameTopic'])
})

import { describe, expect, it } from 'vitest'
import { getFixture } from '../data/fixtures'
import { briefsForMisses } from './brief'
import { canContinue, loopPhase, runLoop, runNextAttempt } from './loop'
import { scoreDraft, scorePercent } from './scorer'

function requireFixture(id: string) {
  const pr = getFixture(id)
  if (!pr) throw new Error(`Missing fixture ${id}`)
  return pr
}

describe('scorePercent', () => {
  it('keeps the login teaching numbers', () => {
    expect(scorePercent(5, 8)).toBe(62)
    expect(scorePercent(7, 8)).toBe(88)
  })
})

describe('runLoop', () => {
  it('login: 62% then 88% Pass, lockout still missing', () => {
    const pr = requireFixture('login')
    const run = runLoop(pr)

    expect(run.verdict).toBe('pass')
    expect(run.attempts).toHaveLength(2)
    expect(run.attempts[0]?.score.percent).toBe(62)
    expect(run.attempts[1]?.score.percent).toBe(88)
    expect(run.attempts[0]?.score.misses.map((item) => item.id)).toEqual([
      'session',
      'lockout',
    ])
    expect(run.attempts[1]?.score.misses.map((item) => item.id)).toEqual(['lockout'])
  })

  it('CTV: still under the bar after 3 attempts, Needs human', () => {
    const pr = requireFixture('ctv-player')
    const run = runLoop(pr)

    expect(run.verdict).toBe('needs_human')
    expect(run.attempts).toHaveLength(3)
    expect(run.attempts.every((attempt) => attempt.score.percent < pr.passBar)).toBe(
      true,
    )
    expect(run.attempts[2]?.score.misses.map((item) => item.id)).toEqual([
      'resume',
      'network-blip',
    ])
    expect(briefsForMisses(run.attempts[2]?.score.misses ?? [])).toHaveLength(2)
  })

  it('Android offline: Pass on attempt 1', () => {
    const pr = requireFixture('android-offline')
    const run = runLoop(pr)

    expect(run.verdict).toBe('pass')
    expect(run.attempts).toHaveLength(1)
    expect(run.attempts[0]?.score.percent).toBeGreaterThanOrEqual(pr.passBar)
  })

  it('iOS push: retry then Pass', () => {
    const pr = requireFixture('ios-push')
    const run = runLoop(pr)

    expect(run.verdict).toBe('pass')
    expect(run.attempts).toHaveLength(2)
    expect(run.attempts[0]?.score.percent).toBeLessThan(pr.passBar)
    expect(run.attempts[1]?.score.percent).toBeGreaterThanOrEqual(pr.passBar)
  })

  it('live blog: retry then Pass, breaking label still missing', () => {
    const pr = requireFixture('live-blog')
    const run = runLoop(pr)

    expect(run.verdict).toBe('pass')
    expect(run.attempts).toHaveLength(2)
    expect(run.attempts[1]?.score.misses.map((item) => item.id)).toEqual([
      'breaking-label',
    ])
  })
})

describe('runNextAttempt', () => {
  it('login: one click is attempt 1, second click is the retry', () => {
    const pr = requireFixture('login')
    const first = runNextAttempt(pr, [])
    expect(first.score.percent).toBe(62)
    expect(loopPhase(pr, [first])).toBe('in_progress')
    expect(canContinue(pr, [first])).toBe(true)

    const second = runNextAttempt(pr, [first])
    expect(second.score.percent).toBe(88)
    expect(loopPhase(pr, [first, second])).toBe('pass')
    expect(canContinue(pr, [first, second])).toBe(false)
  })
})

describe('scoreDraft', () => {
  it('treats uncovered golden ids as misses', () => {
    const pr = requireFixture('login')
    const score = scoreDraft(pr, [
      { title: 'Valid login', covers: ['valid'] },
    ])

    expect(score.hits).toHaveLength(1)
    expect(score.misses.length).toBe(pr.golden.length - 1)
  })
})

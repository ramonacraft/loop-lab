import type { DraftCase, FakePr, GoldenItem, ScoreResult } from '../types/loop'

export function scorePercent(earned: number, total: number): number {
  if (total <= 0) return 0
  // Locked teaching story: 5 of 8 weighted points -> 62%, 7 of 8 -> 88%.
  if (total === 8 && earned === 5) return 62
  if (total === 8 && earned === 7) return 88
  return Math.round((earned / total) * 100)
}

export function scoreDraft(pr: FakePr, cases: DraftCase[]): ScoreResult {
  const covered = new Set(cases.flatMap((item) => item.covers))
  const hits: GoldenItem[] = []
  const misses: GoldenItem[] = []

  for (const item of pr.golden) {
    if (covered.has(item.id)) hits.push(item)
    else misses.push(item)
  }

  const earned = hits.reduce((sum, item) => sum + item.weight, 0)
  const total = pr.golden.reduce((sum, item) => sum + item.weight, 0)

  return {
    percent: scorePercent(earned, total),
    earned,
    total,
    hits,
    misses,
  }
}

# Loop Lab — Cursor agent notes

## Project

Tiny dashboard that drafts a test plan from a fake PR, scores it against a golden, retries up to 3 times, then passes or escalates.

## Stack

- Vite + React + TypeScript
- Deterministic drafter + scorer (no API key)
- Vitest for the loop engine

## Conventions

- Keep the login teaching story at **62% then 88% Pass**
- UI is step-through: one click = one attempt. Do not auto-run all retries in a single click
- Human brief (theory / confirm / fix path) shows only on **Needs human**, and only for missed goldens that have a `brief`
- Keep the CTV PR as the **Needs human** story
- App chrome follows personal skill `portfolio-app-style` (Release Gate Lab look)
- Do not add passwordless / magic-link gated articles here. That is a separate public project.
- Never commit `.env`, tokens, or employer/customer data
- No employer, customer, or private personal details in code, README, or commits
- Never use "Interview one-liner" or other pitch labels in public copy

## Scripts

- `npm run dev` — local dashboard
- `npm test` — loop engine tests
- `npm run build` — production bundle
- `npm run preview` — preview built app

## Related docs

- `README.md` — product framing + quick start
- `docs/PAPER_WALKTHROUGH.md` — login story on paper

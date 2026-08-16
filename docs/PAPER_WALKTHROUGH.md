# Walk one golden PR on paper

This is the Loop Lab teaching story. Read this once, then click **Run attempt 1** on the login PR. After you see 62%, click **Retry with critic**. The dashboard should match these numbers. One click is one attempt.

## Words we will use

- **Fake PR** — a made-up code change, not a real GitHub pull request.
- **Golden** — the plan Ramona would sign. The scorer uses this. The drafter does not see it on attempt 1.
- **Score** — how much of the golden the draft covered, as a percent.
- **Critic** — the list of golden items still missing after a score.
- **Escalate** — stop guessing and hand the plan to a human after 3 attempts.

## The PR

**PR #1042 — Switch login to email + password and add Remember me** (Web)

What changed: login uses email, not username. Remember me keeps the session on this browser.

What can break at 2am: a user refreshes the tab and is kicked out, or a wrong password looks like success.

## The golden (what a good plan must include)

A plan Ramona would sign must cover at least:

| Must include | Why |
|--------------|-----|
| Valid credentials land in the app | If happy path is missing, it is not a plan |
| **Wrong password** shows an error | Auth must fail closed |
| Empty email or password is blocked | Blank submit is the first tired-user hit |
| Invalid email format is blocked | Keep error copy honest |
| **Session still works after refresh** | Users refresh. Remember me that dies on refresh is a false logout |
| Repeated failures are throttled | Unlimited guesses is an incident |

Pass bar: **80%**. Max attempts: **3**.

P0s are worth more than P1s, so the board uses weighted points (8 total).

## Attempt 1 — draft from the PR only

The drafter has not seen the golden. It writes the obvious cases:

1. Valid email and password lands on home
2. Wrong password shows an error
3. Empty email or password is blocked
4. Invalid email format is blocked

**Score: 62%** (5 of 8 weighted points). Missed **session after refresh** (and lockout). Under 80%, so retry.

This is the 62% screenshot.

## Attempt 2 — retry with critic feedback

The critic says: missing P0, session still works after refresh.

The drafter adds that case. Score is now **88%** (7 of 8). That is over 80%, so **Pass**.

Lockout is still missing. That is fine. The loop passed the bar. A human can add lockout later if they want.

This is the 88% Pass screenshot.

## What if it kept guessing?

If attempt 3 was still under 80%, the loop would stop and show **Needs human**. That is the CTV player PR in this lab. The point is not endless retry. The point is a stop rule.

## What you should feel

The agent did a job. Something **graded** that job against a known-good plan. The grade was low, so it tried again with feedback. Then it either passed or asked for a person.

If it cannot score itself, it is not a loop.

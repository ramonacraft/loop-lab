import type { FakePr } from '../types/loop'

const PASS_BAR = 80
const MAX_ATTEMPTS = 3

export const fixtures: FakePr[] = [
  {
    id: 'login',
    number: 1042,
    title: 'Switch login to email + password and add Remember me',
    platform: 'Web',
    teaching: true,
    summary:
      'Login uses email, not username. Remember me keeps the session on this browser.',
    whatCanBreak:
      'A user refreshes the tab and is kicked out, or a wrong password looks like success.',
    passBar: PASS_BAR,
    maxAttempts: MAX_ATTEMPTS,
    golden: [
      {
        id: 'valid',
        priority: 'P1',
        mustInclude: 'Valid credentials land in the app',
        why: 'If the happy path is missing, it is not a plan',
        weight: 1,
      },
      {
        id: 'wrong-password',
        priority: 'P0',
        mustInclude: 'Wrong password shows an error',
        why: 'Auth must fail closed',
        weight: 2,
      },
      {
        id: 'empty',
        priority: 'P1',
        mustInclude: 'Empty email or password is blocked',
        why: 'Blank submit is the first tired-user hit',
        weight: 1,
      },
      {
        id: 'invalid-email',
        priority: 'P1',
        mustInclude: 'Invalid email format is blocked',
        why: 'Keep the error copy honest',
        weight: 1,
      },
      {
        id: 'session',
        priority: 'P0',
        mustInclude: 'Session still works after refresh',
        why: 'Users refresh. Remember me that dies on refresh is a false logout',
        weight: 2,
      },
      {
        id: 'lockout',
        priority: 'P1',
        mustInclude: 'Repeated failures are throttled',
        why: 'Unlimited guesses is an incident',
        weight: 1,
      },
    ],
    scripts: [
      {
        cases: [
          { title: 'Valid email and password lands on home', covers: ['valid'] },
          { title: 'Wrong password shows an error', covers: ['wrong-password'] },
          { title: 'Empty email or password is blocked', covers: ['empty'] },
          { title: 'Invalid email format is blocked', covers: ['invalid-email'] },
        ],
      },
      {
        cases: [
          { title: 'Valid email and password lands on home', covers: ['valid'] },
          { title: 'Wrong password shows an error', covers: ['wrong-password'] },
          { title: 'Empty email or password is blocked', covers: ['empty'] },
          { title: 'Invalid email format is blocked', covers: ['invalid-email'] },
          {
            title: 'Remember me still has a session after refresh',
            covers: ['session'],
          },
        ],
      },
    ],
  },
  {
    id: 'ctv-player',
    number: 1108,
    title: 'CTV player: start, pause, and resume from last position',
    platform: 'CTV',
    summary:
      'Living-room player now stores last position and should resume after the app is killed.',
    whatCanBreak:
      'A viewer comes back from a commercial break and the show restarts from zero, or the remote pause does nothing.',
    passBar: PASS_BAR,
    maxAttempts: MAX_ATTEMPTS,
    golden: [
      {
        id: 'first-play',
        priority: 'P0',
        mustInclude: 'Video starts on first play',
        why: 'If start fails, nothing else matters',
        weight: 1,
      },
      {
        id: 'remote-pause',
        priority: 'P0',
        mustInclude: 'Play and pause work from the remote',
        why: 'The remote is the only input in the living room',
        weight: 1,
      },
      {
        id: 'resume',
        priority: 'P0',
        mustInclude: 'Resume from last position after app restart',
        why: 'Restart-from-zero after a crash is a 2am complaint spike',
        weight: 1,
        brief: {
          theory:
            'Last position is held in memory and never written before the app is killed.',
          confirm:
            'Play for 2 minutes, force-quit, relaunch. If it starts at 0:00, the save never hit disk.',
          fixPath:
            'Persist position on pause and on app background. Read it on player start before the first frame.',
        },
      },
      {
        id: 'network-blip',
        priority: 'P0',
        mustInclude: 'Playback recovers after a brief network drop',
        why: 'Hotel Wi-Fi blips should not require a full relaunch',
        weight: 1,
        brief: {
          theory:
            'A short Wi-Fi drop is treated as a fatal player error instead of a retry.',
          confirm:
            'Start playback, toggle airplane mode for 5 seconds, then back on. If the player dies, the retry path is missing.',
          fixPath:
            'Catch the network error, keep the last good position, and retry the playlist. Show a short recovering state, not a hard stop.',
        },
      },
      {
        id: 'seek-sync',
        priority: 'P1',
        mustInclude: 'Audio stays in sync after seek',
        why: 'Desync after skip is a support ticket magnet',
        weight: 1,
      },
      {
        id: 'back-row',
        priority: 'P1',
        mustInclude: 'Back returns to the last row, not home',
        why: 'Dumping people on home loses the browse context',
        weight: 1,
      },
    ],
    scripts: [
      {
        cases: [
          { title: 'Title starts when the user hits play', covers: ['first-play'] },
          { title: 'Remote play and pause toggle playback', covers: ['remote-pause'] },
        ],
      },
      {
        cases: [
          { title: 'Title starts when the user hits play', covers: ['first-play'] },
          { title: 'Remote play and pause toggle playback', covers: ['remote-pause'] },
          { title: 'Audio stays in sync after a 30-second skip', covers: ['seek-sync'] },
        ],
      },
      {
        cases: [
          { title: 'Title starts when the user hits play', covers: ['first-play'] },
          { title: 'Remote play and pause toggle playback', covers: ['remote-pause'] },
          { title: 'Audio stays in sync after a 30-second skip', covers: ['seek-sync'] },
          { title: 'Back from player lands on the last row', covers: ['back-row'] },
        ],
      },
    ],
  },
  {
    id: 'ios-push',
    number: 1184,
    title: 'iOS breaking-news push opens the matching story',
    platform: 'iOS',
    summary:
      'A breaking-news push should deep-link into the story, including from a killed app.',
    whatCanBreak:
      'The badge lands, the user taps, and they get a blank screen or the wrong article.',
    passBar: PASS_BAR,
    maxAttempts: MAX_ATTEMPTS,
    golden: [
      {
        id: 'tap-opens',
        priority: 'P0',
        mustInclude: 'Tap opens the matching story',
        why: 'A push that opens the wrong story is worse than no push',
        weight: 2,
      },
      {
        id: 'cold-start',
        priority: 'P0',
        mustInclude: 'Cold start from a killed app still opens the story',
        why: 'Most taps happen hours later with the app dead',
        weight: 2,
      },
      {
        id: 'stale',
        priority: 'P0',
        mustInclude: 'Expired or unpublished story shows a fallback, not a blank screen',
        why: 'Editors unpublish. Blank is an incident screenshot',
        weight: 2,
      },
      {
        id: 'permission',
        priority: 'P1',
        mustInclude: 'Notification permission denied still lets the user browse',
        why: 'Push is optional. The app is not',
        weight: 1,
      },
      {
        id: 'no-double',
        priority: 'P1',
        mustInclude: 'Double tap does not open two copies of the story',
        why: 'Stacked screens confuse back behavior',
        weight: 1,
      },
    ],
    scripts: [
      {
        cases: [
          { title: 'Tap the push and land on the matching story', covers: ['tap-opens'] },
          {
            title: 'User who denied notifications can still browse the app',
            covers: ['permission'],
          },
        ],
      },
      {
        cases: [
          { title: 'Tap the push and land on the matching story', covers: ['tap-opens'] },
          {
            title: 'Tap from a killed app still opens the matching story',
            covers: ['cold-start'],
          },
          {
            title: 'Unpublished story shows a fallback, not a blank screen',
            covers: ['stale'],
          },
          {
            title: 'User who denied notifications can still browse the app',
            covers: ['permission'],
          },
          { title: 'Double tap opens one story, not two', covers: ['no-double'] },
        ],
      },
    ],
  },
  {
    id: 'android-offline',
    number: 1210,
    title: 'Android saved articles open with no network',
    platform: 'Android',
    summary:
      'Saved stories should open on a plane or a subway, including a partial download.',
    whatCanBreak:
      'The user saved it last night, goes underground, and gets a spinner that never ends.',
    passBar: PASS_BAR,
    maxAttempts: MAX_ATTEMPTS,
    golden: [
      {
        id: 'offline-open',
        priority: 'P0',
        mustInclude: 'Saved article opens with no network',
        why: 'That is the feature. If this fails, ship is a no',
        weight: 1,
      },
      {
        id: 'partial',
        priority: 'P0',
        mustInclude: 'Partial download does not show a blank body',
        why: 'Half a file should say so, not look like a crash',
        weight: 1,
      },
      {
        id: 'no-wipe',
        priority: 'P1',
        mustInclude: 'Coming back online does not wipe scroll position',
        why: 'A sync that jumps the reader is a trust hit',
        weight: 1,
      },
      {
        id: 'storage-full',
        priority: 'P1',
        mustInclude: 'Storage full shows a clear error',
        why: 'A silent fail looks like the save button is broken',
        weight: 1,
      },
      {
        id: 'byline-refresh',
        priority: 'P1',
        mustInclude: 'Returning online updates byline time without jumping scroll',
        why: 'Metadata can refresh. The reader should stay put',
        weight: 1,
      },
    ],
    scripts: [
      {
        cases: [
          { title: 'Airplane mode, saved story still opens', covers: ['offline-open'] },
          {
            title: 'Partial file shows a retry, not a blank body',
            covers: ['partial'],
          },
          {
            title: 'Reconnect keeps the same scroll position',
            covers: ['no-wipe'],
          },
          {
            title: 'Full disk shows a clear save error',
            covers: ['storage-full'],
          },
          {
            title: 'Byline time updates on reconnect without a jump',
            covers: ['byline-refresh'],
          },
        ],
      },
    ],
  },
  {
    id: 'live-blog',
    number: 1276,
    title: 'Web live blog appends updates without a full refresh',
    platform: 'Web',
    summary:
      'A breaking live blog should append updates in place so the reader does not lose their spot.',
    whatCanBreak:
      'A new update reloads the page and the reader is sent back to the top mid-sentence.',
    passBar: PASS_BAR,
    maxAttempts: MAX_ATTEMPTS,
    golden: [
      {
        id: 'no-reload',
        priority: 'P0',
        mustInclude: 'New updates appear without a full page refresh',
        why: 'A full reload is a lost-place incident on a live story',
        weight: 1,
      },
      {
        id: 'keep-place',
        priority: 'P0',
        mustInclude: 'User does not lose place when a new update arrives',
        why: 'People read from the middle. Do not yank them to the top',
        weight: 1,
      },
      {
        id: 'error-visible',
        priority: 'P0',
        mustInclude: 'Offline or error state is visible, not a silent freeze',
        why: 'A frozen blog looks like the news stopped',
        weight: 1,
      },
      {
        id: 'scroll-back',
        priority: 'P1',
        mustInclude: 'Oldest updates still load when scrolling back',
        why: 'Catch-up readers start at the beginning',
        weight: 1,
      },
      {
        id: 'breaking-label',
        priority: 'P1',
        mustInclude: 'Breaking label turns off when the event is over',
        why: 'A stuck Breaking chip trains people to ignore it',
        weight: 1,
      },
    ],
    scripts: [
      {
        cases: [
          { title: 'New update appears without reloading the page', covers: ['no-reload'] },
          { title: 'Scrolling back loads earlier updates', covers: ['scroll-back'] },
        ],
      },
      {
        cases: [
          { title: 'New update appears without reloading the page', covers: ['no-reload'] },
          {
            title: 'A new update does not jump the reader to the top',
            covers: ['keep-place'],
          },
          {
            title: 'Lost connection shows a visible error, not a freeze',
            covers: ['error-visible'],
          },
          { title: 'Scrolling back loads earlier updates', covers: ['scroll-back'] },
        ],
      },
    ],
  },
]

export function getFixture(id: string): FakePr | undefined {
  return fixtures.find((pr) => pr.id === id)
}

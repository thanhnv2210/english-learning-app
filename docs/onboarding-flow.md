# Onboarding Flow

## Overview

First-login flow gated by middleware. New users are redirected to `/onboarding` before accessing any dashboard page. On completion, users land on `/analytics` (new users) or `/dashboard` (returning users).

---

## Schema

Columns on the `users` table:

| Column | Type | Default | Purpose |
|--------|------|---------|---------|
| `onboardingCompletedAt` | `timestamp` | `null` | Gate — null means onboarding incomplete |
| `returningUser` | `boolean` | `false` | Skips guided steps; unlocks full nav immediately |
| `bio` | `text` | `''` | Free-text self-description |
| `weakSkills` | `jsonb string[]` | `[]` | Selected skills to improve |
| `targetProfile` | `text` | `'IELTS_Academic_6.5'` | Selected IELTS band or Professional |
| `onboardingReasons` | `jsonb string[]` | `[]` | Why they're using the app |
| `unlockedPages` | `jsonb string[]` | `[]` | Nav pages unlocked via progressive discovery |

---

## Steps

### Step 1 — About You

Fields:
- **Bio** (optional textarea) — free text, e.g. "software engineer preparing for UK job application"
- **Weak skills** (multi-select toggle buttons) — Writing, Speaking, Reading, Listening
- **Returning user toggle** — "I'm already familiar with this app"
  - When ON: green highlight on toggle + amber alert warning: "All guided steps will be skipped. You can restart from Settings."
  - When ON: `submit()` is called immediately from Step 1 (skips Step 2)

"Continue →" advances to Step 2 (unless returning user, where it submits).

### Step 2 — Your Goal

Fields:
- **Target profile** (dropdown) — IELTS Band 5, 5.5, 6, 6.5, 7, Professional
  - Description shown below dropdown (e.g. "Good user — handles complex language with minor errors")
- **Why are you using this app?** (multi-select chips + free-text input)
  - Preset options: University admission, Job application, Migration visa, Professional growth, Personal interest
  - "Other reason" free-text input

"← Back" returns to Step 1. "Finish →" submits.

---

## Completion Action (`completeOnboardingAction`)

Saves: `bio`, `weakSkills`, `targetProfile`, `onboardingReasons`, `returningUser`, `favouritePages: []`
Sets: `onboardingCompletedAt = now()`
Redirects: `/dashboard` (Next.js `redirect()`)

---

## Post-Onboarding Routing

Root page (`/`) reads `returningUser` and redirects:
- `returningUser = true` → `/dashboard`
- `returningUser = false` (new user) → `/analytics`

`/dashboard` is always accessible directly for both user types — the redirect only applies to `/`.

---

## Progressive Nav Unlock (New Users)

New users (`returningUser = false`) see a restricted nav labeled "Getting started" with only:

**Always visible** (`ALWAYS_VISIBLE_HREFS`):
- `/dashboard`
- `/analytics`
- `/getting-started`
- `/cheat-sheet`

**Unlocked on first visit** (via `UnlockPageTrigger` client component):
- `/speaking` — unlocked when user visits any speaking page
- `/writing` — unlocked when user visits any writing page
- `/reading` — unlocked when user visits any reading page
- `/listening` — unlocked when user visits any listening page

Unlocked pages appear in nav with a green `NEW` badge. The `unlockPageAction(href)` server action is idempotent — skips DB write if already unlocked; skips entirely for returning users.

**Returning users** see the full grouped nav immediately (Practice, Tools, Guides, Progress sections).

---

## Reset Onboarding (Settings)

Located in Settings page under "Onboarding" section.

Button: "Reset Onboarding"
Confirmation dialog: "This will clear your onboarding history and redirect you to the start."
On confirm:
1. Sets theme to `dark` (via `useTheme`)
2. Calls `resetOnboardingAction()`
   - Clears: `onboardingCompletedAt`, `returningUser = false`, `bio = ''`, `weakSkills = []`, `onboardingReasons = []`
   - Does NOT clear: `targetProfile`, `unlockedPages`, `favouritePages`
3. Redirects to `/onboarding`

---

## Target Profiles

| Value | Label | Description |
|-------|-------|-------------|
| `IELTS_Academic_5` | IELTS Band 5 | Modest user — partial command of the language |
| `IELTS_Academic_5.5` | IELTS Band 5.5 | Modest user — partial grasp of overall meaning |
| `IELTS_Academic_6` | IELTS Band 6 | Competent user — generally effective despite inaccuracies |
| `IELTS_Academic_6.5` | IELTS Band 6.5 | University admission / general competency |
| `IELTS_Academic_7` | IELTS Band 7 | Good user — handles complex language with minor errors |
| `Business_Fluent` | Professional | Professional workplace communication |

---

## Key Files

| File | Role |
|------|------|
| `app/onboarding/page.tsx` | Server component — gates on `onboardingCompletedAt`, renders form |
| `app/onboarding/onboarding-form.tsx` | Client component — 2-step form UI |
| `app/actions/onboarding.ts` | `completeOnboardingAction`, `resetOnboardingAction` |
| `lib/db/user.ts` | `completeOnboarding()`, `resetOnboarding()`, `unlockPage()` |
| `lib/nav-config.ts` | `ALWAYS_VISIBLE_HREFS`, `UNLOCK_MAP`, `ALL_NAV_ITEMS` |
| `components/unlock-page-trigger.tsx` | Client component — fires `unlockPageAction` on mount |
| `app/(dashboard)/speaking/layout.tsx` | Wraps speaking pages with `UnlockPageTrigger` |
| `app/(dashboard)/writing/layout.tsx` | Wraps writing pages with `UnlockPageTrigger` |
| `app/(dashboard)/reading/layout.tsx` | Wraps reading pages with `UnlockPageTrigger` |
| `app/(dashboard)/listening/layout.tsx` | Wraps listening pages with `UnlockPageTrigger` |
| `middleware.ts` | Redirects unauthenticated / incomplete-onboarding users |
| `app/page.tsx` | Root redirect: returningUser → `/dashboard`, new user → `/analytics` |
| `app/(dashboard)/settings/settings-form.tsx` | Reset onboarding button + confirmation dialog |

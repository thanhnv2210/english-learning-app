# Launch Checklist — IELTS Accelerator

Format: `[ ]` pending · `[x]` done (with finish date)

---

## Infrastructure

| # | Item | Status | Done |
|---|------|--------|------|
| 1 | Deploy app to Vercel | [x] | 2026-05-04 |
| 2 | Production PostgreSQL on Neon | [x] | 2026-05-04 |
| 3 | Custom domain registered and configured | [ ] | — |
| 4 | Environment variables set in Vercel dashboard | [x] | — |
| 5 | Anthropic API key (production) configured | [x] | — |

---

## Authentication

| # | Item | Status | Done |
|---|------|--------|------|
| 6 | NextAuth v5 with Google OAuth | [x] | — |
| 7 | Credentials login for admin | [x] | — |
| 8 | User auto-provisioning on first Google sign-in | [x] | — |
| 9 | Campaign gate: isActive flag + userLimit to control signups | [x] | — |
| 10 | Tier system (free / pro) on user row | [x] | — |
| 11 | Status system (active / pending) on user row | [x] | — |
| 12 | NEXTAUTH_SECRET set in production env | [x] | — |
| 13 | Google OAuth client ID/secret configured for production domain | [x] | — |

---

## Payments

| # | Item | Status | Done |
|---|------|--------|------|
| 14 | Decide payment method for beta (manual bank transfer / VietQR first) | [ ] | — |
| 15 | Set up MoMo or ZaloPay for self-serve payment | [ ] | — |
| 16 | Upgrade flow: payment confirmation → set user.tier = 'pro' in DB | [ ] | — |
| 17 | Founding-member pricing offer page (VND 99k/month locked) | [ ] | — |

---

## API Cost Control

| # | Item | Status | Done |
|---|------|--------|------|
| 18 | Model cost per session estimated (Haiku vs Sonnet per feature) | [x] | 2026-05-06 |
| 19 | Free-tier usage cap defined and enforced (e.g. 3 writing scores/month) | [x] | 2026-05-06 |
| 20 | Anthropic spend alert set in dashboard | [x] | 2026-05-06 |

---

## Landing Page & Waitlist

| # | Item | Status | Done |
|---|------|--------|------|
| 21 | Public landing page live (Vietnamese, mobile-optimised) | [x] | 2026-05-06 |
| 22 | Waitlist / beta signup form (email or Zalo number) | [x] | 2026-05-06 |
| 23 | "Founding member" CTA on landing page | [x] | 2026-05-06 |

---

## Onboarding

| # | Item | Status | Done |
|---|------|--------|------|
| 24 | First-session guided task defined (e.g. "Take your first Writing score") | [x] | 2026-05-06 |
| 25 | Empty-state screens guide new users to start, not a blank dashboard | [x] | 2026-05-06 |
| 26 | Follow-up message at 48h for users who haven't returned (Zalo or email) | [ ] | — |

---

## Data & Privacy

| # | Item | Status | Done |
|---|------|--------|------|
| 27 | Privacy policy page published (what data is collected, retention period) | [x] | 2026-05-06 |
| 28 | Consent notice on login page (link to Privacy Policy) | [x] | 2026-05-06 |
| 29 | Data retention policy decided (e.g. essays kept as long as account is active) | [x] | 2026-05-06 |

---

## Support & Operations

| # | Item | Status | Done |
|---|------|--------|------|
| 30 | Zalo OA or dedicated number set up for beta support | [ ] | — |
| 31 | Bug triage process defined (Zalo report → GitHub issue or Notion) | [ ] | — |
| 32 | Response time SLA for beta users (e.g. within 24h) | [ ] | — |
| 33 | Error monitoring set up (Sentry or Vercel logs alert) | [x] | 2026-05-06 |

---

## Beta Recruitment

| # | Item | Status | Done |
|---|------|--------|------|
| 34 | Personal network outreach: 20–30 engineers identified by name | [ ] | — |
| 35 | Zalo group created for beta cohort | [ ] | — |
| 36 | Seeding post drafted (Vietnamese, for Facebook groups) | [ ] | — |
| 37 | First post published in 2–3 Facebook / Zalo groups | [ ] | — |
| 38 | Weekly check-in cadence with beta users scheduled | [ ] | — |

---

## Expert Validation

| # | Item | Status | Done |
|---|------|--------|------|
| 39 | 1–2 IELTS teachers / examiners identified for AI scoring review | [ ] | — |
| 40 | 10 essays submitted to expert for scoring comparison | [ ] | — |
| 41 | AI scoring accuracy communicated publicly (with data) | [ ] | — |

---

## Legal & Business

| # | Item | Status | Done |
|---|------|--------|------|
| 42 | Business registration decision made (sole proprietorship vs LLC) | [ ] | — |
| 43 | Business registered (deadline: before collecting payments officially) | [ ] | — |
| 44 | Anthropic API commercial use terms reviewed | [ ] | — |

---

## Engagement Tracking (milestone: 50 users)

| # | Item | Status | Done |
|---|------|--------|------|
| 45 | `lastActiveAt` column on users table + 30-min throttled update in `getCurrentUser()` | [x] | 2026-05-05 |
| 46 | Admin engagement page: list all users with last active date, sessions this week, skills used | [x] | 2026-05-06 |
| 47 | Engagement tier label per user: Active (used in last 7d) / At-risk (8–21d) / Churned (21d+) | [x] | 2026-05-06 |
| 48 | Inactivity reminder: Zalo or email triggered when user crosses 7 days without a session | [ ] | — |

---

## Notes

- Update this file by replacing `[ ]` with `[x]` and adding the finish date (YYYY-MM-DD).
- Items 12, 13 are critical before inviting any beta user — auth breaks without them.
- Items 18–20 should be done before opening free tier to avoid surprise bills.
- Items 42–44 can wait until Month 3 but set a date now.
- Items 46–48 are low priority until you have 50+ users — manual Zalo check-ins are faster before that point.

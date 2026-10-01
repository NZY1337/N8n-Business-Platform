
## 1. Switch off Gmail SMTP, use a transactional email provider

Currently `Authentication → Emails → Custom SMTP` in Supabase is configured
with a personal Gmail account. Supabase itself warns this is not meant for
transactional email — deliverability is unreliable and Gmail may throttle or
flag the account for automated sending.

**Action:** before going live, switch the SMTP provider to a dedicated
transactional service (Resend, Postmark, SendGrid, Mailgun, etc.). Keep
"Enable Custom SMTP" checked — do not revert to Supabase's default mailer,
which has a strict rate limit meant only for local testing.

## 2. Add production Redirect URLs in Supabase

`Authentication → URL Configuration → Redirect URLs` currently only has
`http://localhost:5173/**`. `resetPasswordForEmail`'s `redirectTo` will be
rejected for any URL not covered by an allowed pattern.

**Action:** once the production domain is known, add
`https://<production-domain>/**` (or the specific `/reset-password` path) to
Redirect URLs. Also update `Site URL` if it's still pointing at localhost.

## 3. `flowType` — tried PKCE, reverted to `implicit` — CLOSED

Tried setting `auth: { flowType: 'pkce' }` explicitly in
`client/lib/supabase.ts` for the extra security PKCE gives over the default
`implicit` flow. Broke password recovery: confirmed a bug in
`@supabase/auth-js@2.102.1` — `_getSessionFromURL()` hardcodes
`redirectType: null` on the PKCE branch (`GoTrueClient.js:3043`), discarding
the `'recovery'` value `_exchangeCodeForSession` actually computes. Result:
`PASSWORD_RECOVERY` never fires under PKCE, only `SIGNED_IN`, so the
`isPasswordRecovery` guard in `ResetPasswordForm` never opens and the user
gets bounced straight to `/dashboard`.

(Update: `isPasswordRecovery` itself was later removed from `AppContext`/
`ResetPasswordForm` entirely — the form no longer gates on it, see git log.
This entry is kept as-is for the PKCE/auth-js bug history, not as a
description of current behavior.)

Reverted to the default `implicit` flow (now just `createClient(url, key)`,
no auth options), with a comment in `supabase.ts` explaining why, so nobody
re-introduces PKCE here without knowing it breaks recovery on this library
version. Re-check if `@supabase/auth-js` ships a fix in a future version.

## 4. Password policy consistency

Frontend (`ResetPasswordForm.tsx`, `SignUpForm.tsx`) only enforces
`password.length >= 8`. Supabase has its own configurable password policy
under `Authentication → Policies`.

**Action:** confirm the Supabase-side policy matches (or is stricter than)
what the frontend validates, so a password accepted by the form is never
rejected by Supabase with a confusing error, and vice versa.

## 5. Rate-limit UX on "Send reset link"

Supabase throttles `resetPasswordForEmail` server-side (this is what caused
the "email rate limit exceeded" error during testing). The frontend has no
specific handling for that error — it just shows the generic error message.

**Action:** optional polish, not a security gap. Consider a friendlier
message or a cooldown/disabled state on the button after a send, to avoid
users repeatedly hitting the rate limit and seeing a confusing Supabase error
string.

## 6. CAPTCHA on forgot-password (and sign-up)

Supabase's own server-side rate limit is currently the only thing stopping
someone from scripting repeated `resetPasswordForEmail` calls against an
arbitrary address — each successful call sends a real email, so this is an
email-bombing/harassment vector against whoever owns that address, and (with
the Gmail SMTP from item #1 still in place) a way to get the sending account
throttled or flagged. The same applies to `signUp` — unlimited automated
account creation.

Supabase supports hCaptcha or Cloudflare Turnstile natively: both
`resetPasswordForEmail` and `signUp` accept `options.captchaToken`.

**Action, before going live:**
1. Create an hCaptcha or Turnstile site key (either works — Turnstile is
   usually the less annoying one for real users).
2. `Authentication → Attack Protection → Enable CAPTCHA protection` in the
   Supabase dashboard, paste the secret key.
3. Add the widget to `ForgotPasswordForm.tsx` and `SignUpForm.tsx`, pass the
   resulting token as `options.captchaToken` in `AppContext.tsx`'s
   `forgotPasswordEmail`/`signUpWithPassword`.

Not urgent at current scale (no real traffic yet), but don't ship this to the
public with an open signup/reset form and no CAPTCHA.

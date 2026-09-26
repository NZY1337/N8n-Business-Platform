# CLAUDE.md — Automation Business Platform

This file is the source of truth for how this project is built. Read it before
implementing anything. When in doubt, prefer whatever this file says over a
"cleaner"-looking alternative.

## 1. Project overview

A small web platform for a one-person automation/integration business built on
**n8n** and **Claude**. The owner (admin) builds and runs the actual
automations inside n8n. This platform never builds automations — it sells
them, takes orders, takes payments, and shows status.

> **PLATFORM = client portal + commerce + service status**
> **n8n = automation engine**
> **Claude = AI / automation intelligence, used inside n8n workflows**

What the platform does:

1. Landing page / service presentation
2. Service catalog with pricing (setup fee + optional monthly fee)
3. Client orders a service
4. Client pays for it
5. Client has a minimal dashboard: active services, orders, status, history
6. Client gets notified about status changes
7. Admin manages orders, statuses, and can manually retrigger automation

What the platform explicitly is **not**:

- Not a workflow builder, not an n8n alternative
- Not a place to configure nodes, triggers, or automation logic
- Not a billing engine (the payment provider owns subscription lifecycle)
- Not a CMS
- Not multi-tenant / not a SaaS-for-agencies product (yet) — one business,
  one admin, many clients

## 2. Product philosophy

Minimal, fast, premium-feeling, clean, easy for **one developer** to maintain
and extend.

Hard rules, not suggestions:

- No microservices, no event bus, no message queue for a project this size.
- No workflow builder, no drag & drop, no node editor — that's n8n's job.
- No custom auth — Supabase Auth is the identity provider.
- No custom subscription/billing logic — the payment provider is the source
  of truth for subscription lifecycle.
- No feature exists "because it might be needed later." Build it when a real
  requirement shows up.

**Guiding rule when unsure:** if n8n, Supabase, or the payment provider can
already do it, the platform does not reimplement it. The platform is a thin
layer of commerce + status on top of systems that already do the hard parts.

## 3. Architecture (high level)

Two deployables, developed and deployed independently:

```
client/   React + TypeScript SPA (already scaffolded in this repo)
server/   NestJS REST API (already scaffolded in this repo)
```

External systems the platform integrates with but does not own:

- **Supabase** — authentication (already wired: `SupabaseAuthGuard`,
  `SupabaseService`).
- **PostgreSQL** — the platform's own business data (users, services, orders,
  payments, notifications). Not shared with n8n's own database.
- **n8n** — external automation engine, talked to only through webhooks/API.
  The platform stores at most a reference to an n8n run, never its internals.
- **Payment provider** (Stripe or similar, not chosen yet) — source of truth
  for payment and subscription state. Talked to through a `PaymentProvider`
  abstraction (see §8).

No shared runtime, no shared code, no monorepo tooling beyond the two
top-level folders that already exist.

## 4. Frontend architecture (`client/`)

Existing structure (keep it — do not introduce `features/` or `api/` folders
just to match some generic template; the current layout already fits a
project this size):

```
client/src/
  pages/         route-level screens (thin, compose components + hooks)
  components/    reusable UI (auth, common, form, header, ui, layout pieces)
  hooks/         React Query hooks — one hook file per resource
  services/      fetch functions per resource (the "API client" layer)
  context/       app-wide client state (session, theme, sidebar) — small,
                 already established, don't add more without a real need
  layout/        shell (AppLayout, AppSidebar, AppHeader)
  helpers/       constants, small pure helpers
```

New resources (services, orders, payments, notifications) follow the same
pattern already used by `notifications` and `user`:

```
services/<resource>/index.ts   → fetch functions (getX, createX, ...)
hooks/use<Resource>.tsx         → React Query hooks wrapping those functions
```

Don't add a `features/` layer unless a resource grows complex enough that
co-locating its hook/service/components actually reduces navigation cost.
For this product's scope, it won't.

## 5. Backend architecture (`server/`)

NestJS, one module per real responsibility. Existing modules to keep as-is:
`auth/`, `user/`, `notifications/`, `interceptors/` (has the app-wide
`UserSyncInterceptor`), plus the root-level `services/` folder for
**infrastructure** integrations (`nodemailer`, `supabase`, `taskservice`) —
that folder is *not* the business "Service" entity, see below for the naming
distinction.

New modules to add, each with real, single responsibility:

```
server/src/
  catalog/    Service entity + GET /services, GET /services/:slug
  orders/     Order entity + client-facing order endpoints
  payments/   Payment entity + PaymentProvider abstraction + webhook intake
  automation/ Outbound trigger to n8n + inbound webhook from n8n
  admin/      Thin admin-only endpoints, reuses orders/payments services
```

Naming note: the business "Service" (a sellable package) lives in a module
called **`catalog`**, not `services`, specifically to avoid clashing with the
existing root-level `services/` folder (nodemailer, supabase, taskservice —
infrastructure, not sellable products). Route paths stay human-friendly
(`/services`, `/services/:slug`); only the folder/module name differs.

No `repositories/` layer, no generic `BaseService`, no CQRS. A NestJS
`*.service.ts` talking to a TypeORM repository directly is enough at this
scale.

## 6. Domain model

Five entities. Kept deliberately separate — do not merge Order and Payment,
do not merge Service and Order.

```ts
// User — already exists (server/src/user/entities/user.entity.ts)
User {
  id: uuid (from Supabase)
  email: string
  name: string
  avatar: string
  plan: Plan            // existing enum, currently unused by billing — keep
  role: Role             // USER | ADMIN — drives RolesGuard
  createdAt, updatedAt
}

// Service — sellable package, admin-managed, rarely changes at runtime
Service {
  id: uuid
  name: string
  slug: string (unique)
  description: string
  shortDescription: string
  price: number                 // setup price, in minor units (cents)
  currency: string               // 'EUR'
  billingType: 'ONE_TIME' | 'SUBSCRIPTION'
  recurringPrice?: number        // only when SUBSCRIPTION (e.g. €49/month)
  active: boolean
  createdAt, updatedAt
}

// Order — what a client bought and its lifecycle
Order {
  id: uuid
  userId: uuid          // FK -> User, always scoped by this for client routes
  serviceId: uuid        // FK -> Service
  status: OrderStatus
  amount: number
  currency: string
  paymentStatus: PaymentStatus
  formData?: jsonb        // service-specific intake data, see §7
  customerNotes?: string
  adminNotes?: string
  externalAutomationId?: string   // opaque reference to the n8n run, optional
  createdAt, updatedAt
}

enum OrderStatus {
  PENDING, PAID, IN_PROGRESS, WAITING_FOR_CLIENT,
  ACTIVE, PAUSED, COMPLETED, CANCELLED
}

// Payment — one transaction against an Order
Payment {
  id: uuid
  orderId: uuid          // FK -> Order
  provider: string        // 'stripe' | 'mock' — whatever's configured
  providerPaymentId?: string   // provider's own id, once known
  amount: number
  currency: string
  status: PaymentStatus
  createdAt, updatedAt
}

enum PaymentStatus { PENDING, SUCCEEDED, FAILED, REFUNDED }

// Notification — already exists (server/src/notifications), reused as-is
Notification {
  id, user_id, message, type: 'info'|'warning'|'error', is_read, created_at
}
```

`externalAutomationId` is the **only** thing the platform stores about the
n8n side. Never store node graphs, workflow JSON, or n8n credentials.

## 7. Service-specific intake data (form data)

Some services need extra info after purchase (website, CRM, business type,
etc.). Don't build a form builder.

**Decision: use `formData: jsonb` on `Order`.** Reasons:

- Every service can define its own shape without a schema migration.
- The frontend already knows the shape per service (it rendered the form),
  so there's no need for the backend to understand or validate the *shape*
  deeply — validate only what's structurally required (non-empty, size
  limit) plus whatever fields the admin actually reads.
- A relational "answers" table (`order_field_values`) would be premature
  normalization for a handful of services with a handful of fields each.

If a specific service later needs strongly-typed, validated fields, add a
narrow DTO for *that* service's submit endpoint — don't generalize until
there's a second real case that needs it.

## 8. Payments

**Decision: a `PaymentProvider` interface, one concrete implementation for
now.** This is the one place an abstraction is justified up front, because
the requirement explicitly names swapping providers later.

```ts
interface PaymentProvider {
  createCheckoutSession(order: Order, service: Service): Promise<{ checkoutUrl: string; providerPaymentId?: string }>;
  verifyWebhook(rawBody: Buffer, signature: string): PaymentEvent; // throws if invalid
}

type PaymentEvent =
  | { type: 'payment.succeeded'; providerPaymentId: string; orderId: string }
  | { type: 'payment.failed'; providerPaymentId: string; orderId: string }
  | { type: 'payment.refunded'; providerPaymentId: string; orderId: string };
```

Implementations live in `server/src/payments/providers/` (e.g.
`stripe.provider.ts`). Which one is active is picked once, from config/env,
via a factory provider in `PaymentsModule` — not scattered `if (provider ===
'stripe')` checks through the codebase.

**Flow:**

```
Client → POST /payments/checkout { orderId }
       → PaymentProvider.createCheckoutSession(...)
       → Payment row created (status PENDING), client redirected to checkoutUrl
Provider → POST /webhooks/payment  (raw body, signature verified)
         → PaymentProvider.verifyWebhook(...)
         → Payment.status updated, Order.paymentStatus + Order.status updated
         → on success: AutomationService.trigger(order) called
```

Hard rule: **the frontend redirect back from checkout proves nothing.** Only
the verified webhook may move `Payment.status` to `SUCCEEDED` or
`Order.status` to `PAID`. The success-redirect page just shows a "processing"
state and polls `GET /orders/:id` (React Query, short interval or refetch on
focus) until the webhook has landed.

Subscriptions: the payment provider owns renewal/cancellation state. The
platform only reacts to webhook events it receives (e.g. subscription
cancelled → reflect it on the Order) — it never computes next billing dates
or dunning itself.

## 9. n8n integration

n8n is external. The platform never knows how a workflow is built.

**Outbound (platform → n8n):** a single `N8nClient` (in `automation/`), not
an interface with multiple implementations — there is exactly one automation
engine, an abstraction here would be speculative. It does one thing: POST a
flat payload to a configured n8n webhook URL.

```ts
POST {N8N_WEBHOOK_URL}
{
  orderId, userId, serviceId,
  customerData: order.formData,
  paymentStatus: order.paymentStatus
}
```

Triggered from two places only:
- `PaymentsModule` after a payment webhook marks an order `PAID`.
- `AdminModule` via `POST /admin/orders/:id/trigger` (manual retrigger).

Both call the same `AutomationService.trigger(order)` — no duplicated logic.

**Inbound (n8n → platform):** `POST /webhooks/n8n`, authenticated with a
shared secret header (`X-Automation-Secret`), not OAuth — n8n workflows can't
easily do interactive auth and don't need to.

```ts
{
  orderId,
  status?: OrderStatus,        // n8n may advance the order, e.g. -> ACTIVE
  externalAutomationId?: string,
  result?: string,              // free-form, stored in adminNotes if present
  error?: string
}
```

On receipt: update `Order.status`/`externalAutomationId` if present, create a
`Notification` for the client if the status actually changed. That's the
entire contract. If a future automation needs to send richer data, extend
this payload — don't build a generic event bus for it.

## 10. Client dashboard

One screen, three sections, matches the existing `Home.tsx` placeholder
pattern (replace its placeholder cards with real data once these modules
exist):

```
"Welcome back, {name}"

Active Services        → orders with status ACTIVE (or IN_PROGRESS/PAUSED)
Orders                  → table: service name, amount, status, paymentStatus
Recent Activity         → latest Notifications for this user
```

No settings page, no profile editor, no billing portal beyond "go to
checkout" / "manage subscription" (a link straight to the provider's own
customer portal, if it has one — don't rebuild it).

## 11. Admin

No CMS. Admin is a role (`Role.ADMIN`, already modeled on `User`), gated by
the existing `RolesGuard` + `@Roles(Role.ADMIN)`. Admin screens can live in
the same `client/` app under an admin-only route guard (mirroring
`ProtectedRoute`), not a separate app.

Admin can:
- List orders (with client, service, payment status)
- View one order's full detail, including `formData` and notes
- Change `Order.status`
- Add `adminNotes`
- Retrigger automation (`POST /admin/orders/:id/trigger`)

Nothing else. No bulk actions, no CSV export, no analytics dashboard unless
a real need shows up.

## 12. React Query rules

- **Server state → React Query. UI state → local `useState`. Form state →
  local `useState`/uncontrolled inputs**, not a form library, unless a form
  genuinely needs it (the intake forms might, once built — decide then).
- No Redux. No mirroring server data into `AppContext`. `AppContext` stays
  limited to what it already holds (session) plus things that are *not*
  server data (e.g. sidebar open/closed already lives in `SidebarContext`).
- One hook per resource, following the existing `useNotifications.tsx`
  pattern: wraps `useQuery`/`useMutation`, exposes plain data + loading/error,
  invalidates its own query key on mutation success.
- Query keys: `['services']`, `['services', slug]`, `['orders']`,
  `['orders', id]`, `['notifications']` — flat, resource-first, matches
  existing convention.

## 13. API conventions

REST, plural nouns, resource-scoped:

```
GET  /services
GET  /services/:slug

POST /orders                       (client, creates PENDING order)
GET  /orders                       (client, own orders only)
GET  /orders/:id                   (client, own order only — 404 if not owner)

POST /payments/checkout            (client, { orderId } -> { checkoutUrl })
POST /webhooks/payment             (public, signature-verified, provider only)

GET  /notifications                (client, own notifications only)

POST /webhooks/n8n                 (shared-secret verified, n8n only)

GET   /admin/orders                (admin)
GET   /admin/orders/:id            (admin)
PATCH /admin/orders/:id/status     (admin, { status })
POST  /admin/orders/:id/trigger    (admin)
```

Nothing beyond this list unless a real screen needs it. Every endpoint has a
DTO (class-validator) for its body, even trivial ones.

Error shape: NestJS default `{ statusCode, message, error }` — don't build a
custom envelope.

## 14. Authentication & authorization

- **Authentication**: Supabase Auth. `SupabaseAuthGuard` (existing) validates
  the bearer token on every non-public route and sets `request.user = { id,
  email, avatar, name }`.
- **Authorization**: `RolesGuard` (existing) + `@Roles(Role.ADMIN)` for admin
  routes. Default (no decorator) = any authenticated user.
- **Ownership**: every client-facing query that returns an `Order` or
  `Payment` must filter by `request.user.id` at the query level (`WHERE
  userId = :userId`), never by trusting a client-supplied id alone. A client
  requesting another client's order id gets a 404, not a 403 (don't leak
  existence).
- **Public routes**: `/services`, `/services/:slug`, `/webhooks/payment`,
  `/webhooks/n8n`. The two webhook routes are "public" in the sense of no
  Supabase auth, but each has its own verification (provider signature /
  shared secret) — never leave a webhook route unauthenticated.
- **Secrets**: payment provider secret key, payment webhook signing secret,
  n8n webhook URL, n8n inbound shared secret, Supabase service key — all env
  vars, never in frontend code, never logged.
- **Rate limiting**: not needed at current scale beyond what's obviously
  abusable (`/webhooks/*`, auth-adjacent routes). Add `@nestjs/throttler` on
  those specific routes only if abuse actually becomes a problem — don't
  install it preemptively.

## 15. Coding conventions

- TypeScript strict mode, no `any` without a one-line comment explaining why.
- DTOs + `class-validator` for every request body.
- Small, single-responsibility functions and services. A `*.service.ts` talks
  to its own repository directly — no generic repository wrapper.
- React components stay small; a page composes hooks + small components, it
  doesn't contain business logic (no computing order status transitions in a
  component — that's backend logic).
- No design patterns for their own sake (no factory/strategy/observer unless
  the problem actually has more than one implementation today — the
  `PaymentProvider` interface qualifies, a hypothetical `NotificationSender`
  interface with one implementation does not).
- Prefer editing/extending an existing module over creating a new one that
  overlaps it.

## 16. Folder structure (target)

```
client/src/
  pages/
    Dashboard/
      Home.tsx              (existing — becomes the real dashboard)
      Orders/
      Services/             (browse catalog, client-facing detail page reuses this too)
    AuthPages/               (existing)
    OtherPage/               (existing)
  components/
    auth/ common/ form/ header/ ui/ Homepage/   (existing, unchanged)
  hooks/
    useServices.ts   useOrders.ts   usePayments.ts   useNotifications.tsx (existing)
  services/
    services/index.ts   orders/index.ts   payments/index.ts   notifications/index.ts (existing)   user/index.ts (existing)
  context/ layout/ helpers/                      (existing, unchanged)

server/src/
  auth/ user/ notifications/ interceptors/       (existing, unchanged)
  catalog/
    entities/service.entity.ts
    catalog.controller.ts  catalog.service.ts  catalog.module.ts
  orders/
    entities/order.entity.ts
    dto/create-order.dto.ts
    orders.controller.ts  orders.service.ts  orders.module.ts
  payments/
    entities/payment.entity.ts
    providers/payment-provider.interface.ts
    providers/stripe.provider.ts (or mock.provider.ts to start)
    payments.controller.ts  payments.service.ts  payments.module.ts
    webhooks.controller.ts  (POST /webhooks/payment)
  automation/
    n8n-client.service.ts
    automation.controller.ts   (POST /webhooks/n8n)
    automation.module.ts
  admin/
    admin.controller.ts   admin.module.ts   (reuses OrdersService/AutomationService)

server/services/                                  (existing, unchanged — infra: nodemailer, supabase, taskservice)
```

Don't create a folder from this list before the module it belongs to has a
real endpoint or entity to put in it.

## 17. Development workflow

- Frontend and backend are developed and can be deployed independently —
  never assume they share a process, a port, or a filesystem.
- Migrations: TypeORM `synchronize: true` is fine for local dev (already the
  case in `app.module.ts`); once there's real client data, switch to proper
  migrations before any further schema change — don't do this prematurely
  either.
- Environment variables live in `.env` (already gitignored on the server
  side); new ones needed for this work: payment provider keys/secrets,
  `N8N_WEBHOOK_URL`, `N8N_INBOUND_SECRET`.
- When a change touches both `client/` and `server/`, land the backend
  endpoint/DTO first, then wire the frontend against it — don't build UI
  against an imagined API shape.

## 18. Rules for Claude Code

- Before implementing a feature, check the existing architecture in this
  file and in the codebase — don't re-derive it from scratch.
- Don't introduce a new library without a real reason (check `package.json`
  first — most needs are already covered: React Query, TypeORM,
  class-validator, Supabase client).
- Don't add abstractions "for clean code." An interface needs a second real
  implementation to justify existing (the exception already made in this
  file: `PaymentProvider`).
- Don't change the architecture described here without explaining why in the
  same response, before making the change.
- Don't build anything that belongs to n8n (no workflow logic, no node
  graphs, no scheduling logic beyond what already exists in
  `services/taskservice`).
- Don't turn this into a workflow builder, ever, regardless of how the
  request is phrased.
- Prefer the simplest solution that satisfies the requirement.
- Reuse existing code (`SupabaseAuthGuard`, `RolesGuard`, the
  `services/notifications` + `useNotifications` pattern, etc.) instead of
  writing a parallel version.
- Don't duplicate business logic between frontend and backend — status
  transitions, pricing, and payment logic live in the backend only; the
  frontend renders what the backend returns.
- Keep frontend and backend clearly separated — no shared code, no shared
  types package unless duplication becomes a real, measured problem.
- No business logic in React components; no UI/presentation logic in NestJS
  services.
- Every resource access is ownership-checked (see §14) — no exceptions for
  "it's just an MVP."
- For a large change (new module, new external integration, schema change),
  explain the approach first, then implement.
- For a small change (new field, new small endpoint, a bugfix), implement
  directly.
- Don't create files or folders that aren't backed by a real responsibility
  described in this file — if something new is genuinely needed that isn't
  covered here, say so and propose the addition before creating it.

# HYDROSEED Studio — Phase 1 Infrastructure Foundation

Source of truth: HYDROSEED Studio Architecture Blueprint Revision 2.0.
Scope: infrastructure only. No Phase 2 content functionality.

## 1. Repository independence

- Single, self-contained project. Studio-only source layout (`src/routes`,
  `src/components/studio`, `src/components/public`, `src/lib`).
- No imports, packages or configuration referencing HYDROSEED OS / Field or the
  hydroseed.app application.
- FIRMA terminology, domains and architecture are fully excluded.

## 2. Hosting & domain

- Studio deploys independently. Production origin: `https://studio.hydroseed.app`.
- The origin is read from `VITE_STUDIO_PUBLIC_URL` (`src/lib/site.ts`), with the
  production origin as fallback — no dependency on hydroseed.app hosting.
- Build/dev setup unchanged (TanStack Start + Vite).

## 3. Database / backend

- Studio owns its own managed backend instance, separate from HYDROSEED OS.
- Phase 1 schema: `public.studio_members` only (member profile keyed by auth user id,
  row-level security scoped to the owner). No `content_items`, articles, publishing,
  SEO or taxonomy models.

## 4. Environment architecture

Required variable names (values never committed) — see `.env.example`:

| Variable | Purpose |
| --- | --- |
| `VITE_STUDIO_PUBLIC_URL` | Canonical Studio origin per environment |
| `VITE_SUPABASE_URL` / `SUPABASE_URL` | Studio backend endpoint |
| `VITE_SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_PUBLISHABLE_KEY` | Publishable client key |
| `VITE_SUPABASE_PROJECT_ID` / `SUPABASE_PROJECT_ID` | Studio backend project identifier |

## 5. Authentication foundation

- Email + password and Google sign-in at `/auth`.
- Session provider: `src/hooks/useAuth.tsx` (session state only).
- States: loading, authenticated, unauthorized (redirect to `/auth?redirect=…`).
- The Phase 3 five-role permission matrix is intentionally not implemented.

## 6. Route boundaries

| Area | Access |
| --- | --- |
| `/admin` and all Studio screens (`/`, `/blog`, `/seo`, …) | Authenticated only |
| `/journal`, `/journal/*`, `/learn`, `/learn/*` | Public |
| `/auth` | Public |

The gate lives in `src/routes/__root.tsx`. Anonymous visitors to any private
screen are redirected to `/auth`.

## 7. Canonical / indexing

- Studio-owned canonical, OG and JSON-LD URLs resolve through `studioUrl()` to
  `studio.hydroseed.app`. `https://hydroseed.app/journal` is no longer used as a
  Studio canonical.
- The application sends `noindex,nofollow`; `public/robots.txt` disallows all crawlers.

## 8. Deployment foundation

- Production build unchanged and passing; deploys independently of hydroseed.app.
- No additional CI/CD systems introduced.

## Not in Phase 1

Articles, blog CMS, SEO module, publishing workflow, taxonomy, media management,
analytics, newsletter, integrations, Academy, role matrix.

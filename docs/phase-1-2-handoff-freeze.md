# HYDROSEED Studio — Phase 1–2 Handoff / Freeze

Status: frozen at end of Phase 2. No Phase 3 functionality is implemented.
Source of truth: HYDROSEED Studio Architecture Blueprint Revision 2.0
(mirrored in-app at `/architecture`, referenced by `src/lib/site.ts` and `docs/phase-1-infrastructure.md`).

## 1. Product boundaries

- Studio is a self-contained application. It shares no code, packages or
  configuration with HYDROSEED OS / Field or the hydroseed.app application.
- No FIRMA branding, terminology, domains or routes exist in the application.
  The only remaining occurrences are in the historical adaptation brief
  (`README.md`) and the exclusion statement in `docs/phase-1-infrastructure.md`.

## 2. Hosting, database, auth, domain (as implemented)

| Decision | Implementation |
| --- | --- |
| Hosting | Deploys independently; production origin `https://studio.hydroseed.app` |
| Origin resolution | `src/lib/site.ts` → `VITE_STUDIO_PUBLIC_URL`, fallback production origin |
| Framework | TanStack Start v1 + Vite 7, React 19 |
| Database | Own managed Postgres backend instance, separate from HYDROSEED OS |
| Auth | Email + password and Google sign-in at `/auth`; session state in `src/hooks/useAuth.tsx` |
| Access gate | `src/routes/__root.tsx` — all Studio screens private; `/journal*`, `/learn*`, `/auth` public |
| Indexing | Application sends `noindex,nofollow`; `public/robots.txt` disallows all |

## 3. Environment variables (names only — never commit values)

`VITE_STUDIO_PUBLIC_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`,
`VITE_SUPABASE_PROJECT_ID`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`,
`SUPABASE_PROJECT_ID`.

## 4. Data model implemented in Phase 1–2

| Entity | Key fields |
| --- | --- |
| `studio_members` | `id` (auth user), `email`, `display_name`, `last_seen_at` |
| `user_roles` | `user_id`, `role` (`writer` / `editor` / `administrator`) |
| `locales` | `code`, `name`, `native_name`, `rtl`, `sort_order`, `enabled` |
| `authors` | `id`, `member_id`, `name`, bio/avatar metadata |
| `taxonomy` | `id`, `kind` (category / tag / topic / cluster), `name`, `slug`, `parent_id` |
| `media` | `id`, `filename`, `url`, `alt`, type/size metadata, `created_by` |
| `content_items` | `id`, `title`, `slug`, `type`, `status`, `locale`, `author_id`, `body`, `version`, `created_by` |
| content ↔ taxonomy / media | join relationships from `content_items` |
| `content_versions` | version snapshot per content update |
| `audit_logs` | entity, action, actor, timestamp — written by database triggers |

Relationships: content → author, content → locale, content ↔ taxonomy,
content ↔ media, author → member, roles → auth user.

## 5. Roles and permissions (Phase 2 model only)

- `writer` — creates content and media; may edit only their own items.
- `editor` — may edit and delete any content and media.
- `administrator` — additionally manages authors, taxonomy, locales and roles.
- Enforced by row-level security using `has_role` / `is_admin` /
  `is_editor_or_admin` / `can_edit_content`; surfaced in the UI by
  `src/hooks/useStudioRole.tsx`. Users cannot promote themselves.
- The Phase 3 five-role publishing permission matrix is intentionally absent.

## 6. Localization foundation

- `locales` seeded with EN, FR, ES and AR; Arabic carries `rtl = true`.
- Content items carry a `locale` and are filterable by locale.
- The RTL requirement for Arabic is preserved as a layout constraint in the
  blueprint; RTL rendering itself is later-phase work.

## 7. Mocked / sample data

Static sample data lives in `src/lib/mock.ts` and is rendered by dashboard and
future-module screens: `/`, `/blog`, `/blog/$id`, `/seo`, `/analytics`,
`/redirects`, `/settings`, `/architecture`, `/landing`, `/resources`,
`/case-studies`. Sample screens are labelled through
`src/components/studio/SampleDataNote.tsx`, and non-active navigation items are
flagged `soon` in `src/components/studio/Shell.tsx`.

Live database-backed screens (Phase 2): `/content`, `/content/new`,
`/content/$id`, `/media`, `/taxonomy`, `/team`.

## 8. Navigation structure (frozen)

Workspace: Overview, Architecture ·
Publishing: Content, Landing Pages, Blog, Resources, Case Studies,
Documentation*, Academy*, Newsletter* ·
Growth: SEO, Analytics, Media Library, Integrations*, Redirects*, Taxonomy* ·
System: Team, Settings. (* = future module, route reserved.)

## 9. Verification at freeze

- Typecheck: passing.
- Production build: passing.
- Phase 2 end-to-end CRUD, audit history, media delete and role restrictions:
  verified previously; temporary test accounts and records removed.

## Not implemented (Phase 3+)

Publishing workflow and scheduling, SEO module logic, analytics ingestion,
newsletter, integrations, redirects engine, Academy, media uploads to storage,
full role matrix, RTL rendering, public site generation.

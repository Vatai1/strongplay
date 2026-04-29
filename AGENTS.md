<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# StrongPlay — AGENTS.md

Monorepo: gaming community website + CRM admin panel. UI language is **Russian**. Retro pixel-art dark theme.

## Monorepo Layout

```
strong-play/                 # Root — Next.js 16 site (port 3000)
  app/                       # Pages (App Router)
  components/                # Shared React components
  lib/api.ts                 # Fetch client → CRM API
  data/                      # Legacy static data (kept as fallback)
  crm/                       # CRM admin panel (port 3001)
    server/                  # Express 5 API + Prisma ORM
    client/src/              # React SPA (Vite)
    prisma/                  # Schema, migrations, seed
  docker-compose.yml         # postgres + crm + web
  start.sh                   # Unified management script
```

## Commands

### Main site (run from repo root)

```bash
npm run dev        # Dev server → http://localhost:3000
npm run build      # Production build (Turbopack)
npm run lint       # ESLint (flat config, core-web-vitals + TS)
npm run start      # Start production server
```

### CRM (run from `crm/`)

```bash
npm run dev          # Dev server + client concurrently → http://localhost:3001
npm run dev:server   # Server only (tsx watch)
npm run dev:client   # Client only (Vite dev)
npm run build        # Build client + server
npm run build:client # Vite build → dist/client
npm run build:server # tsc build → dist/server
npm run db:migrate   # Run Prisma migrations
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed DB with initial data
```

### Docker (run from repo root)

```bash
./start.sh setup     # First-time install
./start.sh start     # Start all services (postgres + crm + web)
./start.sh dev       # Dev mode with hot reload
./start.sh stop      # Stop all services
./start.sh rebuild   # Full rebuild without cache
```

There is **no test framework** in either project.

## Build Verification

After ANY change, run the appropriate commands and ensure zero errors:

- Main site: `npm run build && npm run lint`
- CRM server: `cd crm && npm run build:server`
- CRM client: `cd crm && npm run build:client`

## Code Style — Main Site (Next.js)

### Imports (ordered, blank-line separated)

1. `"use client"` — first line if component uses hooks/events
2. External packages (`next/link`, `react`)
3. Internal via `@/` alias (`@/lib/api`, `@/components/...`)
4. Type-only: `import type { X }`
5. CSS Module — **always last**: `import styles from "./X.module.css"`

### Components

- Files: PascalCase (`TeamCard.tsx`) with co-located `.module.css`
- Export: always `export default function Name()` — no arrow functions, no `React.FC`
- `"use client"`: only when hooks or browser APIs are needed
- Props: inline typed (`({ player }: { player: Player })`) — no separate type aliases for props

### Pages

- Async server components fetch data from CRM API via `lib/api.ts`
- Export `generateMetadata()` for dynamic SEO (not static `metadata` object)
- Wrap: `<div className={styles.page}>` → `<div className={styles.container}>`

### CSS Modules

- One `.module.css` per component/page, co-located
- Class names: **camelCase** (`heroContent`, `btnPrimary`) — never kebab-case
- Use CSS variables from `globals.css` — `var(--accent-green)`, `var(--bg-card)`, etc.
- Pixel theme: hard shadows (`4px 4px 0px`), **no border-radius**, `var(--font-pixel)`
- Responsive: `@media (max-width: 768px)` at bottom of each file

### Data Flow

- Pages fetch from CRM API (`lib/api.ts`) with `next: { revalidate: 60 }` for ISR
- API fallbacks return empty arrays/null on failure

## Code Style — CRM (Express + React)

### Server (`crm/server/`)

- Express 5 route functions: `export default function nameRoutes(prisma: PrismaClient)`
- Route pattern: `router.get("/:id", async (req: Request, res: Response) => { ... })`
- Auth-protected routes use `authMiddleware` and `AuthRequest` type
- Params: cast `req.params.slug as string` (Express 5 types params as `string | string[]`)
- Errors: return `{ error: "message" }` with appropriate status code
- No comments unless explicitly asked

### Prisma (`crm/prisma/`)

- Schema: PascalCase models, camelCase fields
- Nullable foreign keys for optional relations (`teamId Int?`)
- `onDelete: SetNull` for soft disconnects, `Cascade` only where appropriate
- Migrations: `npx prisma migrate dev --name descriptive_name`
- Seed: `crm/prisma/seed.ts` — idempotent with `count()` checks

### CRM Client (`crm/client/src/`)

- Pages: one file per page in `pages/`, PascalCase (`Players.tsx`)
- API client: `api.ts` — all endpoints typed, uses `request<T>()` helper
- File upload: XMLHttpRequest for progress events (not fetch)
- State: `useState` for modals, forms, confirm dialogs
- ConfirmModal component for all destructive actions
- No CSS Modules — uses global `index.css` with `crm-` prefixed utility classes
- Same pixel theme as main site (same CSS variables)

## TypeScript

- Strict mode everywhere (`strict: true`)
- No `any` — type everything explicitly
- Main site: `@/*` path alias → repo root
- CRM server: CommonJS modules, `moduleResolution: "node"`
- CRM client: ESNext modules, `moduleResolution: "bundler"`

## Things to Avoid

- Do NOT add Tailwind CSS — CSS Modules (main site) and global CSS (CRM) only
- Do NOT add `border-radius` — pixel-art design uses sharp corners
- Do NOT use `<a>` for internal navigation — `<Link />` from `next/link`
- Do NOT add comments unless explicitly asked
- Do NOT install dependencies without checking existing ones
- Do NOT use `*` wildcard in Express 5 routes — use `{*splat}` instead

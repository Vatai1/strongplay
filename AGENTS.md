<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# StrongPlay — AGENTS.md

Gaming community website built with Next.js 16 (App Router), React 19, TypeScript, CSS Modules.
UI language is **Russian**. Retro pixel-art dark theme with neon accents.

## Commands

```bash
npm run dev       # Development server (http://localhost:3000)
npm run build     # Production build (Turbopack)
npm run lint      # ESLint (flat config, core-web-vitals + TypeScript)
npm run start     # Start production server (after build)
```

There is **no test framework** configured. No test commands exist.

## Project Structure

```
app/
  layout.tsx            # Root layout: Header + Footer wrapper
  page.tsx              # Home page (/)
  globals.css           # Global CSS variables and resets
  page.module.css       # Home page styles
  gallery/page.tsx      # Gallery page (/gallery)
  teams/page.tsx        # Teams page (/teams)
components/             # Shared React components (one .tsx + one .module.css each)
data/                   # Static TypeScript data modules (teams.ts, gallery.ts)
public/                 # Static assets served at /
Dockerfile              # Multi-stage standalone build
docker-compose.yml      # Single-service deployment on port 3000
```

## Build & Deploy

- `next.config.ts` sets `output: "standalone"` for Docker deployment.
- Docker: `docker compose up -d` → port 3000.
- Always run `npm run build` and `npm run lint` after making changes. Both must pass with zero errors.

## Code Style Guidelines

### Imports

Order (separated by blank lines):

1. `"use client"` directive — **always first line** if the component uses hooks or event handlers
2. External packages (`next/link`, `react`, etc.)
3. Internal modules using `@/` alias (`@/data/...`, `@/components/...`)
4. Type-only imports use `import type { X }` syntax
5. CSS Module import — **always last**: `import styles from "./ComponentName.module.css"`

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { GalleryImage } from "@/data/gallery";
import styles from "./GalleryGrid.module.css";
```

### Components

- **File naming**: PascalCase (`Header.tsx`, `TeamCard.tsx`)
- **Function naming**: PascalCase, matching filename (`export default function Header()`)
- **Export style**: Always `export default function` — no named exports for components, no arrow functions
- **"use client"**: Only when the component needs hooks or browser APIs. Pure presentational components are server components.
- **Props**: Typed inline with anonymous object types — no separate interfaces or type aliases for props:
  ```tsx
  export default function TeamCard({ player }: { player: Player }) { ... }
  ```
- **No `React.FC`** — use plain function declarations

### Pages

- Each page exports `default function PageName()`
- Page naming: `Home`, `TeamsPage`, `GalleryPage`
- Pages can export `const metadata = { title, description }` for SEO
- Wrap content in `<div className={styles.page}>` → `<div className={styles.container}>`

### CSS Modules

- One `.module.css` file per component/page, co-located in the same directory
- Import as `import styles from "./ComponentName.module.css"`
- Apply via `className={styles.className}`
- Conditional classes: `className={\`${styles.foo} ${condition ? styles.bar : ""}\`}`
- **Class naming**: camelCase (`heroContent`, `btnPrimary`, `lightboxClose`) — never kebab-case or snake_case
- Use CSS variables from `globals.css` (`var(--accent-green)`, `var(--bg-card)`, etc.)
- Responsive breakpoints: `@media (max-width: 768px)` at the bottom of each file
- Pixel theme: hard shadows (`4px 4px 0px`), solid borders (no border-radius), `var(--font-pixel)`

### Global CSS Variables (defined in `app/globals.css`)

| Variable | Purpose |
|---|---|
| `--bg-primary`, `--bg-secondary`, `--bg-card` | Background layers |
| `--text-primary`, `--text-secondary` | Text colors |
| `--accent-green`, `--accent-pink`, `--accent-cyan` | Neon accent colors |
| `--pixel-shadow-green`, `--pixel-shadow-pink` | Hard pixel shadows |
| `--font-pixel` | Press Start 2P font family |

### Data Files (`data/`)

- Export **interfaces** (PascalCase) and **typed const arrays** (camelCase)
- Named exports only — no default exports
- Static/hardcoded data, no API calls or async fetching
- True constants use SCREAMING_SNAKE_CASE (`GALLERY_SLOTS`)

```ts
export interface Player { nickname: string; role: string; avatar: string; }
export const teams: Team[] = [ ... ];
```

### TypeScript

- Strict mode enabled (`strict: true` in tsconfig)
- No `any` types — type everything explicitly
- Path alias: `@/*` → project root
- `moduleResolution: "bundler"` with `isolatedModules: true`

### Error Handling

- No error boundary (`error.tsx`) or `not-found.tsx` files exist yet
- No API routes — purely static/client-side

### Things to Avoid

- Do NOT add Tailwind CSS — this project uses CSS Modules exclusively
- Do NOT add `border-radius` — the design is pixel-art with sharp corners
- Do NOT use `<a>` for internal navigation — use `<Link />` from `next/link` (ESLint enforces this)
- Do NOT add comments in code unless explicitly asked
- Do NOT install new dependencies without checking what's already available

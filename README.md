# VLTG.notes

**Local-first, zero-trust encrypted note-taking app.** All data stays in your browser — no accounts, no servers, no telemetry.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)

---

## Features

- **Offline-only** — No network calls, no backend, no database. Everything runs client-side
- **AES-256-GCM encrypted exports** — Backup notes as password-protected `.vltg` files
- **Markdown support** — Write in Markdown with live preview (via `react-markdown` + `remark-gfm`)
- **Tag-based organization** — Categorize notes as `personal`, `work`, `ideas`, or `encrypted`
- **Pin important notes** — Pinned notes always appear at the top
- **Real-time search** — Filter notes by title and content instantly
- **Responsive design** — Full mobile support with slide-out sidebar
- **Import with merge** — Import backups with option to merge or replace existing notes
- **Custom export naming** — Name your backup files with automatic `.vltg` extension

---

## Architecture

```
src/
├── components/
│   ├── NoteEditor.tsx        # Main editor with Markdown preview toggle
│   ├── NoteSidebar.tsx        # Note list, search, tags, navigation
│   ├── ExportImportDialog.tsx # Backup & restore UI
│   ├── NavLink.tsx
│   └── ui/                   # shadcn/ui component library
├── hooks/
│   ├── useNotes.ts           # Core state management & persistence
│   └── use-mobile.tsx        # Responsive breakpoint detection
├── lib/
│   ├── crypto.ts             # AES-GCM encryption / PBKDF2 key derivation
│   └── utils.ts              # Tailwind merge utilities
├── pages/
│   ├── Index.tsx              # Main app layout
│   └── NotFound.tsx
├── index.css                  # Design system tokens (HSL)
└── main.tsx                   # App entry point
```

---

## Cryptography

All encryption uses the native **Web Crypto API** — no third-party crypto libraries.

### Export encryption pipeline

```
plaintext (JSON) → PBKDF2 key derivation → AES-256-GCM encrypt → base64 encode → .vltg file
```

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Algorithm** | AES-256-GCM | Authenticated encryption — integrity + confidentiality in one pass |
| **Key derivation** | PBKDF2 with SHA-256 | Stretches user passwords into cryptographic keys |
| **Iterations** | 100,000 | OWASP-recommended minimum for PBKDF2-SHA256 |
| **Salt** | 16 bytes, random per export | Prevents rainbow table attacks; unique per file |
| **IV** | 12 bytes, random per export | GCM standard nonce length; never reused with same key |

### File format (`.vltg`)

The exported file is a single base64 string containing:

```
[16 bytes salt][12 bytes IV][ciphertext + GCM auth tag]
```

The import process reverses this: decode base64 → extract salt/IV → derive key from password → AES-GCM decrypt → parse JSON.

**Source:** [`src/lib/crypto.ts`](src/lib/crypto.ts)

---

## Data Model

Notes are stored as a JSON array in `localStorage` under the key `vltg-notes`.

```typescript
interface Note {
  id: string;        // crypto.randomUUID()
  title: string;
  content: string;   // Markdown-formatted text
  createdAt: Date;
  updatedAt: Date;
  pinned: boolean;
  tag?: 'personal' | 'work' | 'ideas' | 'encrypted';
}
```

### State management

The [`useNotes`](src/hooks/useNotes.ts) hook manages all note operations:

- **Persistence** — Every mutation (create, update, delete) immediately writes to `localStorage`
- **Auto-save** — The editor debounces title/content changes at 300ms before persisting
- **Sorting** — Pinned notes first, then by `updatedAt` descending
- **Filtering** — Combined tag filter + full-text search across title and content
- **Immutable updates** — State changes produce new arrays via `.map()` / `.filter()`, triggering clean React re-renders

---

## UI & Design System

### Stack

| Layer | Technology |
|-------|-----------|
| **Components** | [shadcn/ui](https://ui.shadcn.com/) (Radix primitives + Tailwind) |
| **Styling** | Tailwind CSS v3 with HSL custom properties |
| **Animation** | Framer Motion |
| **Icons** | Lucide React |
| **Markdown** | react-markdown + remark-gfm |

### Theming

The design system uses HSL-based CSS custom properties defined in [`src/index.css`](src/index.css) with semantic tokens:

- `--background`, `--foreground` — Base surface colors
- `--primary`, `--accent` — Brand colors
- `--surface-1`, `--surface-2` — Elevated surface layers
- `--muted`, `--muted-foreground` — De-emphasized content
- `--destructive` — Danger actions

All components reference these tokens via Tailwind classes (`bg-primary`, `text-muted-foreground`, etc.) — no hardcoded colors in components.

### Responsive behavior

- **Desktop** — Persistent sidebar + editor side-by-side
- **Mobile** (<768px) — Sidebar collapses into a slide-out `Sheet` component, toggled via hamburger menu

---

## Development

### Prerequisites

- Node.js 18+ or Bun

### Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The app runs at `http://localhost:8080` by default.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint check |
| `npm test` | Run Vitest test suite |

### Testing

Tests use **Vitest** with **jsdom** and **Testing Library**. Playwright is configured for E2E tests.

```bash
npx vitest          # Unit tests
npx playwright test # E2E tests
```

---

## Security considerations

- **No server-side code** — Zero attack surface from network exposure
- **No telemetry or analytics** — Nothing leaves the browser
- **localStorage limits** — ~5-10MB depending on browser. For large note collections, export regularly
- **Browser trust model** — Data is as secure as the browser profile. Use full-disk encryption on the host OS
- **Password strength** — Export encryption is only as strong as the password chosen. Use a passphrase

---

## License

Private project. All rights reserved.

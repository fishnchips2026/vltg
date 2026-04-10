# Third-Party Notices

VLTG.notes is built with the following open-source libraries. We gratefully acknowledge their authors and contributors.

---

## Runtime Dependencies

| Package | License | Description |
|---------|---------|-------------|
| [React](https://github.com/facebook/react) | MIT | UI component library |
| [React DOM](https://github.com/facebook/react) | MIT | React renderer for the browser |
| [React Router DOM](https://github.com/remix-run/react-router) | MIT | Client-side routing |
| [TypeScript](https://github.com/microsoft/TypeScript) | Apache-2.0 | Typed JavaScript superset |
| [Vite](https://github.com/vitejs/vite) | MIT | Build tool and dev server |
| [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) | MIT | Utility-first CSS framework |
| [Framer Motion](https://github.com/framer/motion) | MIT | Animation library for React |
| [Lucide React](https://github.com/lucide-icons/lucide) | ISC | Icon library |
| [react-markdown](https://github.com/remarkjs/react-markdown) | MIT | Markdown renderer for React |
| [remark-gfm](https://github.com/remarkjs/remark-gfm) | MIT | GitHub Flavored Markdown support |
| [Sonner](https://github.com/emilkowalski/sonner) | MIT | Toast notification library |
| [date-fns](https://github.com/date-fns/date-fns) | MIT | Date utility library |
| [Zod](https://github.com/colinhacks/zod) | MIT | Schema validation |
| [React Hook Form](https://github.com/react-hook-form/react-hook-form) | MIT | Form state management |
| [@hookform/resolvers](https://github.com/react-hook-form/resolvers) | MIT | Validation resolvers for React Hook Form |
| [TanStack React Query](https://github.com/TanStack/query) | MIT | Async state management |
| [Recharts](https://github.com/recharts/recharts) | MIT | Charting library |
| [cmdk](https://github.com/pacocoursey/cmdk) | MIT | Command palette component |
| [Vaul](https://github.com/emilkowalski/vaul) | MIT | Drawer component |
| [next-themes](https://github.com/pacocoursey/next-themes) | MIT | Theme management |
| [input-otp](https://github.com/guilhermerodz/input-otp) | MIT | OTP input component |
| [Embla Carousel](https://github.com/davidjerleke/embla-carousel) | MIT | Carousel component |
| [React Resizable Panels](https://github.com/bvaughn/react-resizable-panels) | MIT | Resizable panel layouts |
| [React Day Picker](https://github.com/gpbl/react-day-picker) | MIT | Date picker component |
| [class-variance-authority](https://github.com/joe-bell/cva) | Apache-2.0 | Component variant utility |
| [clsx](https://github.com/lukeed/clsx) | MIT | Conditional className utility |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | MIT | Tailwind class conflict resolution |
| [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate) | MIT | Animation utilities for Tailwind |

## Radix UI Primitives

All [Radix UI](https://github.com/radix-ui/primitives) packages are licensed under the **MIT** license. The following primitives are used:

`accordion` · `alert-dialog` · `aspect-ratio` · `avatar` · `checkbox` · `collapsible` · `context-menu` · `dialog` · `dropdown-menu` · `hover-card` · `label` · `menubar` · `navigation-menu` · `popover` · `progress` · `radio-group` · `scroll-area` · `select` · `separator` · `slider` · `slot` · `switch` · `tabs` · `toast` · `toggle` · `toggle-group` · `tooltip`

## shadcn/ui

UI components are built on [shadcn/ui](https://ui.shadcn.com/), which provides unstyled, accessible component patterns on top of Radix UI primitives. shadcn/ui is **not a package** — it is a collection of copy-paste components. No license restriction applies to generated component code.

---

## Dev Dependencies

| Package | License | Description |
|---------|---------|-------------|
| [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) | MIT | SWC-based React plugin for Vite |
| [ESLint](https://github.com/eslint/eslint) | MIT | JavaScript linter |
| [Playwright](https://github.com/microsoft/playwright) | Apache-2.0 | E2E testing framework |
| [Vitest](https://github.com/vitest-dev/vitest) | MIT | Unit test framework |
| [Testing Library](https://github.com/testing-library) | MIT | DOM testing utilities |
| [jsdom](https://github.com/jsdom/jsdom) | MIT | DOM implementation for Node.js |
| [PostCSS](https://github.com/postcss/postcss) | MIT | CSS transformer |
| [Autoprefixer](https://github.com/postcss/autoprefixer) | MIT | CSS vendor prefix tool |
| [@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography) | MIT | Prose styling plugin |

---

## Web Crypto API

VLTG.notes uses the browser-native **Web Crypto API** for all cryptographic operations (AES-256-GCM, PBKDF2). This is a W3C standard built into all modern browsers — no third-party cryptography libraries are used.

---

## Full License Texts

The full text of each license can be found in the respective package's repository linked above, or in the `node_modules/<package>/LICENSE` file after installing dependencies.

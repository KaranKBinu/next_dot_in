---
kind: frontend_style
name: Tailwind CSS v4 Design System with Custom Theme Tokens
category: frontend_style
scope:
    - '**'
source_files:
    - src/app/globals.css
    - src/app/layout.tsx
    - src/components/Typography.tsx
    - postcss.config.mjs
    - package.json
---

The project uses Tailwind CSS v4 (via `@tailwindcss/postcss`) as its sole styling system, driven by a centralized design token layer defined in `src/app/globals.css`. There is no separate `tailwind.config.js` — configuration lives entirely in the CSS file using Tailwind v4's new `@theme` and `@custom-variant` directives.

**Design tokens & color system**
- A full 50–950 scale for `primary-*` (shiny blue) and `neutral-*` (high-contrast charcoal grays) is declared inside `@theme`, replacing Tailwind defaults. These are exposed as CSS custom properties (`--color-primary-*`, `--color-neutral-*`) so they cascade into component classes like `bg-primary-500`, `text-neutral-700`, etc.
- Dark mode is implemented via a `.dark` class that re-declares `--background`, `--foreground`, and swaps the neutral palette to zinc-like tones; the `:root` vs `.dark` variable split drives all theme-aware components.
- Shadows are overridden with pronounced, tactile values (`--shadow-sm` through `--shadow-xl`) to avoid a fragile look.

**Typography system**
- Fonts are loaded at the root layout via `next/font/google`: Geist Sans/Mono plus Noto Sans Devanagari and Noto Sans Malayalam, each registered as CSS variables (`--font-geist-sans`, `--font-devanagari`, …) and mapped into `@theme` under `--font-sans`, `--font-mono`, `--font-devanagari-var`, `--font-malayalam-var`.
- Locale-aware font switching is handled by `[data-locale="hi"]` / `[data-locale="ml"]` selectors on `body` in `globals.css`, swapping the active font stack based on the synchronous locale state set by `NavbarContext`.
- A dedicated `<Typography>` component (`src/components/Typography.tsx`) encapsulates a Material-style variant map (`h1`–`h6`, `subtitle1/2`, `body1/2`, `caption`, `overline`) composed from Tailwind utility strings, with optional `color`, `weight`, `align`, and `gutterBottom` props. This is the canonical way to render text across the app rather than hand-writing heading classes.

**Dark-mode convention**
- Components use the `dark:` prefix extensively (e.g., `bg-white dark:bg-neutral-950`, `text-neutral-900 dark:text-neutral-50`) paired with the global `.dark` class strategy. The `@custom-variant dark (&:where(.dark, .dark *))` rule ensures nested dark contexts work correctly.

**Styling conventions observed in components**
- Utility-first composition: pages and components compose layout, spacing, color, and typography directly from Tailwind utilities (`flex`, `grid`, `gap-*`, `p-*`, `m-*`, `rounded-*`, `shadow-*`).
- No external UI kit (no shadcn/ui, MUI, Chakra); reusable visual primitives live as small React components (`Typography`, `Tooltip`, `Footer`, `Navbar`) that wrap Tailwind classes.
- Icons come from `lucide-react`; no icon font or SVG sprite system.
- No SCSS/Sass, CSS-in-JS, or CSS Modules — plain CSS + Tailwind utilities only.
- Responsive breakpoints follow Tailwind's default mobile-first scale (`sm:`, `md:`, `lg:`).

**Build pipeline**
- PostCSS is configured solely with `@tailwindcss/postcss` (no Autoprefixer, PurgeCSS, or other plugins), letting Tailwind v4 handle import resolution, JIT compilation, and theme extraction from `globals.css`.
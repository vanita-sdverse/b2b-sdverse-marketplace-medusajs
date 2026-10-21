# Frontend Styling Rules

1. **Brand Yellow Color Standard**:
   - The brand yellow MUST strictly be `rgb(255, 244, 81)` (hex `#FFF451`) everywhere and in all future components.
   - NEVER use `#FACC15`, `#EAB308`, `#F59E0B`, or any darker/amber shades of yellow.
   - All styling must reference `var(--brand-yellow)` or directly `rgb(255, 244, 81)` / `#FFF451`.
   - Hover states should use `#F5E83D` (slightly deeper yellow) or a subtle brightness/glow filter, maintaining pure yellow tone.

2. **Strictly Ban Inline Styles**:
   - Never use `style={{ ... }}` in any React component or page across `apps/storefront`, `apps/seller-portal`, `apps/backoffice`, or `packages/shared-ui`.

3. **Dedicated SCSS Files**:
   - Every component must have a co-located `.module.scss` file (e.g., `Button.tsx` -> `Button.module.scss`).
   - Every route/page must have a co-located `.module.scss` file (e.g., `app/products/page.tsx` -> `app/products/page.module.scss`).
   - Global design tokens, layout variables, and typography are defined in `styles/globals.scss`.

4. **No Tailwind CSS**:
   - Use clean, semantic SCSS with CSS modules.

5. **Component Typing**:
   - Use standard function signatures returning `React.ReactElement` or `React.ReactElement | null` for maximum compatibility across React 18 and Next.js Server/Client Components.

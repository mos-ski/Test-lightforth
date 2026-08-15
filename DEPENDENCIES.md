# Dependencies

- `@tanstack/react-query` - Existing app dependency; not used by the v3 Auth slice.
- `@base-ui/react` - Existing headless primitive dependency available for future behavior-heavy UI.
- `clsx` - Used by `src/ui/cn.ts` to compose class names.
- `tailwind-merge` - Used by `src/ui/cn.ts` to resolve conflicting Tailwind classes.
- `lucide-react` - Existing icon dependency; not used by the v3 Auth slice because Figma assets were exported directly.
- `react`, `react-dom`, `react-router-dom` - Existing runtime stack for the Vite app and v3 route wiring.

No new runtime dependencies were added for the v3 Auth slice.

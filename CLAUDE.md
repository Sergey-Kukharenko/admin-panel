# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Vue 3 + TypeScript admin panel for Mico ("mico-client-portal-ui"). Built with Vite, styled with Tailwind CSS v4, state via Pinia + TanStack Vue Query, routing via Vue Router. Ships as a static build served by nginx (see `Dockerfile`, `nginx.conf`).

## Commands

```sh
npm run dev              # start Vite dev server
npm run build            # type-check (vue-tsc) + production build
npm run preview          # preview the production build
npm run test:unit        # run Vitest (jsdom environment)
npm run type-check       # vue-tsc --build only
npm run lint             # oxlint --fix, eslint --fix --cache, steiger (FSD rules)
npm run format           # prettier --write src/
npm run check            # everything without --fix: type-check, check:lint, check:format, tests
npm run api:types        # regenerate src/shared/api/generated from openapi/openapi.json
npm run icons:sprite     # rebuild the UI icon sprite
```

Run `npm run check` before committing. Tests live next to the code in `__tests__/` (`*.spec.ts`); a single file: `npx vitest run path/to/file.spec.ts`. Composables that need the app context (router, i18n, Vue Query) are tested with `withSetup` from `@/shared/lib/test`.

Linting runs oxlint first (fast correctness checks, config in `.oxlintrc.json`), then ESLint (style/import rules, `eslint.config.ts`), which also loads `eslint-plugin-oxlint` to avoid duplicate reporting, then steiger (FSD layers, public API, cross-imports; `steiger.config.ts`). Prettier (`.prettierrc.json`: single quotes, semicolons, 100 print width) is checked by `check:format`.

## Architecture

The codebase follows **Feature-Sliced Design (FSD)**. Layers, from lowest to highest, live under `src/`:

- `shared/` — framework-agnostic building blocks with no knowledge of business domain: `shared/ui` (design-system components like `AppButton`, `AppDropdown`, `AppDrawer`), `shared/api` (axios instance `apiClient`, HTTP error helpers, OpenAPI types generated into `shared/api/generated`), `shared/config`, `shared/lib`, `shared/assets/styles` (Tailwind tokens as CSS custom properties: `tokens/colors.css`, `tokens/theme.css`, `tokens/radius.css`, `tokens/typography.css`).
- `entities/` — business domain objects and their API/model, e.g. `entities/dataset` (dataset types, `datasetApi`, upload/validation helpers), `entities/user` (Pinia `useUserStore`, `sessionApi`/`authorizationApi`).
- `features/` — single user actions built from entities, e.g. `features/upload-dataset` (upload zone, template picker, `useDatasetFiles` composable).
- `widgets/` — composite, self-sufficient UI blocks assembled from entities/features, e.g. `widgets/dataset-history-table`, `widgets/dataset-upload-drawer`, `widgets/auth-loader`.
- `pages/` — route-level views (`pages/<name>/ui/<Name>Page.vue`, slice names without a `-page` suffix: `pages/datasets`, `pages/integrations`, …), each a thin composition of widgets, lazy-loaded from the router.
- `app/` — app-wide concerns: `app/router` (route table + auth guard) and `app/layouts/admin-layout` (shell: header, sidebar, navigation).

Each slice exposes a **public API via `index.ts`** — other slices must import through that barrel (e.g. `@/entities/dataset`, `@/shared/api`), not by reaching into internal files. The `@/*` path alias maps to `src/*` (configured in both `vite.config.ts` and `tsconfig.app.json`).

Within a slice, code is grouped by segment by the nature of the code: `model/` (reactive: stores, composables, query keys, UI types), `lib/` (pure functions: mappers, formatters, validation), `config/` (constants, dictionaries, mocks), `api/` (backend calls; DTOs in `api/types.ts` as aliases of the generated OpenAPI types), `ui/` (`.vue` components, one per directory with its own `index.ts`), `assets/`. Create a segment only when it has content. FSD rules are checked by steiger; known deviations are listed in `docs/fsd-debt.md` — don't copy them.

### Data flow conventions

- All HTTP calls go through the shared `apiClient` (axios, `withCredentials: true`, base URL from `VITE_API_URL`). Domain-specific calls live in each entity's `api/*.ts` file (e.g. `datasetApi`) and are the only place that touches axios directly.
- Server state (lists, history, uploads) is managed with **TanStack Vue Query**; the `QueryClient` is created once in `main.ts` with `refetchOnWindowFocus: false` and `retry: 1`. Cancellation is done by passing an `AbortSignal` through to axios (see `datasetApi.getFiles`).
- Client/UI state that should survive navigation (filters, sort, pagination) is kept in the **URL query string** via computed getters/setters over `route.query` (see `widgets/dataset-history-table/model/useDatasetHistoryFilters.ts`), not in a store — treat the router as the source of truth for this kind of state.
- Global client state (current user/session) uses **Pinia** with the setup-store syntax (`entities/user/model/store.ts`).
- Auth is cookie/session based: `useUserStore.initAuth()` calls `sessionApi.me()` on bootstrap; `login()`/`logout()` do full-page redirects to `${API_URL}/authorization/login|logout`. Routes are gated with `meta: { requiresAuth: true }` and a global `router.beforeEach` guard in `app/router/index.ts`.

### UI/styling conventions

- Design tokens are CSS custom properties (`--primary`, `--muted`, `--border`, `--radius-sm`, etc., defined in `shared/assets/styles/tokens/*.css`) consumed in Tailwind via the `bg-(--token)` / `text-(--token)` arbitrary-property syntax — prefer referencing existing tokens over hardcoded colors/spacing.
- Shared UI components (`shared/ui/app-*`) follow a consistent shape: a `<ComponentName>.vue`, an optional `<ComponentName>.types.ts` for exported prop types, and an `index.ts` re-export. Variant/size styling is done with `computed()` functions returning class arrays switched on props, not a separate CVA-style library.
- Radix Vue (`radix-vue`) underlies interactive primitives (dropdowns, dialogs, drawers).
- SVGs are imported either as URLs (default) or as Vue components via the `?component` suffix — see `vite-svg-loader` config in `vite.config.ts` and the module declarations in `env.d.ts`.
- UI icons come from the design-system set (Figma "Icons", node 52:4927) via `<AppIcon name="..." />` from `@/shared/ui/app-icon` — an SVG sprite with a typed `IconName`. Default size 16px (override with `size-*`), color is `currentColor` (`text-*`). To add/update an icon, drop the raw Figma SVG export into `src/shared/assets/icons/ui/<name>.svg` and run `npm run icons:sprite` (regenerates `sprite.svg` + `iconNames.ts`). Don't add icon libraries (lucide was removed) or one-off icon SVGs; only logos/illustrations stay as local assets.

### Vue/ESLint conventions enforced by config

- SFC block order is **`script` → `template` → `style`** (`vue/block-order` in `eslint.config.ts`), the reverse of Vue's default scaffold order — follow existing files.
- Imports are auto-sorted (`simple-import-sort`) and unused imports/vars are errors/warnings (`unused-imports`) — don't hand-order imports.
- `vue/html-self-closing` is enforced for void, normal, and component tags; `vue/attributes-order` and `vue/max-attributes-per-line` (1 attr per line when multiline) are enforced.
- `no-console` and `no-debugger` are warnings, not errors, but should still be cleaned up before committing.

### Notes on existing code

- Many existing comments and some UI copy are in Russian; match the surrounding file's language when editing nearby code rather than converting it.
- `noUncheckedIndexedAccess` is enabled in `tsconfig.app.json` — indexed array/object access is typed as possibly `undefined`, guard accordingly.

## Language preference

- Always communicate, explain, and reply strictly in Russian (на русском языке).
- If the user asks a question in Russian, you must reply in Russian.
- You can still write code, variable names, and technical terms in English as per standard programming practices, but all descriptions and chat dialogue must be in Russian.

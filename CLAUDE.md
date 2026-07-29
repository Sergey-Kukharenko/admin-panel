# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Vue 3 + TypeScript admin panel for Mico ("mico-client-portal-ui"). Built with Vite, styled with Tailwind CSS v4, state via Pinia + TanStack Vue Query, routing via Vue Router. Ships as a static build served by nginx (see `Dockerfile`, `nginx.conf`).

## Commands

```sh
npm run dev              # start Vite dev server
npm run build             # type-check (vue-tsc) + production build
npm run preview           # preview the production build
npm run test:unit         # run Vitest (jsdom environment)
npm run type-check        # vue-tsc --build only
npm run lint              # oxlint --fix, then eslint --fix --cache
npm run format             # prettier --write src/
```

There are no test files in `src` yet — `npm run test:unit` runs Vitest against `src/**/__tests__/*` once tests are added. To run a single test file: `npx vitest run path/to/file.spec.ts`.

Linting runs oxlint first (fast correctness checks, config in `.oxlintrc.json`), then ESLint (style/import rules, `eslint.config.ts`), which also loads `eslint-plugin-oxlint` to avoid duplicate reporting. Prettier (`.prettierrc.json`: single quotes, semicolons, 100 print width) runs separately via `npm run format` — it's not wired into `lint`.

## Architecture

The codebase follows **Feature-Sliced Design (FSD)**. Layers, from lowest to highest, live under `src/`:

- `shared/` — framework-agnostic building blocks with no knowledge of business domain: `shared/ui` (design-system components like `AppButton`, `AppDropdown`, `AppDrawer`), `shared/api` (axios instance `apiClient`, `sessionApi`), `shared/config`, `shared/lib`, `shared/assets/styles` (Tailwind tokens as CSS custom properties: `tokens/colors.css`, `tokens/theme.css`, `tokens/radius.css`, `tokens/typography.css`).
- `entities/` — business domain objects and their API/model, e.g. `entities/dataset` (dataset types, `datasetApi`, upload/validation helpers), `entities/user` (Pinia `useUserStore`, auth types).
- `features/` — single user actions built from entities, e.g. `features/upload-dataset` (upload zone, template picker, `useDatasetFiles` composable).
- `widgets/` — composite, self-sufficient UI blocks assembled from entities/features, e.g. `widgets/dataset-history-table`, `widgets/dataset-upload-drawer`, `widgets/auth-loader`.
- `pages/` — route-level views (`DashboardPage`, `DatasetsPage`, `IntegrationsPage`, `PredictionsPage`, `BillingPage`), each a thin composition of widgets.
- `app/` — app-wide concerns: `app/router` (route table + auth guard) and `app/layouts/admin-layout` (shell: header, sidebar, navigation).

Each slice exposes a **public API via `index.ts`** — other slices must import through that barrel (e.g. `@/entities/dataset`, `@/shared/api`), not by reaching into internal files. The `@/*` path alias maps to `src/*` (configured in both `vite.config.ts` and `tsconfig.app.json`).

Within a slice, code is grouped by segment: `model/` (types, composables, stores, pure logic), `ui/` (`.vue` components, one per directory with its own `index.ts`), `api/` (backend calls), `assets/`.

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

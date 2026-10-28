# mico-client-portal-ui

Фронтенд клиентского портала MICo: загрузка данных, интеграции (REST API, Amazon S3), предсказания
ML-продуктов. Vue 3 + TypeScript + Vite, архитектура — Feature-Sliced Design.

## Быстрый старт

Нужен Node `^20.19.0 || >=22.12.0`.

```sh
npm install
npm run dev
```

Вход — через сессию бэкенда (OIDC / Authentik): без авторизации приложение уводит на страницу входа.
В dev вход идёт с `frontend=local`, бэкенд возвращает на локальный адрес.

## Окружение

| Переменная | Где | Назначение |
|---|---|---|
| `VITE_API_URL` | `.env` | адрес API (сейчас — dev-стенд; цель — относительный `/api` с прокси, см. манифест) |
| `VITE_FEATURE_*` | `.env.local` | `true` — включить скрытую фичу; список и описание флагов — `src/shared/config/env.ts` (ключи интеграций, уведомления, ссылки помощи и аналитики, последние операции) |

Личные настройки — в `.env.local` (не коммитится).

## Скрипты

| Команда | Что делает |
|---|---|
| `npm run dev` | dev-сервер |
| `npm run build` | type-check + сборка |
| `npm run check` | все проверки без исправлений: типы, oxlint, ESLint, Prettier, тесты — **перед коммитом** |
| `npm run lint` / `npm run format` | исправить линт / форматирование |
| `npm run test:unit` | Vitest в watch-режиме |
| `npm run api:types` | типы API из `openapi/openapi.json` (Swagger бэка) |
| `npm run icons:sprite` | пересобрать спрайт иконок из `src/shared/assets/icons/ui/` |

## Документация

- [`CLAUDE.md`](CLAUDE.md) — **архитектурный манифест**: слои FSD, сегменты, работа с API, состояние,
  компоненты, дизайн-система, i18n, тесты, Definition of Done. Им руководствуется и Claude Code.
- [`docs/reference-slice.md`](docs/reference-slice.md) — эталонный срез entity → feature → widget → page.
- [`docs/checklists.md`](docs/checklists.md) — чеклисты: страница, эндпоинт, фича, виджет, компонент.
- [`docs/delivery.md`](docs/delivery.md) — git, коммиты, CI/CD, деплой.
- [`docs/fsd-debt.md`](docs/fsd-debt.md) — известные отклонения от манифеста (не копировать).
- [`docs/refactoring-plan.md`](docs/refactoring-plan.md) — план рефакторинга.

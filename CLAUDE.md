# Архитектурный манифест — mico-client-portal-ui

> **Назначение.** Стандарт архитектуры и стиля для фронтенда клиентского портала MICo
> (Vue 3 + TypeScript + Feature-Sliced Design). Claude Code развивает проект строго по этому
> документу. Манифест описывает **«как должно быть»**, а не текущий состав файлов — актуальное
> содержимое всегда смотри в самой репе.
>
> **Существующий код и долг.** Код, который не соответствует манифесту, — это долг, а не образец.
> Известные отклонения перечислены в [`docs/fsd-debt.md`](docs/fsd-debt.md). **Перед правкой
> существующего слайса сверься с этим файлом: перечисленные там паттерны не копировать.**
> В рамках задачи приводим к манифесту только те файлы, которые и так правим; перенос слайса
> между слоями или сегментами — отдельной `chore/*`-задачей.
>
> **Что ещё не реализовано.** Часть правил опирается на инфраструктуру, которой пока нет в коде
> (таблица ниже). Если задача упирается в такой элемент — создай его по описанию из манифеста
> (отдельным MR или явно в рамках задачи), а не обходи. Пакеты из таблицы **согласованы** —
> правило «новые зависимости только по согласованию» на них не распространяется.
>
> | Элемент | Где описан |
> |---|---|
> | Генерация типов из OpenAPI (`openapi-typescript`, `npm run api:types`, `shared/api/generated/` + реэкспорт из `shared/api/index.ts`) | «Работа с бэкендом» |
> | `getHttpStatus`, `isClientError` в `shared/api` | «Ошибки и уведомления», «Серверное состояние» |
> | Интерсептор 401 в `app/providers/` | «Ошибки и уведомления» |
> | Фабрики query keys `<entity>Keys` | «Серверное состояние» |
> | `AppModal` | «Дизайн-система» |
> | `TooltipProvider` в `App.vue` (сейчас создаётся внутри `AppTooltip`) | «Дизайн-система» |
> | `ROUTE_NAMES`, ленивые страницы, `meta.titleKey` / `meta.nav`, маршрут 404 | «Авторизация и роутинг» |
> | `server.proxy` в `vite.config.ts` и `VITE_API_URL=/api` | «Конфигурация» |
> | Vitest: окружение `node` по умолчанию, хелпер `withSetup` | «Тесты» |
> | Скрипты `check:lint`, `check:format`, `icons:sprite`; CI-джоба `quality` | «Команды», «Деплой и CI/CD» |
> | Линтеры `steiger`, `eslint-plugin-vuejs-accessibility`, `@intlify/eslint-plugin-vue-i18n` | «Линтинг» |
>
> **Эталонные места в коде** (делать «как там» — в указанном аспекте):
> - `widgets/prediction-run-history` — фильтры, сортировка и пагинация в URL; маппер DTO → UI с тестами; состояния loading / error / empty;
> - `entities/product` — query-composable сущности с `select` и поллингом;
> - `shared/ui/app-button` — вариативный компонент дизайн-системы;
> - `shared/ui/app-pagination` — компонент с `defineModel` и чистой логикой с тестом.
>
> Ключи запросов, раскладка по сегментам и справочники в этих местах — долг (см. `docs/fsd-debt.md`).
>
> Следуй манифесту строго. Не отклоняйся от описанных паттернов без согласования с командой.

---

## Содержание

- [Технический стек](#технический-стек)
- [Команды](#команды)
- [Структура каталогов](#структура-каталогов)
- [Слои FSD и правила импорта](#слои-fsd-и-правила-импорта)
- [Feature или widget](#feature-или-widget)
- [Устройство слайса (сегменты)](#устройство-слайса-сегменты)
- [Нейминг](#нейминг)
- [Работа с бэкендом (api-сегмент)](#работа-с-бэкендом-api-сегмент)
- [Серверное состояние (TanStack Query)](#серверное-состояние-tanstack-query)
- [Маппинг DTO → UI-модель](#маппинг-dto--ui-модель)
- [Клиентское состояние](#клиентское-состояние)
- [Vue-компоненты](#vue-компоненты)
- [Состояния экрана: загрузка, ошибка, пусто](#состояния-экрана-загрузка-ошибка-пусто)
- [Дизайн-система (shared/ui)](#дизайн-система-sharedui)
- [Стили и дизайн-токены](#стили-и-дизайн-токены)
- [Иконки и ассеты](#иконки-и-ассеты)
- [Локализация (i18n)](#локализация-i18n)
- [Даты, числа, форматирование](#даты-числа-форматирование)
- [Ошибки и уведомления](#ошибки-и-уведомления)
- [Авторизация и роутинг](#авторизация-и-роутинг)
- [Конфигурация, env и фича-флаги](#конфигурация-env-и-фича-флаги)
- [Моки и скрытые фичи](#моки-и-скрытые-фичи)
- [Требования и макеты](#требования-и-макеты)
- [Комментарии в коде](#комментарии-в-коде)
- [Тесты](#тесты)
- [Линтинг и форматирование](#линтинг-и-форматирование)
- [Деплой и CI/CD](#деплой-и-cicd)
- [Чеклисты](#чеклисты)
- [Эталонный пример (вертикальный срез)](#эталонный-пример-вертикальный-срез)
- [Definition of Done (перед MR)](#definition-of-done-перед-mr)
- [Git, ветки и Merge Request](#git-ветки-и-merge-request)
- [Коммиты](#коммиты)
- [Язык общения](#язык-общения)

---

## Технический стек

| Назначение | Библиотека / инструмент |
|---|---|
| Фреймворк | Vue 3.5 (Composition API, `<script setup lang="ts">`) |
| Язык | TypeScript (strict, `noUncheckedIndexedAccess`) |
| Сборка | Vite 8, `@vitejs/plugin-vue`, `vite-svg-loader`, `vite-plugin-vue-devtools` |
| Стили | Tailwind CSS v4 (CSS-first, `@tailwindcss/vite`), дизайн-токены — CSS custom properties |
| Headless-примитивы | `radix-vue` (Dialog, DropdownMenu, Tooltip, Checkbox, Switch, Collapsible, ScrollArea) |
| Серверное состояние | `@tanstack/vue-query` v5 |
| Клиентское состояние | Pinia (setup-store) + URL query через Vue Router |
| Роутинг | Vue Router |
| HTTP | axios (единый инстанс `apiClient`) |
| Типы API | `openapi-typescript` *(подключить)* |
| Локализация | `vue-i18n` (composition mode, `legacy: false`), языки `ru` / `en` |
| Уведомления | `vue-sonner` (`toast`) |
| Даты | `Intl.*` для отображения, `dayjs` — для арифметики дат |
| Графики | `apexcharts` + `vue3-apexcharts` |
| Тесты | Vitest + `@vue/test-utils` |
| Линт / формат | oxlint → ESLint (flat config) → Prettier; `steiger`, `eslint-plugin-vuejs-accessibility`, `@intlify/eslint-plugin-vue-i18n` *(подключить)* |
| Node | `^20.19.0 \|\| >=22.12.0` (в Docker — `node:24-alpine`) |
| Рантайм | статика в `nginx-unprivileged` (порт 8080) → Helm (`mico-app`) → K8s |

Новые зависимости, кроме перечисленных в таблице «Что ещё не реализовано», не добавлять без
согласования. Если задача решается уже подключённой библиотекой (radix-vue, dayjs, Intl,
TanStack Query) — используем её. Неиспользуемые зависимости удаляются из `package.json`.

---

## Команды

| Команда | Что делает |
|---|---|
| `npm run dev` | дев-сервер Vite (запросы на `/api` проксируются на dev-бэкенд — см. «Конфигурация») |
| `npm run build` | `vue-tsc --build` + `vite build` параллельно |
| `npm run type-check` | только проверка типов |
| `npm run test:unit` | Vitest (watch); разово — `npx vitest run`, один файл — `npx vitest run <path>` |
| `npm run lint` | `run-s lint:*` — oxlint и eslint с `--fix` (**правит файлы**), для локальной работы |
| `npm run check:lint` | oxlint + eslint **без** `--fix` + `steiger` — для CI и проверки перед MR |
| `npm run format` | `prettier --write --experimental-cli src/` |
| `npm run check:format` | `prettier --check --experimental-cli src/` — для CI и проверки перед MR |
| `npm run api:types` | перегенерировать типы API из OpenAPI бэкенда в `src/shared/api/generated/` |
| `npm run icons:sprite` | пересобрать SVG-спрайт и `iconNames.ts` (`node scripts/build-icon-sprite.mjs`) |

Скрипты проверок называются `check:*`, а не `lint:check`: скрипт `lint` запускает все `lint:*`
по маске, и проверочный скрипт с таким префиксом попал бы в него.

---

## Структура каталогов

```
mico-client-portal-ui/
├── src/
│   ├── main.ts                 ← bootstrap: Pinia, i18n, QueryClient, initAuth(), HTTP-интерсепторы, router, mount
│   ├── App.vue                 ← корневой выбор экрана: AuthLoader / AuthErrorScreen / AdminLayout + Toaster + TooltipProvider
│   │
│   ├── app/                    ← слой app: всё, что про приложение целиком
│   │   ├── router/index.ts     ← таблица маршрутов (name, meta) + глобальный guard авторизации
│   │   ├── providers/          ← подключение HTTP-интерсепторов и прочих глобальных обработчиков
│   │   └── layouts/admin-layout/  ← каркас: сайдбар, шапка, навигация (строятся из meta маршрутов)
│   │
│   ├── pages/                  ← страницы (по одной на маршрут), тонкая композиция виджетов
│   │   └── <name>-page/        ← <Name>Page.vue + index.ts
│   │
│   ├── widgets/                ← самостоятельные блоки экрана (имя — существительное)
│   │   └── <widget-name>/      ← index.ts + ui/ + model/ + lib/ + config/ + assets/ (только нужные сегменты)
│   │
│   ├── features/               ← действия пользователя (имя — глагол + объект)
│   │   └── <verb-object>/      ← index.ts + ui/ + model/ + lib/ + config/ (только нужные сегменты)
│   │
│   ├── entities/               ← бизнес-сущности
│   │   └── <entity>/
│   │       ├── index.ts
│   │       ├── @x/             ← (при необходимости) типы для других сущностей
│   │       ├── api/            ← <name>-api.ts (вызовы бэка) + types.ts (DTO)
│   │       ├── model/          ← queryKeys.ts, useXxx.ts (query-composables), store.ts, types.ts (UI-типы)
│   │       ├── lib/            ← чистые функции: валидация, сборка тела запроса, форматтеры
│   │       ├── config/         ← константы, справочники, моки MOCK_*
│   │       ├── ui/<component>/ ← отображение сущности (бейдж статуса, иконка типа)
│   │       └── assets/
│   │
│   └── shared/                 ← переиспользуемое, без знания о домене
│       ├── api/                ← apiClient, getHttpStatus, isClientError, generated/ (типы из OpenAPI)
│       ├── config/             ← api.ts (API_URL), env.ts (IS_DEV, фича-флаги), routes.ts (ROUTE_NAMES)
│       ├── i18n/               ← createI18n, setAppLocale/getAppLocale/toIntlLocale, locales/ru.ts|en.ts
│       ├── lib/                ← чистые утилиты (downloadBlob, getContentDispositionFilename, router/createQueryPatch)
│       ├── ui/app-*/           ← дизайн-система: AppButton, AppModal, AppDrawer, AppIcon, ...
│       └── assets/
│           ├── icons/ui/       ← исходные SVG иконок (Figma) — вход для спрайта
│           ├── images/
│           └── styles/         ← main.css, base/globals.css, tokens/*.css
│
├── docs/fsd-debt.md            ← известные отклонения от манифеста (не копировать)
├── scripts/build-icon-sprite.mjs
├── helm/                       ← чарт-обёртка над mico-app (values.yaml / values-dev.yaml / values-prod.yaml)
├── Dockerfile · nginx.conf · .gitlab-ci.yml
├── eslint.config.ts · .oxlintrc.json · .prettierrc.json · .editorconfig
└── vite.config.ts · vitest.config.ts · tsconfig.*.json · env.d.ts
```

Алиас `@/*` → `src/*` (в `vite.config.ts` и `tsconfig.app.json`).

---

## Слои FSD и правила импорта

Проект построен по **Feature-Sliced Design**. Слои снизу вверх:

```
shared → entities → features → widgets → pages → app
```

| Слой | Что лежит | Может импортировать |
|---|---|---|
| `shared` | дизайн-система, apiClient, i18n, утилиты, токены — **без доменных понятий** | только `shared` |
| `entities` | бизнес-сущность: API и DTO, query-composables, доменные правила, отображение сущности | `shared` (+ `@x` других сущностей, см. ниже) |
| `features` | действие пользователя: UI действия, мутация, реакция (тост, закрытие, навигация) | `entities`, `shared` |
| `widgets` | самостоятельный блок экрана, собранный из фич и сущностей | `features`, `entities`, `shared` |
| `pages` | страница маршрута — композиция виджетов + страничная логика (онбординг, редирект) | `widgets`, `features`, `entities`, `shared` |
| `app` | роутер, layout, глобальные провайдеры | все слои |

Правила:

- **Импорт только вниз.** Слой не знает о слоях выше себя (`shared` не импортирует из `entities`, `entities` — из `features` и т.д.).
- **Нет кросс-импортов внутри слоя.** Слайс не импортирует соседний слайс того же слоя (`widgets/a` → `widgets/b`, `features/a` → `features/b` запрещено). Если двум виджетам нужен общий блок — он опускается в `features`/`entities`/`shared`, либо композицию делает слой выше (страница).
- **Ссылки между сущностями — только через `@x` и только типы.** Если сущности нужен тип другой сущности (прогон → сервис, датасет → продукт), сущность-владелец публикует его в `entities/<owner>/@x/<consumer>.ts`, а потребитель импортирует `@/entities/<owner>/@x/<consumer>`. Через `@x` экспортируются только типы (`export type`); логику и компоненты между сущностями не передаём — это композиция в `features`/`widgets`. Типы не дублируем.
- **Только через публичный API.** Снаружи слайса импортируем только из его `index.ts` (или `@x`): `@/entities/dataset`, а не `@/entities/dataset/model/types`.
- **Исключение — `shared`:** у `shared/ui`, `shared/lib`, `shared/config` нет общего барреля, каждый сегмент — самостоятельный модуль: `@/shared/ui/app-button`, `@/shared/lib/downloadBlob`, `@/shared/config/env`. `@/shared/api` и `@/shared/i18n` импортируются через свои `index.ts`.
- **В `shared/api` — только транспорт:** `apiClient`, хелперы разбора ошибок и сгенерированные типы. Вызовы конкретных эндпоинтов (в т.ч. сессия и авторизация) — в `entities/<entity>/api` (`entities/user/api/session-api.ts`).
- **Внутри слайса — относительные импорты** (`../model/useRunHistoryTable`, `./PredictionRunHistoryTable.vue`, `../assets/icon.png`). Свой же слайс по алиасу (`@/entities/dataset/...` изнутри `entities/dataset`) не импортируем.
- **Внутри слайса `model` и `lib` не импортируют из `ui`.** Типы, которые нужны и логике, и компоненту, живут в `model/types.ts`.
- Ключ, который нужен нескольким слоям (например query key для инвалидации из feature), кладём в **самый нижний** слайс, которому он принадлежит.
- Правила слоёв проверяются линтером `steiger` в `check:lint`.

---

## Feature или widget

| | **feature** | **widget** |
|---|---|---|
| Что это | одно действие пользователя, которое приносит ценность | самостоятельный блок экрана |
| Состав | UI действия (кнопка, модалка, форма) + мутация + реакция на результат | собирает несколько фич и сущностей, держит состояние блока (фильтры, пагинация) |
| Имя | глагол + объект: `connect-s3`, `create-api-secret`, `upload-dataset`, `change-password` | существительное: `integration-detail`, `dataset-history-table` |
| Примеры | модалка заявки на подключение, кнопка скачивания результата, переключатель языка | таблица истории загрузок, каталог интеграций, история прогонов |

- Модалка или панель с действием — это **feature**, даже если она большая.
- Виджет кладёт фичи в нужные места своей разметки (кнопка скачивания в строке таблицы, модалка заявки на странице интеграции).
- **В `entities/*/ui` — только отображение сущности** без сценариев: бейдж статуса, иконка типа, карточка данных. Модалки с действием, кнопки с мутацией и UI-реакцией (тосты, навигация) — в `features`.
- `useMutation` в `entities` допустим только как «голая» операция с обновлением кэша, без UI-реакции; сценарий действия вокруг неё — в `features`.

---

## Устройство слайса (сегменты)

Стандартные сегменты FSD. Критерий выбора сегмента — **природа кода**, а не тип файла:

| Сегмент | Что лежит | Примеры |
|---|---|---|
| `ui/` | `.vue`-компоненты | `IntegrationCard.vue`, `PredictionRunHistorySkeleton.vue` |
| `model/` | то, где есть реактивность, состояние или Vue/TanStack: composables, query keys, Pinia-store, UI-типы | `useRunHistoryTable.ts`, `queryKeys.ts`, `store.ts`, `types.ts` |
| `lib/` | чистые функции «вход → выход» без Vue: мапперы DTO → UI, форматтеры, валидация, сборка тела запроса | `mapper.ts`, `format.ts`, `fileValidation.ts`, `connectionRequest.ts` |
| `config/` | статические данные без логики: константы, справочники, моки `MOCK_*` | `constants.ts`, `displayNames.ts`, `mocks.ts` |
| `api/` | только в `entities`: вызовы бэка и DTO | `product-api.ts`, `types.ts` |
| `assets/` | картинки и иллюстрации слайса | `illustrations/rest-api-empty-state.png` |

- **Сегмент создаём, только когда в нём что-то есть.** Пустые `lib/` и `config/` «на будущее» не заводим.
- Каждый сегмент с несколькими файлами имеет `index.ts` с реэкспортом (`export * from './mapper'`).
- **`api/` в `entities`:** `<name>-api.ts` — объект `<name>Api` с вызовами бэка (единственное место, где вызывается `apiClient`); `types.ts` — DTO как алиасы на сгенерированные типы OpenAPI.
- **`ui/`:** компонент, который экспортируется из слайса или переиспользуется, — папкой (`ui/integration-card/IntegrationCard.vue` + `index.ts`); внутренние части корневого компонента виджета — плоско (`ui/PredictionRunHistoryTable.vue`).
- Тесты — в `__tests__/` внутри сегмента (`lib/__tests__/mapper.spec.ts`).

**`index.ts` слайса** — публичный API:

```ts
// entities/<entity>/index.ts
export { productApi } from './api/product-api';
export type * from './api/types';
export * from './model';
export * from './ui/connection-status-tag';

// widgets/<widget>/index.ts — наружу только корневой компонент (и типы, если нужны снаружи)
export type { PredictionRunRecord } from './model/types';
export { default as PredictionRunHistory } from './ui/PredictionRunHistory.vue';
```

- Компоненты экспортируем **именованно**: `export { default as AppButton } from './AppButton.vue'`. `export default` из `index.ts` не используем.

---

## Нейминг

| Что | Правило | Пример |
|---|---|---|
| Папка слайса / сегмента ui | kebab-case | `prediction-run-history`, `ui/connection-status-tag/` |
| Слайс feature | глагол + объект | `connect-s3`, `download-invoice` |
| Слайс widget | существительное | `integration-detail`, `invoice-history` |
| Папка страницы | `<name>-page` | `datasets-page` |
| Vue-компонент | PascalCase, имя файла = имя компонента | `PredictionRunHistory.vue` |
| Компонент дизайн-системы | префикс `App` | `AppButton`, `AppModal` |
| Страница | суффикс `Page` | `DatasetsPage` |
| Части виджета | префикс = имя виджета | `PredictionRunHistorySkeleton`, `DatasetHistoryToolbar` |
| Файл API | kebab-case, `<name>-api.ts` | `ml-service-run-api.ts` |
| Объект API | `<name>Api` | `mlServiceRunApi`, `datasetApi` |
| Методы API | глагол + сущность: `get*`, `list*`, `download*`, `upload*`, `request*`, `create*`, `delete*` | `getProducts`, `downloadPrediction` |
| Фабрика query keys | `<entity>Keys` в `model/queryKeys.ts` | `productKeys.list()`, `datasetKeys.history(filters)` |
| Composable | `use<Thing>`, файл = имя функции | `useRunHistoryTable.ts` |
| Pinia-store | `use<Name>Store`, id — camelCase | `useUserStore` (`'user'`), `useUploadDatasetStore` |
| Модули в `lib/`, `config/` | camelCase | `connectionRequest.ts`, `displayNames.ts` |
| Константы | UPPER_SNAKE_CASE | `PREDICTIONS_POLLING_INTERVAL`, `RUN_HISTORY_PAGE_SIZE` |
| Маппер | `map<From>To<To>` / `to<Something>` | `mapServiceRunToRunRecord`, `toErrorsReportFileName` |
| Тип DTO | имя схемы бэка без `Schema` | `MLServiceRunListItem`, `PredictionResultListResponse` |
| Тип фильтров запроса | `<Entity>Filters` | `MLServiceRunFilters` |
| Union-статусы | строковый union, не `enum` | `type IntegrationStatus = 'not_configured' \| 'setup_in_progress' \| 'connected'` |
| Имя маршрута | kebab-case, константа в `ROUTE_NAMES` | `ROUTE_NAMES.integrationDetail = 'integration-detail'` |
| Пропсы-флаги | `is*`/`has*` в модели, в пропсах — короткие прилагательные | `disabled`, `expanded`, `submitting`, `clickable` |
| События | camelCase в `defineEmits`, kebab-case в шаблоне | `openUploadDrawer` → `@open-upload-drawer` |
| Ключ localStorage | константа `*_STORAGE_KEY` / `*_KEY`, значение snake_case | `LOCALE_STORAGE_KEY = 'app_locale'` |
| Тест | `<module>.spec.ts` в `__tests__/` рядом с модулем | `lib/__tests__/mapper.spec.ts` |

TypeScript-перечисления (`enum`) не используем — только строковые union-типы и `as const`-объекты/массивы
(`ENVIRONMENT_OPTIONS ... as const` + `typeof X[number]['value']`).

---

## Работа с бэкендом (api-сегмент)

- Все HTTP-вызовы — через `apiClient` из `@/shared/api` (`baseURL = API_URL`, `withCredentials: true`). Новые axios-инстансы не создаём, `fetch` не используем.
- Вызовы живут **только** в `entities/<entity>/api/<name>-api.ts`. Компоненты, composables и сторы axios не трогают.
- **Типы — из OpenAPI.** `npm run api:types` генерирует `src/shared/api/generated/schema.ts`; `shared/api/index.ts` реэкспортирует `export type { components, operations } from './generated/schema'`. В `entities/<entity>/api/types.ts` — алиасы:
  - тело и ответ — `components['schemas']['ProductSchema']`;
  - **query-параметры (фильтры) — тоже из схемы:** `NonNullable<operations['list_products']['parameters']['query']>`.
  
  Ручное описание DTO — только если эндпоинта ещё нет в OpenAPI (с `// TODO:` заменить на сгенерированный тип). Статусы приходят как `enum` из схемы бэка, фронт не угадывает их регэкспами.
- API-объект — плоский объект методов, каждый метод **возвращает промис `AxiosResponse<T>`** (не разворачивает `.data`) — развёртка делается в `queryFn`/вызывающем коде.
- У каждого метода — однострочный JSDoc: что делает, неочевидные коды ответа (`409 — an active request already exists`).
- Списки принимают `params?: <Entity>Filters` и `signal?: AbortSignal` и пробрасывают `signal` в axios — TanStack Query отменяет устаревшие запросы.
- Фильтры-множества передаём строкой через запятую (`product_id__in: ids.join(',')`) — так ожидает бэк (fastapi-filter `__in`).
- Скачивание файлов: `responseType: 'blob'`; имя файла — из `Content-Disposition` через `getContentDispositionFilename(...)`, своё имя — только как fallback; сохранение — `downloadBlob(blob, filename)`.
- Загрузка файлов: `FormData` + `'Content-Type': 'multipart/form-data'` + `onUploadProgress`.

```ts
export const mlServiceRunApi = {
  /** List ML service runs of the current project (including processing / error) */
  getMLServiceRuns(params?: MLServiceRunFilters, signal?: AbortSignal) {
    return apiClient.get<MLServiceRunListResponse>('/ml-service-runs', { params, signal });
  },
};
```

---

## Серверное состояние (TanStack Query)

Всё, что пришло с бэка, — это **кэш TanStack Query**, а не Pinia и не `ref` в компоненте.

- `QueryClient` создаётся один раз в `main.ts`: `refetchOnWindowFocus: false`; **ретраи только для сетевых сбоев и 5xx** (4xx не повторяем — повтор не поможет): `retry: (count, error) => count < 1 && !isClientError(error)`. Переопределяем точечно в конкретном запросе с комментарием «почему».
- **Query-composable сущности** — в `entities/<entity>/model/useXxx.ts` (`useProducts`, `useDatasetTemplates`, `useIntegrationStatus`). Он владеет ключом и `queryFn` и безопасно вызывается из нескольких виджетов — запрос и поллинг идут один раз на всех подписчиков. Composable **уровня виджета** (`useRunHistoryTable`) собирает из них данные конкретного экрана. Один и тот же эндпоинт не запрашивается в обход composable сущности.
- `queryFn` разворачивает ответ: `const response = await api.getX(params, signal); return response.data;`.
- **Ключи — только через фабрику сущности** в `model/queryKeys.ts`. Иерархия от общего к частному, чтобы инвалидация по префиксу работала предсказуемо:

  ```ts
  export const productKeys = {
    all: ['products'] as const,
    list: () => [...productKeys.all, 'list'] as const,
    requiredFiles: (productId: string) => [...productKeys.all, 'required-files', productId] as const,
  };
  ```

  Реактивные параметры передаются в ключ через `computed(() => productKeys.requiredFiles(id.value))`. Строковые ключи и ключи, собранные по месту, не используем.
- Глобальные фильтры, применимые к данным всегда, — через `select` в composable сущности, чтобы их не видел ни один потребитель.
- Зависимые запросы — `enabled` (реактивный).
- Смена страницы/фильтра без «мигания»: `placeholderData: keepPreviousData`.
- **Поллинг** — `refetchInterval` с именованной константой интервала и комментарием, почему нужен поллинг (нет push-канала) и откуда число (AC/PRD). Условный поллинг — функцией от `query.state.data` (опрашиваем, пока есть незавершённые элементы). Фоновая вкладка не опрашивается (дефолт).
- **Мутации** — `useMutation` в `model/` фичи, которая выполняет действие (см. «Feature или widget»). После успеха — `setQueryData` (если ответ уже содержит новое состояние) или `invalidateQueries({ queryKey: <entity>Keys.all })`. Тосты, закрытие модалки и навигация — в фиче (`onSuccess` / `onError` composable-а фичи или `mutate(vars, { onSuccess, onError })` в её компоненте).
- Параллельные однотипные запросы по списку id — `useQueries`.

---

## Маппинг DTO → UI-модель

- Компоненты не работают с сырыми DTO, если их форма отличается от нужной UI: DTO → UI-модель переводится **чистой функцией-маппером** в `lib/mapper.ts` слайса-потребителя (`mapServiceRunToRunRecord`, `mapProductToIntegrations`).
- UI-модель описывается в `model/types.ts` (`camelCase`, JSDoc на неочевидных полях: откуда берётся, когда `null`).
- Маппер **не вызывает `useI18n`** — функции перевода/форматирования передаются аргументом (`{ productName, serviceName }`, `intlLocale`). Так маппер остаётся чистым и тестируемым, а `computed`, который его вызывает, пересчитывается при смене языка.
- Технические значения бэка (`status`, `source_type`) переводятся в UI-значения через таблицы соответствия `Record<Backend, Ui>` с безопасным дефолтом для неизвестного значения (`?? 'LOADING'`). UI не должен падать на новом значении от бэка.
- **Бизнес-справочники — источник правды бэкенд.** Человекочитаемые названия, ссылки на документацию, видимость сервисов должны приходить с бэка (`display_name`, `docs_url`, скрытое не отдаётся). Фронтовые справочники по slug'ам (`config/displayNames.ts`, `config/docsLinks.ts`, `config/hiddenServices.ts`) — только **fallback**, пока бэк не отдаёт поле: каждый такой справочник помечается `// TODO:` со ссылкой на задачу бэка, новые не заводятся без согласования.
- Каждый маппер покрыт юнит-тестом (`lib/__tests__/mapper.spec.ts`).

---

## Клиентское состояние

Выбор места хранения:

| Что | Где |
|---|---|
| Данные с бэка | TanStack Query |
| Фильтры, сортировка, пагинация, выбранная вкладка списка — всё, что должно пережить перезагрузку и открываться по ссылке | **URL query** |
| Глобальное клиентское состояние (сессия пользователя), процессы, живущие дольше компонента (очередь загрузки файлов) | Pinia (setup-store) |
| Локальное UI-состояние (открыта ли модалка, раскрытые группы, поля формы) | `ref` в компоненте / composable |
| Пользовательские предпочтения устройства (язык, «онбординг уже показан») | `localStorage` через именованный ключ |

**URL как источник истины:**

- Composable `use<Widget>Filters()` в `model/` виджета; имена параметров — в объекте `QUERY_KEYS = { ... } as const`.
- Каждый параметр — `computed({ get, set })` поверх `route.query`; запись — через `createQueryPatch(route, router)` из `@/shared/lib/router/createQueryPatch` (`router.replace`, пустые значения удаляются из URL, массивы склеиваются через запятую).
- Дефолтные значения в URL не пишем (`page=1`, пустой фильтр → параметр отсутствует).
- `get` валидирует сырое значение и возвращает дефолт для мусора (`Number.isInteger(value) && value > 0 ? value : 1`).
- Несколько параметров меняем **одним** вызовом `replaceQuery({...})` — несколько последовательных `set` перетирают друг друга.
- Смена фильтра сбрасывает страницу на первую; смена сортировки — нет. Страница за пределами `total` переводится на последнюю.
- В `watch` по массивам из URL сравниваем сериализованное значение (`types.value.join(',')`), а не ссылку.

**Pinia:**

- Только setup-синтаксис (`defineStore('id', () => { ...; return {...} })`), store живёт в `model/store.ts` своего слайса.
- В сторе — **только клиентское состояние**. Серверные данные в Pinia не загружаются и не дублируются — их отдаёт TanStack Query.
- В setup-сторе работает `inject()`, поэтому `useQueryClient()`, `useRoute()` и `useRouter()` в нём допустимы. **`useI18n()` в сторе не вызываем** — ему нужен экземпляр компонента. В сторе храним ключи i18n, перевод делаем при отображении.
- В `localStorage` не сохраняем несериализуемое (`File`, `Blob`) и то, что должно считаться на бэке (квоты, лимиты). Чтение — `JSON.parse` в `try/catch`.

---

## Vue-компоненты

**Каркас SFC** (порядок блоков `script` → `template` → `style` — проверяется ESLint):

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { DatasetTemplate } from '@/entities/dataset';
import { AppButton } from '@/shared/ui/app-button';

const props = withDefaults(
  defineProps<{
    template: DatasetTemplate;
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  },
);

const expanded = defineModel<boolean>('expanded', { default: false });

const emit = defineEmits<{
  upload: [files: File[]];
}>();

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  ...
</template>
```

Правила:

- Только `<script setup lang="ts">` + Composition API. Options API не используем.
- Имя компонента берётся из имени файла; `defineOptions({ name })` нужен только если имя должно отличаться от файла.
- Пропсы — типизированный generic `defineProps<{...}>()`; дефолты — `withDefaults`. Тип пропсов, нужный снаружи, выносится в `<Component>.types.ts` (`AppSwitchProps`) и реэкспортируется из `index.ts`. **Типы из `.vue`-файлов не экспортируем.**
- **`v-model` — через `defineModel`** (`const page = defineModel<number>('page', { required: true })`). Пара `modelValue` / `update:modelValue` вручную — только если запись требует нетривиальной логики (преобразование, валидация перед emit).
- События — `defineEmits` в tuple-синтаксисе с именованными аргументами (`submit: [request: RestApiConnectionRequest]`). В шаблоне вызываем `emit(...)`, а не `$emit(...)`.
- Компонент дизайн-системы, оборачивающий нативный элемент, — `inheritAttrs: false` + `v-bind="$attrs"` на целевом элементе.
- `useI18n({ useScope: 'global' })` — всегда с глобальным скоупом.
- Роутер и сторы — только через `useRoute()` / `useRouter()` / `useXxxStore()` в `setup`; глобалы `$route`, `$router` в шаблоне не используем.
- **Логика — в composable, не в компоненте.** Корневой компонент виджета деструктурирует результат своего `use<Widget>()` и раскладывает по дочерним компонентам. В компоненте остаются только обработчики UI и локальное состояние вида.
- **Страница тонкая:** композиция виджетов + страничная логика (онбординг, редирект при невалидном параметре). Запросов к бэку на странице нет.
- Тернарный оператор — только для вычисления значения; ветвление с побочными эффектами — `if/else`.
- Обработчик события, у которого функция принимает свои аргументы, вызываем явно: `@retry="refetch()"`, а не `@retry="refetch"` (иначе аргументы события уйдут в функцию).
- Списки — всегда со стабильным `:key` (id сущности, а не индекс; исключение — массив полей формы без id).
- Формы: `<form @submit.prevent>`, кнопка отправки вне формы связывается через `form="<id>"`; ошибку поля показываем после `blur` (touched); форма сбрасывается в `watch` на открытие модалки; кнопка отправки `disabled` при невалидной форме и во время `submitting` (+ спиннер `loader-2-line animate-spin`).
- Таймеры/подписки (`setInterval`, `addEventListener`) обязательно снимаются в `onUnmounted`.
- **Доступность:** кликабельное — только `<button>`, `<a>`/`RouterLink` или radix-примитив (не `div @click`); интерактивный элемент внутри другого интерактивного не вкладываем; у кнопки без текста — `aria-label` через `t()`. Проверяется `eslint-plugin-vuejs-accessibility`.
- Шаблон: атрибуты по порядку `vue/attributes-order`; при переносе — один атрибут на строку; все теги самозакрывающиеся, если без содержимого (`<div />`, `<AppIcon ... />`).

---

## Состояния экрана: загрузка, ошибка, пусто

Каждый виджет, грузящий данные, явно обрабатывает четыре состояния — отдельными компонентами в `ui/`:

```vue
<PredictionRunHistorySkeleton v-if="isLoading" />
<PredictionRunHistoryErrorState v-else-if="isError" @retry="refetch()" />
<template v-else-if="hasData"> ... </template>
<PredictionRunHistoryEmptyState v-else />
```

- `isError` — только когда **данных нет совсем**: `computed(() => isRequestError.value && !data.value)`. Упавший фоновый поллинг не прячет уже показанные данные.
- Скелетон повторяет геометрию реального контента (на `AppSkeleton`), чтобы не было скачка вёрстки.
- Различаем «данных нет вообще» (empty state с CTA) и «по фильтру ничего не найдено» (сообщение + «Сбросить фильтры»).
- Пустое состояние не показываем, пока идёт первая загрузка (иначе мигает).
- Фоновое обновление — ненавязчивый индикатор, без скелетона.

---

## Дизайн-система (shared/ui)

Перед тем как сверстать элемент, проверь `shared/ui` — используем то, что есть:

| Компонент | Назначение |
|---|---|
| `AppButton` | кнопки; `variant`: `primary` / `secondary` / `outline` / `ghost`, `size`: `small` / `medium` / `icon` |
| `AppIcon` | иконка из спрайта, `name: IconName` (типизирован) |
| `AppModal` | **базовая модалка**: `v-model:open`, `title`, ширина; слоты default и `#footer`; оверлей, анимации, фокус и a11y внутри |
| `AppConfirmDialog` | подтверждение действия (`variant: warning / danger`), построен на `AppModal` |
| `AppDrawer` | правая шторка (слоты default + `#footer`) |
| `AppDropdown` + `AppDropdownItem` | меню по клику (слот `#trigger`) |
| `AppFilter` | фильтр-дропдаун single/multiple (`FilterOption[]`) |
| `AppTooltip` | подсказка (иконка-«i» или обёртка над слотом при `:icon="false"`) |
| `AppPagination` | пагинация (`v-model:page`, фиксированный `pageSize`) |
| `AppEmptyState` | пустое состояние с иллюстрацией и слотом `#action` |
| `AppSkeleton`, `AppStatusBadge`, `AppSwitch`, `AppCheckbox`, `AppCard`, `AppBanner`, `AppScrollArea`, `AppSourceCard` | по названию |

Правила компонента дизайн-системы:

- Папка `shared/ui/app-<name>/`: `App<Name>.vue`, опционально `App<Name>.types.ts` (экспортируемые типы пропсов), `lib/` (чистая логика с тестами, как `getPaginationRange`), `index.ts` с именованным реэкспортом.
- Компонент **не знает о домене**: никаких сущностей, API, стора. Всё — через пропсы, события, слоты.
- Варианты и размеры — `computed`, возвращающий массив классов через `switch` по пропсу (см. `AppButton`). CVA и подобные библиотеки не подключаем.
- **Интерактивные примитивы строим на `radix-vue`** (поведение + доступность), сверху — свои Tailwind-стили на токенах.
- **Любая модалка — только на `AppModal`.** Каркас radix-диалога (`DialogRoot`/`DialogOverlay`/`<Transition>`/шапка с закрытием) за пределами `AppModal` и `AppDrawer` не собираем. z-index, оверлей и анимации задаются только внутри базовых компонентов.
- Дропдауны radix — с `:modal="false"` (иначе radix блокирует скролл body и добавляет padding-right поверх `scrollbar-gutter: stable` — страница дёргается).
- Каждый интерактивный элемент внутри меню — пункт меню: `AppDropdownItem`, а кнопка — `AppDropdownItem as-child` вокруг `AppButton`. radix-меню держит фокус внутри и перебирает стрелками только пункты.
- Компонент реализует **все состояния** своего компонента из UI kit (`02. Master-components`): default, hover, pressed, focus, disabled — по заливке, обводке, тексту, иконке и прозрачности, для каждого размера. Фокус с клавиатуры — кольцо `focus-visible:shadow-(--shadow-focus)` (`state=focus` в UI kit), у кастомных кнопок вне `AppButton` — тоже.
- `TooltipProvider` — **один**, в `App.vue`; в компонентах и виджетах провайдеры не создаём. Переход: сначала добавить провайдер в `App.vue`, потом убирать локальные (иначе тултипы перестанут работать).
- Специализированный компонент строим **поверх базового**, а не копированием обвязки.
- Тексты внутри компонента дизайн-системы приходят пропсами (с переводом снаружи) или берутся из `t()` — без захардкоженных строк.
- Ключевые компоненты дизайн-системы покрыты компонентными тестами (см. «Тесты»): варианты, состояния и значения по умолчанию, на которые опираются потребители.
- Изменение компонента дизайн-системы затрагивает все экраны — проверяй все места использования. Изменённые значения по умолчанию (ширина, отступы, высота пункта, цвета варианта) и экраны, которые на них опираются, перечисляем в описании MR.

---

## Стили и дизайн-токены

- Tailwind v4, **CSS-first**: тема и токены — в `src/shared/assets/styles/`:
  - `tokens/colors.css` — примитивы (`--color-neutral-*`, `--color-green-*` ...) и семантика (`--text-*`, `--bg-*`, `--icon-*`, `--border-*`, `--shadow-*`, статусы, бейджи);
  - `tokens/typography.css` — шрифты и типографическая шкала (`--text-title-*`, `--text-body-*`, `--text-element-*`);
  - `tokens/radius.css`, `tokens/layout.css`; `tokens/theme.css` — проброс в `@theme` для утилит Tailwind;
  - `base/globals.css` — глобальные правила (scrollbar-gutter, cursor, стили тостов).
- `tailwind.config.js` (формат Tailwind v3) и stylelint не используются — всё через CSS и утилиты.
- Токены используются через синтаксис arbitrary-property: `bg-(--bg-surface-primary)`, `text-(--text-secondary)`, `rounded-(--radius-lg)`, `shadow-(--shadow-panel)`, `border-(--border-default)`.
- Типографика — утилитами шкалы: `text-body-sm`, `text-body-xs`, `text-title-sm`, `text-element-button`, `text-element-tag` (+ `font-medium`, `font-mono`, `uppercase`, где требует макет).
- В компонентах используем **семантические** токены (`--text-primary`, `--bg-badge-success`), а не примитивы палитры (`--color-neutral-400`) — примитивы допустимы только внутри дизайн-системы.
- **Токены называются как переменные Figma.** Значение, привязанное в макете к переменной, в коде — токен с тем же именем: `bg/button/secondary` → `--bg-button-secondary`, `default/default-foreground` → `--default-foreground`. Новый токен повторяет цепочку алиасов Figma: семантический ссылается на семантический или примитив (`--bg-scrollbar-thumb: var(--text-disabled)`).
- **Запрещено:** хардкод цветов (`text-[#668948]`, hex в `style` и в JS-константах), инлайн `style="..."` для статичных стилей, произвольные цвета Tailwind (`bg-red-50`). Нужного токена нет — добавь его в `tokens/colors.css` с именем переменной Figma (если переменной нет — с именем по смыслу). Canvas/JS читает цвета токенов через `getComputedStyle`.
- **Значения переносим такими, какими они отрисованы в Figma:**
  - прозрачность слоя-группы — одна `opacity` на обёртке всей группы, а не на каждом дочернем элементе (иначе дочерние элементы просвечивают друг через друга);
  - обводка внутрь (`strokeAlign: INSIDE`) — `ring-1 ring-inset`: она, как и в Figma, не меняет размер элемента;
  - итоговый цвет = цвет заливки × прозрачность заливки × прозрачность слоя и всех его родителей.
- Размеры — шкала Tailwind (`w-120`, `size-4.5`, `gap-1.5`), произвольные `[123px]` — только если значения нет в шкале.
- `:style` допустим только для действительно динамических значений (ширина прогресс-бара в %).
- **Условные классы — массив/объект в `:class`** (`:class="[base, cond && 'x']"`). Хелпер `cn` не используем.
- `<style>`-блоки в SFC не используем — всё утилитами; глобальное — в `base/globals.css`.
- Тёмной темы нет. Тост-контейнер — `theme="dark"` (так требует макет).

---

## Иконки и ассеты

- **Иконки — только через `AppIcon`** и SVG-спрайт дизайн-системы. Цвет — `currentColor` (задаётся `text-*`), размер по умолчанию 16px, меняется `size-*`.
- Новая иконка: экспорт из Figma в `src/shared/assets/icons/ui/<name>.svg` → `npm run icons:sprite` → в коммит идут исходник, `shared/ui/app-icon/assets/sprite.svg` и сгенерированный `iconNames.ts` (руками не редактировать).
- Сторонние иконочные пакеты (`lucide-vue-next` и т.п.) не используем — набор иконок задаёт дизайн-система.
- Картинки/иллюстрации слайса — в его `assets/`, импортируются относительно (`../assets/illustrations/x.png`). Общие — в `shared/assets/images/`.
- SVG как картинка — обычный импорт (URL); как компонент — суффикс `?component` (`vite-svg-loader`).
- Декоративное изображение — `alt=""`, иконка — `aria-hidden` (уже в `AppIcon`); у кнопки без текста — `aria-label` через `t()`.

---

## Локализация (i18n)

- Языки — `ru` (по умолчанию и fallback) и `en`. Выбор сохраняется в `localStorage` (`setAppLocale`).
- Словари — `src/shared/i18n/locales/ru.ts` и `en.ts`. `ru.ts` — **эталон схемы** (`export type MessageSchema = typeof ru`), `en.ts` типизирован `MessageSchema` — TypeScript не даст забыть перевод. Новый ключ добавляется **в оба файла сразу**.
- Ключи сгруппированы по домену/странице: `auth.*`, `layout.*`, `datasets.*`, `predictions.*`, `integrations.*`, `pagination.*`. Внутри — по блокам экрана (`datasets.table.emptyNotFound.title`).
- **Любой текст, видимый пользователю** (лейблы, плейсхолдеры, `aria-label`, `alt`, тосты, тексты ошибок, дефолтные подписи компонентов дизайн-системы), — через `t()`. Хардкод строк в шаблоне, в `toast.*` и в константах запрещён; проверяется правилом `@intlify/vue-i18n/no-raw-text` (с исключениями для служебных символов — см. «Линтинг»).
- В компонентах и composables — `useI18n({ useScope: 'global' })`. Вне `setup` (модули `lib/`, `config/`) — `i18n.global.t` только в функциях, которые вызываются при рендере, а не при импорте модуля.
- В состоянии (store, очередь, ошибки валидации) храним **ключ** i18n, а не готовый текст — перевод делаем при отображении, чтобы смена языка подхватывалась.
- Не переводятся: технические названия типов данных (совпадают со Swagger), названия продуктов из макета, названия языков в переключателе. Такое решение фиксируется комментарием рядом со справочником.
- Интерполяция — именованными параметрами: `t('datasets.validation.uploadFailedFile', { fileName })`.
- Неразрывные пробелы из текста макета переносим в словарь escape-последовательностью `\u00a0` (так он виден в коде и на ревью) с комментарием рядом: они задают, где строка переносится.

---

## Даты, числа, форматирование

- Отображение дат и чисел — `Intl.DateTimeFormat` / `toLocaleString` с локалью `toIntlLocale(locale.value)` из `@/shared/i18n` (`ru-RU` / `en-US`). Хардкод локали (`'ru-RU'`, `'en-GB'`) не используем.
- Формат должен совпадать с макетом — нужный вид собираем через `formatToParts` (убрать «г.», точку после месяца и т.п.).
- `dayjs` — только для арифметики и ключей (`subtract`, `startOf('day')`, `format('YYYY-MM-DD')`), не для отображения.
- Отсутствующее значение показываем как `-` (или `—`, если так в макете), а не пустую строку.
- Функции форматирования — в `lib/format.ts` слайса, чистые, с тестами; `computed`, который их вызывает, зависит от `locale`.

---

## Ошибки и уведомления

- Пользовательские уведомления — `toast.success / toast.error` из `vue-sonner`, текст через `t()`. Тост успеха — с иконкой `check-line` (настроено в `App.vue`).
- HTTP-статус ошибки получаем единым хелпером `getHttpStatus(error)` из `@/shared/api` (внутри — `isAxiosError`). Ожидаемые коды (409 «уже существует» и т.п.) обрабатываются явно и с понятным текстом; остальные — общим сообщением.
- **401 во время работы обрабатывается глобально** response-интерсептором `apiClient`, который подключается в `app/providers/`:
  - подключается **после** `initAuth()` в `main.ts` — на старте 401 от `/user/me` означает «не залогинен», и это обрабатывает guard роутера;
  - игнорирует запрос `/user/me`;
  - не редиректит, если в `useUserStore` есть `authError` (иначе обходится защита от цикла и экран `AuthErrorScreen`);
  - вызывает `login()` один раз (защита от повторного срабатывания при нескольких параллельных 401).
- Локально 401 не обрабатываем.
- Действие, результат которого пользователь может не увидеть (шторка уже закрыта), дублируем тостом.
- Ошибку не глотаем молча: либо тост/инлайн-ошибка, либо error-state. `console.*` в коде приложения не оставляем (ESLint `no-console`).
- Ошибки валидации формы — инлайн под полем (`text-xs text-(--text-error)`), поле — `aria-invalid` + `ring-(--border-error)`.

---

## Авторизация и роутинг

- Авторизация — cookie-сессия бэка (OIDC через Authentik). На старте `main.ts` вызывает `useUserStore().initAuth()` (`GET /user/me`) **до** монтирования и подключения роутера. Истечение сессии во время работы ловит интерсептор 401 (см. «Ошибки»).
- `login()` / `logout()` — полный редирект браузера на `${API_URL}/authorization/login` (в dev — с `frontend=local`) / по `authentik_logout_url`.
- `App.vue` выбирает экран: `AuthLoader` (идёт проверка) → `AuthErrorScreen` (бэк вернул `?auth=error&error=<код>`) → `AdminLayout`.
- **Маршруты** — в `app/router/index.ts`:
  - страницы подключаются **лениво**, с учётом именованного экспорта страницы: `component: () => import('@/pages/billing-page').then((m) => m.BillingPage)`;
  - у каждого маршрута есть `name` из `ROUTE_NAMES` (`@/shared/config/routes` — чтобы навигацию по имени могли использовать все слои); навигация — **по имени** (`router.push({ name: ROUTE_NAMES.integrations })`, `<RouterLink :to="{ name: ... }">`), строковые пути в коде не используем;
  - `meta` маршрута — единый источник для каркаса: `requiresAuth`, `titleKey` (ключ i18n заголовка в шапке), `nav: { labelKey, icon, order }` (пункт сайдбара). `AdminHeader` и `SidebarNavigation` строятся из `meta`, а не держат свои списки;
  - последним идёт catch-all `/:pathMatch(.*)*` → страница 404 (или редирект на раздел по умолчанию).
- Глобальный `beforeEach` при отсутствии сессии вызывает `login()`; если уже есть `authError` — не редиректит повторно (иначе бесконечный цикл при живой сессии Authentik).
- Невалидный параметр маршрута обрабатывает страница: `router.replace` на родительский раздел.
- Внешние ссылки — `<a target="_blank" rel="noopener noreferrer">`.

---

## Конфигурация, env и фича-флаги

- Переменные окружения — только `VITE_*`, читаются **только** в `shared/config/*` и экспортируются константами (`API_URL`, `IS_DEV`, `IS_PROD`, `FEATURE_*`). В остальном коде `import.meta.env` не используем.
- **`VITE_API_URL` — относительный путь `/api`.** UI и API во всех окружениях живут на одном хосте (`/api` проксируется на `client-portal-api` HTTPRoute'ом gateway), поэтому один образ работает и на dev, и на prod. Абсолютные адреса в закоммиченных `.env` не держим.
- Локальная разработка: `server.proxy` в `vite.config.ts` проксирует `/api` на dev-бэкенд; персональные переопределения — `.env.local` (в `.gitignore`).
  - **Порядок перехода:** сначала добавить `server.proxy` и проверить вход в dev (`frontend=local`) и работу cookie сессии через прокси (домен и `SameSite` — согласовать с бэкендом), только потом менять `VITE_API_URL` на `/api`. Иначе ломается локальная разработка.
- Фича-флаг: `export const FEATURE_<NAME> = import.meta.env.VITE_FEATURE_<NAME> === 'true';` в `shared/config/env.ts` с JSDoc — что закрывает, почему выключено, тикет, как включить локально (`.env.local`). По умолчанию выключен.
- Секретов во фронтенде нет и быть не может.

---

## Моки и скрытые фичи

Экраны, для которых ещё нет API, делаются на моках, оформленных так, чтобы замена на реальный API трогала только модель:

- Мок-данные — в `config/mocks.ts` слайса сущности, константы с префиксом `MOCK_` (`MOCK_ORGANIZATION`), тексты — через ключи i18n.
- Мутации над моками — временный Pinia-store сущности с той же сигнатурой, какой будет API, с комментарием, что это мок и до какого этапа. Это временное решение, а не образец для работы с серверными данными.
- Компоненты не знают, мок это или API, — переход на реальный бэк меняет только модель/composable.
- **Скрываем фичи только фича-флагом.** Готовый, но вырезанный из скоупа UI остаётся подключённым к странице/маршруту за `FEATURE_*`, а не «отвязывается» и не лежит мёртвым кодом. Код, который не используется и не находится за флагом, удаляется.

---

## Требования и макеты

- Источники требований — задача Jira, PRD/RFC в Confluence и макет Figma. Узел Figma указывается в задаче и в комментарии в коде у нетривиальной вёрстки.
- **Расхождение источников — сначала вопрос, потом код.** Если PRD, RFC, макет или поведение API противоречат друг другу или постановке — пишем вопрос в задаче (что расходится, варианты, предлагаемое решение) и ждём ответа. Продуктовое поведение молча не выбираем и «как лучше» без согласования не делаем.
- Дополнение к требованиям в ходе работы оформляется отдельной задачей или явным изменением текущей.
- **Приоритет источников вёрстки: UI kit, затем кадр экрана.** Вид и состояния компонента берём из UI kit (страницы `01. UI-kit` и `02. Master-components`), кадр экрана показывает, какой компонент, с каким содержимым и где. Кадр, который расходится с UI kit, — вопрос дизайнеру.
- Эталон экрана — кадр того состояния, которое выпускаем: кадры намеренно скрывают части (например, элемент за фича-флагом).
- **Самопроверка по макету перед сдачей** — обязательна (чек-лист в DoD): тексты и подписи, пустые и ошибочные состояния, модалки, иконки, скругления и отступы, состояния (hover, pressed, focus, disabled), навигация с клавиатуры (Tab, Enter, стрелки, Esc), обе локали. Цвета и размеры сверяем по числам из Figma (итоговые значения), а не на глаз.

---

## Комментарии в коде

- **Язык комментариев — английский**: `//`, JSDoc, `<!-- -->`, CSS-комментарии, комментарии в конфигах. Тексты для пользователя — не комментарии, они идут через i18n.
- Существующие русские комментарии массово не переводим. Комментарий переводится, когда правится строка кода, к которой он относится.
- Комментарий объясняет **«почему»**, а не «что»: скрытое ограничение, баг библиотеки, решение PM/дизайна, договорённость с бэком. Комментарий-пересказ кода не пишем.
- Привязываем к источнику решения: тикет (`WT-448`, `ML-2866`), узел Figma (`mockup 1221:200577`), решение PM с датой (`PM decision, 2026-09-30`), AC из PRD.
- JSDoc (`/** ... */`) — на методах API, экспортируемых функциях `lib/`, неочевидных полях типов и пропсах.
- Комментарии в шаблоне `<!-- -->` — для разметки, зависящей от макета или обходящей баг (например, почему `:modal="false"`).
- Временные решения помечаются `// TODO:` с причиной и условием снятия (и тикетом, если есть).

---

## Тесты

- Vitest. **Окружение по умолчанию — `node`** (в `vitest.config.ts`); тестам, которым нужен DOM (монтирование компонентов, composables с `createApp`), окружение включается в начале файла: `// @vitest-environment jsdom`.
- Тесты лежат в `__tests__/` **рядом с тестируемым модулем**: `lib/__tests__/mapper.spec.ts`, `shared/ui/app-modal/__tests__/AppModal.spec.ts`.
- Обязательно покрываем:
  - `lib/` слайсов: мапперы DTO → UI, форматирование дат/чисел, доменные правила (валидация, сборка тела запроса); утилиты `shared/lib`;
  - чистую логику компонентов дизайн-системы (`getPaginationRange`);
  - **компонентными тестами** (`@vue/test-utils`) — ключевые компоненты `shared/ui` (`AppModal`, `AppButton`, `AppPagination`, `AppFilter`): рендер вариантов, события, `v-model`, доступность.
- Composable с `useI18n` — через общий хелпер `withSetup` (создать app, подключить `i18n`, смонтировать) из `shared/lib/test/withSetup.ts`.
- Структура — `describe(<имя функции/компонента>)` + `it(<сценарий>)`; `it.each` для табличных проверок. **Описания сценариев — на английском.** Кейсы из макета/тикета помечаем ссылкой (`as in mockup 52:3936`, `WT-511`).
- Паттерн Arrange → Act → Assert, проверки через `expect`.
- Сетевые вызовы в юнит-тестах не делаем — тестируем логику, вынесенную в `lib/`.

---

## Линтинг и форматирование

- Перед MR и в CI код обязан проходить: `npm run type-check`, `npm run check:lint`, `npm run check:format`, `npx vitest run`.
- Локально — `npm run lint` (с `--fix`) и `npm run format`.
- `lint` = oxlint (correctness) → ESLint (Vue/TS/импорты/a11y/i18n); `check:lint` дополнительно запускает `steiger` (правила FSD: слои, кросс-импорты, публичный API, сегменты). ESLint-правила, на которые чаще всего натыкаемся:
  - `simple-import-sort` — импорты сортируются автоматически (группы: внешние пакеты → `@/` → относительные, `import type` — рядом со своим модулем); руками не упорядочиваем;
  - `unused-imports` — неиспользуемые импорты — ошибка, переменные — предупреждение (неиспользуемый аргумент — префикс `_`);
  - `vue/block-order` (`script` → `template` → `style`), `vue/attributes-order`, `vue/max-attributes-per-line` (однострочно ≤ 2, при переносе — по одному), `vue/html-self-closing`;
  - `vuejs-accessibility/*` — доступность разметки; radix-компоненты, которые сами отдают роль и обработку клавиатуры, добавляются в настройки правила как интерактивные;
  - `@intlify/vue-i18n/no-raw-text` — сырой текст в шаблоне; служебные символы (`-`, `—`, `·`, `/`, `%`, `…`) — в списке исключений правила;
  - `no-console`, `no-debugger` — предупреждения, перед MR — ноль.
- Prettier: одинарные кавычки, точки с запятой, ширина 100. `.editorconfig`: 2 пробела, LF, финальная пустая строка.
- `noUncheckedIndexedAccess` включён: доступ по индексу/ключу — `T | undefined`, обрабатываем `?.` / `??` / проверкой, а не `!`.
- `any` не используем; для внешних данных неизвестной формы — `unknown` + сужение.

---

## Деплой и CI/CD

Конфигурация инфраструктуры — стандарт mico, менять только осознанно и согласованно с DevOps.

**Окружения:**

| Ветка / событие | Окружение | Хост |
|---|---|---|
| merge в `develop` | **dev** | `client-portal-ui.dev.mico.team` |
| тег `vX.Y.Z` на `main` | **prod** | `platform.mico.team` |
| merge в `main` (без тега) | не деплоится, ждёт тега | — |

> ⚠️ **CI пока не приведён к этому флоу:** сейчас dev-стенд UI катится из `main`, а для `develop` пайплайн не настроен (в бэке портала флоу уже правильный: `develop` → dev). Перенастройка — задача DevOps (тикет заведён); до неё не меняй CI самостоятельно и согласовывай целевую ветку MR с командой.

**Пайплайн:**

- **Проверки качества в MR** — джоба `quality` (стадия `test`): `npm ci` → `type-check` → `check:lint` → `check:format` → `vitest run`. MR с красной `quality` не мержится.
- **Dockerfile** — multi-stage: `node:24-alpine` (`npm ci` + `npm run build`) → `docker.io/nginxinc/nginx-unprivileged` (non-root, порт **8080**). Имена образов — полностью квалифицированные (buildah в CI не резолвит short names). В образ не попадают локальные `.env.local`.
- **nginx.conf** — только статика: SPA-fallback на `index.html`, `index.html` без кэша, хэшированные ассеты — `immutable` на год, `/healthz` для проб. Проксирования в nginx нет.
- **Helm** (`helm/`) — обёртка над общим `mico-app`; `values.yaml` (ресурсы, пробы на `/healthz`, `emptyDir` в `/tmp` под `readOnlyRootFilesystem`), `values-dev.yaml` / `values-prod.yaml` (образ, HTTPRoute: `/api` → `mico-client-portal-api:8000` с вырезанием префикса, `/` → UI). Секретов в values нет.
- **GitLab CI** — общие mico-компоненты (сборка образа buildah, зеркалирование в `registry.mico.team`), `helm-lint` в MR, публикация чарта и триггер деплоя на стороне mico.
- Новая переменная `VITE_*` вшивается в сборку на этапе `npm run build` — согласуй её с CI/Docker.

---

## Чеклисты

### Новая страница / раздел

1. `pages/<name>-page/<Name>Page.vue` + `index.ts` (`export { default as <Name>Page } ...`).
2. Имя в `ROUTE_NAMES` (`shared/config/routes.ts`).
3. Маршрут в `app/router/index.ts`: `component: () => import('@/pages/<name>-page').then((m) => m.<Name>Page)`, `name`, `meta` (`requiresAuth`, `titleKey`, `nav`).
4. Ключи `layout.nav.<name>` и `<name>.page.*` в `ru.ts` и `en.ts`.
5. Содержимое — виджетами из `widgets/`.

### Новый эндпоинт / сущность

1. `npm run api:types` — сгенерировать типы; алиасы DTO и фильтров в `entities/<entity>/api/types.ts`.
2. Метод в `entities/<entity>/api/<name>-api.ts` (возвращает `AxiosResponse`, `signal` для списков).
3. Ключи в `model/queryKeys.ts` (фабрика `<entity>Keys`).
4. Query-composable `model/useXxx.ts` (ключ, `queryFn`, при нужде `select`/поллинг).
5. Реэкспорт через `index.ts` сегментов и слайса.
6. UI-модель (`model/types.ts`) + маппер (`lib/mapper.ts`) + тест маппера — в слайсе-потребителе (обычно виджет).

### Новое действие пользователя (feature)

1. `features/<verb-object>/`: `ui/` (кнопка / модалка / форма), `model/use<Action>.ts` (`useMutation` + реакция: тост, инвалидация, закрытие), `index.ts`.
2. Модалка — на `AppModal`; наружу — `v-model:open` и при необходимости событие результата.
3. Форма сбрасывается при открытии; кнопка отправки блокируется при невалидной форме и во время отправки.
4. Фичу встраивает виджет или страница; фича не импортирует другие фичи и виджеты.

### Новый виджет

1. `widgets/<noun>/` с `model/use<Name>.ts`, `model/types.ts`, `ui/<Name>.vue`, `index.ts` (+ `lib/`, `config/` при необходимости).
2. Состояния: `<Name>Skeleton`, `<Name>ErrorState` (`@retry`), `<Name>EmptyState`.
3. Фильтры/пагинация — в URL (`use<Name>Filters` + `QUERY_KEYS`).
4. Действия — фичами из `features/`; другие виджеты не импортировать.

### Новый компонент дизайн-системы

1. Проверить, что аналога нет в `shared/ui`; при наличии макета — сверить с Figma.
2. `shared/ui/app-<name>/App<Name>.vue` (+ `.types.ts`, `lib/`), `index.ts`.
3. Интерактив — на `radix-vue`, стили — токены, варианты — `computed` + `switch`.
4. Компонентный тест в `__tests__/`.
5. Никакой доменной логики.

---

## Эталонный пример (вертикальный срез)

Фича «История счетов» (`Invoice` — иллюстративная сущность): entity → feature → widget → page.
Новую функциональность делать **идентично** по структуре и стилю.

**`entities/invoice/api/types.ts`**
```ts
import type { components, operations } from '@/shared/api';

/** Invoice list item — GET /invoices */
export type InvoiceListItem = components['schemas']['InvoiceListItemSchema'];
export type InvoiceListResponse = components['schemas']['InvoiceListResponseSchema'];
export type InvoiceStatus = InvoiceListItem['status'];
export type InvoiceFilters = NonNullable<operations['list_invoices']['parameters']['query']>;
```

**`entities/invoice/api/invoice-api.ts`**
```ts
import { apiClient } from '@/shared/api';

import type { InvoiceFilters, InvoiceListResponse } from './types';

export const invoiceApi = {
  /** List invoices of the current project */
  getInvoices(params?: InvoiceFilters, signal?: AbortSignal) {
    return apiClient.get<InvoiceListResponse>('/invoices', { params, signal });
  },

  /** Download the invoice PDF */
  downloadInvoice(invoiceId: string) {
    return apiClient.get<Blob>(`/invoices/${invoiceId}/download`, { responseType: 'blob' });
  },
};
```

**`entities/invoice/model/queryKeys.ts`**
```ts
import type { InvoiceFilters } from '../api/types';

export const invoiceKeys = {
  all: ['invoices'] as const,
  list: (filters: InvoiceFilters) => [...invoiceKeys.all, 'list', filters] as const,
};
```

**`entities/invoice/index.ts`**
```ts
export { invoiceApi } from './api/invoice-api';
export type * from './api/types';
export { invoiceKeys } from './model/queryKeys';
```

**`features/download-invoice/model/useDownloadInvoice.ts`**
```ts
import { useMutation } from '@tanstack/vue-query';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';

import { invoiceApi } from '@/entities/invoice';
import { downloadBlob } from '@/shared/lib/downloadBlob';
import { getContentDispositionFilename } from '@/shared/lib/getContentDispositionFilename';

export function useDownloadInvoice() {
  const { t } = useI18n({ useScope: 'global' });

  return useMutation({
    mutationFn: async (invoiceId: string) => {
      const response = await invoiceApi.downloadInvoice(invoiceId);
      const filename =
        getContentDispositionFilename(response.headers['content-disposition']) ??
        `invoice_${invoiceId}.pdf`;
      downloadBlob(response.data, filename);
    },
    onError: () => toast.error(t('billing.invoices.downloadFailed')),
  });
}
```

**`features/download-invoice/ui/DownloadInvoiceButton.vue`**
```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { AppButton } from '@/shared/ui/app-button';
import { AppIcon } from '@/shared/ui/app-icon';

import { useDownloadInvoice } from '../model/useDownloadInvoice';

const props = defineProps<{
  invoiceId: string;
}>();

const { t } = useI18n({ useScope: 'global' });
const { mutate: download, isPending } = useDownloadInvoice();
</script>

<template>
  <AppButton
    variant="ghost"
    size="icon"
    :disabled="isPending"
    :aria-label="t('billing.invoices.download')"
    @click="download(props.invoiceId)"
  >
    <AppIcon
      :name="isPending ? 'loader-2-line' : 'download-line'"
      :class="{ 'animate-spin': isPending }"
    />
  </AppButton>
</template>
```

**`features/download-invoice/index.ts`**
```ts
export { default as DownloadInvoiceButton } from './ui/DownloadInvoiceButton.vue';
```

**`widgets/invoice-history/model/types.ts`**
```ts
import type { InvoiceStatus } from '@/entities/invoice';

export interface InvoiceRecord {
  id: string;
  amount: number;
  status: InvoiceStatus;
  issuedAt: string;
  /** null until the invoice is paid */
  paidAt: string | null;
}
```

**`widgets/invoice-history/lib/mapper.ts`**
```ts
import type { InvoiceListItem } from '@/entities/invoice';

import type { InvoiceRecord } from '../model/types';

export function mapInvoiceToRecord(item: InvoiceListItem): InvoiceRecord {
  return {
    id: item.invoice_id,
    amount: item.amount,
    status: item.status,
    issuedAt: item.issued_at,
    paidAt: item.paid_at,
  };
}
```

**`widgets/invoice-history/model/useInvoiceHistory.ts`**
```ts
import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { invoiceApi, invoiceKeys } from '@/entities/invoice';
import { createQueryPatch } from '@/shared/lib/router/createQueryPatch';

import { mapInvoiceToRecord } from '../lib/mapper';

export const INVOICE_HISTORY_PAGE_SIZE = 20;

const QUERY_KEYS = {
  page: 'page',
} as const;

export function useInvoiceHistory() {
  const route = useRoute();
  const router = useRouter();
  const replaceQuery = createQueryPatch(route, router);

  const page = computed<number>({
    get() {
      const value = Number(route.query[QUERY_KEYS.page]);
      return Number.isInteger(value) && value > 0 ? value : 1;
    },
    set: (value) => replaceQuery({ [QUERY_KEYS.page]: value > 1 ? String(value) : undefined }),
  });

  const filters = computed(() => ({
    limit: INVOICE_HISTORY_PAGE_SIZE,
    offset: (page.value - 1) * INVOICE_HISTORY_PAGE_SIZE,
  }));

  const {
    data: response,
    isLoading,
    isError: isRequestError,
    refetch,
  } = useQuery({
    queryKey: computed(() => invoiceKeys.list(filters.value)),
    queryFn: async ({ signal }) => {
      const result = await invoiceApi.getInvoices(filters.value, signal);
      return result.data;
    },
    placeholderData: keepPreviousData,
  });

  // Error state only when there is no data at all: a failed refetch keeps the table visible
  const isError = computed(() => isRequestError.value && !response.value);

  const records = computed(() => (response.value?.items ?? []).map(mapInvoiceToRecord));
  const totalCount = computed(() => response.value?.total_count ?? 0);
  const hasData = computed(() => records.value.length > 0 || page.value > 1);

  return { records, totalCount, page, hasData, isLoading, isError, refetch };
}
```

**`widgets/invoice-history/ui/InvoiceHistoryTable.vue`** (фрагмент: фича в строке таблицы)
```vue
<script setup lang="ts">
import { DownloadInvoiceButton } from '@/features/download-invoice';

import type { InvoiceRecord } from '../model/types';

defineProps<{
  items: InvoiceRecord[];
}>();
</script>

<template>
  <ul class="flex flex-col gap-1">
    <li v-for="item in items" :key="item.id" class="flex items-center gap-4">
      <!-- ...invoice columns... -->
      <DownloadInvoiceButton :invoice-id="item.id" />
    </li>
  </ul>
</template>
```

**`widgets/invoice-history/ui/InvoiceHistory.vue`**
```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { AppPagination } from '@/shared/ui/app-pagination';

import { INVOICE_HISTORY_PAGE_SIZE, useInvoiceHistory } from '../model/useInvoiceHistory';
import InvoiceHistoryEmptyState from './InvoiceHistoryEmptyState.vue';
import InvoiceHistoryErrorState from './InvoiceHistoryErrorState.vue';
import InvoiceHistorySkeleton from './InvoiceHistorySkeleton.vue';
import InvoiceHistoryTable from './InvoiceHistoryTable.vue';

const { records, totalCount, page, hasData, isLoading, isError, refetch } = useInvoiceHistory();

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <section class="flex w-full flex-col gap-4">
    <h2 class="text-title-sm font-medium text-(--text-primary)">
      {{ t('billing.invoices.title') }}
    </h2>

    <InvoiceHistorySkeleton v-if="isLoading" />
    <InvoiceHistoryErrorState v-else-if="isError" @retry="refetch()" />
    <template v-else-if="hasData">
      <InvoiceHistoryTable :items="records" />

      <AppPagination
        v-model:page="page"
        :total-items="totalCount"
        :page-size="INVOICE_HISTORY_PAGE_SIZE"
      />
    </template>
    <InvoiceHistoryEmptyState v-else />
  </section>
</template>
```

**`widgets/invoice-history/index.ts`**
```ts
export { default as InvoiceHistory } from './ui/InvoiceHistory.vue';
```

**`pages/billing-page/BillingPage.vue`** и **`index.ts`**
```vue
<script setup lang="ts">
import { InvoiceHistory } from '@/widgets/invoice-history';
</script>

<template>
  <div class="flex w-full flex-col gap-10">
    <InvoiceHistory />
  </div>
</template>
```
```ts
export { default as BillingPage } from './BillingPage.vue';
```

**`app/router/index.ts`** (фрагмент)
```ts
{
  path: '/billing',
  name: ROUTE_NAMES.billing,
  component: () => import('@/pages/billing-page').then((m) => m.BillingPage),
  meta: {
    requiresAuth: true,
    titleKey: 'layout.nav.billing',
    nav: { labelKey: 'layout.nav.billing', icon: 'receipt-line', order: 50 },
  },
},
```

**`shared/i18n/locales/ru.ts` / `en.ts`** — ключи `billing.invoices.*` в оба файла.

**`widgets/invoice-history/lib/__tests__/mapper.spec.ts`**
```ts
import { describe, expect, it } from 'vitest';

import { mapInvoiceToRecord } from '../mapper';

describe('mapInvoiceToRecord', () => {
  it('maps the DTO to the UI model', () => {
    expect(
      mapInvoiceToRecord({
        invoice_id: 'inv-1',
        amount: 100,
        status: 'paid',
        issued_at: '2026-10-01T00:00:00Z',
        paid_at: '2026-10-02T00:00:00Z',
      }),
    ).toEqual({
      id: 'inv-1',
      amount: 100,
      status: 'paid',
      issuedAt: '2026-10-01T00:00:00Z',
      paidAt: '2026-10-02T00:00:00Z',
    });
  });
});
```

---

## Definition of Done (перед MR)

**Код:**
- [ ] Код лежит в правильном слое и сегменте FSD (feature — действие, widget — блок экрана; `model` / `lib` / `config` / `api` по природе кода); импорты только вниз, без кросс-импортов внутри слоя, снаружи слайса — только через `index.ts` или `@x`.
- [ ] Паттерны из `docs/fsd-debt.md` не скопированы в новый код.
- [ ] Вызовы бэка — только в `entities/*/api`, типы DTO и фильтров — из OpenAPI, данные с бэка — через TanStack Query, ключи — через фабрику `<entity>Keys`.
- [ ] Фильтры/сортировка/пагинация — в URL.
- [ ] Обработаны состояния loading / error / empty (и «ничего не найдено» для фильтров).
- [ ] Все видимые тексты — через `t()`, ключи добавлены в `ru.ts` и `en.ts`.
- [ ] Только токены дизайн-системы: нет хардкода цветов и статичных `style`; иконки — через `AppIcon`; модалки — на `AppModal`.
- [ ] Новые функции `lib/` и новые компоненты `shared/ui` покрыты тестами.
- [ ] `type-check`, `check:lint`, `check:format`, `vitest run` — зелёные.
- [ ] Нет `console.*`, `debugger`, закомментированного и неиспользуемого кода.
- [ ] Новые `VITE_*` переменные описаны в `shared/config` (и согласованы с CI/Docker).

**Соответствие требованиям:**
- [ ] Самопроверка по макету пройдена: тексты и подписи, пустые и ошибочные состояния, модалки, иконки, скругления и отступы, состояния (hover, pressed, focus, disabled), клавиатура, ru и en.
- [ ] Новые цвета — токены с именами переменных Figma; изменённые значения по умолчанию компонентов `shared/ui` и задетые экраны перечислены в описании MR.
- [ ] В описании MR — ссылки на узлы Figma и скриншоты «макет / реализация» для изменённых экранов.
- [ ] Все расхождения с PRD/RFC/макетом согласованы в задаче (ссылка на ответ), а не решены молча.

---

## Git, ветки и Merge Request

**Флоу:**

```
feature/* , fix/* , chore/*  ──MR──▶  develop  ──релизный MR──▶  main  ──тег vX.Y.Z──▶  prod
                                         │
                                         └──▶ dev-стенд
```

- `develop` — основная ветка разработки, всё вливается в неё; `main` — релизная, в неё попадает только релизный MR из `develop`; прод выкатывается тегом `vX.Y.Z` на `main`.
- `main` и `develop` — защищённые ветки, прямой push запрещён. Защищённые ветки создаются только через веб-UI GitLab.
- Ветки от свежего `develop`; в `develop` мерджим **сквошем**.

**Имена веток:**

| Тип | Шаблон | Когда |
|---|---|---|
| Фича / задача | `feature/<TICKET>[-<slug>]` | новая функциональность и обычные задачи |
| Баг | `fix/<TICKET>[-<slug>]` | исправление ошибки |
| Техническая задача | `chore/<slug>` | зависимости, CI, документация, рефакторинг и перенос слайсов без изменения поведения; тикет необязателен |

- `<TICKET>` — ключ задачи (`WT-…`, `ML-…`); `<slug>` — необязательное короткое описание в kebab-case: `feature/WT-343-integration-secrets`, `fix/WT-538`, `chore/update-deps`.

**Merge Request:**

- **Один MR — одна задача.** Не собираем в один MR несколько тикетов и не копим работу до конца: черновой MR (Draft) открывается в начале работы, изменения пушатся по ходу.
- В MR задачи приводим к манифесту только тронутые файлы; перенос слайсов между слоями/сегментами — отдельный `chore/*` MR.
- **Без самомержа:** MR в `develop` вливается только после ревью и зелёного пайплайна.
- Описание MR: ссылка на задачу, что сделано, как проверить, ссылки на Figma и скриншоты для UI-изменений.

---

## Коммиты

Сообщение коммита — **на английском**, в формате:

```
<TICKET>: <imperative summary>

- <main change 1>
- <main change 2>
```

- **`<TICKET>`** — ключ задачи из имени ветки (`feature/WT-343-...` → `WT-343`). Если тикета нет (`chore/*`) — вместо ключа тип изменения: `chore:`, `docs:`, `ci:`, `refactor:` (`docs: add architecture manifest`).
- **Заголовок** — короткий, в повелительном наклонении (`add` / `fix` / `refactor`), без точки в конце.
- **Тело** — маркированная сводка основных изменений (для нетривиальных изменений обязательно; для мелких можно опустить).
- **Без соавторов.** Не добавлять трейлеры `Co-Authored-By`, подписи `Generated with Claude Code` и любые упоминания AI — автор коммита только пользователь.

---

## Язык общения

- Всегда общаться, объяснять и отвечать на русском языке.
- Код, имена переменных, комментарии в коде и технические термины — на английском; описания и диалог — на русском.

# Архитектурный манифест фронтенда — mico-client-portal-ui

Стандарт архитектуры и стиля клиентского портала MICo: Vue 3 + TypeScript + Feature-Sliced Design.
Claude Code развивает проект по этому документу. Манифест описывает **«как должно быть»**; состав
файлов смотри в самой репе.

**Принципы, которыми решаем спорное:** чистая архитектура (зависимости только вниз, домен отделён от
UI и транспорта), SOLID (одна ответственность у модуля, расширение через пропсы/слоты/композицию, а не
правку базового), DRY (одна модалка, один `apiClient`, типы из одного контракта), **KISS и YAGNI**
(не заводим абстракцию, сегмент или фабрику «на будущее» — только когда есть второй потребитель или
реальная задача). Правила проверяются линтерами, а не только ревью. Манифест — наш рабочий договор:
если правило мешает этим принципам, меняем правило и фиксируем решение здесь.

**Долг.** Код, который не соответствует манифесту, — долг, а не образец. Известные отклонения — в
[`docs/fsd-debt.md`](docs/fsd-debt.md): **эти паттерны не копировать.** В рамках задачи приводим к
манифесту только тронутые файлы; перенос слайса между слоями или сегментами — отдельной задачей.

**Ещё не сделано** (ждёт внешних решений): прокси `/api` в dev и относительный `VITE_API_URL`
(«Конфигурация»), CI-джоба `quality` и флоу `develop` ([`docs/delivery.md`](docs/delivery.md)).
План рефакторинга — [`docs/refactoring-plan.md`](docs/refactoring-plan.md).

Документы рядом: [`docs/reference-slice.md`](docs/reference-slice.md) — эталонный вертикальный срез,
[`docs/checklists.md`](docs/checklists.md) — чеклисты, [`docs/delivery.md`](docs/delivery.md) — git,
коммиты, CI/CD.

---

## Стек

| Назначение | Инструмент |
|---|---|
| Фреймворк | Vue 3.5, Composition API, `<script setup lang="ts">` |
| Язык | TypeScript 6 (strict, `noUncheckedIndexedAccess`) |
| Сборка | Vite 8, `vite-svg-loader`, `vite-plugin-vue-devtools` |
| Стили | Tailwind CSS v4 (CSS-first), дизайн-токены — CSS custom properties |
| Headless-примитивы | `radix-vue` (Dialog, DropdownMenu, Tooltip, Checkbox, Switch, Collapsible, ScrollArea) |
| Серверное состояние | `@tanstack/vue-query` v5 |
| Клиентское состояние | URL query (Vue Router 5) + Pinia 3 (setup-store) |
| HTTP | axios, единый `apiClient` |
| Контракт API | OpenAPI бэка → `openapi-typescript` (`npm run api:types`) |
| Локализация | `vue-i18n` 11 (composition, `legacy: false`), `ru` / `en` |
| Уведомления | `vue-sonner` |
| Даты | `Intl.*` для отображения, `dayjs` для арифметики |
| Графики | `apexcharts` + `vue3-apexcharts` |
| Тесты | Vitest 4 + `@vue/test-utils` (jsdom) |
| Качество | oxlint → ESLint (flat; Vue, TS, импорты, a11y, i18n) → `steiger` (FSD) → Prettier |

Новая зависимость — только если задачу не решают уже подключённые (radix-vue, dayjs, Intl, TanStack
Query); решение фиксируем в манифесте. Неиспользуемые зависимости удаляем.

`openapi-typescript` 7 объявляет peer-зависимость от TypeScript 5; через `overrides` в `package.json`
он использует TypeScript проекта.

## Команды

```sh
npm run dev           # dev-сервер Vite
npm run build         # type-check + production build
npm run check         # всё без --fix: type-check, check:lint, check:format, тесты — перед коммитом
npm run lint          # oxlint --fix, eslint --fix, steiger — локально
npm run format        # prettier --write src/
npm run test:unit     # Vitest (watch); разово: npx vitest run [path]
npm run api:types     # типы API из openapi/openapi.json → src/shared/api/generated
npm run icons:sprite  # пересобрать SVG-спрайт и iconNames.ts
```

Проверочные скрипты называются `check:*`, а не `lint:check`: `lint` запускает все `lint:*` по маске.

---

## Слои FSD и импорты

```
shared → entities → features → widgets → pages → app
```

| Слой | Что лежит | Импортирует |
|---|---|---|
| `shared` | дизайн-система, `apiClient`, i18n, конфиг, утилиты, токены — **без доменных понятий** | только `shared` |
| `entities` | бизнес-сущность: API и DTO, query-composables, доменные правила, отображение сущности | `shared` (+ `@x` других сущностей) |
| `features` | действие пользователя: UI действия, мутация, реакция (тост, закрытие, навигация) | `entities`, `shared` |
| `widgets` | самостоятельный блок экрана из фич и сущностей | `features`, `entities`, `shared` |
| `pages` | страница маршрута — композиция виджетов + страничная логика (редирект, онбординг) | все ниже |
| `app` | роутер, layout, глобальные провайдеры, bootstrap | все |

- **Только вниз**, **без кросс-импортов внутри слоя** (`widgets/a` → `widgets/b` нельзя). Общий блок
  опускается ниже или композицию делает слой выше.
- **Снаружи слайса — только через публичный API** (`index.ts`): `@/entities/dataset`, а не
  `@/entities/dataset/model/types`.
- **`shared`:** у `shared/ui/app-*` и `shared/api`, `shared/i18n`, `shared/config` — свои `index.ts`;
  в `shared/lib` верхнеуровневые файлы импортируются напрямую (`@/shared/lib/downloadBlob`), папки —
  через свой индекс (`@/shared/lib/router`, `@/shared/lib/test`).
- **В `shared/api` — только транспорт:** `apiClient`, разбор HTTP-ошибок, сгенерированные типы.
  Эндпоинты (в т.ч. сессия) — в `entities/<entity>/api`.
- **Ссылки между сущностями — через `@x` и только типы** (`entities/<owner>/@x/<consumer>.ts`,
  `export type`). Логику и компоненты между сущностями не передаём — это композиция выше. Типы не
  дублируем.
- **Внутри слайса — относительные импорты**; свой слайс по алиасу не импортируем.
- `model` и `lib` не импортируют из `ui`. Общие типы — `model/types.ts`.
- Ключ, нужный нескольким слоям (query key для инвалидации из фичи), — в **самом нижнем** слайсе.
- Проверяется `steiger` (`steiger.config.ts`). Выключены `insignificant-slice` (ложные срабатывания,
  противоречит критерию feature/widget) и `segments-by-purpose` (`assets`, `app/providers` оставляем).

## Feature или widget

| | **feature** | **widget** |
|---|---|---|
| Что это | одно действие пользователя с ценностью | самостоятельный блок экрана |
| Состав | UI действия (кнопка, модалка, форма) + мутация + реакция | собирает фичи и сущности, держит состояние блока (фильтры, пагинация) |
| Имя | глагол + объект: `request-integration-connection`, `upload-dataset`, `change-password` | существительное: `integration-detail`, `dataset-history-table` |

- Модалка или панель с действием — **feature**, даже большая. Если у двух вариантов действия общая
  мутация (S3 и REST API), это **одна** фича, а не две (иначе кросс-импорт или копия).
- Компонент, у которого нет действия и одного потребителя (пустое состояние таблицы с кнопкой,
  которая лишь эмитит событие), — внутренний компонент виджета, а не отдельный слайс.
- **`entities/*/ui` — только отображение сущности** (бейдж статуса, иконка типа). Модалки с
  действием и мутации с UI-реакцией — в `features`. `useMutation` в `entities` — только «голая»
  операция с обновлением кэша.

## Сегменты слайса

Критерий — **природа кода**, а не тип файла.

| Сегмент | Что лежит |
|---|---|
| `ui/` | `.vue`-компоненты |
| `model/` | реактивное: composables, Pinia-store, query keys, UI-типы |
| `lib/` | чистые функции без Vue: мапперы DTO → UI, форматтеры, валидация, сборка тела запроса |
| `config/` | статические данные: константы, справочники, имена URL-параметров, моки `MOCK_*` |
| `api/` | только `entities`: `<name>-api.ts` (вызовы) + `types.ts` (DTO-алиасы OpenAPI) |
| `assets/` | картинки слайса |

- **Сегмент создаём, только когда в нём что-то есть.** Пустые сегменты «на будущее» не заводим.
- Сегмент с несколькими файлами — с `index.ts`-реэкспортом.
- `ui/`: компонент, экспортируемый из слайса, — папкой с `index.ts`; внутренние части виджета — плоско.
- Тесты — `__tests__/` рядом с модулем.
- Публичный API слайса — `index.ts`; компоненты экспортируем именованно
  (`export { default as AppButton } from './AppButton.vue'`), типы DTO — `export type * from './api/types'`.

## Нейминг

| Что | Правило | Пример |
|---|---|---|
| Папки слайсов и компонентов | kebab-case | `prediction-run-history`, `ui/connection-status-tag/` |
| Страница | `pages/<name>/ui/<Name>Page.vue`, без суффикса в имени слайса | `pages/datasets` → `DatasetsPage` |
| Компонент | PascalCase, файл = имя; кит — префикс `App`; части виджета — префикс виджета | `AppModal`, `DatasetHistoryToolbar` |
| API | файл `<name>-api.ts`, объект `<name>Api`, методы `get*` / `list*` / `download*` / `upload*` / `request*` / `create*` | `mlServiceRunApi.getMLServiceRuns` |
| Composable / store | `use<Thing>`, файл = имя; store `use<Name>Store` | `useRunHistoryTable`, `useUserStore` |
| Модули `lib/`, `config/` | camelCase | `connectionRequest.ts`, `urlParams.ts` |
| Константы | UPPER_SNAKE_CASE | `PREDICTIONS_POLLING_INTERVAL` |
| Маппер | `map<From>To<To>` / `to<Something>` | `mapServiceRunToRunRecord` |
| DTO | имя схемы бэка без `Schema` | `MLServiceRunListItem` |
| Фильтры запроса | `<Entity>Filters` | `MLServiceRunFilters` |
| Статусы | строковый union или `as const`, **не `enum`** | `'not_configured' \| 'connected'` |
| Маршрут | константа в `ROUTE_NAMES`, значение kebab-case | `ROUTE_NAMES.integrationDetail` |
| События | camelCase в `defineEmits`, kebab-case в шаблоне | `openUploadDrawer` → `@open-upload-drawer` |
| Ключ localStorage | константа `*_STORAGE_KEY`, значение snake_case | `LOCALE_STORAGE_KEY = 'app_locale'` |

---

## Контракт с бэкендом (api-сегмент)

- Все HTTP — через `apiClient` из `@/shared/api`. Новых инстансов axios и `fetch` нет.
- Вызовы — **только** в `entities/<entity>/api/<name>-api.ts`. Компоненты, composables и сторы axios
  не трогают.
- **Типы — из OpenAPI.** Схема бэка лежит в `openapi/openapi.json` (обновляем по Swagger) →
  `npm run api:types` → `shared/api/generated/schema.d.ts` (реэкспорт `components`, `operations`,
  `paths` из `@/shared/api`). В `entities/<entity>/api/types.ts` — алиасы:
  `components['schemas']['XxxSchema']`; фильтры — `NonNullable<operations['list_xxx']['parameters']['query']>`.
  Ручной DTO — только для эндпоинта, которого ещё нет в схеме, с `// TODO:`.
- **Контракт поменялся** → обновить схему → `api:types` → исправить ошибки `type-check`. Это и есть
  проверка совместимости с бэком.
- Необязательные поля схемы (`field?: T | null`) нормализуем в маппере (`?? null`); сравнения
  `=== null` на сырых DTO не пишем.
- Метод API возвращает **`AxiosResponse<T>`** (не разворачивает `.data`); однострочный JSDoc с
  неочевидными кодами ответа (`409 — an active request already exists`).
- Списки принимают `params?: <Entity>Filters` и `signal?: AbortSignal`. Множества — строкой через
  запятую (`product_id__in`).
- Скачивание: `responseType: 'blob'`, имя — `getContentDispositionFilename(...)` с fallback,
  сохранение — `downloadBlob`. Загрузка: `FormData` + `onUploadProgress`.
- Неиспользуемые методы API — заготовки под ближайшие фичи, пока эндпоинт есть в схеме; не удаляем.

## Серверное состояние (TanStack Query)

Всё с бэка — **кэш TanStack Query**, а не Pinia и не `ref`.

- `QueryClient` один, в `main.ts`: `refetchOnWindowFocus: false`; **одна повторная попытка только
  для сбоя сети и 5xx** — `retry: (count, error) => count < 1 && isRetryableError(error)` (4xx и
  отменённые не повторяем). Переопределение — точечно, с комментарием «почему».
- **Query-composable сущности** — `entities/<entity>/model/use<Thing>.ts`: владеет ключом и `queryFn`,
  вызывается из любых виджетов (запрос и поллинг один на всех). Composable виджета собирает из них
  данные экрана. Эндпоинт в обход composable сущности не запрашиваем.
- `queryFn` разворачивает ответ: `return (await api.getX(params, signal)).data`.
- **Ключи** — массив, домен первым (`['dataset-history', ...]`), чтобы инвалидация по префиксу
  работала. Экспортируем ключ, только если его инвалидирует другой слайс (кладём в нижний слайс);
  иначе — константа рядом с `useQuery`. **Фабрика `<entity>Keys`** (`all`, `list(filters)`, …) —
  когда у сущности появляются связанные запросы и мутации (KISS: не раньше).
- Глобальный фильтр данных (скрытые сервисы) — `select` в composable сущности.
- Зависимые запросы — реактивный `enabled`; смена страницы без мигания — `keepPreviousData`.
- **Поллинг** — `refetchInterval` с именованной константой и комментарием (нет push-канала; откуда
  число). Условный — функцией от `query.state.data`. Фоновая вкладка не опрашивается.
- **Мутации** — в `model/` фичи. После успеха — `setQueryData` (ответ содержит новое состояние) или
  `invalidateQueries`. Тосты, закрытие модалки и навигация — в фиче.
- Однотипные запросы по списку id — `useQueries`.

## Маппинг DTO → UI

- Компонент не работает с сырым DTO, если форма отличается от нужной UI: перевод — **чистым
  маппером** в `lib/mapper.ts` слайса-потребителя. UI-модель — `model/types.ts` (camelCase, JSDoc на
  неочевидных полях).
- Маппер **не вызывает `useI18n`** — перевод и локаль передаются аргументом; `computed`, вызывающий
  маппер, пересчитывается при смене языка.
- Технические значения бэка → UI через `Record<Backend, Ui>` с безопасным дефолтом
  (`?? 'LOADING'`): новое значение от бэка не роняет UI.
- **Справочники — источник правды бэк.** Фронтовые справочники по slug'ам (названия, ссылки на доки,
  скрытые сервисы) — только fallback с `// TODO:` на задачу бэка; новые без согласования не заводим.
- Каждый маппер — с юнит-тестом.

## Клиентское состояние

| Что | Где |
|---|---|
| Данные с бэка | TanStack Query |
| Фильтры, сортировка, пагинация — всё, что открывается по ссылке | **URL query** |
| Сессия; процессы дольше компонента (очередь загрузки файлов) | Pinia setup-store |
| Локальный UI (открыта модалка, раскрытые группы, поля формы) | `ref` в компоненте / composable |
| Предпочтения устройства (язык) | `localStorage` через именованный ключ |

**URL как источник истины:**
- `use<Widget>Filters()` в `model/` виджета; имена параметров — `URL_PARAMS` (`as const`) в
  `config/urlParams.ts` (это не ключи TanStack Query).
- Параметр — `computed({ get, set })` поверх `route.query`; запись — `createQueryPatch(route, router)`
  из `@/shared/lib/router` (`router.replace`, пустое удаляется, массив — через запятую).
- Дефолты в URL не пишем; `get` валидирует мусор и возвращает дефолт.
- Несколько параметров — **одним** вызовом `replaceQuery({...})`.
- Смена фильтра сбрасывает страницу; смена сортировки — нет.

**Pinia:** только setup-синтаксис, store в `model/store.ts` своего слайса, только клиентское
состояние. `inject()` работает, поэтому `useQueryClient` / `useRoute` / `useRouter` допустимы;
**`useI18n()` в сторе нельзя** — для разового текста `i18n.global.t`, в состоянии храним ключи i18n.
В `localStorage` не кладём `File`/`Blob` и то, что должно считаться на бэке; чтение — `JSON.parse` в
`try/catch`.

---

## Vue-компоненты

- Только `<script setup lang="ts">` + Composition API. Порядок блоков `script` → `template` →
  `style` (ESLint). Имя компонента — из имени файла; `defineOptions({ name })` — только если имя
  должно отличаться.
- Пропсы — generic `defineProps<{...}>()` + `withDefaults`. Тип пропсов, нужный снаружи, —
  `<Component>.types.ts` + реэкспорт из `index.ts`. **Типы из `.vue` не экспортируем.**
- **`v-model` — `defineModel`.** Пара `modelValue` / `update:modelValue` вручную — только при
  нетривиальной записи. Управляемые компоненты без двусторонней привязки (модалка: `:open` + `@close`)
  — пропс + событие.
- `defineEmits` — tuple-синтаксис с именованными аргументами; в шаблоне `emit(...)`, не `$emit`
  (проверяет `vue/no-restricted-syntax`).
- Обёртка над нативным элементом — `inheritAttrs: false` + `v-bind="$attrs"`.
- `useI18n({ useScope: 'global' })`; роутер и сторы — `useRoute()` / `useRouter()` / `useXxxStore()`,
  не `$route` в шаблоне.
- **Логика — в composable.** Корневой компонент виджета деструктурирует `use<Widget>()` и раздаёт
  детям. **Страница тонкая**: композиция виджетов, без запросов.
- Обработчик с аргументами вызываем явно: `@retry="refetch()"`.
- Списки — стабильный `:key` (id, не индекс; исключение — поля формы без id).
- Формы: `<form @submit.prevent>`, внешняя кнопка — `form="<id>"`; ошибка поля после `blur`;
  сброс в `watch` на открытие; отправка `disabled` при невалидной форме и во время `submitting`.
- Таймеры и подписки снимаем в `onUnmounted`.
- Тернарный оператор — для значения; ветвление с эффектами — `if/else`.
- Не добавляем пропсы и события, которые никто не использует (YAGNI): API компонента — по реальным
  потребителям.

### Доступность

- Кликабельное — только `<button>`, `<a>`/`RouterLink` или radix-примитив. **Интерактивное в
  интерактивном не вкладываем** (кнопка сброса рядом с триггером, а не внутри).
- Кнопка без текста — `aria-label` через `t()`; поле — `<label for>` или вложенность; скрытый
  `input type=file` — `aria-label`.
- `<label>` только для поля; подпись к тексту — обычный элемент.
- Декоративное изображение — `alt=""`; иконки уже `aria-hidden` в `AppIcon`.
- Проверяется `eslint-plugin-vuejs-accessibility` (`label-has-for`: `for`/`id` или вложенность;
  `CheckboxRoot` — поле). Отключение правила — точечно, с причиной в комментарии.

## Состояния экрана

Виджет с данными явно обрабатывает четыре состояния — отдельными компонентами в `ui/`:

```vue
<XxxSkeleton v-if="isLoading" />
<XxxErrorState v-else-if="isError" @retry="refetch()" />
<template v-else-if="hasData"> ... </template>
<XxxEmptyState v-else />
```

- `isError` — только когда **данных нет**: `isRequestError.value && !data.value`.
- Скелетон повторяет геометрию контента (на `AppSkeleton`).
- Различаем «данных нет» (CTA) и «по фильтру ничего не найдено» («Сбросить фильтры»).
- Пустое состояние не показываем во время первой загрузки.

---

## Дизайн-система (`shared/ui`)

Источник — UI-кит Figma (страница «01. UI-kit», фрейм `Semantic colors` для токенов). Перед вёрсткой
проверь `shared/ui`:

| Компонент | Назначение |
|---|---|
| `AppButton` | `variant`: `primary` / `secondary` / `outline` / `ghost` / `danger`; `size`: `small` / `medium` / `icon` |
| `AppIcon` | иконка из спрайта, `name: IconName` |
| `AppModal` | **базовая модалка**: `:open` + `@close`, `title`, `size: sm \| md`, `overlay: strong \| soft` (soft — поверх другого слоя), `hasDescription`; слоты default (прокручиваемое тело) и `#footer`; крестик с `aria-label` |
| `AppConfirmDialog` | подтверждение (`variant: warning \| danger`), на `AppModal` |
| `AppDrawer` | правая шторка |
| `AppDropdown` + `AppDropdownItem` | меню по клику |
| `AppFilter` | фильтр single / multiple (`FilterOption[]`) |
| `AppTooltip` | подсказка; провайдер один — `TooltipProvider` в `App.vue` |
| `AppPagination` | `v-model:page`, фиксированный `pageSize` |
| `AppEmptyState`, `AppSkeleton`, `AppStatusBadge`, `AppSwitch`, `AppCheckbox`, `AppCard`, `AppBanner`, `AppScrollArea` | по названию |

- Папка `app-<name>/`: `App<Name>.vue`, опционально `App<Name>.types.ts` и чистая логика отдельным
  файлом рядом (`getPaginationRange.ts`), `index.ts`, `__tests__/`.
- Компонент **не знает о домене**: только пропсы, события, слоты.
- Варианты и размеры — `computed` с массивом классов через `switch` (как `AppButton`). CVA и `cn` не
  используем — условные классы массивом/объектом в `:class`.
- Интерактив — **на `radix-vue`**; дропдауны — с `:modal="false"` (иначе дёргается страница).
- **Любая модалка — на `AppModal`.** Каркас radix-диалога вне `AppModal` / `AppDrawer` не собираем.
- Специализированный компонент — поверх базового, а не копией обвязки.
- Тексты кита — пропсами или `t()`, без хардкода (включая дефолтные подписи).
- Изменение кита затрагивает все экраны — проверяй все места использования.

## Стили и токены

- Tailwind v4 CSS-first; токены — `src/shared/assets/styles/tokens/*.css` (`colors`, `typography`,
  `radius`, `layout`, `theme`), глобальное — `base/globals.css`.
- Токены — через arbitrary-property: `bg-(--bg-surface-primary)`, `text-(--text-secondary)`,
  градиенты — `bg-(image:--gradient-card)`.
- В компонентах — **семантические** токены (`--text-primary`, `--bg-badge-success`), не примитивы
  палитры. Имена — как переменные Figma (`text/primary` → `--text-primary`).
- **Запрещено:** hex и `rgba()` в классах, `style` и JS-константах; статичный `style="..."`;
  произвольные цвета Tailwind (`bg-red-50`). Нет токена — добавь в `tokens/colors.css` (имя из Figma,
  точное значение, комментарий-источник). Canvas читает цвета через `getComputedStyle`.
- Типографика — утилитами шкалы (`text-body-sm`, `text-title-sm`, `text-element-button`).
- Размеры — шкала Tailwind; `[123px]` — только если значения нет в шкале. `:style` — только для
  динамики (ширина прогресса в %).
- `<style>` в SFC не используем. Тёмной темы нет.

## Иконки и ассеты

- Иконки — **только `AppIcon`** и спрайт: исходник из Figma в `shared/assets/icons/ui/<name>.svg` →
  `npm run icons:sprite` → в коммит исходник, `sprite.svg`, `iconNames.ts`. Иконочных пакетов нет.
- Картинки слайса — в его `assets/`, импорт относительный; общие — `shared/assets/images/`.
- SVG как URL — обычный импорт; как компонент — `?component`.

## Локализация

- `ru` (по умолчанию и fallback) и `en`; выбор в `localStorage` (`setAppLocale`).
- `locales/ru.ts` — эталон схемы (`MessageSchema`), `en.ts` типизирован ей: TypeScript не даст
  забыть перевод. Ключ — **в оба файла сразу**.
- Ключи по домену и блоку экрана: `datasets.table.emptyNotFound.title`.
- **Любой видимый текст** (лейблы, плейсхолдеры, `aria-label`, `alt`, `title`, тосты, ошибки,
  дефолтные подписи кита) — через `t()`. Проверяется `@intlify/vue-i18n/no-raw-text`: в исключениях
  знаки и числа и технические термины (`CSV`, `API`, `Client ID`, …). Тексты в `<script>` правило не
  видит — следим сами.
- Вне компонента (store, `lib/`) — `i18n.global.t` в момент отображения, не при импорте модуля; в
  состоянии храним ключ.
- Не переводятся: технические типы данных (как в Swagger), названия продуктов, названия языков;
  термины, которые по макету на английском, — ключами с одинаковым текстом в обеих локалях.
- Интерполяция — именованная: `t('...uploadFailedFile', { fileName })`.

## Даты и числа

- Отображение — `Intl.*` / `toLocaleString` с `toIntlLocale(locale.value)`. Хардкод `'ru-RU'` нет.
- Вид под макет — через `formatToParts`; время — `hourCycle: 'h23'` (иначе en-US даёт 12-часовой
  формат).
- `dayjs` — только арифметика и ключи дат.
- Нет значения — `-` (или как в макете).
- Форматтеры — в `lib/`, чистые, с тестами.

## Ошибки и уведомления

- Уведомления — `toast` из `vue-sonner`, текст через `t()`.
- Статус ошибки — `getHttpStatus(error)` из `@/shared/api` (там же `isClientError`,
  `isRetryableError`). Ожидаемые коды (409) — явно, с понятным текстом.
- **401 во время работы** — интерсептор в `app/providers/setupAuthInterceptor.ts`, подключается в
  `main.ts` **после** `initAuth()`; пропускает `/user/me` и `/authorization/*`, не редиректит при
  `authError`, вызывает `login()` один раз. Локально 401 не обрабатываем.
- Результат, который пользователь может не увидеть (шторка закрыта), дублируем тостом.
- Ошибку не глотаем: тост, инлайн или error-state. `console.log` нет; `console.warn/error` — только
  как диагностика рядом с пользовательской реакцией.
- Ошибка поля — инлайн под ним, поле `aria-invalid` + `ring-(--border-error)`.

## Авторизация и роутинг

- Cookie-сессия (OIDC через Authentik). `main.ts`: `initAuth()` (`GET /user/me`) → интерсептор 401 →
  роутер → mount. `login()` / `logout()` — полный редирект браузера.
- `App.vue`: `AuthLoader` → `AuthErrorScreen` (`?auth=error`) → `AdminLayout`; там же `Toaster` и
  единственный `TooltipProvider`.
- **Маршруты** (`app/router/index.ts`):
  - страницы ленивые: `component: () => import('@/pages/billing').then((m) => m.BillingPage)`;
  - `name` из `ROUTE_NAMES` (`@/shared/config`); навигация **по имени**, строковые пути не пишем;
  - `meta` (типизирован `RouteMeta`) — единственный источник каркаса: `requiresAuth`, `titleKey`
    (шапка), `nav: { icon }` (пункт сайдбара; подпись — `titleKey`, порядок — порядок маршрутов);
  - последний — catch-all → `NotFoundPage`.
- Guard: нет сессии → `login()`, кроме случая `authError` (защита от цикла).
- Невалидный параметр маршрута — `router.replace` на родительский раздел в странице.
- Внешние ссылки — `target="_blank" rel="noopener noreferrer"`.

## Конфигурация и фича-флаги

- `import.meta.env` читается **только** в `shared/config/*`; наружу — константы (`API_URL`,
  `IS_DEV`, `FEATURE_*`).
- **Цель:** `VITE_API_URL=/api` и `server.proxy` в dev — один образ на все окружения. Порядок: сначала
  прокси и проверка входа (`frontend=local`) и cookie через прокси (домен, `SameSite` — с бэком),
  потом смена `VITE_API_URL`. *(Ждёт ответа бэка.)*
- Фича-флаг — `FEATURE_<NAME>` в `shared/config/env.ts` с JSDoc (что закрывает, почему, тикет, как
  включить в `.env.local`); по умолчанию выключен.
- Секретов во фронтенде нет.

## Моки и скрытые экраны

- Мок-данные — `config/mocks.ts` (`MOCK_*`); мутации над моками — временный store с сигнатурой
  будущего API и комментарием. Компоненты не знают, мок это или API.
- **Скрываем фичу только флагом**; не используемый и не спрятанный за флагом код удаляем.
- Готовый, но скрытый PM экран (профиль, тарифы, расписание) не дорабатываем, пока он не вернулся в
  скоуп; его долг — в `docs/fsd-debt.md`.

## Требования и макеты

- Источники — задача Jira, PRD/RFC, Figma (UI-кит — источник токенов и состояний компонентов).
- **Расхождение источников — сначала вопрос** (что расходится, варианты, предложение), потом код.
  Продуктовое поведение молча не выбираем.
- Перед сдачей — самопроверка по макету: тексты, состояния, модалки, иконки, отступы, ховеры, ru и en.

## Комментарии в коде

- **Новые комментарии — на английском.** Существующие русские массово не переводим: переводим, когда
  правим строку.
- Объясняют **«почему»**: ограничение, баг библиотеки, решение PM, договорённость с бэком; со ссылкой
  на источник (`WT-448`, `mockup 1221:200577`, `PM decision, 2026-09-30`).
- JSDoc — на методах API, экспортируемых функциях `lib/`, неочевидных полях и пропсах.
- Временное — `// TODO:` с причиной и условием снятия.

## Тесты

- Vitest, окружение **jsdom** (компонентам нужен DOM, `shared/i18n` читает `localStorage` при
  импорте). Тесты — в `__tests__/` рядом с модулем, `<module>.spec.ts`.
- Обязательно: `lib/` (мапперы, форматтеры, валидация, сборка запросов), утилиты `shared/lib`,
  чистая логика кита, **компонентные тесты** ключевых компонентов `shared/ui` (рендер вариантов,
  события, `v-model`, a11y-атрибуты).
- Composable с роутером / i18n / Vue Query — через `withSetup` из `@/shared/lib/test`; роутер —
  `createMemoryHistory`; ожидание навигации — `flushPromises`.
- `describe(<функция/компонент>)` + `it(<сценарий>)`, `it.each` для таблиц; **описания — на
  английском**; кейс из макета/тикета — со ссылкой. Arrange → Act → Assert.
- Сеть в юнит-тестах не трогаем — тестируем логику в `lib/`. Тест, который нашёл баг, фиксирует
  исправленное поведение, а не ошибку.

## Линтинг и форматирование

- Перед коммитом и в CI: `npm run check` зелёный (type-check, oxlint, ESLint, `steiger`, Prettier,
  тесты). Локально — `npm run lint`, `npm run format`.
- ESLint: `simple-import-sort` (руками не сортируем), `unused-imports`, `vue/block-order`,
  `vue/attributes-order`, `vue/max-attributes-per-line`, `vue/html-self-closing`,
  `vuejs-accessibility/*`, `@intlify/vue-i18n/no-raw-text`, `no-console` (кроме `warn`/`error`).
- Prettier: одинарные кавычки, точки с запятой, ширина 100. Сгенерированный `shared/api/generated`
  исключён из линтеров и Prettier.
- `noUncheckedIndexedAccess`: индекс — `T | undefined`, обрабатываем `?.` / `??`, не `!`.
- `any` нет; внешние данные неизвестной формы — `unknown` + сужение.
- Отключение правила — только точечно (`eslint-disable-next-line` / блок в конфиге) с причиной.

---

## Definition of Done

- [ ] Слой и сегмент выбраны по манифесту; импорты вниз, без кросс-импортов, через `index.ts` / `@x`.
- [ ] Паттерны из `docs/fsd-debt.md` не скопированы.
- [ ] Бэк — только в `entities/*/api`, DTO и фильтры — из OpenAPI, данные — через TanStack Query.
- [ ] Фильтры / сортировка / пагинация — в URL.
- [ ] Состояния loading / error / empty (и «ничего не найдено»).
- [ ] Видимые тексты — `t()`, ключи в `ru.ts` и `en.ts`.
- [ ] Только токены; иконки — `AppIcon`; модалки — `AppModal`; доступность соблюдена.
- [ ] Новые `lib/` и `shared/ui` покрыты тестами.
- [ ] `npm run check` зелёный.
- [ ] Нет `console.log`, `debugger`, закомментированного и неиспользуемого кода.
- [ ] Самопроверка по макету (ru и en); расхождения с PRD/макетом согласованы, а не решены молча.

## Git и коммиты

Сейчас работаем в `main` (ветка — по запросу); перед коммитом — `npm run check`. Формат коммита —
`<TICKET>: <imperative summary>` или без тикета `refactor:` / `chore:` / `docs:` / `test:`, на
английском, тело — список изменений. **Без `Co-Authored-By` и упоминаний AI.** Подробности и целевой
флоу `develop` → `main` — [`docs/delivery.md`](docs/delivery.md).

## Язык общения

Общаемся, объясняем и отвечаем по-русски. Код, имена, новые комментарии и технические термины — на
английском.

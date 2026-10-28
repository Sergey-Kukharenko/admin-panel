# План приведения проекта к архитектурному манифесту

Пошаговый план рефакторинга `mico-client-portal-ui` под манифест (`CLAUDE.md`) с упором на FSD.
Задача — WT-547. Первая итерация сделана в ветке `refactoring` (2026-10-15) и осталась справочной:
за это время `main` ушёл вперёд, поэтому пункты переносим заново на ветке `chore/WT-547-refactoring`
от свежего `main` — cherry-pick, если ложится чисто, иначе переделка на текущем коде.
Замечания к манифесту, на которых основан план: [документ на claude.ai](https://claude.ai/code/artifact/7f3dcaab-16ff-41dd-90b5-2032f31e2837).

**Правила работы:**

- Работаем в `chore/WT-547-refactoring`, после приёмки вливаем в `main`.
- Один пункт — один коммит, без смешивания с фичами.
- Перед коммитом — `type-check`, линт и тесты, ручная проверка затронутых экранов (headless-скриншоты).
- Сделанные пункты отмечаем `[x]` в этом файле.

## Этап 0 — подготовка

- [x] Свести манифест: за основу — фронтовая версия первой итерации (`CLAUDE.md` + `docs/reference-slice.md`, `docs/checklists.md`, `docs/delivery.md`); из версии `main` (черновик бэкенда) взято полезное фронту — графики без библиотеки, верность UI-киту и Figma (состояния, фокус, токены, прозрачность, обводки), `AppModal` с `v-model:open`, пункты меню, `\u00a0`, флоу прод-GitLab.
- [x] Получить актуальную OpenAPI-схему бэка (`openapi/openapi.json`, обновляется вручную по новому Swagger). Снимок 2026-10-28: эндпоинта `/registration/invitations` в схеме больше нет, неиспользуемая `entities/invitation` удалена.
- [ ] Согласовать с DevOps джобу `quality`.

## Этап 1 — быстрые исправления

- [x] Точечные нарушения FSD:
  - перенести `shared/api/session-api.ts` и `shared/api/authorization-api.ts` в `entities/user/api/`;
  - вынести `ErrorDetails` из `widgets/dataset-history-table/ui/DatasetHistoryErrorDialog.vue` в `model/types.ts`;
  - заменить импорты своего же слайса по алиасу на относительные (`entities/dataset/ui/dataset-template-icon/DatasetTemplateIcon.vue`, `widgets/predictions-manager/model/constants.ts`).
- [x] Query keys: единый формат (массив, домен первым), экспорт только для инвалидации из другого слайса; фабрика `<entity>Keys` — когда у сущности есть связанные запросы и мутации (как `integrationKeys`); `QUERY_KEYS` → `URL_PARAMS` в `config/urlParams.ts` (это имена параметров URL).
- [x] Скрипты `check:lint`, `check:format` и общий `check` (type-check, линт, формат, тесты) — без `--fix`, не попадают под маску `run-s lint:*`; проект доведён до зелёных проверок.

## Этап 2 — базовая инфраструктура

- [x] `AppModal` с тестами (уже в `main`, `v-model:open`), `AppConfirmDialog` на его основе: необязательный заголовок в шапке, оверлей `soft` поверх шторки, `hasDescription`.
- [x] Перевод модалок на `AppModal`: подключение интеграций (вместе с переносом в `features`), `ChangePasswordModal`, `DatasetHistoryErrorDialog`. Модалки ключей (`CreateApiSecretModal`, `CreateKeySecretModal`, `RevealSecretModal`) отложены до API ключей: они за фича-флагом на моках и будут переписаны.
- [ ] Перенос модалок и панелей из `widgets` в `features`:
  - [x] `s3-connection-modal` и мутация `useRequestIntegrationConnection` → `features/request-integration-connection` (одна фича на заявку: у S3 и REST общая мутация) — уже в `main`;
  - [x] `rest-api-connection-modal` → туда же — уже в `main`;
  - [x] панели `rest-api-credentials` и `s3-credentials` → внутренние компоненты `widgets/integration-detail` (кросс-импорт найден `steiger`);
  - отложено до API ключей: модалки ключей → `features/manage-integration-secrets`;
  - [x] `uploads-empty-state` → внутренний компонент `widgets/dataset-history-table/ui/DatasetHistoryEmptyState.vue` (действия в нём нет, только событие открыть дровер);
  - `entities/integration/ui/reveal-secret-modal` — тоже отложено, вместе с модалками ключей.
- [x] Роутер:
  - `ROUTE_NAMES` в `shared/config/routes.ts`, навигация по имени маршрута;
  - ленивые страницы (`() => import('@/pages/x').then((m) => m.XPage)`);
  - сайдбар и шапка, построенные из `meta` (`titleKey`, `nav`, типизация `RouteMeta`);
  - страница 404.
- [x] Интерсептор 401 в `app/providers` (подключается после `initAuth()`, не трогает `/user/me` и `/authorization/*`, не редиректит при `authError`, редиректит один раз), `isRetryableError` в `shared/api` для политики ретраев (`getHttpStatus`, `isClientError` уже в `main`).
- [x] Один `TooltipProvider` в `App.vue`.
- [ ] Прокси `/api` в dev (`server.proxy`), относительный `VITE_API_URL` — ждём ответа бэкенда про куку сессии через прокси и `/api` на стендах (в `nginx.conf` `location /api/` указывает на чужой сервис).
- [x] Убрать `useI18n` из стора `features/upload-dataset/model/store.ts` (тост берёт `i18n.global.t`, как `entities/dataset/model/templateMapper.ts`).

## Этап 3 — типы и структура слайсов

- [x] Генерация типов из OpenAPI (`npm run api:types` → `shared/api/generated`), алиасы DTO во всех сущностях (`entities/*/api/types.ts`). При изменении бэка: обновить схему → `api:types` → поправить ошибки type-check.
- [x] Сегменты `lib/`, `config/` и `api/types.ts` — по слайсам, одним коммитом на слой (`shared`, `entities`, `widgets`; в `features` чистого кода в `model/` не было):
  - `model/` — реактивное: сторы, composables, query keys, UI-типы;
  - `lib/` — чистые функции: мапперы, форматтеры, валидация;
  - `config/` — константы, справочники, моки;
  - `api/` — вызовы бэка и DTO.
- [x] Хардкод цветов заменить на токены — только точные значения, вид как в `main` (сверено попиксельно): существующие `--text-model-active`, `--default-foreground`, `--text-disabled`, `--bg-surface-primary`; новые `--gradient-section`, `--gradient-card`, `--gradient-skeleton`, `--bg-switch-pressed`, `--bg-menu-item-danger-hover`, `--text-section-title`. Подгонку цветов под UI-кит из первой итерации не переносим (меняет вид). Остатки на скрытых экранах — в `fsd-debt.md`.

## Этап 4 — качество и контроль

- [x] Хелпер `withSetup` (`shared/lib/test`). Окружение по умолчанию — `jsdom` (уже в `main`): компонентным тестам нужен DOM, а `shared/i18n` читает `localStorage` при импорте.
- [x] Компонентные тесты `shared/ui`: `AppModal`, `AppConfirmDialog`, `AppButton`, `AppPagination`, `AppFilter`.
- [x] Тесты недостающих мапперов и форматтеров живых экранов (история датасетов, проверка файлов, форматтеры предсказаний, `createQueryPatch`). Не покрыты: скрытые экраны (расписание, тарифы), неиспользуемый `cn`, `downloadBlob` (побочный эффект DOM).
- [x] Линтер i18n (`@intlify/eslint-plugin-vue-i18n`, `no-raw-text`, включая `aria-label`/`title`/`placeholder`/`alt`) с исправлениями: shared-компоненты (в т.ч. тексты в `<script>`), дашборд, смена пароля, доступ к продуктам. Технические термины (CSV, API, Client ID…) в исключениях; скрытые экраны выключены с TODO.
- [x] Линтер a11y (`eslint-plugin-vuejs-accessibility`, `flat/recommended`) с исправлениями. `label-has-for`: достаточно `for`/`id` или вложенности; `CheckboxRoot` считается полем. Исключения с причиной: зона drag-and-drop, скрытый виджет расписания.
- [x] Линтер FSD (`steiger`) в `lint` и `check:lint` (CI — вместе с джобой `quality`). Решения по манифесту: страницы — `pages/<name>/ui/`, без суффикса `-page`; у `shared/config`, `shared/lib/router`, `shared/lib/test` есть index-файлы; выключены `insignificant-slice` (ложные срабатывания, спорит с критерием feature/widget) и `segments-by-purpose` (`assets`, `app/providers` оставляем).

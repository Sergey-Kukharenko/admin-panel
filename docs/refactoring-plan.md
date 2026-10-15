# План приведения проекта к архитектурному манифесту

Пошаговый план рефакторинга `mico-client-portal-ui` под манифест (CLAUDE.md) с упором на FSD.
Замечания к манифесту, на которых основан план: [документ на claude.ai](https://claude.ai/code/artifact/7f3dcaab-16ff-41dd-90b5-2032f31e2837).

**Правила работы:**

- Проект — черновик: работаем в `main`, отдельная ветка — только по запросу.
- Один пункт — один коммит, без смешивания с фичами.
- Перед коммитом — `type-check`, линт и тесты, ручная проверка затронутых экранов.
- Сделанные пункты отмечаем `[x]` в этом файле.

## Этап 0 — подготовка

- [ ] Поправить манифест по замечаниям и влить его.
- [ ] Получить доступ к OpenAPI-схеме бэка.
- [ ] Согласовать с DevOps джобу `quality`.

## Этап 1 — быстрые исправления

- [x] Точечные нарушения FSD:
  - перенести `shared/api/session-api.ts` и `shared/api/authorization-api.ts` в `entities/user/api/`;
  - вынести `ErrorDetails` из `widgets/dataset-history-table/ui/DatasetHistoryErrorDialog.vue` в `model/types.ts`;
  - заменить импорты своего же слайса по алиасу на относительные (`entities/dataset/ui/dataset-template-icon/DatasetTemplateIcon.vue`, `widgets/predictions-manager/model/constants.ts`).
- [x] Query keys: единый формат (массив, домен первым), экспорт только для инвалидации из другого слайса; `QUERY_KEYS` → `URL_PARAMS` (это имена параметров URL). Фабрики `<entity>Keys` — по мере появления мутаций.
- [x] Скрипты `check:lint`, `check:format` и общий `check` (type-check, линт, формат, тесты) — без `--fix`, не попадают под маску `run-s lint:*`; проект доведён до зелёных проверок.

## Этап 2 — базовая инфраструктура

- [x] `AppModal` с тестами, `AppConfirmDialog` на его основе.
- [x] Перевод модалок на `AppModal`: подключение интеграций (вместе с переносом в `features`), `ChangePasswordModal`, `DatasetHistoryErrorDialog`. Модалки ключей (`CreateApiSecretModal`, `CreateKeySecretModal`, `RevealSecretModal`) отложены до API ключей: они за фича-флагом на моках и будут переписаны.
- [ ] Перенос модалок и панелей из `widgets` в `features`:
  - [x] `s3-connection-modal` и мутация `useRequestIntegrationConnection` → `features/request-integration-connection` (одна фича на заявку: у S3 и REST общая мутация);
  - [x] `rest-api-connection-modal` → туда же;
  - отложено до API ключей: модалки ключей → `features/manage-integration-secrets`, панели `rest-api-credentials` и `s3-credentials` → внутренние компоненты `widgets/integration-detail`;
  - [x] `uploads-empty-state` → внутренний компонент `widgets/dataset-history-table/ui/DatasetHistoryEmptyState.vue` (действия в нём нет, только событие открыть дровер);
  - `entities/integration/ui/reveal-secret-modal` — тоже отложено, вместе с модалками ключей.
- [ ] Роутер:
  - `ROUTE_NAMES`;
  - ленивые страницы (`() => import('@/pages/x-page').then((m) => m.XPage)`);
  - сайдбар и шапка, построенные из `meta`;
  - страница 404.
- [ ] Интерсептор 401 (подключается после `initAuth()`, не трогает `/user/me`, не редиректит при `authError`), `getHttpStatus` и `isClientError`, ретраи только для 5xx и сетевых сбоев.
- [ ] Прокси `/api` в dev (`server.proxy`), относительный `VITE_API_URL`, один `TooltipProvider` в `App.vue`.
- [x] Убрать `useI18n` из стора `features/upload-dataset/model/store.ts` (тост берёт `i18n.global.t`, как `entities/dataset/model/templateMapper.ts`).

## Этап 3 — типы и структура слайсов

- [ ] Генерация типов из OpenAPI (`api:types`), алиасы DTO во всех сущностях.
- [ ] Сегменты `lib/`, `config/` и `api/types.ts` — по слайсам, одним MR на слой:
  - `model/` — реактивное: сторы, composables, query keys, UI-типы;
  - `lib/` — чистые функции: мапперы, форматтеры, валидация;
  - `config/` — константы, справочники, моки;
  - `api/` — вызовы бэка и DTO.
- [ ] Хардкод цветов заменить на токены (21 место).

## Этап 4 — качество и контроль

- [ ] Окружение Vitest и хелпер `withSetup`.
- [ ] Компонентные тесты `shared/ui`: `AppModal`, `AppButton`, `AppPagination`, `AppFilter`.
- [ ] Тесты недостающих мапперов и форматтеров.
- [ ] Линтер i18n (`no-raw-text`) с исправлениями.
- [ ] Линтер a11y (`vuejs-accessibility`) с исправлениями.
- [ ] Линтер FSD (`steiger`) в `check:lint` и CI.

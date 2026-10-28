# Долг: отклонения кода от манифеста

Известные места, где текущий код расходится с [`CLAUDE.md`](../CLAUDE.md). **Это не образцы —
паттерны отсюда в новый код не копировать.**

Как работать со списком:
- в рамках задачи приводим к манифесту только тронутые файлы;
- перенос слайса между слоями или сегментами — отдельной `chore/*`-задачей;
- исправленный пункт удаляется из списка в том же MR.

Состояние на 2026-10-14.

## FSD: слои и импорты

| Где | Отклонение | Как привести |
|---|---|---|
| `shared/api/session-api.ts`, `shared/api/authorization-api.ts` | `shared` импортирует `UserProfile` из `@/entities/user` (импорт вверх, цикл) | Перенести в `entities/user/api/` |
| `widgets/integration-detail/ui/IntegrationDetail.vue` | Импортирует 4 виджета: `rest-api-connection-modal`, `rest-api-credentials`, `s3-connection-modal`, `s3-credentials` | Модалки → `features/connect-rest-api`, `features/connect-s3`; панели ключей → `features/manage-api-secrets` (или собирать на странице) |
| `widgets/dataset-history-table/ui/DatasetHistoryTable.vue` | Импортирует виджет `uploads-empty-state` | Пустое состояние с CTA загрузки → в `features/upload-dataset` или внутрь виджета |
| `widgets/dataset-history-table/model/useDatasetHistoryGroupErrors.ts` | `model` импортирует тип из `.vue` (`../ui/DatasetHistoryErrorDialog.vue`) | Вынести `ErrorDetails` в `model/types.ts` |
| `entities/integration/ui/reveal-secret-modal` | Модалка-действие в слое `entities` | Перенести в `features` |
| `entities/integration/model/useIntegrationStatus.ts` (`useRequestIntegrationConnection`) | Мутация действия пользователя в `entities` | Перенести в `features/connect-*` вместе с модалками |
| `entities/integration/model/store.ts` | Мутации на моках в Pinia сущности | Временное решение под фича-флагом; не образец. Заменить на API, когда появится |
| `entities/dataset/ui/dataset-template-icon/DatasetTemplateIcon.vue` | Свой же слайс по алиасу `@/entities/dataset/model/types` | Относительный импорт |
| `widgets/predictions-manager/model/constants.ts` | Свой же слайс по алиасу `@/widgets/predictions-manager/assets/...` | Относительный импорт |

Импортов вверх из `entities` и `features`, кросс-импортов между `features` и между `entities` нет; страницы тонкие и без запросов.

## Сегменты

| Где | Отклонение | Как привести |
|---|---|---|
| Все слайсы | Мапперы, форматтеры, валидация, константы, справочники и моки лежат в `model/` (`model/mapper.ts`, `model/utils.ts`, `model/data.ts`, `model/constants.ts`) | Чистые функции → `lib/`, статические данные → `config/` |
| `entities/*/model/api.ts` | DTO в `model/api.ts` | → `api/types.ts`, алиасы на сгенерированные типы |
| `shared/ui/app-pagination/model/getPaginationRange.ts` | Чистая логика в `model/` | → `lib/` |

## Данные и состояние

| Где | Отклонение | Как привести |
|---|---|---|
| Все `entities/*/model/api.ts` | DTO описаны вручную, статусы строкой (`/fail|error/` в `prediction-run-history/model/mapper.ts`) | Генерация из OpenAPI; `enum` статусов — на стороне бэка |
| `entities/dataset`, `entities/product`, `widgets/*` | Query keys в трёх стилях (строка, массив, фабрика) и собираются по месту | Фабрики `<entity>Keys` в `model/queryKeys.ts` |
| `entities/product/model/{displayNames,docsLinks,hiddenServices}.ts`, `entities/dataset/model/templateMapper.ts` | Бизнес-справочники по slug'ам на фронте | Fallback в `config/` с `TODO` на задачу бэка |
| `features/upload-dataset/model/store.ts` | `useI18n()` в Pinia-сторе; стор сам грузит шаблоны в обход `useDatasetTemplates`; `filesMap` с `File` и квота в `localStorage` | Убрать `useI18n` (хранить ключи); шаблоны через `useDatasetTemplates`; квоту считать на бэке |
| `shared/api/api-client.ts`, `main.ts` | Пустой интерсептор, нет обработки 401 во время работы; `retry: 1` на все ошибки | Интерсептор 401 в `app/providers/`; ретраи только сеть и 5xx |
| `.env` | Абсолютный `VITE_API_URL` на dev-хост вшивается в любую сборку (в т.ч. prod) | `server.proxy` + `VITE_API_URL=/api` (порядок — в «Конфигурации») |

## UI

| Где | Отклонение | Как привести |
|---|---|---|
| `AppConfirmDialog`, `RevealSecretModal`, `ChangePasswordModal`, `RestApiConnectionModal`, `S3ConnectionModal`, `CreateApiSecretModal`, `CreateKeySecretModal`, `DatasetHistoryErrorDialog` | Каркас radix-диалога скопирован 8 раз, оверлеи и z-index расходятся | Базовый `AppModal` |
| `AppTooltip`, `PredictionsManager`, `PredictionRunHistory` | `TooltipProvider` в каждом компоненте, в `App.vue` его нет | Один провайдер в `App.vue`, затем убрать локальные |
| `app/router/index.ts`, `AdminHeader`, `SidebarNavigation` | Статические импорты страниц, нет `name`, пути строками, заголовки и меню отдельными списками, нет 404 | Ленивые страницы, `ROUTE_NAMES`, `meta` |
| `ProductAccessTable.vue`, `DatasetUploadZone.vue` | Экспорт типов из `.vue` | Типы в `*.types.ts` |
| 7 компонентов (`AppDrawer`, `DatasetHistoryGroupHeader`, …) | `$emit` в шаблоне | `emit` |
| `tokens/colors.css` и 43 файла | Алиасы старой темы без переменной в Figma: `--background`, `--card`, `--surface`, `--foreground`, `--muted-foreground`, `--primary`, `--primary-foreground`, `--muted`, `--muted-hover`, `--muted-hover-soft`, `--border`, `--success`, `--danger` | Заменить на токены с именами Figma, сверяя место с макетом (`--surface` → `--bg-surface-primary`, `--muted` → `--bg-button-secondary`, `--muted-hover` → `--bg-button-secondary-hover` — значения совпадают; `--border` (#e5e5e5) отличается от `--border-default` (8%) — выбирать по макету), затем удалить алиасы |
| `AppFilterTrigger`, кнопки закрытия модалок (кроме `AppConfirmDialog`) | `div @click`, кликабельный `span` внутри `button`, иконочные кнопки без `aria-label` | По правилам доступности |
| ~21 место: `ConnectionStatusTag`, `CredentialsInfoCard`, `AppSwitch`, `AppSkeleton`, `AppWaveBackground`, `profile-overview/*`, … | Хардкод цветов, градиенты в `style`, `bg-red-50`, `bg-neutral-300` | Семантические токены |
| `entities/integration/ui/connection-status-tag/ConnectionStatusTag.vue`, `widgets/predictions-manager/model/constants.ts` | Зелёный «активного» статуса зашит как `text-[#668948]` | `text-(--text-model-active)` — токен того же цвета (WT-324); переменной в Figma пока нет, дизайнер заведёт |
| `ChangePasswordModal`, `usePasswordChange`, `ProfileInfoRow`, `AppTooltip`, `ProductAccessTable`, `AdminSidebar` (alt) | Тексты в обход i18n | Ключи в `ru.ts` / `en.ts` |
| `widgets/dataset-history-table/model/utils.ts`, `entities/integration/model/format.ts` | Зашитые локали `'ru-RU'`, `'en-GB'` | `toIntlLocale` |
| `widgets/tariff-*`, `profile-overview`, `prediction-processing-schedule`; `entities/tariff`, `entities/organization` | Готовый UI отвязан от страниц | Подключить за фича-флагом или удалить |
| `vitest.config.ts`, `shared/lib/cn.ts`, `tailwind.config.js`, `.stylelintrc.json` + stylelint в devDependencies, `lucide-vue-next` | Не используются / противоречат манифесту | Удалить; окружение Vitest → `node` |

## Процесс и прочее

| Где | Отклонение | Как привести |
|---|---|---|
| `.gitlab-ci.yml` | dev-стенд из `main`, `develop` без пайплайна; нет проверок качества | Тикет у DevOps; джоба `quality` |
| Весь код | Комментарии на русском | Переводить при правке строки, массово не переводить |
| `README.md` | Шаблон create-vue | Переписать |

# Долг: отклонения кода от манифеста

Известные места, где текущий код расходится с [`CLAUDE.md`](../CLAUDE.md). **Это не образцы —
паттерны отсюда в новый код не копировать.**

Как работать со списком:
- в рамках задачи приводим к манифесту только тронутые файлы;
- перенос слайса между слоями или сегментами — отдельной `chore/*`-задачей;
- исправленный пункт удаляется из списка в том же коммите.

Состояние на 2026-10-14.

## FSD: слои и импорты

| Где | Отклонение | Как привести |
|---|---|---|
| `widgets/integration-detail/ui/IntegrationDetail.vue` | Импортирует 2 виджета: `rest-api-credentials`, `s3-credentials` | Панели ключей → `features/manage-api-secrets` (или собирать на странице) |
| `entities/integration/ui/reveal-secret-modal` | Модалка-действие в слое `entities` | Перенести в `features` |
| `entities/integration/model/store.ts` | Мутации на моках в Pinia сущности | Временное решение под фича-флагом; не образец. Заменить на API, когда появится |

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
| `entities/product/model/{displayNames,docsLinks,hiddenServices}.ts`, `entities/dataset/model/templateMapper.ts` | Бизнес-справочники по slug'ам на фронте | Fallback в `config/` с `TODO` на задачу бэка |
| `features/upload-dataset/model/store.ts` | Стор сам грузит шаблоны в обход `useDatasetTemplates`; `filesMap` с `File` и квота в `localStorage` | Шаблоны через `useDatasetTemplates`; квоту считать на бэке |
| `shared/api/api-client.ts`, `main.ts` | Пустой интерсептор, нет обработки 401 во время работы; `retry: 1` на все ошибки | Интерсептор 401 в `app/providers/`; ретраи только сеть и 5xx |
| `.env` | Абсолютный `VITE_API_URL` на dev-хост вшивается в любую сборку (в т.ч. prod) | `server.proxy` + `VITE_API_URL=/api` (порядок — в «Конфигурации») |

## UI

| Где | Отклонение | Как привести |
|---|---|---|
| `RevealSecretModal`, `CreateApiSecretModal`, `CreateKeySecretModal` | Каркас radix-диалога скопирован вместо `AppModal` | Перевести на `AppModal` вместе с переносом в `features/manage-integration-secrets`, когда появится API ключей |
| `AppTooltip`, `PredictionsManager`, `PredictionRunHistory` | `TooltipProvider` в каждом компоненте, в `App.vue` его нет | Один провайдер в `App.vue`, затем убрать локальные |
| `ProductAccessTable.vue`, `DatasetUploadZone.vue`, `AppButton.vue` | Экспорт типов из `.vue`; `AppButton.types.ts` устарел и не используется | Типы в `*.types.ts` |
| 9 компонентов (`AppConfirmDialog`, `AppDrawer`, `AppStatusBadge`, …) | `$emit` в шаблоне | `emit` |
| `AppStatusBadge`, `AppFilterTrigger`, кнопки закрытия модалок | `div @click`, кликабельный `span` внутри `button`, иконочные кнопки без `aria-label` | По правилам доступности |
| ~22 места: `ConnectionStatusTag`, `CredentialsInfoCard`, `UserMenu`, `AppSwitch`, `AppSkeleton`, `AppWaveBackground`, `profile-overview/*`, … | Хардкод цветов, градиенты в `style`, `bg-red-50`, `bg-neutral-300` | Семантические токены |
| `ChangePasswordModal`, `usePasswordChange`, `ProfileInfoRow`, `AppConfirmDialog`, `AppStatusBadge`, `AppTooltip`, `ProductAccessTable`, `AdminSidebar` (alt) | Тексты в обход i18n | Ключи в `ru.ts` / `en.ts` |
| `widgets/dataset-history-table/model/utils.ts`, `entities/integration/model/format.ts` | Зашитые локали `'ru-RU'`, `'en-GB'` | `toIntlLocale` |
| `widgets/dashboard-*`, `tariff-*`, `profile-overview`, `prediction-processing-schedule`; `entities/tariff`, `entities/organization` | Готовый UI отвязан от страниц | Подключить за фича-флагом или удалить |
| `vitest.config.ts`, `shared/lib/cn.ts`, `tailwind.config.js`, `.stylelintrc.json` + stylelint в devDependencies, `lucide-vue-next` | Не используются / противоречат манифесту | Удалить; окружение Vitest → `node` |

## Процесс и прочее

| Где | Отклонение | Как привести |
|---|---|---|
| `.gitlab-ci.yml` | Нет проверок качества | Тикет у DevOps: джоба `quality` = `npm run check` |
| Весь код | Комментарии на русском | Переводить при правке строки, массово не переводить |
| `README.md` | Шаблон create-vue | Переписать |

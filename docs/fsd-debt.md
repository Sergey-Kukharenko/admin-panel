# Долг: отклонения кода от манифеста

Известные места, где текущий код расходится с манифестом ([`CLAUDE.md`](../CLAUDE.md)). **Это не образцы —
паттерны отсюда в новый код не копировать.**

Как работать со списком:
- в рамках задачи приводим к манифесту только тронутые файлы;
- перенос слайса между слоями или сегментами — отдельной `chore/*`-задачей;
- исправленный пункт удаляется из списка в том же коммите.

Состояние на 2026-10-15.

## FSD: слои и импорты

| Где | Отклонение | Как привести |
|---|---|---|
| `widgets/integration-detail/ui/IntegrationDetail.vue` | Импортирует 2 виджета: `rest-api-credentials`, `s3-credentials` | Панели ключей → `features/manage-api-secrets` (или собирать на странице) |
| `entities/integration/ui/reveal-secret-modal` | Модалка-действие в слое `entities` | Перенести в `features` |
| `entities/integration/model/store.ts` | Мутации на моках в Pinia сущности | Временное решение под фича-флагом; не образец. Заменить на API, когда появится |

Импортов вверх из `entities` и `features`, кросс-импортов между `features` и между `entities` нет; страницы тонкие и без запросов.

## Данные и состояние

| Где | Отклонение | Как привести |
|---|---|---|
| Статусы файлов, прогонов и сервисов | В OpenAPI — `string` без `enum`, фронт сравнивает литералы со стенда (`/fail|error/` в `prediction-run-history/model/mapper.ts`) | `enum` статусов — на стороне бэка (вопрос задан), затем `api:types` |
| `entities/integration/api/types.ts` (scopes) | `GET /project-api-credentials/scopes` нет в OpenAPI, типы ручные | Заменить на алиас, когда эндпоинт появится в схеме |
| `entities/product/model/displayNames.ts`, `entities/product/config/docsLinks.ts`, `entities/product/lib/hiddenServices.ts`, `entities/dataset/lib/templateMapper.ts` | Бизнес-справочники по slug'ам на фронте | Fallback в `config/` с `TODO` на задачу бэка |
| `features/upload-dataset/model/store.ts` | Стор сам грузит шаблоны в обход `useDatasetTemplates`; `filesMap` с `File` и квота в `localStorage` | Шаблоны через `useDatasetTemplates`; квоту считать на бэке |
| `.env` | Абсолютный `VITE_API_URL` на dev-хост вшивается в любую сборку (в т.ч. prod) | `server.proxy` + `VITE_API_URL=/api` (порядок — в «Конфигурации») |
| `nginx.conf` | `location /api/` проксирует на `mico-transcription-orchestrator-service` (скопировано из другого проекта) | Исправить вместе с переходом на `/api`, согласовать с бэкендом/DevOps |

## UI

| Где | Отклонение | Как привести |
|---|---|---|
| `RevealSecretModal`, `CreateApiSecretModal`, `CreateKeySecretModal` | Каркас radix-диалога скопирован вместо `AppModal` | Перевести на `AppModal` вместе с переносом в `features/manage-integration-secrets`, когда появится API ключей |
| `ProductAccessTable.vue`, `DatasetUploadZone.vue`, `AppButton.vue` | Экспорт типов из `.vue`; `AppButton.types.ts` устарел и не используется | Типы в `*.types.ts` |
| 9 компонентов (`AppConfirmDialog`, `AppDrawer`, `AppStatusBadge`, …) | `$emit` в шаблоне | `emit` |
| `widgets/prediction-processing-schedule` | Кликабельный `span` (месяц) внутри кнопки сворачивания календаря; правила a11y для файла выключены | Развести на две кнопки, когда виджет вернётся |
| `profile-overview/*` (`text-[#181818]`), `PredictionProcessingSchedule` (`hover:bg-black/5`) | Цвета без токена; в UI-ките состояния не раскрыты, экраны скрыты | Решить, когда экраны вернутся |
| `--text-success-soft` (`#668948`) | В Figma тоже сырой hex («Active» в Status Tag), не переменная | Попросить завести переменную в Figma |
| `profile-overview/*`, `tariff-*`, `prediction-processing-schedule` (скрытые экраны) | Тексты в обход i18n; `no-raw-text` для них выключен | Перевести вместе с возвратом экрана |
| `widgets/dataset-history-table/lib/utils.ts`, `entities/integration/lib/format.ts`, `dashboard-*-chart` (`toLocaleString('ru-RU')`) | Зашитые локали `'ru-RU'`, `'en-GB'` | `toIntlLocale` |
| `widgets/dashboard-*`, `tariff-*`, `profile-overview`, `prediction-processing-schedule`; `entities/tariff`, `entities/organization` | Готовый UI отвязан от страниц | Подключить за фича-флагом или удалить |

## Процесс и прочее

| Где | Отклонение | Как привести |
|---|---|---|
| `.gitlab-ci.yml` | Нет проверок качества | Тикет у DevOps: джоба `quality` = `npm run check` |
| Весь код и тесты | Комментарии и описания тестов (`it(...)`) на русском | Переводить при правке строки, массово не переводить |
| `Dockerfile` | `node:22-alpine` и `nginx:1.27-alpine` вместо `node:24-alpine` и `docker.io/nginxinc/nginx-unprivileged` | По `docs/delivery.md`, вместе с DevOps |
| `README.md` | Шаблон create-vue | Переписать |

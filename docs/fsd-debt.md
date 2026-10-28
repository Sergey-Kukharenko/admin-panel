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
| `widgets/integration-detail/ui/IntegrationDetail.vue` | Импортирует 4 виджета: `rest-api-connection-modal`, `rest-api-credentials`, `s3-connection-modal`, `s3-credentials` | Модалки → `features/connect-rest-api`, `features/connect-s3`; панели ключей → `features/manage-api-secrets` (или собирать на странице) |
| `entities/integration/ui/reveal-secret-modal` | Модалка-действие в слое `entities` | Перенести в `features` |
| `entities/integration/model/useIntegrationStatus.ts` (`useRequestIntegrationConnection`) | Мутация действия пользователя в `entities` | Перенести в `features/connect-*` вместе с модалками |
| `entities/integration/model/store.ts` | Мутации на моках в Pinia сущности | Временное решение под фича-флагом; не образец. Заменить на API, когда появится |

Импортов вверх из `entities` и `features`, кросс-импортов между `features` и между `entities` нет; страницы тонкие и без запросов.

## Данные и состояние

| Где | Отклонение | Как привести |
|---|---|---|
| `entities/*/api/types.ts` | Статусы в OpenAPI — строки без `enum` (`/fail|error/` в `prediction-run-history/model/mapper.ts`) | `enum` статусов — на стороне бэка, затем `api:types` |
| `entities/product/model/{displayNames,docsLinks,hiddenServices}.ts`, `entities/dataset/model/templateMapper.ts` | Бизнес-справочники по slug'ам на фронте | Fallback в `config/` с `TODO` на задачу бэка |
| `features/upload-dataset/model/store.ts` | `filesMap` с `File` и квота в `localStorage` | Квоту считать на бэке |
| `.env` | Абсолютный `VITE_API_URL` на dev-хост вшивается в любую сборку (в т.ч. prod) | `server.proxy` + `VITE_API_URL=/api` (порядок — в «Конфигурации») |

## UI

| Где | Отклонение | Как привести |
|---|---|---|
| `RevealSecretModal`, `CreateKeySecretModal` | Свой каркас radix-диалога (экраны ключей за фича-флагом, на моках) | `AppModal` — вместе с переписыванием под API ключей |
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

## Расхождения с макетом (ждут решения PM)

Экраны уже приняты PM в текущем виде, поэтому рефакторинг их не меняет: правим только после
согласования. Сверено 2026-10-28 с кадрами Figma файла Client-Portal-UI-UX. По итогам
рефакторинга (WT-547) — один общий комментарий для PM: «сверил… предлагаю…, ок?», кадры называем
по именам, а не по номерам узлов.

| Где | Макет | Сейчас |
|---|---|---|
| Диалог «Ошибки валидации» (`DatasetHistoryErrorDialog`), кадр «Ошибка загрузки» | Между последней строкой и кнопкой ~4px, высота модалки ~248px | Под строками пустой блок ~68px, высота ~324px |
| Там же, дата проверки | `14 янв 2026, 03:16` — без точки и «г.» | `20 окт. 2026 г.`; время убрано намеренно |
| Там же, оверлей | `rgba(68,68,68,0.4)`, blur 6px, без переменной Figma | `--overlay` (переменная `bg/overlay`, `rgba(48,48,50,0.25)`), как в кадре подтверждения 97:115570 |
| Там же, высота строк | 24 / 24 / 20 / 20px — разная у одного компонента «Popup list» | Все строки по 24px |
| Заголовок модалок на `AppModal` | UI-кит, компонент `Modal` — 16/24 medium; кадр «REST API _ Состояние: Интеграции не подключена…» — 14px | Модалки форм (подключение, логи ключа) — 14px; диалог ошибок и смена пароля — 16px |

Подтверждение отправки в шторке (кадр «Подтверждение загрузки файлов») совпадает с макетом: оверлей, отступы, шапка без заголовка.

## Процесс и прочее

| Где | Отклонение | Как привести |
|---|---|---|
| `.gitlab-ci.yml` | dev-стенд из `main`, `develop` без пайплайна; нет проверок качества | Тикет у DevOps; джоба `quality` |
| Весь код | Комментарии на русском | Переводить при правке строки, массово не переводить |
| `README.md` | Шаблон create-vue | Переписать |

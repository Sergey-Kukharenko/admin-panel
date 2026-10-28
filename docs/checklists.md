# Чеклисты

Правила — в [`CLAUDE.md`](../CLAUDE.md), образец кода — в [`reference-slice.md`](reference-slice.md).

## Новая страница / раздел

1. `pages/<name>/ui/<Name>Page.vue` + `index.ts` (`export { default as <Name>Page } from './ui/<Name>Page.vue'`).
2. Имя в `ROUTE_NAMES` (`shared/config/routes.ts`).
3. Маршрут в `app/router/index.ts`: `component: () => import('@/pages/<name>').then((m) => m.<Name>Page)`,
   `name`, `meta` (`requiresAuth`, `titleKey`, `nav: { icon }` — если пункт сайдбара; порядок пунктов =
   порядок маршрутов).
4. Ключи `layout.nav.<name>` и `<name>.*` в `ru.ts` и `en.ts`.
5. Содержимое — виджетами из `widgets/`.

## Новый эндпоинт / сущность

1. Обновить `openapi/openapi.json` (Swagger бэка) → `npm run api:types`; алиасы DTO и фильтров в
   `entities/<entity>/api/types.ts`.
2. Метод в `entities/<entity>/api/<name>-api.ts` (возвращает `AxiosResponse`, `signal` для списков).
3. Query-composable `model/use<Thing>.ts`: ключ (массив, домен первым), `queryFn`, при нужде
   `select` / поллинг. Ключ экспортируется, только если его инвалидирует другой слайс; фабрика
   `<entity>Keys` — когда у сущности несколько связанных запросов и мутации.
4. Реэкспорт через `index.ts` сегментов и слайса.
5. UI-модель (`model/types.ts`) + маппер (`lib/mapper.ts`) + тест маппера — в слайсе-потребителе.

## Новое действие пользователя (feature)

1. `features/<verb-object>/`: `ui/` (кнопка / модалка / форма), `model/use<Action>.ts`
   (`useMutation` + реакция: тост, инвалидация, закрытие), `index.ts`.
2. Модалка — на `AppModal` (`v-model:open`).
3. Форма сбрасывается при открытии; кнопка отправки блокируется при невалидной форме и во время
   отправки.
4. Фичу встраивает виджет или страница; фича не импортирует другие фичи и виджеты.

## Новый виджет

1. `widgets/<noun>/` с `model/use<Name>.ts`, `model/types.ts`, `ui/<Name>.vue`, `index.ts`
   (+ `lib/`, `config/` при необходимости).
2. Состояния: `<Name>Skeleton`, `<Name>ErrorState` (`@retry`), `<Name>EmptyState`.
3. Фильтры / пагинация — в URL (`use<Name>Filters` + `URL_PARAMS` в `config/urlParams.ts`).
4. Действия — фичами из `features/`; другие виджеты не импортировать.

## Новый компонент дизайн-системы

1. Проверить, что аналога нет в `shared/ui`; сверить с UI-китом Figma (страница «01. UI-kit»).
2. `shared/ui/app-<name>/App<Name>.vue` (+ `App<Name>.types.ts`, чистая логика отдельным файлом
   рядом), `index.ts`.
3. Интерактив — на `radix-vue`, стили — токены, варианты — `computed` + `switch`.
4. Компонентный тест в `__tests__/`.
5. Никакой доменной логики.

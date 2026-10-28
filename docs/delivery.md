# Поставка: git, CI/CD, деплой

Правила кода — в [`CLAUDE.md`](../CLAUDE.md). Инфраструктура — стандарт mico, меняем только
осознанно и по согласованию с DevOps.

## Git

**Этот репозиторий (черновик на GitHub):** только `main`; задача — в своей ветке от `main`, после
приёмки вливается обратно. Перед коммитом — `npm run check`. Один логический пункт — один коммит.

**Прод-репозиторий GitLab** — флоу с 2026-10-23 (ML-2904), ветка по умолчанию `develop`:

```
feature/* , fix/* , chore/*  ──MR──▶  develop  ──релизный MR──▶  main  ──тег vX.Y.Z──▶  prod
                                        │
                                        └──▶ dev-стенд
```

- `develop` — основная ветка разработки; `main` — релизная, в неё попадает только релизный MR из
  `develop`; прод выкатывается тегом `vX.Y.Z` на `main`.
- `main` и `develop` защищены, прямой push запрещён; в `develop` мерджим сквошем.
- Имена веток: `feature/<TICKET>[-<slug>]`, `fix/<TICKET>[-<slug>]`, `chore/<slug>`
  (`feature/WT-343-integration-secrets`, `fix/WT-538`, `chore/update-deps`).
- Один MR — одна задача; черновой MR открывается в начале работы. В MR задачи приводим к манифесту
  только тронутые файлы; перенос слайсов — отдельный `chore/*`.
- Без самомержа: MR вливается после ревью и зелёного пайплайна. В описании — задача, что сделано,
  как проверить, узлы Figma и скриншоты «макет / реализация» для UI.

## Коммиты

```
<TICKET>: <imperative summary>

- <main change 1>
- <main change 2>
```

- На английском. `<TICKET>` — ключ задачи; без тикета — тип изменения: `refactor:`, `chore:`,
  `docs:`, `test:`, `ci:` (`docs: add architecture manifest`).
- Заголовок короткий, в повелительном наклонении, без точки. Тело — маркированная сводка (для
  нетривиальных изменений обязательно).
- **Без соавторов:** никаких трейлеров `Co-Authored-By`, подписей «Generated with …» и упоминаний AI.

## Окружения

| Ветка / событие | Окружение | Хост |
|---|---|---|
| merge в `develop` | dev | `client-portal-ui.dev.mico.team` |
| тег `vX.Y.Z` на `main` | prod | `platform.mico.team` |
| merge в `main` без тега | не деплоится | — |


## Пайплайн и образ

- **Джоба `quality`** (стадия `test`) в MR: `npm ci` → `npm run check` (type-check, `check:lint`,
  `check:format`, тесты). Красная `quality` блокирует мерж. *(Ещё не заведена — тикет у DevOps.)*
- **Dockerfile** — multi-stage: `node:24-alpine` (`npm ci` + `npm run build`) →
  `docker.io/nginxinc/nginx-unprivileged` (non-root, порт 8080). Имена образов полностью
  квалифицированные (buildah не резолвит short names). `.env.local` в образ не попадает.
- **nginx.conf** — только статика: SPA-fallback на `index.html`, `index.html` без кэша, хэшированные
  ассеты — `immutable` на год, `/healthz` для проб. Проксирования в nginx нет.
- **Helm** — обёртка над общим `mico-app`; `values.yaml` (ресурсы, пробы на `/healthz`, `emptyDir` в
  `/tmp` под `readOnlyRootFilesystem`), `values-dev.yaml` / `values-prod.yaml` (образ, HTTPRoute:
  `/api` → `mico-client-portal-api:8000` с вырезанием префикса, `/` → UI). Секретов в values нет.
- **GitLab CI** — общие mico-компоненты (сборка образа buildah, зеркалирование в
  `registry.mico.team`), `helm-lint` в MR, публикация чарта и триггер деплоя на стороне mico.
- Новая переменная `VITE_*` вшивается на этапе `npm run build` — согласуй с CI / Docker.

Текущие отличия Dockerfile / nginx / CI от этого описания — в [`fsd-debt.md`](fsd-debt.md).

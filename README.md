# admin-panel

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Deployment

- Helm chart: `helm/`

Dev is deployed automatically on every push to `develop`.

Prod is **not** deployed by pushing to `main` — prod is deployed by a semver tag.

## Release process

`develop` -> `main` -> tag on `main`.

1. Merge the work into `develop`; merge requests target `develop`. Each push to
   `develop` deploys dev.
2. When the release is ready, open a merge request from `develop` to `main` and
   merge it.
3. Put a semver tag (`vX.Y.Z`) on the resulting `main` commit. The tag pipeline
   publishes the chart and the image and triggers the prod deploy.

Only a tag that is on `main` deploys prod. A semver tag on any other commit
fails the `assert-tag-on-main` job before anything is published or deployed, so
prod always matches a commit reachable from `main` (ML-2958).

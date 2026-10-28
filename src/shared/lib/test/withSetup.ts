import { type App, createApp, type Plugin } from 'vue';

/**
 * Runs a composable inside a real Vue app, so inject (router, i18n, Vue Query), lifecycle hooks
 * and watchers work. For testing composables outside a component; call app.unmount() after the test.
 */
export function withSetup<T>(composable: () => T, plugins: Plugin[] = []): [T, App] {
  let result!: T;

  const app = createApp({
    setup() {
      result = composable();
      return () => null;
    },
  });

  plugins.forEach((plugin) => app.use(plugin));
  app.mount(document.createElement('div'));

  return [result, app];
}

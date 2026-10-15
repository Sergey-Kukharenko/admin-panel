import { type App, createApp, type Plugin } from 'vue';

/**
 * Запускает composable внутри настоящего приложения Vue: работают inject (роутер, i18n,
 * Vue Query), жизненный цикл и watch. Для тестов composables вне компонента.
 * После теста вызывайте app.unmount().
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

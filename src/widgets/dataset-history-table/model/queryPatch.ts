import type { LocationQueryRaw, RouteLocationNormalizedLoaded, Router } from 'vue-router';

export function createQueryPatch(route: RouteLocationNormalizedLoaded, router: Router) {
  return function replaceQuery(values: Record<string, string | string[] | undefined>) {
    // 1. Создаем чистую копию текущих параметров URL
    const nextQuery: LocationQueryRaw = { ...route.query };

    // 2. Накатываем новые значения параметров
    Object.entries(values).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
      ) {
        // Если параметр сброшен или массив пуст — полностью удаляем ключ из URL
        delete nextQuery[key];
      } else if (Array.isArray(value)) {
        // ⚡ ВАЖНО: Если пришел массив (множественный выбор), принудительно склеиваем в плоскую строку.
        // Это предотвращает баг Vue Router, когда он затирает массив и оставляет только последний элемент.
        nextQuery[key] = value.join(',');
      } else {
        nextQuery[key] = String(value);
      }
    });

    // 3. Дополнительно зачищаем старые пустые параметры, если они застряли в route.query
    Object.keys(nextQuery).forEach((key) => {
      if (!nextQuery[key]) {
        delete nextQuery[key];
      }
    });

    // 4. Обновляем URL в браузере
    router.replace({
      query: nextQuery,
    });
  };
}

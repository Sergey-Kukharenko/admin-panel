/// <reference types="vite/client" />

// 1. Для обычных картинок (импорт без суффиксов возвращает строку)
declare module '*.svg' {
  const content: string;
  export default content;
}

// 2. Для иконок навигации (с суффиксом возвращает Vue-компонент)
declare module '*.svg?component' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>;
  export default component;
}

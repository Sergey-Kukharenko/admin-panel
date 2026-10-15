export type AppModalSize = 'sm' | 'md';

export type AppModalTitleSize = 'sm' | 'md';

/** strong — модалка поверх страницы, soft — диалог поверх другого слоя (например, дровера) */
export type AppModalOverlay = 'strong' | 'soft';

export interface AppModalProps {
  open: boolean;
  /** Заголовок в шапке. Без него шапка содержит только крестик, а `DialogTitle` рендерит слот */
  title?: string;
  size?: AppModalSize;
  /** Временный пропс: размер заголовка в модалках разошёлся (text-sm / text-base), ждём решения по макету */
  titleSize?: AppModalTitleSize;
  overlay?: AppModalOverlay;
  /** true, если в слоте есть `DialogDescription`; иначе `aria-describedby` снимается */
  hasDescription?: boolean;
}

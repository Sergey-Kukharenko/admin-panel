export type AppModalSize = 'sm' | 'md';

/** strong — модалка поверх страницы, soft — диалог поверх другого слоя (например, дровера) */
export type AppModalOverlay = 'strong' | 'soft';

export interface AppModalProps {
  open: boolean;
  /** Заголовок в шапке. Без него шапка содержит только крестик, а `DialogTitle` рендерит слот */
  title?: string;
  size?: AppModalSize;
  overlay?: AppModalOverlay;
  /** true, если в слоте есть `DialogDescription`; иначе `aria-describedby` снимается */
  hasDescription?: boolean;
}

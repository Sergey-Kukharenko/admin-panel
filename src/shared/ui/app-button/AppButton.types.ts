export interface AppButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'icon';
  disabled?: boolean;
  /**
   * Element to render: `a` for a link that looks like a button (`href`, `target` and `rel` go as
   * attributes). `disabled` applies to the `button` only: the attribute blocks neither the click nor
   * the focus of an `<a>`, a disabled link would need `aria-disabled="true"`, no `href` and
   * `tabindex="-1"` (no consumer needs it yet)
   */
  as?: 'button' | 'a';
}

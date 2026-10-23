export interface AppCheckboxProps {
  modelValue?: boolean;
  disabled?: boolean;
  /**
   * Fill of the checked box instead of bg/accent: a token, e.g. `var(--stats-users)` for a chart
   * legend (the UI kit Legend Item 52:3438 colors the box with its series)
   */
  color?: `var(--${string})`;
}

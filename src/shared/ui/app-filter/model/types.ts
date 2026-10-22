import type { IconName } from '@/shared/ui/app-icon';

export interface FilterOption {
  label: string;
  value: string;
}

export interface AppFilterProps {
  title: string;
  /** Leading icon; the UI kit Filter hides it where the label is enough (dashboard chart) */
  icon?: IconName;
  options: readonly FilterOption[];
  /** UI kit Filter state=disabled: tertiary label and icons, not interactive */
  disabled?: boolean;
}

export interface AppFilterSingleProps extends AppFilterProps {
  modelValue?: string;
  /** Show a reset cross instead of the arrow while a value is selected */
  clearable?: boolean;
}

export interface AppFilterMultipleProps extends AppFilterProps {
  modelValue?: string[];
}

import type { IconName } from '@/shared/ui/app-icon';

export interface FilterOption {
  label: string;
  value: string;
}

export interface AppFilterProps {
  title: string;
  icon: IconName;
  options: readonly FilterOption[];
}

export interface AppFilterSingleProps extends AppFilterProps {
  modelValue?: string;
}

export interface AppFilterMultipleProps extends AppFilterProps {
  modelValue?: string[];
}

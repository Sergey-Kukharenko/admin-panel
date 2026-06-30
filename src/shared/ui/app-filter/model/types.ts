import type { Component } from 'vue';

export interface FilterOption {
  label: string;
  value: string;
}

export interface AppFilterProps {
  title: string;
  icon: Component;
  options: readonly FilterOption[];
}

export interface AppFilterSingleProps extends AppFilterProps {
  modelValue?: string;
}

export interface AppFilterMultipleProps extends AppFilterProps {
  modelValue?: string[];
}

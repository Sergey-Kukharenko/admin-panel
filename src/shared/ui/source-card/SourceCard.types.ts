import type { Component } from 'vue';

export interface SourceCardProps {
  title: string;
  description: string;
  icon: Component;
  status: 'active' | 'inactive';
}

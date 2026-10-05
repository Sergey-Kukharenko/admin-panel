<script setup lang="ts">
import type { DatasetIcon } from '@/entities/dataset/model/types';
import { AppIcon, type IconName } from '@/shared/ui/app-icon';

defineOptions({
  name: 'DatasetTemplateIcon',
});

const props = defineProps<{
  icon: DatasetIcon;
}>();

// Иконки типов данных из набора дизайн-системы (Figma Icons 52:4927)
const icons: Record<DatasetIcon, IconName> = {
  users: 'group-line',
  vip: 'vip-crown-2-line',
  bets: 'target-line',
  balance: 'exchange-funds-line',
  payments: 'wallet-line',
};
</script>

<template>
  <!-- Декоративная иконка — рядом всегда есть видимое название типа данных текстом -->
  <AppIcon :name="icons[props.icon]" class="size-4 text-(--text-primary)" />
</template>

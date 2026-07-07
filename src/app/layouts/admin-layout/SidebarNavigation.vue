<script setup lang="ts">
import { CreditCard, Database, Home, Plug, Sparkles } from 'lucide-vue-next';

interface NavigationItem {
  label: string;
  to: string;
  icon: typeof Home;
}

const items: NavigationItem[] = [
  {
    label: 'Главная',
    to: '/dashboard',
    icon: Home,
  },
  {
    label: 'Интеграции',
    to: '/integrations',
    icon: Plug,
  },
  {
    label: 'Загрузка данных',
    to: '/datasets',
    icon: Database,
  },
  {
    label: 'Предсказания',
    to: '/predictions',
    icon: Sparkles,
  },
  {
    label: 'Тарифы',
    to: '/billing',
    icon: CreditCard,
  },
];
</script>

<template>
  <nav class="px-3">
    <ul class="flex flex-col gap-1">
      <li v-for="item in items" :key="item.to">
        <RouterLink
          :to="item.to"
          class="flex h-9 items-center gap-3 rounded-lg px-3 text-[14px] leading-5 font-medium text-(--muted-foreground) transition-colors hover:bg-(--muted)"
          active-class="bg-(--muted) text-(--foreground)"
        >
          <component :is="item.icon" class="h-4.5 w-4.5 shrink-0" />

          <span>
            {{ item.label }}
          </span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

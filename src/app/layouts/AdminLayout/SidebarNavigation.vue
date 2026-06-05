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
  <nav>
    <ul class="space-y-1">
      <li v-for="item in items" :key="item.to">
        <RouterLink :to="item.to" class="sidebar-link" exact-active-class="router-link-active">
          <component :is="item.icon" class="size-4 shrink-0" />

          <span>
            {{ item.label }}
          </span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

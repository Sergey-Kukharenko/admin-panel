<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import HeaderActions from './HeaderActions.vue';

const route = useRoute();

const routeTitles: Record<string, string> = {
  '/dashboard': 'Главная',
  '/integrations': 'Интеграции',
  '/datasets': 'Загрузка данных',
  '/predictions': 'Предсказания',
  '/billing': 'Тарифы',
};

const title = computed(() => routeTitles[route.path] ?? 'Загрузка данных');
</script>

<template>
  <header
    class="flex h-(--header-height) items-center justify-between border-b border-(--border) bg-(--surface) px-8"
  >
    <h1 class="text-sm font-medium text-(--color-foreground)">{{ title }}</h1>

    <HeaderActions />
  </header>
</template>

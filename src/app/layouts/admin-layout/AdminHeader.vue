<script setup lang="ts">
import HeaderActions from './HeaderActions.vue';
</script>

<template>
  <header
    class="flex h-(--header-height) items-center justify-between border-b border-(--border) bg-white px-8"
  >
    <h1 class="text-sm font-medium text-(--color-foreground)">Загрузка данных</h1>

    <HeaderActions />
  </header>
</template>

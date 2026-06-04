<script setup lang="ts">
import { Database } from 'lucide-vue-next';
</script>

<template>
  <section
    class="flex min-h-[320px] flex-col items-center justify-center rounded-xl border text-center"
  >
    <Database class="mb-4 size-12 text-muted-foreground" />

    <h2 class="mb-2 text-lg font-semibold">Нет загрузок</h2>

    <p class="text-sm text-muted-foreground">Загрузите данные, чтобы начать работу с моделью</p>
  </section>
</template>

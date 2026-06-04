<script setup lang="ts">
import { Brain, CreditCard, Database, Home, Plug } from 'lucide-vue-next';
</script>

<template>
  <nav>
    <ul class="space-y-1">
      <li>
        <RouterLink
          to="/"
          class="flex h-9 items-center gap-3 rounded-xl px-3 text-[15px] text-[#5F5F5F]"
        >
          <Home class="size-4" />
          Главная
        </RouterLink>
      </li>

      <li>
        <RouterLink
          to="/integrations"
          class="flex h-9 items-center gap-3 rounded-xl px-3 text-[15px] text-[#5F5F5F]"
        >
          <Plug class="size-4" />
          Интеграции
        </RouterLink>
      </li>

      <li>
        <RouterLink
          to="/datasets"
          class="flex h-9 items-center gap-3 rounded-xl bg-[#EEEEEE] px-3 text-[15px] font-medium text-[#222222]"
        >
          <Database class="size-4" />
          Загрузка данных
        </RouterLink>
      </li>

      <li>
        <RouterLink
          to="/predictions"
          class="flex h-9 items-center gap-3 rounded-xl px-3 text-[15px] text-[#5F5F5F]"
        >
          <Brain class="size-4" />
          Предсказания
        </RouterLink>
      </li>

      <li>
        <RouterLink
          to="/billing"
          class="flex h-9 items-center gap-3 rounded-xl px-3 text-[15px] text-[#5F5F5F]"
        >
          <CreditCard class="size-4" />
          Тарифы
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

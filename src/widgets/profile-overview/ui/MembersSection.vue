<script setup lang="ts">
import { MOCK_ORGANIZATION_MEMBERS } from '@/entities/organization';

defineOptions({
  name: 'MembersSection',
});
</script>

<template>
  <section
    class="flex w-full flex-col gap-2 rounded-(--radius-xl) pt-4 pb-2"
    style="background-image: linear-gradient(180deg, #ffffff 1%, rgba(217, 217, 217, 0.3) 37%)"
  >
    <p class="px-4 text-base font-medium text-[#181818]">Пользователи</p>

    <div class="mx-2 w-full overflow-hidden rounded-(--radius-xl) border border-(--border-default)">
      <div class="flex w-full items-center">
        <div
          class="flex h-9 flex-1 items-center border-r border-(--border-default) bg-(--bg-surface-secondary) px-4 font-mono text-xs font-medium uppercase text-(--text-secondary)"
        >
          Имя
        </div>
        <div
          class="flex h-9 flex-1 items-center border-r border-(--border-default) bg-(--bg-surface-secondary) px-4 font-mono text-xs font-medium uppercase text-(--text-secondary)"
        >
          Email
        </div>
        <div
          class="flex h-9 flex-1 items-center bg-(--bg-surface-secondary) px-4 font-mono text-xs font-medium uppercase text-(--text-secondary)"
        >
          Роль
        </div>
      </div>

      <div
        v-for="member in MOCK_ORGANIZATION_MEMBERS"
        :key="member.id"
        class="flex w-full items-center border-t border-(--border-default)"
      >
        <div class="flex h-11 flex-1 items-center border-r border-(--border-default) px-4 text-sm text-(--text-primary)">
          {{ member.name }}
        </div>
        <div class="flex h-11 flex-1 items-center border-r border-(--border-default) px-4 text-sm text-(--text-primary)">
          {{ member.email }}
        </div>
        <div class="flex h-11 flex-1 items-center px-4 text-sm text-(--text-primary)">
          {{ member.role }}
        </div>
      </div>
    </div>
  </section>
</template>

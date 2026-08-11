<script setup lang="ts">
import { LogOut, User } from 'lucide-vue-next';
import { computed } from 'vue';

import { useUserStore } from '@/entities/user';
import { AppDropdown, AppDropdownItem } from '@/shared/ui/app-dropdown';

defineOptions({
  name: 'UserMenu',
});

const userStore = useUserStore();

const email = computed(() => userStore.user?.email ?? '');
</script>

<template>
  <AppDropdown align="end" :side-offset="8">
    <template #trigger>
      <button type="button" class="flex size-8 shrink-0 items-center justify-center rounded-full">
        <img src="https://i.pravatar.cc/32" alt="avatar" class="size-8 rounded-full" />
      </button>
    </template>

    <div class="flex flex-col gap-0.5 px-3 py-2">
      <p class="truncate text-body-sm font-medium text-(--text-primary)">{{ email }}</p>
    </div>

    <AppDropdownItem>
      <User class="size-4 text-(--text-secondary)" stroke-width="2" />
      <span class="text-body-sm font-medium text-(--text-primary)">Профиль</span>
    </AppDropdownItem>

    <AppDropdownItem @select="userStore.logout()">
      <LogOut class="size-4 text-(--text-secondary)" stroke-width="2" />
      <span class="text-body-sm font-medium text-(--text-primary)">Выйти</span>
    </AppDropdownItem>
  </AppDropdown>
</template>

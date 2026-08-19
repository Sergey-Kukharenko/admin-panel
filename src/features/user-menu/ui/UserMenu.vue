<script setup lang="ts">
import { LogOut, User } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { MOCK_ORGANIZATION_MEMBERS } from '@/entities/organization';
import { useUserStore } from '@/entities/user';
import { AppConfirmDialog } from '@/shared/ui/app-confirm-dialog';
import { AppDropdown, AppDropdownItem } from '@/shared/ui/app-dropdown';

defineOptions({
  name: 'UserMenu',
});

const userStore = useUserStore();
const router = useRouter();

const email = computed(() => userStore.user?.email ?? '');
const displayName = computed(() => MOCK_ORGANIZATION_MEMBERS[0]?.name ?? '');

const isLogoutConfirmOpen = ref(false);

function handleLogout(): void {
  isLogoutConfirmOpen.value = false;
  userStore.logout();
}
</script>

<template>
  <AppDropdown align="end" :side-offset="8">
    <template #trigger>
      <button type="button" class="flex size-8 shrink-0 items-center justify-center rounded-(--radius-full)">
        <img src="https://i.pravatar.cc/32" alt="avatar" class="size-8 rounded-(--radius-full)" />
      </button>
    </template>

    <div class="flex flex-col gap-0.5 px-3 py-2">
      <p v-if="displayName" class="truncate text-body-sm font-medium text-(--text-primary)">
        {{ displayName }}
      </p>
      <p class="truncate text-body-xs text-(--text-secondary)">{{ email }}</p>
    </div>

    <AppDropdownItem @select="router.push('/profile')">
      <User class="size-4 text-(--text-secondary)" stroke-width="2" />
      <span class="text-body-sm font-medium text-(--text-primary)">Профиль</span>
    </AppDropdownItem>

    <AppDropdownItem @select="isLogoutConfirmOpen = true">
      <LogOut class="size-4 text-(--text-secondary)" stroke-width="2" />
      <span class="text-body-sm font-medium text-(--text-primary)">Выйти</span>
    </AppDropdownItem>
  </AppDropdown>

  <AppConfirmDialog
    :open="isLogoutConfirmOpen"
    title="Выйти из профиля?"
    description="Для продолжения работы потребуется снова войти в систему."
    confirm-label="Выйти"
    @close="isLogoutConfirmOpen = false"
    @confirm="handleLogout"
  />
</template>

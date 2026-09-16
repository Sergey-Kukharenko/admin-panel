<script setup lang="ts">
import { LogOut, User } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { MOCK_ORGANIZATION_MEMBERS } from '@/entities/organization';
import { useUserStore } from '@/entities/user';
import avatarPlaceholderUrl from '@/shared/assets/images/avatar-placeholder.png';
import { AppConfirmDialog } from '@/shared/ui/app-confirm-dialog';
import { AppDropdown, AppDropdownItem } from '@/shared/ui/app-dropdown';

defineOptions({
  name: 'UserMenu',
});

const userStore = useUserStore();
const router = useRouter();
const { t } = useI18n({ useScope: 'global' });

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
      <button
        type="button"
        class="relative size-7 shrink-0 overflow-hidden rounded-(--radius-full)"
        style="background-image: linear-gradient(146deg, #bfed85 21.5%, #e4ffc3 94.33%)"
      >
        <img
          :src="avatarPlaceholderUrl"
          alt=""
          class="absolute left-[3.91px] top-[7.23px] h-[21.64px] w-[20.18px]"
        />
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
      <span class="text-body-sm font-medium text-(--text-primary)">{{ t('layout.userMenu.profile') }}</span>
    </AppDropdownItem>

    <AppDropdownItem @select="isLogoutConfirmOpen = true">
      <LogOut class="size-4 text-(--text-secondary)" stroke-width="2" />
      <span class="text-body-sm font-medium text-(--text-primary)">{{ t('layout.userMenu.logout') }}</span>
    </AppDropdownItem>
  </AppDropdown>

  <AppConfirmDialog
    :open="isLogoutConfirmOpen"
    :title="t('layout.userMenu.logoutConfirmTitle')"
    :description="t('layout.userMenu.logoutConfirmDescription')"
    :confirm-label="t('layout.userMenu.logout')"
    @close="isLogoutConfirmOpen = false"
    @confirm="handleLogout"
  />
</template>

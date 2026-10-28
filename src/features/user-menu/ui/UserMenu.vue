<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { UserAvatar, useUserStore } from '@/entities/user';
import { ROUTE_NAMES } from '@/shared/config';
import { AppConfirmDialog } from '@/shared/ui/app-confirm-dialog';
import { AppDropdown, AppDropdownItem } from '@/shared/ui/app-dropdown';
import { AppIcon } from '@/shared/ui/app-icon';

defineOptions({
  name: 'UserMenu',
});

const userStore = useUserStore();
const router = useRouter();
const { t } = useI18n({ useScope: 'global' });

const email = computed(() => userStore.user?.email ?? '');
const displayName = computed(() => userStore.user?.name ?? '');

const isLogoutConfirmOpen = ref(false);

function handleLogout(): void {
  isLogoutConfirmOpen.value = false;
  userStore.logout();
}
</script>

<template>
  <!-- UI kit "Dropdown / type=Proifle" (Figma 1221:234960): avatar + name + email head, then
       Profile and Log out items without gap between them -->
  <AppDropdown align="end" :side-offset="8" content-class="w-53 gap-0.5 p-1">
    <template #trigger>
      <button
        type="button"
        class="shrink-0 rounded-(--radius-full) focus-visible:shadow-(--shadow-focus) focus-visible:outline-none"
        :aria-label="t('layout.userMenu.ariaLabel')"
      >
        <UserAvatar />
      </button>
    </template>

    <div class="flex h-12 items-center gap-2 px-3 py-1.5">
      <UserAvatar />

      <div class="flex min-w-0 flex-col">
        <p v-if="displayName" class="truncate text-body-sm font-medium text-(--text-primary)">
          {{ displayName }}
        </p>
        <p class="truncate text-body-xs text-(--text-secondary)">{{ email }}</p>
      </div>
    </div>

    <div class="flex flex-col">
      <AppDropdownItem @select="router.push({ name: ROUTE_NAMES.profile })">
        <AppIcon name="user-line" class="size-4 text-(--icon-secondary)" />
        <span class="text-body-sm font-medium text-(--text-primary)">
          {{ t('layout.userMenu.profile') }}
        </span>
      </AppDropdownItem>

      <!-- Log out looks like the other items, as in most mockup frames (1221:228909, 1221:232532);
           the red variant of the library component is not used (decision 2026-10-16) -->
      <AppDropdownItem @select="isLogoutConfirmOpen = true">
        <AppIcon name="logout-circle-r-line" class="size-4 text-(--icon-secondary)" />
        <span class="text-body-sm font-medium text-(--text-primary)">
          {{ t('layout.userMenu.logout') }}
        </span>
      </AppDropdownItem>
    </div>
  </AppDropdown>

  <AppConfirmDialog
    v-model:open="isLogoutConfirmOpen"
    :title="t('layout.userMenu.logoutConfirmTitle')"
    :description="t('layout.userMenu.logoutConfirmDescription')"
    :confirm-label="t('layout.userMenu.logout')"
    @confirm="handleLogout"
  />
</template>

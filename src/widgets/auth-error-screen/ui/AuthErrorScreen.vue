<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useUserStore } from '@/entities/user';
import { AppButton } from '@/shared/ui/app-button';
import { AppIcon } from '@/shared/ui/app-icon';

defineOptions({
  name: 'AuthErrorScreen',
});

const props = defineProps<{
  /** Код ошибки из ?error= после неудачного OIDC-callback, например PortalUserNotProvisionedError */
  errorCode: string;
}>();

const { t, te } = useI18n({ useScope: 'global' });
const userStore = useUserStore();

// Для известных кодов — понятное объяснение, для остальных — общее
const description = computed(() => {
  const key = `auth.error.descriptions.${props.errorCode}`;
  return te(key) ? t(key) : t('auth.error.descriptions.default');
});

// Повторный вход — только по явному клику пользователя (без автоматического редиректа)
function retry() {
  window.history.replaceState(null, '', '/');
  userStore.login();
}
</script>

<template>
  <div class="flex h-screen w-screen items-center justify-center bg-(--background) px-4">
    <div class="flex max-w-100 flex-col items-center gap-4 text-center">
      <AppIcon name="spam-2-line" class="size-6 text-(--danger-failed)" />

      <div class="flex flex-col items-center gap-1">
        <p class="text-lg font-medium leading-6 text-(--text-primary)">
          {{ t('auth.error.title') }}
        </p>
        <p class="text-sm font-normal leading-5 text-(--text-secondary)">{{ description }}</p>
      </div>

      <AppButton variant="secondary" @click="retry">{{ t('auth.error.retry') }}</AppButton>

      <p class="font-mono text-xs text-(--text-secondary)">
        {{ t('auth.error.code') }}: {{ errorCode }}
      </p>
    </div>
  </div>
</template>

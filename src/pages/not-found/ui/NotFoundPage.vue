<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { ROUTE_NAMES } from '@/shared/config';
import { AppButton } from '@/shared/ui/app-button';
import { AppEmptyState } from '@/shared/ui/app-empty-state';

defineOptions({
  name: 'NotFoundPage',
});

const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
</script>

<template>
  <div class="flex flex-1 items-center justify-center">
    <AppEmptyState :title="t('notFound.title')" :description="t('notFound.description')">
      <template #action>
        <AppButton size="small" @click="router.push({ name: ROUTE_NAMES.datasets })">
          {{ t('notFound.backHome') }}
        </AppButton>
      </template>
    </AppEmptyState>
  </div>
</template>

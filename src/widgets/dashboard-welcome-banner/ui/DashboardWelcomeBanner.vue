<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { ROUTE_NAMES, ROUTE_QUERY } from '@/shared/config';
import { AppButton } from '@/shared/ui/app-button';

import illustrationUrl from '../assets/welcome-illustration.png';

const { t } = useI18n({ useScope: 'global' });
const router = useRouter();

function openUpload() {
  router.push({ name: ROUTE_NAMES.datasets, query: { [ROUTE_QUERY.openUpload]: '1' } });
}

function openIntegrations() {
  router.push({ name: ROUTE_NAMES.integrations });
}
</script>

<template>
  <!-- Figma «banner» (dashboard frame «Идет обучение модели» 1322:138651). Shown in every state of
       the dashboard, not only on the first visit (PM decision, 2026-11-03, WT-564) -->
  <section
    class="flex h-22 items-center gap-3 overflow-hidden rounded-(--radius-xl) bg-(--bg-surface-accent) pr-4"
  >
    <img :src="illustrationUrl" alt="" class="size-22 shrink-0 object-cover" />

    <div class="flex min-w-0 flex-1 flex-col gap-1">
      <h2 class="text-body-sm font-medium text-(--text-primary)">
        {{ t('dashboard.welcome.title') }}
      </h2>

      <p class="text-body-xs text-(--text-secondary)">
        {{ t('dashboard.welcome.description') }}
      </p>
    </div>

    <AppButton size="small" @click="openUpload">
      {{ t('dashboard.welcome.uploadCsv') }}
    </AppButton>

    <AppButton size="small" @click="openIntegrations">
      {{ t('dashboard.welcome.connectIntegrations') }}
    </AppButton>
  </section>
</template>

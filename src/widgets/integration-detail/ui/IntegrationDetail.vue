<script setup lang="ts">
import { ArrowUpRight, FileText } from 'lucide-vue-next';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

import type { Integration } from '@/entities/integration';
import { useIntegrationsStore } from '@/entities/integration';
import { AppButton } from '@/shared/ui/app-button';
import { AppEmptyState } from '@/shared/ui/app-empty-state';
import { RestApiConnectionModal } from '@/widgets/rest-api-connection-modal';

defineOptions({
  name: 'IntegrationDetail',
});

const props = defineProps<{
  integration: Integration;
}>();

const router = useRouter();
const integrationsStore = useIntegrationsStore();

const isConnectionModalOpen = ref(false);

function requestConnection() {
  if (props.integration.type === 'rest-api') {
    isConnectionModalOpen.value = true;
    return;
  }

  // TODO: заменить на реальный вызов API, когда появится backend-эндпоинт запроса подключения.
}

function handleConnectionRequestSubmit() {
  isConnectionModalOpen.value = false;
  integrationsStore.requestConnection(props.integration.type);
  toast.success('Заявка успешно создана!');
  router.push('/integrations');
}
</script>

<template>
  <div class="flex w-full flex-1 flex-col gap-8">
    <div class="flex items-start justify-between gap-4">
      <div class="flex flex-col gap-2">
        <p class="text-lg font-medium text-(--text-primary)">{{ integration.name }}</p>
        <p class="text-sm text-(--text-secondary)">{{ integration.detail.description }}</p>
      </div>

      <a
        v-if="integration.detail.docsUrl"
        :href="integration.detail.docsUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex h-9 shrink-0 items-center gap-2 rounded-(--radius-lg) bg-(--muted) px-4 text-element-button font-medium text-(--foreground) hover:bg-(--muted-hover)"
      >
        <FileText class="size-4" />
        Документация API
        <ArrowUpRight class="size-4" />
      </a>
    </div>

    <div class="flex flex-1 items-center justify-center">
      <AppEmptyState
        :title="integration.detail.emptyStateTitle"
        :description="integration.detail.emptyStateDescription"
        :illustration-src="integration.detail.illustrationSrc"
      >
        <template #action>
          <AppButton size="small" @click="requestConnection">
            {{ integration.detail.ctaLabel }}
          </AppButton>
        </template>
      </AppEmptyState>
    </div>

    <RestApiConnectionModal
      v-if="integration.type === 'rest-api'"
      :open="isConnectionModalOpen"
      @close="isConnectionModalOpen = false"
      @submit="handleConnectionRequestSubmit"
    />
  </div>
</template>

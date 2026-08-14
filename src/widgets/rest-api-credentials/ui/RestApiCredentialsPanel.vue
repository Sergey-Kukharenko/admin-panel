<script setup lang="ts">
import { Copy } from 'lucide-vue-next';
import { computed } from 'vue';
import { toast } from 'vue-sonner';

import type { IntegrationType } from '@/entities/integration';
import { ConnectionStatusTag, useIntegrationsStore } from '@/entities/integration';

import ApiSecretsSection from './ApiSecretsSection.vue';

defineOptions({
  name: 'RestApiCredentialsPanel',
});

const props = defineProps<{
  integrationType: IntegrationType;
}>();

const integrationsStore = useIntegrationsStore();

const clientId = computed(() => integrationsStore.getClientCredentials(props.integrationType).clientId);

async function copyClientId() {
  await navigator.clipboard.writeText(clientId.value);
  toast.success('Скопировано');
}
</script>

<template>
  <div class="flex w-full flex-col gap-8">
    <div
      class="flex flex-col gap-2 rounded-(--radius-xl) pt-4 pb-2"
      style="background-image: linear-gradient(180deg, #ffffff 1%, rgba(217, 217, 217, 0.3) 37%)"
    >
      <p class="px-4 text-base font-medium text-[#181818]">Общая информация</p>

      <div class="mx-2 flex flex-col gap-4 rounded-(--radius-lg) border border-(--border-default) bg-white p-4">
        <div class="flex items-center gap-4">
          <p class="w-49.5 shrink-0 text-sm text-(--text-primary)">Статус подключения</p>
          <ConnectionStatusTag status="connected" />
        </div>

        <div class="h-px w-full bg-(--border-default)" />

        <div class="flex items-center gap-4">
          <p class="w-49.5 shrink-0 text-sm text-(--text-primary)">client_id</p>
          <p class="flex-1 text-sm text-(--text-primary)">{{ clientId }}</p>
          <button
            type="button"
            aria-label="Скопировать client_id"
            class="flex size-8 shrink-0 items-center justify-center rounded-(--radius-lg) text-(--text-secondary) hover:bg-(--muted)"
            @click="copyClientId"
          >
            <Copy class="size-4" />
          </button>
        </div>
      </div>
    </div>

    <ApiSecretsSection :integration-type="integrationType" />
  </div>
</template>

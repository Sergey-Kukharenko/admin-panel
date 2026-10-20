<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IntegrationEnvironment, S3ConnectionRequest } from '@/entities/integration';
import { buildS3ConnectionRequest, EnvironmentTabs } from '@/entities/integration';
import { AppButton } from '@/shared/ui/app-button';
import { AppIcon } from '@/shared/ui/app-icon';
import { AppModal } from '@/shared/ui/app-modal';

const props = defineProps<{
  /** The request is being sent: block resubmitting and show a spinner */
  submitting?: boolean;
}>();

const open = defineModel<boolean>('open', { required: true });

const emit = defineEmits<{
  submit: [request: S3ConnectionRequest];
}>();

const { t } = useI18n({ useScope: 'global' });

const organization = ref('');
// Выбор среды есть в макете (1221:201386) и в RFC S3, хотя в WT-348 его нет — см. коммент в WT-337
const environment = ref<IntegrationEnvironment>('production');

watch(open, (isOpen) => {
  if (!isOpen) return;
  organization.value = '';
  environment.value = 'production';
});

function handleSubmit() {
  if (props.submitting) return;

  // Sending (POST /project-s3-credentials/request) and its errors are handled by the feature model
  emit('submit', buildS3ConnectionRequest({ environment: environment.value }));
}
</script>

<template>
  <AppModal v-model:open="open" :title="t('integrations.s3Modal.title')">
    <form id="s3-connection-form" class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <p class="text-sm text-(--text-secondary)">
        {{ t('integrations.s3Modal.description') }}
      </p>

      <div class="flex flex-col gap-1">
        <label for="s3-organization" class="text-sm font-medium text-(--text-primary)">
          {{ t('integrations.connectionForm.organization') }}
        </label>
        <input
          id="s3-organization"
          v-model="organization"
          type="text"
          placeholder="New_Casino"
          class="h-9 w-full rounded-(--radius-lg) bg-(--bg-input) px-3 text-sm text-(--text-primary) outline-none placeholder:text-(--text-secondary) focus-visible:ring-2 focus-visible:ring-(--border-accent)"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label for="s3-connection-type" class="text-sm font-medium text-(--text-primary)">
          {{ t('integrations.connectionForm.connectionType') }}
        </label>
        <input
          id="s3-connection-type"
          value="S3"
          disabled
          type="text"
          class="h-9 w-full rounded-(--radius-lg) bg-(--bg-input) px-3 text-sm text-(--text-secondary) outline-none disabled:cursor-not-allowed"
        />
      </div>

      <div class="flex flex-col gap-1 pb-2">
        <p class="text-sm font-medium text-(--text-primary)">
          {{ t('integrations.connectionForm.environment') }}
        </p>

        <EnvironmentTabs v-model="environment" />
      </div>
    </form>

    <template #footer>
      <AppButton variant="outline" @click="open = false">
        {{ t('integrations.connectionForm.cancel') }}
      </AppButton>
      <AppButton type="submit" form="s3-connection-form" :disabled="submitting">
        <AppIcon v-if="submitting" name="loader-2-line" class="mr-1.5 size-4 animate-spin" />
        {{ t('integrations.connectionForm.submit') }}
      </AppButton>
    </template>
  </AppModal>
</template>

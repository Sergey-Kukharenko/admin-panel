<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';

import { RevealSecretModal } from '@/entities/integration';
import { AppButton } from '@/shared/ui/app-button';
import { AppConfirmDialog } from '@/shared/ui/app-confirm-dialog';
import { AppIcon } from '@/shared/ui/app-icon';

import { useRotateApiSecret } from '../model/useRotateApiSecret';

const props = defineProps<{
  credentialId: string;
  /** Production / Development — shown in the confirmation */
  environmentLabel: string;
}>();

const { t } = useI18n({ useScope: 'global' });
const { mutate: rotateSecret, isPending } = useRotateApiSecret();

const isConfirmOpen = ref(false);
const newSecret = ref<string | null>(null);

function confirmRotate() {
  isConfirmOpen.value = false;

  rotateSecret(props.credentialId, {
    onSuccess: (credential) => {
      newSecret.value = credential.client_secret;
    },
    onError: () => {
      toast.error(t('integrations.restApiSecrets.rotate.failed'));
    },
  });
}
</script>

<template>
  <AppButton variant="outline" size="small" :disabled="isPending" @click="isConfirmOpen = true">
    <AppIcon v-if="isPending" name="loader-2-line" class="mr-1.5 size-4 animate-spin" />
    {{ t('integrations.restApiSecrets.rotate.action') }}
  </AppButton>

  <AppConfirmDialog
    :open="isConfirmOpen"
    :title="t('integrations.restApiSecrets.rotate.title', { environment: environmentLabel })"
    :description="t('integrations.restApiSecrets.rotate.description')"
    :confirm-label="t('integrations.restApiSecrets.rotate.confirm')"
    @close="isConfirmOpen = false"
    @confirm="confirmRotate"
  />

  <!-- The secret is shown once; copying keeps the modal open (mockup 1740:74513) -->
  <RevealSecretModal
    :open="newSecret !== null"
    :title="t('integrations.restApiSecrets.reveal.title')"
    :description="t('integrations.restApiSecrets.reveal.description')"
    :field-label="t('integrations.restApiSecrets.reveal.field')"
    :copied-toast="t('integrations.restApiSecrets.reveal.copied')"
    :close-on-copy="false"
    :secret-value="newSecret ?? ''"
    @close="newSecret = null"
  />
</template>

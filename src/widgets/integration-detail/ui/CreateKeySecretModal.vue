<script setup lang="ts">
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'radix-vue';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';

import type { IntegrationEnvironment, IntegrationType } from '@/entities/integration';
import { EnvironmentTabs, useIntegrationsStore } from '@/entities/integration';
import { AppButton } from '@/shared/ui/app-button';
import { AppIcon } from '@/shared/ui/app-icon';

defineOptions({
  name: 'CreateKeySecretModal',
});

const props = defineProps<{
  open: boolean;
  integrationType: IntegrationType;
}>();

const emit = defineEmits<{
  close: [];
  created: [secretValue: string];
}>();

const { t } = useI18n({ useScope: 'global' });
const integrationsStore = useIntegrationsStore();

const name = ref('');
const environment = ref<IntegrationEnvironment>('production');

const accessKeyId = computed(
  () => integrationsStore.getClientCredentials(props.integrationType).clientId,
);
const canSubmit = computed(() => name.value.trim().length > 0);

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return;

    name.value = '';
    environment.value = 'production';
  },
);

async function copyAccessKeyId() {
  await navigator.clipboard.writeText(accessKeyId.value);
  toast.success(t('integrations.credentials.copied'));
}

function handleSubmit() {
  if (!canSubmit.value) return;

  const { secretValue } = integrationsStore.createApiSecret(props.integrationType, {
    name: name.value.trim(),
    environment: environment.value,
    productAccess: [],
  });

  emit('created', secretValue);
}
</script>

<template>
  <DialogRoot :open="open" @update:open="(value) => !value && emit('close')">
    <DialogPortal>
      <Transition
        enter-from-class="opacity-0"
        enter-active-class="transition-opacity duration-200 ease-out"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-active-class="transition-opacity duration-150 ease-in"
        leave-to-class="opacity-0"
      >
        <DialogOverlay
          v-if="open"
          class="fixed inset-0 z-40 bg-(--overlay-strong) backdrop-blur-(--blur-overlay)"
        />
      </Transition>

      <Transition
        enter-from-class="opacity-0 scale-95"
        enter-active-class="transition-all duration-200 ease-out"
        enter-to-class="opacity-100 scale-100"
        leave-from-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-150 ease-in"
        leave-to-class="opacity-0 scale-95"
      >
        <DialogContent
          v-if="open"
          :aria-describedby="undefined"
          class="fixed top-1/2 left-1/2 z-50 flex w-120 -translate-x-1/2 -translate-y-1/2 flex-col rounded-(--radius-xxl) bg-(--bg-surface-primary) shadow-(--shadow-panel) focus:outline-none"
        >
          <header class="flex w-full shrink-0 items-center gap-2 px-5 py-4">
            <DialogTitle class="flex-1 text-base font-medium text-(--text-primary)">
              {{ t('integrations.s3KeySecrets.formTitle') }}
            </DialogTitle>

            <AppButton
              variant="outline"
              size="icon"
              :aria-label="t('common.close')"
              @click="emit('close')"
            >
              <AppIcon name="close-line" class="size-4" />
            </AppButton>
          </header>

          <div class="flex flex-col gap-4 px-5 pb-2">
            <div class="flex flex-col gap-1">
              <label
                for="key-secret-name"
                class="flex items-center gap-1 text-sm font-medium text-(--text-primary)"
              >
                {{ t('integrations.credentials.form.name') }}
                <span class="text-(--text-error)">*</span>
              </label>
              <input
                id="key-secret-name"
                v-model="name"
                type="text"
                class="h-9 w-full rounded-(--radius-lg) bg-(--bg-input) px-3 text-sm text-(--text-primary) outline-none focus-visible:ring-2 focus-visible:ring-(--border-accent)"
              />
            </div>

            <div class="flex flex-col gap-1">
              <p class="text-sm font-medium text-(--text-primary)">Access Key ID</p>
              <div
                class="flex h-9 w-full items-center gap-1.5 rounded-(--radius-lg) bg-(--bg-input) pl-3"
              >
                <span class="flex-1 text-sm text-(--text-primary)">{{ accessKeyId }}</span>
                <button
                  type="button"
                  :aria-label="t('integrations.credentials.copyAria', { field: 'Access Key ID' })"
                  class="flex size-9 shrink-0 items-center justify-center text-(--text-secondary) hover:text-(--text-primary)"
                  @click="copyAccessKeyId"
                >
                  <AppIcon name="file-copy-line" class="size-4" />
                </button>
              </div>
            </div>

            <div class="flex flex-col gap-1 pb-4">
              <p class="text-sm font-medium text-(--text-primary)">
                {{ t('integrations.connectionForm.environment') }}
              </p>
              <EnvironmentTabs v-model="environment" />
            </div>
          </div>

          <footer class="flex w-full shrink-0 items-center justify-end gap-2 px-5 py-4">
            <AppButton variant="outline" @click="emit('close')">
              {{ t('integrations.connectionForm.cancel') }}
            </AppButton>
            <AppButton :disabled="!canSubmit" @click="handleSubmit">
              {{ t('integrations.credentials.form.create') }}
            </AppButton>
          </footer>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>

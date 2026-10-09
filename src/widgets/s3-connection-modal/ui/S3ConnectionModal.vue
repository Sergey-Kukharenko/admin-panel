<script setup lang="ts">
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'radix-vue';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IntegrationEnvironment, S3ConnectionRequest } from '@/entities/integration';
import { buildS3ConnectionRequest, EnvironmentTabs } from '@/entities/integration';
import { AppButton } from '@/shared/ui/app-button';
import { AppIcon } from '@/shared/ui/app-icon';

defineOptions({
  name: 'S3ConnectionModal',
});

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [request: S3ConnectionRequest];
}>();

const { t } = useI18n({ useScope: 'global' });

const organization = ref('');
// Выбор среды есть в макете (1221:201386) и в RFC S3, хотя в WT-348 его нет — см. коммент в WT-337
const environment = ref<IntegrationEnvironment>('production');

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return;
    organization.value = '';
    environment.value = 'production';
  },
);

function handleSubmit() {
  // TODO: заменить на POST /project-s3-credentials/request, когда подключим бэкенд (WT-338)
  emit('submit', buildS3ConnectionRequest({ environment: environment.value }));
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
          class="fixed top-1/2 left-1/2 z-50 flex max-h-[85vh] w-120 -translate-x-1/2 -translate-y-1/2 flex-col rounded-(--radius-xxl) bg-(--bg-surface-primary) shadow-(--shadow-panel) focus:outline-none"
          :aria-describedby="undefined"
        >
          <header class="flex w-full shrink-0 items-center gap-2 px-5 py-4">
            <DialogTitle class="flex-1 text-sm font-medium text-(--text-primary)">
              {{ t('integrations.s3Modal.title') }}
            </DialogTitle>

            <AppButton variant="outline" size="icon" @click="emit('close')">
              <AppIcon name="close-line" class="size-4" />
            </AppButton>
          </header>

          <form
            id="s3-connection-form"
            class="flex flex-1 flex-col gap-4 overflow-y-auto px-5 pb-2"
            @submit.prevent="handleSubmit"
          >
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

          <footer class="flex w-full shrink-0 items-center justify-end gap-2 px-5 py-4">
            <AppButton variant="outline" @click="emit('close')">
              {{ t('integrations.connectionForm.cancel') }}
            </AppButton>
            <AppButton type="submit" form="s3-connection-form">
              {{ t('integrations.connectionForm.submit') }}
            </AppButton>
          </footer>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import { Copy, X } from 'lucide-vue-next';
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot } from 'radix-vue';
import { computed, ref, watch } from 'vue';
import { toast } from 'vue-sonner';

import type { IntegrationEnvironment, IntegrationType } from '@/entities/integration';
import { EnvironmentTabs, useIntegrationsStore } from '@/entities/integration';
import { AppButton } from '@/shared/ui/app-button';

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
  toast.success('Скопировано');
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
          class="fixed top-1/2 left-1/2 z-50 flex w-120 -translate-x-1/2 -translate-y-1/2 flex-col rounded-(--radius-xxl) bg-(--bg-surface-primary) shadow-(--shadow-panel) focus:outline-none"
        >
          <header class="flex w-full shrink-0 items-center gap-2 px-5 py-4">
            <p class="flex-1 text-base font-medium text-(--text-primary)">Создать Key secret</p>

            <AppButton variant="outline" size="icon" @click="emit('close')">
              <X class="size-4" />
            </AppButton>
          </header>

          <div class="flex flex-col gap-4 px-5 pb-2">
            <div class="flex flex-col gap-1">
              <label class="flex items-center gap-1 text-sm font-medium text-(--text-primary)">
                Наименование
                <span class="text-(--text-error)">*</span>
              </label>
              <input
                v-model="name"
                type="text"
                class="h-9 w-full rounded-(--radius-lg) bg-(--bg-input) px-3 text-sm text-(--text-primary) outline-none focus-visible:ring-2 focus-visible:ring-(--border-accent)"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-(--text-primary)">Access Key ID</label>
              <div class="flex h-9 w-full items-center gap-1.5 rounded-(--radius-lg) bg-(--bg-input) pl-3">
                <span class="flex-1 text-sm text-(--text-secondary)">{{ accessKeyId }}</span>
                <button
                  type="button"
                  aria-label="Скопировать Access Key ID"
                  class="flex size-9 shrink-0 items-center justify-center text-(--text-secondary) hover:text-(--text-primary)"
                  @click="copyAccessKeyId"
                >
                  <Copy class="size-4" />
                </button>
              </div>
            </div>

            <div class="flex flex-col gap-1 pb-4">
              <p class="text-sm font-medium text-(--text-primary)">Среда</p>
              <EnvironmentTabs v-model="environment" />
            </div>
          </div>

          <footer
            class="flex w-full shrink-0 items-center justify-end gap-2 border-t border-(--border-default) px-5 py-4"
          >
            <AppButton variant="outline" @click="emit('close')">Отмена</AppButton>
            <AppButton :disabled="!canSubmit" @click="handleSubmit">Создать</AppButton>
          </footer>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>

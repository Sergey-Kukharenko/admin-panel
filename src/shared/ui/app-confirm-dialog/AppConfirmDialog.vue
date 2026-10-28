<script setup lang="ts">
import { DialogDescription, DialogTitle } from 'radix-vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { AppButton } from '@/shared/ui/app-button';
import { AppIcon } from '@/shared/ui/app-icon';
import { AppModal } from '@/shared/ui/app-modal';

const props = withDefaults(
  defineProps<{
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    /** danger — an irreversible action (red icon), warning — the default */
    variant?: 'warning' | 'danger';
  }>(),
  {
    variant: 'warning',
  },
);

const open = defineModel<boolean>('open', { required: true });

const emit = defineEmits<{
  confirm: [];
}>();

const { t } = useI18n({ useScope: 'global' });

// Default labels are translated: a hardcoded default stayed Russian in the English UI
const resolvedConfirmLabel = computed(() => props.confirmLabel ?? t('common.confirm'));
const resolvedCancelLabel = computed(() => props.cancelLabel ?? t('common.cancel'));
</script>

<template>
  <!-- Soft overlay: confirmations are also opened over the upload drawer -->
  <AppModal v-model:open="open" size="sm" overlay="soft" :has-description="!!description">
    <div class="flex flex-col items-start gap-4">
      <div
        class="flex size-11 items-center justify-center rounded-(--radius-xl) p-3"
        :class="variant === 'danger' ? 'bg-(--bg-badge-danger)' : 'bg-(--bg-warning)'"
      >
        <AppIcon
          name="spam-2-line"
          class="size-5 shrink-0"
          :class="variant === 'danger' ? 'text-(--text-error)' : 'text-(--warning-foreground)'"
        />
      </div>

      <div class="flex flex-col items-start gap-1 self-stretch text-left">
        <DialogTitle class="text-sm leading-5 font-medium text-(--text-primary) select-none">
          {{ title }}
        </DialogTitle>
        <DialogDescription
          v-if="description"
          class="text-sm leading-5 font-normal whitespace-pre-line text-(--text-secondary) select-none"
        >
          {{ description }}
        </DialogDescription>
      </div>
    </div>

    <template #footer>
      <AppButton variant="outline" size="medium" @click="open = false">
        {{ resolvedCancelLabel }}
      </AppButton>

      <AppButton variant="primary" size="medium" @click="emit('confirm')">
        {{ resolvedConfirmLabel }}
      </AppButton>
    </template>
  </AppModal>
</template>

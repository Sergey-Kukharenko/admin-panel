<script setup lang="ts">
import { ChevronDown, ChevronsUpDown, CircleCheck, CircleX, Plus, Trash2 } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';

import type { ApiSecret, IntegrationType } from '@/entities/integration';
import {
  ENVIRONMENT_OPTIONS,
  formatPermissionsSummary,
  formatSecretDate,
  RevealSecretModal,
  useIntegrationsStore,
} from '@/entities/integration';
import { AppButton } from '@/shared/ui/app-button';
import { AppConfirmDialog } from '@/shared/ui/app-confirm-dialog';

import CreateApiSecretModal from './CreateApiSecretModal.vue';

defineOptions({
  name: 'ApiSecretsSection',
});

const props = defineProps<{
  integrationType: IntegrationType;
}>();

const integrationsStore = useIntegrationsStore();

const secrets = computed(() => integrationsStore.getApiSecrets(props.integrationType));

const isCreateModalOpen = ref(false);
const pendingSecretValue = ref<string | null>(null);
const secretPendingRevoke = ref<ApiSecret | null>(null);

function environmentLabel(value: string) {
  return ENVIRONMENT_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

function handleSecretCreated(secretValue: string) {
  isCreateModalOpen.value = false;
  pendingSecretValue.value = secretValue;
}

function handleSaveModalClose() {
  pendingSecretValue.value = null;
  toast.success('API secret успешно создан');
}

function requestRevoke(secret: ApiSecret) {
  secretPendingRevoke.value = secret;
}

function confirmRevoke() {
  if (!secretPendingRevoke.value) return;

  integrationsStore.revokeApiSecret(props.integrationType, secretPendingRevoke.value.id);
  secretPendingRevoke.value = null;
  toast.success('API secret отозван');
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-base font-medium text-(--text-primary)">API Secrets</p>

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="flex h-8 items-center gap-1.5 rounded-(--radius-lg) border border-(--border-default) px-3 text-sm font-medium text-(--foreground)"
        >
          Активные
          <ChevronDown class="size-4" />
        </button>
        <button
          type="button"
          class="flex h-8 items-center gap-1.5 rounded-(--radius-lg) border border-(--border-default) px-3 text-sm font-medium text-(--foreground)"
        >
          Все среды
          <ChevronDown class="size-4" />
        </button>
      </div>

      <AppButton size="small" @click="isCreateModalOpen = true">
        <Plus class="size-4" />
        Создать API secret
      </AppButton>
    </div>

    <div class="w-full overflow-hidden rounded-(--radius-xl) border border-(--border-default)">
      <div class="flex w-full items-center">
        <div
          class="flex h-9 flex-1 items-center gap-1.5 border-r border-(--border-default) bg-(--bg-surface-secondary) px-4 font-mono text-xs font-medium uppercase text-(--text-secondary)"
        >
          Наименование
          <ChevronsUpDown class="size-3.5" />
        </div>
        <div
          class="flex h-9 w-35 items-center gap-1.5 border-r border-(--border-default) bg-(--bg-surface-secondary) px-4 font-mono text-xs font-medium uppercase text-(--text-secondary)"
        >
          Среда
          <ChevronsUpDown class="size-3.5" />
        </div>
        <div
          class="flex h-9 w-81 items-center gap-1.5 border-r border-(--border-default) bg-(--bg-surface-secondary) px-4 font-mono text-xs font-medium uppercase text-(--text-secondary)"
        >
          Права доступа
          <ChevronsUpDown class="size-3.5" />
        </div>
        <div
          class="flex h-9 w-37.5 items-center gap-1.5 border-r border-(--border-default) bg-(--bg-surface-secondary) px-4 font-mono text-xs font-medium uppercase text-(--text-secondary)"
        >
          Создан
          <ChevronsUpDown class="size-3.5" />
        </div>
        <div
          class="flex h-9 w-31 items-center gap-1.5 border-r border-(--border-default) bg-(--bg-surface-secondary) px-4 font-mono text-xs font-medium uppercase text-(--text-secondary)"
        >
          Статус
          <ChevronsUpDown class="size-3.5" />
        </div>
        <div
          class="flex h-9 w-26.75 items-center bg-(--bg-surface-secondary) px-4 font-mono text-xs font-medium uppercase text-(--text-secondary)"
        >
          Действия
        </div>
      </div>

      <div
        v-for="secret in secrets"
        :key="secret.id"
        class="flex w-full items-center border-t border-(--border-default)"
      >
        <div class="flex h-11 flex-1 items-center border-r border-(--border-default) px-4 text-sm text-(--text-primary)">
          {{ secret.name }}
        </div>
        <div class="flex h-11 w-35 items-center border-r border-(--border-default) px-4 text-sm text-(--text-primary)">
          {{ environmentLabel(secret.environment) }}
        </div>
        <div class="flex h-11 w-81 items-center border-r border-(--border-default) px-4 text-sm text-(--text-primary)">
          {{ formatPermissionsSummary(secret.productAccess) }}
        </div>
        <div class="flex h-11 w-37.5 items-center border-r border-(--border-default) px-4 text-sm text-(--text-primary)">
          {{ formatSecretDate(secret.createdAt) }}
        </div>
        <div class="flex h-11 w-31 items-center border-r border-(--border-default) px-4">
          <span
            v-if="secret.status === 'active'"
            class="inline-flex h-5.75 items-center gap-1 rounded-full bg-(--bg-badge-success) py-1 pr-2 pl-1.5 font-mono text-xs font-medium uppercase text-(--text-success-alt)"
          >
            <CircleCheck class="size-3.5" />
            Активен
          </span>
          <span
            v-else
            class="inline-flex h-5.75 items-center gap-1 rounded-full bg-(--bg-badge-danger) py-1 pr-2 pl-1.5 font-mono text-xs font-medium uppercase text-(--text-error)"
          >
            <CircleX class="size-3.5" />
            Отозван
          </span>
        </div>
        <div class="flex h-11 w-26.75 items-center px-4">
          <button
            v-if="secret.status === 'active'"
            type="button"
            aria-label="Отозвать API secret"
            class="flex size-8 items-center justify-center rounded-(--radius-lg) text-(--text-secondary) hover:bg-(--muted)"
            @click="requestRevoke(secret)"
          >
            <Trash2 class="size-4" />
          </button>
        </div>
      </div>
    </div>

    <CreateApiSecretModal
      :open="isCreateModalOpen"
      :integration-type="integrationType"
      @close="isCreateModalOpen = false"
      @created="handleSecretCreated"
    />

    <RevealSecretModal
      :open="pendingSecretValue !== null"
      title="Сохраните API secret"
      field-label="API secret"
      warning-text="API Secret больше не будет показан. После закрытия этого окна восстановить ключ невозможно."
      :secret-value="pendingSecretValue ?? ''"
      @close="handleSaveModalClose"
    />

    <AppConfirmDialog
      :open="secretPendingRevoke !== null"
      :title="`Отозвать API secret «${secretPendingRevoke?.name}»?`"
      description="Ключ перестанет работать сразу после отзыва. Это действие нельзя отменить."
      @close="secretPendingRevoke = null"
      @confirm="confirmRevoke"
    />
  </div>
</template>

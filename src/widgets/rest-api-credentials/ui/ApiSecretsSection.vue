<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';

import type { ApiSecret, IntegrationType } from '@/entities/integration';
import {
  ENVIRONMENT_OPTIONS,
  formatProductsWithAccess,
  formatSecretDate,
  getIntegrationByType,
  RevealSecretModal,
  useIntegrationsStore,
} from '@/entities/integration';
import { AppButton } from '@/shared/ui/app-button';
import { AppConfirmDialog } from '@/shared/ui/app-confirm-dialog';
import { AppEmptyState } from '@/shared/ui/app-empty-state';
import { AppIcon } from '@/shared/ui/app-icon';

import CreateApiSecretModal from './CreateApiSecretModal.vue';

defineOptions({
  name: 'ApiSecretsSection',
});

const props = defineProps<{
  integrationType: IntegrationType;
}>();

const { t, locale } = useI18n({ useScope: 'global' });
const integrationsStore = useIntegrationsStore();

const secrets = computed(() => integrationsStore.getApiSecrets(props.integrationType));
const emptyStateIllustration = computed(
  () => getIntegrationByType(props.integrationType)?.illustrationSrc,
);

const COLUMNS = [
  { key: 'name', width: 'flex-1', sortable: true },
  { key: 'environment', width: 'w-35', sortable: true },
  { key: 'permissions', width: 'w-81', sortable: true },
  { key: 'createdAt', width: 'w-37.5', sortable: true },
  { key: 'status', width: 'w-31', sortable: true },
  { key: 'actions', width: 'w-26.75', sortable: false },
] as const;

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

function confirmRevoke() {
  if (!secretPendingRevoke.value) return;

  integrationsStore.revokeApiSecret(props.integrationType, secretPendingRevoke.value.id);
  secretPendingRevoke.value = null;
  toast.success(t('integrations.restApiSecrets.revoke.done'));
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-base font-medium text-(--text-primary)">
      {{ t('integrations.restApiSecrets.title') }}
    </p>

    <!-- Пустое состояние (макет 790:133406) -->
    <AppEmptyState
      v-if="secrets.length === 0"
      :title="t('integrations.restApiSecrets.empty.title')"
      :description="t('integrations.restApiSecrets.empty.description')"
      :illustration-src="emptyStateIllustration"
    >
      <template #action>
        <AppButton size="small" @click="isCreateModalOpen = true">
          <AppIcon name="add-line" class="size-4" />
          {{ t('integrations.restApiSecrets.empty.action') }}
        </AppButton>
      </template>
    </AppEmptyState>

    <template v-else>
      <div class="flex items-center justify-between">
        <!-- Фильтры и сортировка пока без логики — как и в исходной реализации на моках -->
        <div class="flex items-center gap-3">
          <button
            v-for="filterKey in ['active', 'allEnvironments'] as const"
            :key="filterKey"
            type="button"
            class="flex h-8 items-center gap-1.5 rounded-(--radius-lg) border border-(--border-default) px-3 text-sm font-medium text-(--foreground)"
          >
            {{ t(`integrations.credentials.filters.${filterKey}`) }}
            <AppIcon name="large-line-arrow-down" class="size-4" />
          </button>
        </div>

        <AppButton size="small" @click="isCreateModalOpen = true">
          <AppIcon name="add-line" class="size-4" />
          {{ t('integrations.restApiSecrets.create') }}
        </AppButton>
      </div>

      <div class="w-full overflow-hidden rounded-(--radius-xl) border border-(--border-default)">
        <div class="flex w-full items-center">
          <div
            v-for="(column, index) in COLUMNS"
            :key="column.key"
            class="flex h-9 items-center gap-1.5 bg-(--bg-surface-secondary) px-4 font-mono text-xs font-medium uppercase text-(--text-secondary)"
            :class="[
              column.width,
              index < COLUMNS.length - 1 && 'border-r border-(--border-default)',
            ]"
          >
            {{ t(`integrations.credentials.columns.${column.key}`) }}
            <AppIcon v-if="column.sortable" name="expand-up-down-line" class="size-3.5" />
          </div>
        </div>

        <div
          v-for="secret in secrets"
          :key="secret.id"
          class="flex w-full items-center border-t border-(--border-default) text-sm font-medium text-(--text-primary)"
        >
          <div class="flex h-11 flex-1 items-center border-r border-(--border-default) px-4">
            {{ secret.name }}
          </div>
          <div class="flex h-11 w-35 items-center border-r border-(--border-default) px-4">
            {{ environmentLabel(secret.environment) }}
          </div>
          <div class="flex h-11 w-81 items-center border-r border-(--border-default) px-4">
            {{ formatProductsWithAccess(secret.productAccess) }}
          </div>
          <div class="flex h-11 w-37.5 items-center border-r border-(--border-default) px-4">
            {{ formatSecretDate(secret.createdAt, locale) }}
          </div>
          <div class="flex h-11 w-31 items-center border-r border-(--border-default) px-4">
            <span
              v-if="secret.status === 'active'"
              class="inline-flex h-5.75 items-center gap-1 rounded-full bg-(--bg-badge-success) py-1 pr-2 pl-1.5 font-mono text-xs font-medium uppercase text-(--text-success-alt)"
            >
              <AppIcon name="checkbox-circle-line" class="size-3.5" />
              {{ t('integrations.credentials.secretStatus.active') }}
            </span>
            <span
              v-else
              class="inline-flex h-5.75 items-center gap-1 rounded-full bg-(--bg-badge-danger) py-1 pr-2 pl-1.5 font-mono text-xs font-medium uppercase text-(--text-error)"
            >
              <AppIcon name="close-circle-line" class="size-3.5" />
              {{ t('integrations.credentials.secretStatus.revoked') }}
            </span>
          </div>
          <div class="flex h-11 w-26.75 items-center px-4">
            <!-- У отозванного ключа иконка остаётся (макет 1746:76407), но действие недоступно -->
            <button
              type="button"
              :aria-label="t('integrations.restApiSecrets.revoke.aria')"
              :disabled="secret.status !== 'active'"
              class="flex size-8 items-center justify-center rounded-(--radius-lg) text-(--text-secondary) hover:bg-(--muted) disabled:pointer-events-none disabled:text-(--icon-disabled)"
              @click="secretPendingRevoke = secret"
            >
              <AppIcon name="delete-bin-line" class="size-4" />
            </button>
          </div>
        </div>
      </div>
    </template>

    <CreateApiSecretModal
      :open="isCreateModalOpen"
      :integration-type="integrationType"
      @close="isCreateModalOpen = false"
      @created="handleSecretCreated"
    />

    <!-- Макет 1746:76319 / 1740:74513: текст над полем, копирование не закрывает окно -->
    <RevealSecretModal
      :open="pendingSecretValue !== null"
      :title="t('integrations.restApiSecrets.reveal.title')"
      :description="t('integrations.restApiSecrets.reveal.description')"
      :field-label="t('integrations.restApiSecrets.reveal.field')"
      :copied-toast="t('integrations.restApiSecrets.reveal.copied')"
      :close-on-copy="false"
      :secret-value="pendingSecretValue ?? ''"
      @close="pendingSecretValue = null"
    />

    <AppConfirmDialog
      :open="secretPendingRevoke !== null"
      variant="danger"
      :title="t('integrations.restApiSecrets.revoke.title')"
      :description="
        t('integrations.restApiSecrets.revoke.description', { name: secretPendingRevoke?.name })
      "
      :confirm-label="t('integrations.restApiSecrets.revoke.confirm')"
      :cancel-label="t('integrations.connectionForm.cancel')"
      @close="secretPendingRevoke = null"
      @confirm="confirmRevoke"
    />
  </div>
</template>

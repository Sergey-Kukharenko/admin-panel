<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';

import type { ApiSecret, IntegrationType } from '@/entities/integration';
import {
  CredentialsInfoCard,
  ENVIRONMENT_OPTIONS,
  formatSecretDate,
  RevealSecretModal,
  useIntegrationsStore,
} from '@/entities/integration';
import { AppButton } from '@/shared/ui/app-button';
import { AppConfirmDialog } from '@/shared/ui/app-confirm-dialog';
import { AppIcon } from '@/shared/ui/app-icon';
import { AppTooltip } from '@/shared/ui/app-tooltip';

import CreateKeySecretModal from './CreateKeySecretModal.vue';

defineOptions({
  name: 'S3CredentialsPanel',
});

// WT-351: не больше 2 активных Key Secret; неактивные в лимит не входят
const MAX_ACTIVE_KEY_SECRETS = 2;

const COLUMNS = [
  { key: 'name', width: 'flex-1', sortable: true },
  { key: 'environment', width: 'w-35', sortable: true },
  { key: 'createdAt', width: 'w-37.5', sortable: true },
  { key: 'status', width: 'w-31', sortable: true },
  { key: 'actions', width: 'w-57.75', sortable: false },
] as const;

const ACTION_BUTTON_CLASS =
  'flex size-8 items-center justify-center rounded-(--radius-lg) text-(--text-secondary) hover:bg-(--muted) disabled:pointer-events-none disabled:text-(--icon-disabled)';

const props = defineProps<{
  integrationType: IntegrationType;
}>();

const { t, locale } = useI18n({ useScope: 'global' });
const integrationsStore = useIntegrationsStore();

const accessKeyId = computed(
  () => integrationsStore.getClientCredentials(props.integrationType).clientId,
);
const secrets = computed(() => integrationsStore.getApiSecrets(props.integrationType));
const activeSecretsCount = computed(
  () => secrets.value.filter((secret) => secret.status === 'active').length,
);
const isAtSecretLimit = computed(() => activeSecretsCount.value >= MAX_ACTIVE_KEY_SECRETS);
const limitTooltip = computed(() =>
  t('integrations.s3KeySecrets.limitTooltip', { max: MAX_ACTIVE_KEY_SECRETS }),
);

const isCreateModalOpen = ref(false);
const pendingSecretValue = ref<string | null>(null);
const secretPendingDeactivate = ref<ApiSecret | null>(null);
const secretPendingRevoke = ref<ApiSecret | null>(null);

function environmentLabel(value: string) {
  return ENVIRONMENT_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

function handleSecretCreated(secretValue: string) {
  isCreateModalOpen.value = false;
  pendingSecretValue.value = secretValue;
}

// Макет 920:84196: после окна с ключом — один тост «Key secret успешно создан»
function handleRevealModalClose() {
  pendingSecretValue.value = null;
  toast.success(t('integrations.s3KeySecrets.reveal.created'));
}

function confirmDeactivate() {
  if (!secretPendingDeactivate.value) return;

  integrationsStore.deactivateApiSecret(props.integrationType, secretPendingDeactivate.value.id);
  secretPendingDeactivate.value = null;
  toast.success(t('integrations.s3KeySecrets.deactivate.done'));
}

function activateKeySecret(secret: ApiSecret) {
  if (isAtSecretLimit.value) return;

  integrationsStore.activateApiSecret(props.integrationType, secret.id);
  toast.success(t('integrations.s3KeySecrets.activate.done'));
}

const revokeDescription = computed(() =>
  secretPendingRevoke.value?.status === 'active'
    ? t('integrations.s3KeySecrets.revoke.descriptionActive')
    : t('integrations.s3KeySecrets.revoke.descriptionInactive'),
);

function confirmRevoke() {
  if (!secretPendingRevoke.value) return;

  integrationsStore.revokeApiSecret(props.integrationType, secretPendingRevoke.value.id);
  secretPendingRevoke.value = null;
  toast.success(t('integrations.s3KeySecrets.revoke.done'));
}
</script>

<template>
  <div class="flex w-full flex-col gap-7">
    <CredentialsInfoCard id-label="Access Key ID" :id-value="accessKeyId" />

    <div class="flex flex-col gap-4">
      <p class="text-base font-medium text-(--text-primary)">
        {{ t('integrations.s3KeySecrets.title') }}
      </p>

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

        <!-- Макет 920:85149: при лимите кнопка тёмно-серая, подсказка объясняет почему -->
        <AppTooltip v-if="isAtSecretLimit" :icon="false" :text="limitTooltip">
          <span
            class="inline-flex h-8 cursor-not-allowed items-center gap-1.5 rounded-(--radius-lg) bg-(--text-secondary) px-3 text-sm font-medium text-(--text-inverse-soft)"
          >
            <AppIcon name="add-line" class="size-4" />
            {{ t('integrations.s3KeySecrets.create') }}
          </span>
        </AppTooltip>

        <AppButton v-else size="small" @click="isCreateModalOpen = true">
          <AppIcon name="add-line" class="size-4" />
          {{ t('integrations.s3KeySecrets.create') }}
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
              v-else-if="secret.status === 'inactive'"
              class="inline-flex h-5.75 items-center gap-1 rounded-full bg-(--bg-badge-processing) py-1 pr-2 pl-1.5 font-mono text-xs font-medium uppercase text-(--text-primary)"
            >
              <AppIcon name="progress-2-line" class="size-3.5" />
              {{ t('integrations.credentials.secretStatus.inactive') }}
            </span>
            <span
              v-else
              class="inline-flex h-5.75 items-center gap-1 rounded-full bg-(--bg-badge-danger) py-1 pr-2 pl-1.5 font-mono text-xs font-medium uppercase text-(--text-error)"
            >
              <AppIcon name="close-circle-line" class="size-3.5" />
              {{ t('integrations.credentials.secretStatus.revoked') }}
            </span>
          </div>
          <!-- У отозванного ключа иконки прежних действий остаются, но неактивны (920:88173) -->
          <div class="flex h-11 w-57.75 items-center gap-1.5 px-4">
            <button
              v-if="secret.status === 'active' || secret.revokedFrom === 'active'"
              type="button"
              :aria-label="t('integrations.s3KeySecrets.deactivate.aria')"
              :disabled="secret.status === 'revoked'"
              :class="ACTION_BUTTON_CLASS"
              @click="secretPendingDeactivate = secret"
            >
              <AppIcon name="close-circle-line" class="size-4" />
            </button>
            <AppTooltip
              v-else-if="secret.status === 'inactive' && isAtSecretLimit"
              :icon="false"
              :text="limitTooltip"
            >
              <button
                type="button"
                :aria-label="t('integrations.s3KeySecrets.activate.aria')"
                disabled
                :class="ACTION_BUTTON_CLASS"
              >
                <AppIcon name="checkbox-circle-line" class="size-4" />
              </button>
            </AppTooltip>
            <button
              v-else
              type="button"
              :aria-label="t('integrations.s3KeySecrets.activate.aria')"
              :disabled="secret.status === 'revoked'"
              :class="ACTION_BUTTON_CLASS"
              @click="activateKeySecret(secret)"
            >
              <AppIcon name="checkbox-circle-line" class="size-4" />
            </button>

            <button
              type="button"
              :aria-label="t('integrations.s3KeySecrets.revoke.aria')"
              :disabled="secret.status === 'revoked'"
              :class="ACTION_BUTTON_CLASS"
              @click="secretPendingRevoke = secret"
            >
              <AppIcon name="delete-bin-line" class="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <CreateKeySecretModal
      :open="isCreateModalOpen"
      :integration-type="integrationType"
      @close="isCreateModalOpen = false"
      @created="handleSecretCreated"
    />

    <RevealSecretModal
      :open="pendingSecretValue !== null"
      :title="t('integrations.s3KeySecrets.reveal.title')"
      :field-label="t('integrations.s3KeySecrets.reveal.field')"
      :warning-text="t('integrations.s3KeySecrets.reveal.warning')"
      :secret-value="pendingSecretValue ?? ''"
      @close="handleRevealModalClose"
    />

    <AppConfirmDialog
      :open="secretPendingDeactivate !== null"
      :title="
        t('integrations.s3KeySecrets.deactivate.title', { name: secretPendingDeactivate?.name })
      "
      :description="t('integrations.s3KeySecrets.deactivate.description')"
      :confirm-label="t('integrations.s3KeySecrets.deactivate.confirm')"
      :cancel-label="t('integrations.connectionForm.cancel')"
      @close="secretPendingDeactivate = null"
      @confirm="confirmDeactivate"
    />

    <AppConfirmDialog
      :open="secretPendingRevoke !== null"
      variant="danger"
      :title="t('integrations.s3KeySecrets.revoke.title', { name: secretPendingRevoke?.name })"
      :description="revokeDescription"
      :confirm-label="t('integrations.s3KeySecrets.revoke.confirm')"
      :cancel-label="t('integrations.connectionForm.cancel')"
      @close="secretPendingRevoke = null"
      @confirm="confirmRevoke"
    />
  </div>
</template>

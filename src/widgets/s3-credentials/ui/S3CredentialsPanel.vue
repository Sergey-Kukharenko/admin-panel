<script setup lang="ts">
import {
  CheckCircle2,
  ChevronDown,
  ChevronsUpDown,
  CircleCheck,
  CircleX,
  Copy,
  Pause,
  Plus,
  Trash2,
  XCircle,
} from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';

import type { ApiSecret, IntegrationType } from '@/entities/integration';
import {
  ConnectionStatusTag,
  ENVIRONMENT_OPTIONS,
  formatSecretDate,
  RevealSecretModal,
  useIntegrationsStore,
} from '@/entities/integration';
import { AppButton } from '@/shared/ui/app-button';
import { AppConfirmDialog } from '@/shared/ui/app-confirm-dialog';
import { AppTooltip } from '@/shared/ui/app-tooltip';

import CreateKeySecretModal from './CreateKeySecretModal.vue';

defineOptions({
  name: 'S3CredentialsPanel',
});

const MAX_ACTIVE_KEY_SECRETS = 2;
const SECRET_LIMIT_TOOLTIP_TEXT =
  'У вас уже есть 2 активных ключа — это максимум.\nЕсли хотите создать новый, просто отзовите или удалите один из существующих.';

const props = defineProps<{
  integrationType: IntegrationType;
}>();

const integrationsStore = useIntegrationsStore();

const accessKeyId = computed(
  () => integrationsStore.getClientCredentials(props.integrationType).clientId,
);
const secrets = computed(() => integrationsStore.getApiSecrets(props.integrationType));
const activeSecretsCount = computed(
  () => secrets.value.filter((secret) => secret.status === 'active').length,
);
const isAtSecretLimit = computed(() => activeSecretsCount.value >= MAX_ACTIVE_KEY_SECRETS);

const isCreateModalOpen = ref(false);
const pendingSecretValue = ref<string | null>(null);
const secretPendingDeactivate = ref<ApiSecret | null>(null);
const secretPendingRevoke = ref<ApiSecret | null>(null);

function environmentLabel(value: string) {
  return ENVIRONMENT_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

async function copyAccessKeyId() {
  await navigator.clipboard.writeText(accessKeyId.value);
  toast.success('Скопировано');
}

function handleSecretCreated(secretValue: string) {
  isCreateModalOpen.value = false;
  pendingSecretValue.value = secretValue;
}

function handleSaveModalClose() {
  pendingSecretValue.value = null;
  toast.success('Key secret успешно создан');
}

function requestDeactivate(secret: ApiSecret) {
  secretPendingDeactivate.value = secret;
}

function confirmDeactivate() {
  if (!secretPendingDeactivate.value) return;

  integrationsStore.deactivateApiSecret(props.integrationType, secretPendingDeactivate.value.id);
  secretPendingDeactivate.value = null;
  toast.success('Key Secret деактивирован');
}

function activateKeySecret(secret: ApiSecret) {
  integrationsStore.activateApiSecret(props.integrationType, secret.id);
  toast.success('Key Secret активирован');
}

function requestRevoke(secret: ApiSecret) {
  secretPendingRevoke.value = secret;
}

const revokeDescription = computed(() =>
  secretPendingRevoke.value?.status === 'active'
    ? 'Ключ сейчас активен и после отзыва сразу перестанет работать. Восстановить его будет невозможно.'
    : 'После отзыва восстановить ключ будет невозможно.',
);

function confirmRevoke() {
  if (!secretPendingRevoke.value) return;

  integrationsStore.revokeApiSecret(props.integrationType, secretPendingRevoke.value.id);
  secretPendingRevoke.value = null;
  toast.success('Key Secret отозван');
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
          <p class="w-49.5 shrink-0 text-sm text-(--text-primary)">Access Key ID</p>
          <p class="flex-1 text-sm text-(--text-primary)">{{ accessKeyId }}</p>
          <button
            type="button"
            aria-label="Скопировать Access Key ID"
            class="flex size-8 shrink-0 items-center justify-center rounded-(--radius-lg) text-(--text-secondary) hover:bg-(--muted)"
            @click="copyAccessKeyId"
          >
            <Copy class="size-4" />
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <p class="text-base font-medium text-(--text-primary)">Key Secrets</p>

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

        <AppTooltip v-if="isAtSecretLimit" :icon="false" :text="SECRET_LIMIT_TOOLTIP_TEXT">
          <span
            class="inline-flex h-8 cursor-not-allowed items-center gap-1.5 rounded-(--radius-lg) bg-(--muted) px-3 text-sm font-medium text-(--text-tertiary)"
          >
            <Plus class="size-4" />
            Создать Key Secret
          </span>
        </AppTooltip>

        <AppButton v-else size="small" @click="isCreateModalOpen = true">
          <Plus class="size-4" />
          Создать Key Secret
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
            class="flex h-9 w-45 items-center bg-(--bg-surface-secondary) px-4 font-mono text-xs font-medium uppercase text-(--text-secondary)"
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
              v-else-if="secret.status === 'inactive'"
              class="inline-flex h-5.75 items-center gap-1 rounded-full bg-(--muted) py-1 pr-2 pl-1.5 font-mono text-xs font-medium uppercase text-(--text-tertiary)"
            >
              <Pause class="size-3.5" />
              Неактивен
            </span>
            <span
              v-else
              class="inline-flex h-5.75 items-center gap-1 rounded-full bg-(--bg-badge-danger) py-1 pr-2 pl-1.5 font-mono text-xs font-medium uppercase text-(--text-error)"
            >
              <CircleX class="size-3.5" />
              Отозван
            </span>
          </div>
          <div class="flex h-11 w-45 items-center gap-1 px-4">
            <template v-if="secret.status !== 'revoked'">
              <button
                v-if="secret.status === 'active'"
                type="button"
                aria-label="Деактивировать Key Secret"
                class="flex size-8 items-center justify-center rounded-(--radius-lg) text-(--text-secondary) hover:bg-(--muted)"
                @click="requestDeactivate(secret)"
              >
                <XCircle class="size-4" />
              </button>
              <button
                v-else
                type="button"
                aria-label="Активировать Key Secret"
                class="flex size-8 items-center justify-center rounded-(--radius-lg) text-(--text-secondary) hover:bg-(--muted)"
                @click="activateKeySecret(secret)"
              >
                <CheckCircle2 class="size-4" />
              </button>
              <button
                type="button"
                aria-label="Отозвать Key Secret"
                class="flex size-8 items-center justify-center rounded-(--radius-lg) text-(--text-secondary) hover:bg-(--muted)"
                @click="requestRevoke(secret)"
              >
                <Trash2 class="size-4" />
              </button>
            </template>
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
      title="Сохраните Key secret"
      field-label="Key secret"
      warning-text="Ключ больше не будет показан. После закрытия этого окна восстановить ключ невозможно."
      :secret-value="pendingSecretValue ?? ''"
      @close="handleSaveModalClose"
    />

    <AppConfirmDialog
      :open="secretPendingDeactivate !== null"
      :title="`Деактивировать Key Secret «${secretPendingDeactivate?.name}»?`"
      description="Ключ перестанет работать. Вы можете активировать его снова в любой момент."
      @close="secretPendingDeactivate = null"
      @confirm="confirmDeactivate"
    />

    <AppConfirmDialog
      :open="secretPendingRevoke !== null"
      :title="`Отозвать Key Secret «${secretPendingRevoke?.name}»?`"
      :description="revokeDescription"
      @close="secretPendingRevoke = null"
      @confirm="confirmRevoke"
    />
  </div>
</template>

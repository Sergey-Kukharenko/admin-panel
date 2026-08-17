<script setup lang="ts">
import { ChevronDown, ChevronsUpDown, CircleCheck, Copy, Plus, Trash2, XCircle } from 'lucide-vue-next';
import { computed } from 'vue';
import { toast } from 'vue-sonner';

import type { IntegrationType } from '@/entities/integration';
import {
  ConnectionStatusTag,
  ENVIRONMENT_OPTIONS,
  formatSecretDate,
  useIntegrationsStore,
} from '@/entities/integration';
import { AppButton } from '@/shared/ui/app-button';

defineOptions({
  name: 'S3CredentialsPanel',
});

const props = defineProps<{
  integrationType: IntegrationType;
}>();

const integrationsStore = useIntegrationsStore();

const accessKeyId = computed(
  () => integrationsStore.getClientCredentials(props.integrationType).clientId,
);
const secrets = computed(() => integrationsStore.getApiSecrets(props.integrationType));

function environmentLabel(value: string) {
  return ENVIRONMENT_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

async function copyAccessKeyId() {
  await navigator.clipboard.writeText(accessKeyId.value);
  toast.success('Скопировано');
}

function createKeySecret() {
  // TODO: реализовать после появления макета формы «Создать Key Secret».
}

function revokeKeySecret() {
  // TODO: реализовать после появления макета флоу отзыва Key Secret.
}

function deleteKeySecret() {
  // TODO: реализовать после появления макета флоу удаления Key Secret.
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

        <AppButton size="small" @click="createKeySecret">
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
              v-else
              class="inline-flex h-5.75 items-center gap-1 rounded-full bg-(--bg-badge-danger) py-1 pr-2 pl-1.5 font-mono text-xs font-medium uppercase text-(--text-error)"
            >
              Отозван
            </span>
          </div>
          <div class="flex h-11 w-45 items-center gap-1 px-4">
            <button
              type="button"
              aria-label="Отозвать Key Secret"
              class="flex size-8 items-center justify-center rounded-(--radius-lg) text-(--text-secondary) hover:bg-(--muted)"
              @click="revokeKeySecret"
            >
              <XCircle class="size-4" />
            </button>
            <button
              type="button"
              aria-label="Удалить Key Secret"
              class="flex size-8 items-center justify-center rounded-(--radius-lg) text-(--text-secondary) hover:bg-(--muted)"
              @click="deleteKeySecret"
            >
              <Trash2 class="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

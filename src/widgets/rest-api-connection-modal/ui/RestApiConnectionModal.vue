<script setup lang="ts">
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'radix-vue';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type {
  ApiAccessType,
  IntegrationEnvironment,
  RestApiConnectionRequest,
} from '@/entities/integration';
import {
  buildRestApiConnectionRequest,
  EnvironmentTabs,
  isRestApiConnectionFormValid,
  isValidIpv4,
  MAX_IP_ADDRESSES,
} from '@/entities/integration';
import { AppButton } from '@/shared/ui/app-button';
import { AppCheckbox } from '@/shared/ui/app-checkbox';
import { AppIcon } from '@/shared/ui/app-icon';
import { AppTooltip } from '@/shared/ui/app-tooltip';

defineOptions({
  name: 'RestApiConnectionModal',
});

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [request: RestApiConnectionRequest];
}>();

const { t } = useI18n({ useScope: 'global' });

const organization = ref('');
// По умолчанию — «Ограничить по IP» (PRD, макет 1221:200577)
const accessType = ref<ApiAccessType>('ip_restricted');
const isIpSectionOpen = ref(true);
const ipAddresses = ref<string[]>(['']);
// Ошибку формата показываем только после того, как пользователь ушёл из поля
const touchedIpIndexes = ref(new Set<number>());
const environment = ref<IntegrationEnvironment>('production');

const isIpRestricted = computed(() => accessType.value === 'ip_restricted');
const isIpLimitReached = computed(() => ipAddresses.value.length >= MAX_IP_ADDRESSES);
const canSubmit = computed(() =>
  isRestApiConnectionFormValid({ accessType: accessType.value, ipAddresses: ipAddresses.value }),
);

function resetForm() {
  organization.value = '';
  accessType.value = 'ip_restricted';
  isIpSectionOpen.value = true;
  ipAddresses.value = [''];
  touchedIpIndexes.value = new Set();
  environment.value = 'production';
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) resetForm();
  },
);

function selectAccessType(type: ApiAccessType, checked: boolean) {
  // Чекбоксы работают как radio: снять выбор нельзя, только переключиться на другой вариант
  if (checked) accessType.value = type;
}

function hasIpError(index: number): boolean {
  const value = ipAddresses.value[index] ?? '';
  return (
    isIpRestricted.value &&
    touchedIpIndexes.value.has(index) &&
    value.trim() !== '' &&
    !isValidIpv4(value)
  );
}

function markIpTouched(index: number) {
  touchedIpIndexes.value = new Set(touchedIpIndexes.value).add(index);
}

function addIpAddress() {
  if (isIpLimitReached.value) return;
  ipAddresses.value.push('');
  isIpSectionOpen.value = true;
}

function handleSubmit() {
  if (!canSubmit.value) return;

  // TODO: заменить на POST /project-api-credentials/request, когда подключим бэкенд (WT-337 — моки)
  emit(
    'submit',
    buildRestApiConnectionRequest({
      accessType: accessType.value,
      ipAddresses: ipAddresses.value,
      environment: environment.value,
    }),
  );
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
              {{ t('integrations.restApiModal.title') }}
            </DialogTitle>

            <AppButton variant="outline" size="icon" @click="emit('close')">
              <AppIcon name="close-line" class="size-4" />
            </AppButton>
          </header>

          <form
            id="rest-api-connection-form"
            class="flex flex-1 flex-col gap-4 overflow-y-auto px-5 pb-2"
            @submit.prevent="handleSubmit"
          >
            <p class="text-sm text-(--text-secondary)">
              {{ t('integrations.restApiModal.description') }}
            </p>

            <div class="flex flex-col gap-1">
              <label for="rest-api-organization" class="text-sm font-medium text-(--text-primary)">
                {{ t('integrations.connectionForm.organization') }}
              </label>
              <input
                id="rest-api-organization"
                v-model="organization"
                type="text"
                placeholder="New_Casino"
                class="h-9 w-full rounded-(--radius-lg) bg-(--bg-input) px-3 text-sm text-(--text-primary) outline-none placeholder:text-(--text-secondary) focus-visible:ring-2 focus-visible:ring-(--border-accent)"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label
                for="rest-api-connection-type"
                class="text-sm font-medium text-(--text-primary)"
              >
                {{ t('integrations.connectionForm.connectionType') }}
              </label>
              <input
                id="rest-api-connection-type"
                value="API"
                disabled
                type="text"
                class="h-9 w-full rounded-(--radius-lg) bg-(--bg-input) px-3 text-sm text-(--text-secondary) outline-none disabled:cursor-not-allowed"
              />
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-1">
                <p class="text-sm font-medium text-(--text-primary)">
                  {{ t('integrations.restApiModal.accessType') }}
                </p>
                <AppTooltip :text="t('integrations.restApiModal.accessTypeTooltip')" />
              </div>

              <AppCheckbox
                :model-value="accessType === 'ip_restricted'"
                @update:model-value="(checked) => selectAccessType('ip_restricted', checked)"
              >
                {{ t('integrations.restApiModal.ipRestricted') }}
              </AppCheckbox>
              <AppCheckbox
                :model-value="accessType === 'public'"
                @update:model-value="(checked) => selectAccessType('public', checked)"
              >
                {{ t('integrations.restApiModal.publicAccess') }}
              </AppCheckbox>
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-1">
                <p class="text-sm font-medium text-(--text-primary)">
                  {{ t('integrations.restApiModal.ipAddresses') }}
                </p>
                <AppTooltip :text="t('integrations.restApiModal.ipAddressesTooltip')" />
              </div>

              <div class="flex flex-col gap-1.5">
                <div class="flex w-full items-center justify-between">
                  <button
                    type="button"
                    class="flex items-center gap-1 text-sm font-medium"
                    :class="isIpRestricted ? 'text-(--text-primary)' : 'text-(--text-secondary)'"
                    :aria-expanded="isIpSectionOpen"
                    @click="isIpSectionOpen = !isIpSectionOpen"
                  >
                    <AppIcon
                      name="large-line-arrow-right"
                      class="size-4 shrink-0 transition-transform"
                      :class="isIpSectionOpen && 'rotate-90'"
                    />
                    {{ t('integrations.restApiModal.ipAddress') }}
                  </button>

                  <button
                    type="button"
                    :aria-label="t('integrations.restApiModal.addIpAddress')"
                    :disabled="!isIpRestricted || isIpLimitReached"
                    class="flex size-8 items-center justify-center rounded-(--radius-lg) text-(--text-secondary) hover:bg-(--muted) disabled:pointer-events-none disabled:opacity-50"
                    @click="addIpAddress"
                  >
                    <AppIcon name="add-circle-line" class="size-4" />
                  </button>
                </div>

                <div v-if="isIpSectionOpen" class="flex flex-col gap-1.5">
                  <div v-for="(_, index) in ipAddresses" :key="index" class="flex flex-col gap-1">
                    <input
                      v-model="ipAddresses[index]"
                      type="text"
                      inputmode="decimal"
                      placeholder="192.168.1.1"
                      :disabled="!isIpRestricted"
                      :aria-invalid="hasIpError(index)"
                      class="h-9 w-full rounded-(--radius-lg) bg-(--bg-input) px-3 text-sm text-(--text-primary) outline-none placeholder:text-(--text-secondary) focus-visible:ring-2 focus-visible:ring-(--border-accent) disabled:cursor-not-allowed disabled:text-(--text-secondary)"
                      :class="hasIpError(index) && 'ring-1 ring-(--border-error)'"
                      @blur="markIpTouched(index)"
                    />
                    <p v-if="hasIpError(index)" class="text-xs text-(--text-error)">
                      {{ t('integrations.restApiModal.invalidIp') }}
                    </p>
                  </div>

                  <p
                    v-if="isIpRestricted && isIpLimitReached"
                    class="text-xs text-(--text-secondary)"
                  >
                    {{ t('integrations.restApiModal.maxIpAddresses', { max: MAX_IP_ADDRESSES }) }}
                  </p>
                </div>
              </div>
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
            <AppButton type="submit" form="rest-api-connection-form" :disabled="!canSubmit">
              {{ t('integrations.connectionForm.submit') }}
            </AppButton>
          </footer>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>

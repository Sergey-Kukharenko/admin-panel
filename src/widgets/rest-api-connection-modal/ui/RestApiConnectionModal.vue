<script setup lang="ts">
import { ChevronRight, PlusCircle, X } from 'lucide-vue-next';
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot } from 'radix-vue';
import { reactive, ref } from 'vue';

import { AppButton } from '@/shared/ui/app-button';
import { AppCheckbox } from '@/shared/ui/app-checkbox';
import { AppSwitch } from '@/shared/ui/app-switch';
import { AppTooltip } from '@/shared/ui/app-tooltip';

import type { ConnectionEnvironment } from '../model/constants';
import { CONNECTION_PRODUCTS, ENVIRONMENT_OPTIONS } from '../model/constants';

defineOptions({
  name: 'RestApiConnectionModal',
});

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [];
}>();

const organization = ref('');
const isPublicAccess = ref(false);
const isIpRestricted = ref(false);
const isIpSectionOpen = ref(true);
const ipAddresses = ref<string[]>(['']);
const environment = ref<ConnectionEnvironment>('production');

const productAccess = reactive<Record<string, { writeData: boolean; readResults: boolean }>>(
  Object.fromEntries(
    CONNECTION_PRODUCTS.map((product) => [product.id, { writeData: false, readResults: false }]),
  ),
);

function addIpAddress() {
  ipAddresses.value.push('');
}

function handleSubmit() {
  // TODO: заменить на реальный вызов API, когда появится backend-эндпоинт заявок на подключение.
  emit('submit');
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
        >
          <header class="flex w-full shrink-0 items-center gap-2 px-5 py-4">
            <p class="flex-1 text-sm font-medium text-(--text-primary)">Подключение REST API</p>

            <AppButton variant="outline" size="icon" @click="emit('close')">
              <X class="size-4" />
            </AppButton>
          </header>

          <div class="flex flex-1 flex-col gap-5 overflow-y-auto px-5 pb-2">
            <p class="text-sm text-(--text-secondary)">
              Заполните параметры заявки. Если часть информации неизвестна, просто отправьте
              заявку — менеджер свяжется с вами и поможет завершить настройку.
            </p>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-(--text-primary)">Организация</label>
              <input
                v-model="organization"
                type="text"
                placeholder="New_Casino"
                class="h-9 w-full rounded-(--radius-lg) bg-(--bg-input) px-3 text-sm text-(--text-primary) outline-none placeholder:text-(--text-secondary) focus-visible:ring-2 focus-visible:ring-(--border-accent)"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-(--text-primary)">Тип подключения</label>
              <input
                value="API"
                disabled
                type="text"
                class="h-9 w-full rounded-(--radius-lg) bg-(--bg-input) px-3 text-sm text-(--text-secondary) outline-none disabled:cursor-not-allowed"
              />
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-1">
                <p class="text-sm font-medium text-(--text-primary)">Тип доступа</p>
                <AppTooltip
                  text="Выберите способ доступа к API. При ограничении по IP необходимо указать разрешенные IP-адреса."
                />
              </div>

              <AppCheckbox v-model="isPublicAccess">Публичный доступ</AppCheckbox>
              <AppCheckbox v-model="isIpRestricted">Ограничить по IP</AppCheckbox>
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-1">
                <p class="text-sm font-medium text-(--text-primary)">IP-адреса сервера</p>
                <AppTooltip
                  text="Укажите IP-адреса серверов, которым будет разрешен доступ к API. Заполняется только при выборе доступа по IP."
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <div class="flex w-full items-center justify-between">
                  <button
                    type="button"
                    class="flex items-center gap-1 text-sm text-(--text-secondary)"
                    @click="isIpSectionOpen = !isIpSectionOpen"
                  >
                    <ChevronRight
                      class="size-4 shrink-0 transition-transform"
                      :class="isIpSectionOpen && 'rotate-90'"
                    />
                    IP-адрес сервера
                  </button>

                  <button
                    type="button"
                    aria-label="Добавить IP-адрес"
                    class="flex size-8 items-center justify-center rounded-(--radius-lg) text-(--text-secondary) hover:bg-(--muted)"
                    @click="addIpAddress"
                  >
                    <PlusCircle class="size-4" />
                  </button>
                </div>

                <div v-if="isIpSectionOpen" class="flex flex-col gap-1.5">
                  <input
                    v-for="(_, index) in ipAddresses"
                    :key="index"
                    v-model="ipAddresses[index]"
                    type="text"
                    placeholder="Например, 192.168.0.1"
                    class="h-9 w-full rounded-(--radius-lg) bg-(--bg-input) px-3 text-sm text-(--text-primary) outline-none placeholder:text-(--text-secondary) focus-visible:ring-2 focus-visible:ring-(--border-accent)"
                  />
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-1">
                <p class="text-sm font-medium text-(--text-primary)">Среда</p>
                <AppTooltip
                  text="Укажите среду, для которой необходимо создать подключение. Используйте Development для тестирования и Production для рабочего окружения."
                />
              </div>

              <div class="flex items-center gap-0.5 rounded-(--radius-full) bg-(--bg-input) p-1">
                <button
                  v-for="option in ENVIRONMENT_OPTIONS"
                  :key="option.value"
                  type="button"
                  class="flex-1 rounded-(--radius-xl) px-3 py-1.5 text-sm font-medium transition-colors"
                  :class="
                    environment === option.value
                      ? 'bg-(--bg-surface-primary) text-(--text-primary) shadow-(--shadow-panel-short)'
                      : 'text-(--text-secondary)'
                  "
                  @click="environment = option.value"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <div class="flex flex-col gap-2 pb-4">
              <p class="text-sm font-medium text-(--text-primary)">Доступ к продуктам</p>

              <div class="w-full overflow-hidden rounded-(--radius-lg) bg-(--bg-input)">
                <div class="flex h-8 items-center gap-4 pl-3">
                  <span class="w-48.5 font-mono text-xs font-medium uppercase text-(--text-secondary)">
                    Продукт
                  </span>
                  <span class="flex-1 font-mono text-xs font-medium uppercase text-(--text-secondary)">
                    Write data
                  </span>
                  <span class="w-28 text-right font-mono text-xs font-medium uppercase text-(--text-secondary)">
                    Read results
                  </span>
                </div>

                <div class="flex flex-col gap-1 p-1">
                  <div
                    v-for="product in CONNECTION_PRODUCTS"
                    :key="product.id"
                    class="flex h-9 items-center gap-4 rounded-(--radius-md) bg-(--bg-surface-primary) px-2"
                  >
                    <span class="w-48.5 text-sm text-(--text-primary)">{{ product.name }}</span>

                    <span class="flex flex-1 justify-center">
                      <AppSwitch v-model="productAccess[product.id]!.writeData" />
                    </span>

                    <span class="flex w-28 justify-center">
                      <AppSwitch v-model="productAccess[product.id]!.readResults" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer
            class="flex w-full shrink-0 items-center justify-end gap-2 border-t border-(--border-default) px-5 py-4"
          >
            <AppButton variant="outline" @click="emit('close')">Отмена</AppButton>
            <AppButton @click="handleSubmit">Запросить подключение</AppButton>
          </footer>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>

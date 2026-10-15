<script setup lang="ts">
import { DropdownMenuTrigger } from 'radix-vue';
import { useI18n } from 'vue-i18n';

import { AppIcon, type IconName } from '@/shared/ui/app-icon';

defineProps<{
  title: string;
  icon: IconName;
  count?: number;
  clearable?: boolean;
}>();

const emit = defineEmits<{
  clear: [];
}>();

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <!-- Две соседние кнопки в общей рамке: открыть меню и сбросить фильтр. Вложить кнопку сброса
       в триггер нельзя — вложенный интерактив недоступен с клавиатуры и невалиден в HTML.
       Рендерится внутри DropdownMenuRoot (AppFilterSingle / AppFilterMultiple) -->
  <div
    class="flex h-8 items-center rounded-(--radius-sm) border border-(--border-subtle) bg-(--surface) transition-colors hover:bg-(--muted)"
  >
    <!-- data-state="open" ставит DropdownMenuTrigger (as-child) — по нему переключаем шеврон -->
    <DropdownMenuTrigger as-child>
      <button
        type="button"
        class="group flex h-full items-center gap-1.5 py-1.5 pl-3"
        :class="clearable ? 'pr-0' : 'pr-2'"
      >
        <AppIcon :name="icon" class="size-4 text-(--text-secondary)" />

        <span class="select-none text-sm font-medium leading-5 text-(--text-primary)">
          {{ title }}
        </span>

        <span
          v-if="count"
          class="flex size-4 items-center justify-center rounded-(--radius-full) bg-(--primary) text-body-2xs font-medium text-(--primary-foreground)"
        >
          {{ count }}
        </span>

        <template v-if="!clearable">
          <AppIcon
            name="large-line-arrow-down"
            class="size-4 text-(--text-primary) group-data-[state=open]:hidden"
          />
          <AppIcon
            name="large-line-arrow-up"
            class="hidden size-4 text-(--text-primary) group-data-[state=open]:block"
          />
        </template>
      </button>
    </DropdownMenuTrigger>

    <button
      v-if="clearable"
      type="button"
      :aria-label="t('filter.clear')"
      class="flex h-full items-center pr-2 pl-1.5"
      @click="emit('clear')"
    >
      <AppIcon name="small-close-line" class="size-4 text-(--text-secondary)" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { AppIcon } from '@/shared/ui/app-icon';

import { formatDatasetGroupDate } from '../model/utils';

defineOptions({
  name: 'DatasetHistoryGroupHeader',
});

const props = defineProps<{
  date: string;
  uploadedCount: number;
  totalCount: number;
  source: string;
  expanded: boolean;
}>();

defineEmits<{
  toggle: [];
}>();

const { t } = useI18n({ useScope: 'global' });

const formattedDate = computed(() => formatDatasetGroupDate(props.date));
</script>

<template>
  <button
    type="button"
    class="flex gap-3 h-12 w-full items-center bg-transparent px-6 text-left focus-visible:outline-none"
    @click="$emit('toggle')"
  >
    <div class="flex min-w-0 items-center gap-3">
      <div class="flex shrink-0 items-center gap-2">
        <AppIcon
          name="arrow-down-s-fill"
          :class="[
            'size-4 text-(--text-primary) transition-transform duration-200',
            { '-rotate-90': !expanded },
          ]"
        />
      </div>
      <!-- Выводим готовую красивую дату из computed -->
      <span class="truncate text-sm font-medium text-(--text-primary) leading-5 select-none">
        {{ formattedDate }}
      </span>
    </div>

    <div class="flex gap-1">
      <div class="flex h-full shrink-0 items-center">
        <div
          class="flex h-5.75 items-center gap-0.5 rounded-(--radius-full) bg-(--muted) pl-1.5 pr-2 py-1 select-none"
        >
          <!-- По макету: пока группа обрабатывается — progress-2-line, когда всё загружено — checkbox-circle-line -->
          <AppIcon
            :name="uploadedCount === totalCount ? 'checkbox-circle-line' : 'progress-2-line'"
            class="size-3.5 text-(--text-primary)"
          />
          <span
            class="font-mono text-element-tag font-medium uppercase text-(--text-primary) pl-0.5"
          >
            {{ uploadedCount }}/{{ totalCount }}
          </span>
        </div>
      </div>

      <div class="flex h-full shrink-0 items-center">
        <div
          class="flex h-5.75 items-center gap-0.5 rounded-(--radius-full) bg-(--muted) pl-1.5 pr-2 py-1 select-none"
        >
          <AppIcon name="file-text-line" class="size-3.5 shrink-0 text-(--text-primary)" />
          <span
            class="font-mono text-element-tag font-medium uppercase text-(--text-primary) pl-0.5"
          >
            {{ t('datasets.table.source', { source }) }}
          </span>
        </div>
      </div>
    </div>
  </button>
</template>

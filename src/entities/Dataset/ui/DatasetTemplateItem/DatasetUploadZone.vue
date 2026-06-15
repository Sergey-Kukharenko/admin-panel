<script setup lang="ts">
import { ref } from 'vue';

import { AppButton } from '@/shared/ui/AppButton';

export interface DatasetUploadZoneProps {
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
}

defineOptions({
  name: 'DatasetUploadZone',
});

withDefaults(defineProps<DatasetUploadZoneProps>(), {
  accept: '.csv',
  multiple: true,
  disabled: false,
});

const emit = defineEmits<{
  upload: [File[]];
}>();

const inputRef = ref<HTMLInputElement>();

const handleSelect = () => {
  if (!inputRef.value) {
    return;
  }

  inputRef.value.click();
};

const handleChange = (event: Event) => {
  const input = event.target as HTMLInputElement;

  if (!input.files?.length) {
    return;
  }

  emit('upload', Array.from(input.files));

  input.value = '';
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();

  if (!event.dataTransfer?.files.length) {
    return;
  }

  emit('upload', Array.from(event.dataTransfer.files));
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-4 rounded-(--radius-md) border border-dashed border-(--border) py-10 px-6 text-center bg-(--background)"
    @drop="handleDrop"
    @dragover="handleDragOver"
  >
    <p class="text-body-sm text-(--text-secondary)">Нет добавленных файлов</p>

    <AppButton variant="secondary" size="small" :disabled="disabled" @click="handleSelect">
      Выбрать файлы
    </AppButton>

    <input
      ref="inputRef"
      type="file"
      class="hidden"
      :accept="accept"
      :multiple="multiple"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import type { IntegrationEnvironment } from '../../model/constants';
import { ENVIRONMENT_OPTIONS } from '../../model/constants';

defineOptions({
  name: 'EnvironmentTabs',
});

defineProps<{
  modelValue: IntegrationEnvironment;
}>();

const emit = defineEmits<{
  'update:modelValue': [IntegrationEnvironment];
}>();
</script>

<template>
  <div class="flex items-center gap-0.5 rounded-(--radius-full) bg-(--bg-input) p-1">
    <button
      v-for="option in ENVIRONMENT_OPTIONS"
      :key="option.value"
      type="button"
      class="flex-1 rounded-(--radius-xl) px-3 py-1.5 text-sm font-medium transition-colors"
      :class="
        modelValue === option.value
          ? 'bg-(--bg-surface-primary) text-(--text-primary) shadow-(--shadow-panel-short)'
          : 'text-(--text-secondary)'
      "
      @click="emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

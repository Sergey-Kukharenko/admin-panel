<script setup lang="ts">
import { AppSwitch } from '@/shared/ui/app-switch';

import { INTEGRATION_PRODUCTS } from '../../model/constants';

export interface ProductAccessMap {
  [productId: string]: { writeData: boolean; readResults: boolean };
}

defineOptions({
  name: 'ProductAccessTable',
});

const props = withDefaults(
  defineProps<{
    modelValue: ProductAccessMap;
    productColumnLabel?: string;
  }>(),
  {
    productColumnLabel: 'Продукт',
  },
);

const emit = defineEmits<{
  'update:modelValue': [ProductAccessMap];
}>();

function toggle(productId: string, field: 'writeData' | 'readResults') {
  const current = props.modelValue[productId] ?? { writeData: false, readResults: false };

  emit('update:modelValue', {
    ...props.modelValue,
    [productId]: { ...current, [field]: !current[field] },
  });
}
</script>

<template>
  <div class="w-full overflow-hidden rounded-(--radius-lg) bg-(--bg-input)">
    <div class="flex h-8 items-center gap-4 pl-3">
      <span class="w-48.5 font-mono text-xs font-medium uppercase text-(--text-secondary)">
        {{ productColumnLabel }}
      </span>
      <span class="flex-1 font-mono text-xs font-medium uppercase text-(--text-secondary)">Write data</span>
      <span class="w-28 text-right font-mono text-xs font-medium uppercase text-(--text-secondary)">
        Read results
      </span>
    </div>

    <div class="flex flex-col gap-1 p-1">
      <div
        v-for="product in INTEGRATION_PRODUCTS"
        :key="product.id"
        class="flex h-9 items-center gap-4 rounded-(--radius-md) bg-(--bg-surface-primary) px-2"
      >
        <span class="w-48.5 text-sm text-(--text-primary)">{{ product.name }}</span>

        <span class="flex flex-1 justify-center">
          <AppSwitch
            :model-value="modelValue[product.id]?.writeData ?? false"
            @update:model-value="toggle(product.id, 'writeData')"
          />
        </span>

        <span class="flex w-28 justify-center">
          <AppSwitch
            :model-value="modelValue[product.id]?.readResults ?? false"
            @update:model-value="toggle(product.id, 'readResults')"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppStatusBadge } from '@/shared/ui/app-status-badge';

import { MOCK_RECENT_OPERATIONS } from '../model/data';

defineOptions({
  name: 'DashboardRecentOperations',
});
</script>

<template>
  <div class="flex flex-col gap-4 pt-4">
    <div class="flex items-center justify-between">
      <h2 class="text-title-sm font-medium text-(--text-primary)">Последние операции</h2>
      <p class="text-body-sm text-(--text-primary)">{{ MOCK_RECENT_OPERATIONS.length }} записей</p>
    </div>

    <div class="flex flex-col overflow-hidden rounded-(--radius-xl) border border-(--border-default)">
      <div class="flex items-center">
        <div class="flex h-9 flex-1 items-center border-r border-(--border-default) bg-(--bg-surface-secondary) px-4">
          <span class="font-mono text-xs font-medium text-(--text-secondary) uppercase">Дата</span>
        </div>
        <div class="flex h-9 flex-1 items-center border-r border-(--border-default) bg-(--bg-surface-secondary) px-4">
          <span class="font-mono text-xs font-medium text-(--text-secondary) uppercase">
            Тип операции
          </span>
        </div>
        <div class="flex h-9 flex-1 items-center border-r border-(--border-default) bg-(--bg-surface-secondary) px-4">
          <span class="font-mono text-xs font-medium text-(--text-secondary) uppercase">Детали</span>
        </div>
        <div class="flex h-9 w-35 shrink-0 items-center bg-(--bg-surface-secondary) px-4">
          <span class="font-mono text-xs font-medium text-(--text-secondary) uppercase">Статус</span>
        </div>
      </div>

      <div
        v-for="operation in MOCK_RECENT_OPERATIONS"
        :key="operation.id"
        class="flex items-center border-t border-(--border-default)"
      >
        <div class="flex h-11 flex-1 items-center border-r border-(--border-default) px-4">
          <span class="text-body-sm font-medium text-(--text-primary)">{{ operation.dateLabel }}</span>
        </div>
        <div class="flex h-11 flex-1 items-center border-r border-(--border-default) px-4">
          <span class="text-body-sm font-medium text-(--text-primary)">{{ operation.type }}</span>
        </div>
        <div class="flex h-11 flex-1 items-center border-r border-(--border-default) px-4">
          <span class="truncate text-body-sm font-medium text-(--text-primary)">
            {{ operation.details }}
          </span>
        </div>
        <div class="flex h-11 w-35 shrink-0 items-center px-4">
          <AppStatusBadge :status="operation.status" />
        </div>
      </div>
    </div>
  </div>
</template>

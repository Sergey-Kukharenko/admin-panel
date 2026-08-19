<script setup lang="ts">
import { Bell, CheckCircle2, Loader2, RotateCw, ShieldAlert, Sparkles } from 'lucide-vue-next';
import { DropdownMenuContent, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from 'radix-vue';
import { computed, ref } from 'vue';

import type { NotificationVariant } from '@/entities/notification';
import { MOCK_NOTIFICATIONS } from '@/entities/notification';

defineOptions({
  name: 'NotificationsPanel',
});

const notifications = ref(MOCK_NOTIFICATIONS.map((notification) => ({ ...notification })));

const hasUnread = computed(() => notifications.value.some((notification) => !notification.isRead));

const VARIANT_CONFIG: Record<
  NotificationVariant,
  { icon: typeof Bell; bg: string; color: string; spin?: boolean }
> = {
  processing: { icon: Loader2, bg: 'bg-(--bg-badge-loading)', color: 'text-(--icon-loading)', spin: true },
  ai: { icon: Sparkles, bg: 'bg-(--warning-muted)', color: 'text-(--icon-warning)' },
  success: { icon: CheckCircle2, bg: 'bg-(--bg-badge-success)', color: 'text-(--icon-success)' },
  error: { icon: ShieldAlert, bg: 'bg-(--bg-badge-danger)', color: 'text-(--icon-error)' },
  loop: { icon: RotateCw, bg: 'bg-(--bg-badge-processing)', color: 'text-(--icon-tertiary)' },
};

function markAllAsRead(): void {
  notifications.value.forEach((notification) => {
    notification.isRead = true;
  });
}
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <button
        type="button"
        class="relative flex size-8 items-center justify-center rounded-(--radius-sm) hover:bg-(--muted)"
        aria-label="Уведомления"
      >
        <Bell class="size-4 text-(--icon-tertiary)" />
        <span
          v-if="hasUnread"
          class="absolute top-1.5 right-1.5 size-1.75 rounded-full border border-(--surface) bg-(--icon-error)"
        />
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        :side-offset="8"
        align="end"
        class="z-50 flex w-90 flex-col overflow-hidden rounded-(--radius-xl) bg-(--surface) shadow-(--shadow-panel) backdrop-blur-floating-panel focus:outline-none animate-in fade-in-50 zoom-in-95 duration-100"
      >
        <div class="flex items-center gap-2 px-4 pt-4 pb-2">
          <p class="flex-1 text-body-sm font-medium text-(--text-primary)">
            Уведомления ({{ notifications.length }})
          </p>

          <button
            v-if="hasUnread"
            type="button"
            class="text-body-xs font-medium text-(--text-secondary) hover:text-(--text-primary)"
            @click="markAllAsRead"
          >
            Прочитать все
          </button>
        </div>

        <div v-if="notifications.length === 0" class="flex flex-col items-center gap-2 px-4 py-10">
          <Bell class="size-6 text-(--icon-disabled)" />
          <p class="text-body-sm text-(--text-tertiary)">Уведомлений пока нет</p>
        </div>

        <div v-else class="relative">
          <div class="flex max-h-105 flex-col gap-1 overflow-y-auto px-1 pb-2">
            <div
              v-for="notification in notifications"
              :key="notification.id"
              class="flex items-start gap-3 rounded-(--radius-lg) px-3 py-2 transition-opacity"
              :class="notification.isRead && 'opacity-60'"
            >
              <div
                class="relative flex size-9 shrink-0 items-center justify-center rounded-(--radius-lg)"
                :class="VARIANT_CONFIG[notification.variant].bg"
              >
                <component
                  :is="VARIANT_CONFIG[notification.variant].icon"
                  class="size-4"
                  :class="[VARIANT_CONFIG[notification.variant].color, VARIANT_CONFIG[notification.variant].spin && 'animate-spin']"
                />

                <span
                  v-if="!notification.isRead"
                  class="absolute -top-0.5 -right-0.5 size-2 rounded-full border border-(--surface) bg-(--icon-success)"
                />
              </div>

              <div class="flex flex-col gap-0.5">
                <p class="text-body-sm font-medium text-(--text-primary)">{{ notification.title }}</p>
                <p class="text-body-xs text-(--text-secondary)">{{ notification.timeLabel }}</p>
              </div>
            </div>
          </div>

          <div
            class="pointer-events-none absolute inset-x-0 bottom-0 h-15 bg-gradient-to-t from-(--surface) to-transparent"
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

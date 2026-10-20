<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'radix-vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { NotificationVariant } from '@/entities/notification';
import { MOCK_NOTIFICATIONS } from '@/entities/notification';
import { AppIcon, type IconName } from '@/shared/ui/app-icon';
import { AppIconButton } from '@/shared/ui/app-icon-button';
import { AppScrollArea } from '@/shared/ui/app-scroll-area';

defineOptions({
  name: 'NotificationsPanel',
});

const { t } = useI18n({ useScope: 'global' });

const notifications = ref(MOCK_NOTIFICATIONS.map((notification) => ({ ...notification })));

const hasUnread = computed(() => notifications.value.some((notification) => !notification.isRead));

// Icon and colors per event type, as in the mockup (Figma image-notifciation 55:1118)
const VARIANT_CONFIG: Record<
  NotificationVariant,
  { icon: IconName; bg: string; color: string; spin?: boolean }
> = {
  processing: {
    icon: 'loader-2-line',
    bg: 'bg-(--bg-badge-loading)',
    color: 'text-(--icon-loading)',
    spin: true,
  },
  ai: { icon: 'ai-generate-3d-line', bg: 'bg-(--bg-warning)', color: 'text-(--icon-warning)' },
  success: {
    icon: 'checkbox-circle-line',
    bg: 'bg-(--bg-badge-success)',
    // TODO: the mockup paints this icon green/700 #00573B, a second Figma variable also named
    // icon/success (status tags use #528300). Switch to its own token once the designer gives it
    // a unique name (asked 2026-10-15); hidden behind FEATURE_NOTIFICATIONS until then
    color: 'text-(--icon-success)',
  },
  error: { icon: 'spam-2-line', bg: 'bg-(--bg-badge-danger)', color: 'text-(--icon-error)' },
  loop: {
    icon: 'loop-left-fill',
    bg: 'bg-(--bg-badge-processing)',
    color: 'text-(--icon-tertiary)',
  },
};

function markAllAsRead(): void {
  notifications.value.forEach((notification) => {
    notification.isRead = true;
  });
}
</script>

<template>
  <!-- modal=false: иначе radix блокирует скролл body и добавляет компенсирующий
       padding-right поверх уже зарезервированного html { scrollbar-gutter: stable },
       из-за чего страница дёргается вправо при каждом открытии дропдауна -->
  <DropdownMenuRoot :modal="false">
    <DropdownMenuTrigger as-child>
      <AppIconButton :aria-label="t('layout.notifications.ariaLabel')">
        <AppIcon
          name="notification-3-line"
          class="absolute top-1.75 left-1.75 size-4.5 text-(--icon-secondary)"
        />
        <!-- the dot covers the bell and fades with it (the button sets 70% on the whole group) -->
        <span
          v-if="hasUnread"
          class="absolute top-1.75 right-1.75 size-1.75 rounded-full border border-(--bg-surface-primary) bg-(--icon-error)"
        />
      </AppIconButton>
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        :side-offset="8"
        align="end"
        class="z-50 flex w-90 flex-col overflow-hidden rounded-(--radius-xl) bg-(--bg-surface-primary) shadow-(--shadow-panel) backdrop-blur-floating-panel focus:outline-none animate-in fade-in-50 zoom-in-95 duration-100"
      >
        <div class="flex items-center gap-2 px-4 pt-4 pb-2">
          <p class="flex-1 text-body-sm font-medium text-(--text-primary)">
            {{ t('layout.notifications.title', { count: notifications.length }) }}
          </p>

          <button
            v-if="hasUnread"
            type="button"
            class="text-body-xs font-medium text-(--text-secondary) hover:text-(--text-primary)"
            @click="markAllAsRead"
          >
            {{ t('layout.notifications.markAllRead') }}
          </button>
        </div>

        <!-- Empty state as in the mockup (Figma Notifications state=empty 55:358): 292px area,
             40px bell and caption starting 98px from its top -->
        <div
          v-if="notifications.length === 0"
          class="flex h-73 flex-col items-center gap-2 pt-24.5"
        >
          <!-- the mockup binds bg/button/primary-disabled to this icon (no icon/* variable for it) -->
          <AppIcon name="notification-3-line" class="size-10 text-(--bg-button-primary-disabled)" />
          <p class="text-body-xs font-medium text-(--text-disabled)">
            {{ t('layout.notifications.empty') }}
          </p>
        </div>

        <div v-else class="relative">
          <!-- List area of the mockup is 292px high (panel 336px minus the 44px head) -->
          <AppScrollArea viewport-class="max-h-73">
            <div class="flex flex-col gap-1 px-1 pb-2">
              <!-- Read and unread items have the same opacity; only the dot tells them apart
                   (Figma Notifications 55:357: the list items are at 100%) -->
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="flex items-start gap-3 rounded-(--radius-lg) px-3 py-2"
              >
                <div
                  class="relative flex size-9 shrink-0 items-center justify-center rounded-(--radius-lg)"
                  :class="VARIANT_CONFIG[notification.variant].bg"
                >
                  <AppIcon
                    :name="VARIANT_CONFIG[notification.variant].icon"
                    class="size-4"
                    :class="[
                      VARIANT_CONFIG[notification.variant].color,
                      VARIANT_CONFIG[notification.variant].spin && 'animate-spin',
                    ]"
                  />

                  <!-- Unread mark: 8px accent dot in a 16px white circle, 25px from the left edge
                       of the icon and 4px above it (Figma prefix type=status) -->
                  <span
                    v-if="!notification.isRead"
                    class="absolute -top-1 left-6.25 flex size-4 items-center justify-center rounded-full bg-(--bg-surface-primary)"
                  >
                    <span class="size-2 rounded-full bg-(--bg-accent)" />
                  </span>
                </div>

                <div class="flex flex-col gap-0.5">
                  <p class="text-body-sm font-medium text-(--text-primary)">
                    {{ t(notification.titleKey) }}
                  </p>
                  <p class="text-body-xs text-(--text-secondary)">{{ t(notification.timeKey) }}</p>
                </div>
              </div>
            </div>
          </AppScrollArea>

          <div
            class="pointer-events-none absolute inset-x-0 bottom-0 h-15 bg-gradient-to-t from-(--bg-surface-primary) to-transparent"
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

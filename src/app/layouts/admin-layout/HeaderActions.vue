<script setup lang="ts">
import { HelpMenu } from '@/features/help-menu';
import { LanguageSwitcher } from '@/features/language-switcher';
import { NotificationsPanel } from '@/features/notifications-panel';
import { UserMenu } from '@/features/user-menu';
import { FEATURE_NOTIFICATIONS } from '@/shared/config/env';
</script>

<template>
  <!-- Icon buttons are grouped 4px apart, the avatar is 12px from the group (Figma Top Bar 52:2712) -->
  <div class="flex items-center gap-3">
    <div class="flex items-center gap-1">
      <LanguageSwitcher />
      <HelpMenu />
      <NotificationsPanel v-if="FEATURE_NOTIFICATIONS" />
    </div>

    <UserMenu />
  </div>
</template>

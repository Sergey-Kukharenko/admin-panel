<script setup lang="ts">
import { HelpMenu } from '@/features/help-menu';
import { LanguageSwitcher } from '@/features/language-switcher';
import { NotificationsPanel } from '@/features/notifications-panel';
import { UserMenu } from '@/features/user-menu';
</script>

<template>
  <div class="flex items-center gap-1">
    <LanguageSwitcher />
    <HelpMenu />
    <NotificationsPanel />
    <UserMenu />
  </div>
</template>

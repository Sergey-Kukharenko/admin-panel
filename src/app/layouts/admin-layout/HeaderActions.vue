<script setup lang="ts">
import { Bell, Globe, Info } from 'lucide-vue-next';
</script>

<template>
  <div class="flex items-center gap-1">
    <button type="button" class="flex size-8 items-center justify-center rounded-sm">
      <Globe class="size-4 text-(--icon-tertiary)" />
    </button>

    <button type="button" class="flex size-8 items-center justify-center rounded-sm">
      <Info class="size-4 text-(--icon-tertiary)" />
    </button>

    <button type="button" class="flex size-8 items-center justify-center rounded-sm">
      <Bell class="size-4 text-(--icon-tertiary)" />
    </button>

    <img src="https://i.pravatar.cc/32" alt="avatar" class="size-8 rounded-full" />
  </div>
</template>

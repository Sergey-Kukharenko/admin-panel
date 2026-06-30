<script setup lang="ts">
import { Bell, Globe, Info } from 'lucide-vue-next';
</script>

<template>
  <div class="flex items-center gap-5">
    <button>
      <Globe class="size-4 text-[#8A8A8A]" />
    </button>

    <button>
      <Info class="size-4 text-[#8A8A8A]" />
    </button>

    <button class="relative">
      <Bell class="size-4 text-[#8A8A8A]" />

      <span class="absolute -right-1 -top-1 size-2 rounded-full bg-red-500" />
    </button>

    <img src="https://i.pravatar.cc/32" alt="avatar" class="size-8 rounded-full" />
  </div>
</template>

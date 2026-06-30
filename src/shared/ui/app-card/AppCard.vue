<script setup lang="ts">
defineOptions({
  name: 'AppCard',
});
</script>

<template>
  <div class="rounded-lg border border-(--border) bg-(--card)">
    <slot />
  </div>
</template>

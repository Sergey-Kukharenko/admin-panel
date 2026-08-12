<script setup lang="ts">
defineOptions({
  name: 'AppCard',
});
</script>

<template>
  <div class="rounded-(--radius-lg) border border-(--border) bg-(--card)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import avatarPlaceholderUrl from '../../assets/avatar-placeholder.svg';
</script>

<template>
  <span
    class="block size-7 shrink-0 overflow-hidden rounded-(--radius-full) bg-(image:--bg-avatar)"
  >
    <!-- Figma component "avatar" (55:128), 28px. The circle is the bg-avatar gradient token; the
         vector silhouette replaces the 2 MB grayscale texture of the mockup, its gradient uses the
         texture's sampled average tones -->
    <img :src="avatarPlaceholderUrl" alt="" class="block size-full" />
  </span>
</template>

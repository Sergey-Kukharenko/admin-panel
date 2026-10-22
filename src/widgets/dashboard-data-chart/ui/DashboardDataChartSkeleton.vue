<script setup lang="ts">
import { AppSkeleton } from '@/shared/ui/app-skeleton';
</script>

<template>
  <!-- The geometry of the loaded chart (Figma BarChart 1322:142113): the 32px total, the 236px plot,
       the 32px filter; no frame for the loading state in the mockup -->
  <div data-chart-skeleton class="flex flex-col gap-4" aria-hidden="true">
    <AppSkeleton class="h-8 w-48 rounded-(--radius-sm)" />
    <AppSkeleton class="h-59 w-full rounded-(--radius-lg)" />
    <AppSkeleton class="h-8 w-41 rounded-(--radius-lg)" />
  </div>
</template>

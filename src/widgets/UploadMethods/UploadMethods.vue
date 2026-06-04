<script setup lang="ts">
import ConnectApiCard from '@/features/ConnectApiSource/ui/ConnectApiCard.vue';
import ConnectS3Card from '@/features/ConnectS3Bucket/ui/ConnectS3Card.vue';
import UploadCsvCard from '@/features/UploadCsv/ui/UploadCsvCard.vue';
</script>
<template>
  <section class="rounded-2xl border border-[var(--color-border)] bg-[#F7F7F7] p-5">
    <h2 class="mb-4 text-xs font-medium uppercase tracking-wide text-[#7A7A7A]">
      Способы загрузки
    </h2>

    <div class="grid grid-cols-3 gap-4">
      <UploadCsvCard />
      <ConnectS3Card />
      <ConnectApiCard />
    </div>
  </section>
</template>

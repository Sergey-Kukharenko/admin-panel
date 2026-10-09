<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { getIntegrationByType } from '@/entities/integration';
import { IntegrationDetail } from '@/widgets/integration-detail';

defineOptions({
  name: 'IntegrationDetailPage',
});

const route = useRoute();
const router = useRouter();

const integration = computed(() => getIntegrationByType(String(route.params.type)));

onMounted(() => {
  if (!integration.value) {
    router.replace('/integrations');
  }
});
</script>

<template>
  <IntegrationDetail v-if="integration" :integration="integration" />
</template>

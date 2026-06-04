<script setup lang="ts">
import { Zap } from 'lucide-vue-next';

import SourceCard from '@/shared/ui/SourceCard';

import { useConnectApi } from '../model/useConnectApi';

const { connect } = useConnectApi();
</script>

<template>
  <SourceCard
    title="API"
    description="Подключите внешний сервис через REST API или webhook"
    :icon="Zap"
  >
    <button class="rounded-md border px-4 py-2" @click="connect">Подключить</button>
  </SourceCard>
</template>

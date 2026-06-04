<script setup lang="ts">
import { Cloud } from 'lucide-vue-next';

import AppButton from '@/shared/ui/AppButton';
import SourceCard from '@/shared/ui/SourceCard';

import { useConnectS3 } from '../model/useConnectS3';

const { connect } = useConnectS3();
</script>

<template>
  <SourceCard
    title="S3 Bucket"
    description="Подключите хранилище — данные будут синхронизироваться автоматически"
    :icon="Cloud"
  >
    <AppButton @click="connect"> Подключить</AppButton>
  </SourceCard>
</template>

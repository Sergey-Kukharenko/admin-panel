<script setup lang="ts">
import type {
  IntegrationType,
  RestApiConnectionRequest,
  S3ConnectionRequest,
} from '@/entities/integration';

import { useSubmitConnectionRequest } from '../model/useSubmitConnectionRequest';
import RestApiConnectionModal from './RestApiConnectionModal.vue';
import S3ConnectionModal from './S3ConnectionModal.vue';

defineProps<{
  integrationType: IntegrationType;
}>();

const open = defineModel<boolean>('open', { required: true });

const { submit, isPending } = useSubmitConnectionRequest({
  onClose: () => {
    open.value = false;
  },
});

function submitRestApi(payload: RestApiConnectionRequest) {
  submit({ type: 'rest-api', payload });
}

function submitS3(payload: S3ConnectionRequest) {
  submit({ type: 's3', payload });
}
</script>

<template>
  <RestApiConnectionModal
    v-if="integrationType === 'rest-api'"
    v-model:open="open"
    :submitting="isPending"
    @submit="submitRestApi"
  />

  <S3ConnectionModal v-else v-model:open="open" :submitting="isPending" @submit="submitS3" />
</template>

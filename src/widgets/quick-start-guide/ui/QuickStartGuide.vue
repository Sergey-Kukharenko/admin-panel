<script setup lang="ts">
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'radix-vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { ROUTE_NAMES } from '@/shared/config';
import { AppIcon } from '@/shared/ui/app-icon';

import { useQuickStartGuide } from '../model/useQuickStartGuide';

const { progress } = useQuickStartGuide();

const { t } = useI18n({ useScope: 'global' });

const isOpen = ref(true);
</script>

<template>
  <!-- Figma «guide tour» (dashboard frame «Идет обучение модели» 1417:190195). The collapsed state
       has no mockup: it keeps the header, the description and the progress bar -->
  <CollapsibleRoot
    v-model:open="isOpen"
    as="section"
    class="flex flex-col gap-2 rounded-(--radius-xl) bg-(--bg-guide) p-3"
  >
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-1">
        <CollapsibleTrigger
          class="flex items-center justify-between rounded-(--radius-sm) text-left focus-visible:shadow-(--shadow-focus) focus-visible:outline-none"
        >
          <span class="flex items-center gap-1">
            <span class="text-body-sm font-medium text-(--text-on-dark)">
              {{ t('quickStart.title') }}
            </span>

            <span
              class="flex h-4.5 items-center rounded-(--radius-4xl) bg-(--bg-guide-badge) px-1.5 font-mono text-element-tag font-medium text-(--bg-tag-active) uppercase"
            >
              {{ progress.percent }}%
            </span>
          </span>

          <AppIcon
            name="large-line-arrow-up"
            :class="['size-3 text-(--text-on-dark) opacity-50', !isOpen && 'rotate-180']"
          />
        </CollapsibleTrigger>

        <p class="text-body-xs text-(--text-on-dark) opacity-70">
          {{ t('quickStart.description') }}
        </p>
      </div>

      <div
        role="progressbar"
        aria-valuemin="0"
        :aria-valuemax="progress.steps.length"
        :aria-valuenow="progress.doneCount"
        :aria-valuetext="
          t('quickStart.progress', { done: progress.doneCount, total: progress.steps.length })
        "
        :aria-label="t('quickStart.title')"
        class="h-2 overflow-hidden rounded-(--radius-sm) bg-(--bg-guide-progress-track) bg-(image:--bg-guide-progress-hatch)"
      >
        <!-- dynamic width of the filled part -->
        <div
          class="h-full rounded-(--radius-sm) bg-(--bg-guide-progress-fill) transition-[width] duration-300"
          :style="{ width: `${progress.percent}%` }"
        />
      </div>
    </div>

    <CollapsibleContent as="ol" class="flex flex-col pt-1">
      <li v-for="(step, index) in progress.steps" :key="step.id" class="flex gap-2">
        <div class="flex flex-col items-center gap-1 pt-1">
          <span
            v-if="step.isDone"
            class="flex size-4 shrink-0 items-center justify-center rounded-full bg-(--bg-tag-active) text-(--icon-guide-step-done)"
          >
            <AppIcon name="check-line" class="size-3" />
          </span>
          <span
            v-else
            class="size-4 shrink-0 rounded-full border-2 border-dashed border-(--border-guide-step-pending)"
          />

          <span
            v-if="index < progress.steps.length - 1"
            class="mb-1 w-px flex-1 bg-(--border-guide-step-connector)"
          />
        </div>

        <div
          :class="[
            'flex min-w-0 flex-col pt-1 text-body-xs',
            step.id === 'uploadData' ? 'gap-1' : 'gap-0.5',
            index < progress.steps.length - 1 && 'pb-4',
          ]"
        >
          <RouterLink
            v-if="step.id === 'uploadData'"
            :to="{ name: ROUTE_NAMES.datasets }"
            class="flex items-center gap-1 self-start rounded-(--radius-sm) font-medium text-(--text-guide-step) focus-visible:shadow-(--shadow-focus) focus-visible:outline-none"
          >
            {{ t(`quickStart.steps.${step.id}.title`) }}
            <AppIcon name="large-line-arrow-right" class="size-3" />
          </RouterLink>

          <p v-else class="font-medium text-(--text-guide-step)">
            {{ t(`quickStart.steps.${step.id}.title`) }}
          </p>

          <p class="text-(--text-guide-step-description)">
            {{ t(`quickStart.steps.${step.id}.description`) }}
          </p>

          <span v-if="step.isDone" class="sr-only">{{ t('quickStart.done') }}</span>
        </div>
      </li>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>

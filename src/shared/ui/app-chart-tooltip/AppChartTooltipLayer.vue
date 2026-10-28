<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';

import type { AppChartTooltipLayerProps } from './AppChartTooltip.types';
import { nearestIndex, stepIndex } from './pointIndex';

const props = withDefaults(defineProps<AppChartTooltipLayerProps>(), {
  disabled: () => [],
  cursor: false,
});

const root = useTemplateRef<HTMLDivElement>('root');
const anchor = useTemplateRef<HTMLDivElement>('anchor');
const active = ref<number | null>(null);
// horizontal shift of the tooltip from the point, px
const shift = ref(0);
// the tooltip stays invisible until its side is chosen by its real width
const placed = ref(false);

const activePosition = computed(() =>
  active.value === null ? null : (props.positions[active.value] ?? null),
);

// new days (another period, a refetch with other dates) make the active index point at another day
// or past the end: close the tooltip. Compared by value: a chart recomputed with the same days (the
// locale, the same data) keeps the open tooltip
watch(
  () => props.positions.join(','),
  () => show(null),
);

/**
 * Starts the tooltip on the point when it fits, otherwise ends it on the point; where it fits on
 * neither side (a narrow chart, a 1280px window), it ends on the right edge of the layer instead
 * of overflowing the chart card
 */
async function place(position: number) {
  placed.value = false;
  await nextTick();
  const width = root.value?.clientWidth ?? 0;
  const tooltipWidth = anchor.value?.offsetWidth ?? 0;
  const left = (position / 100) * width;
  if (tooltipWidth <= width - left) shift.value = 0;
  else if (tooltipWidth <= left) shift.value = -tooltipWidth;
  else shift.value = Math.max(width - tooltipWidth, 0) - left;
  placed.value = true;
}

function show(index: number | null) {
  const position = index === null ? undefined : props.positions[index];
  if (index === null || position === undefined || props.disabled[index]) {
    active.value = null;
    return;
  }
  if (index === active.value) return;
  active.value = index;
  void place(position);
}

function onPointerMove(event: PointerEvent) {
  const box = root.value?.getBoundingClientRect();
  if (!box || box.width === 0) return;
  show(nearestIndex(props.positions, ((event.clientX - box.left) / box.width) * 100));
}

function onFocus() {
  // only a keyboard focus opens the first point: a click focuses the layer under the pointer too
  if (root.value?.matches(':focus-visible') && active.value === null) {
    show(stepIndex(props.positions.length, props.disabled, null, 1));
  }
}

function onKeydown(event: KeyboardEvent) {
  const count = props.positions.length;
  const moves: Record<string, () => number | null> = {
    // a slider takes the vertical arrows too (WAI-ARIA APG slider pattern)
    ArrowRight: () => stepIndex(count, props.disabled, active.value, 1),
    ArrowUp: () => stepIndex(count, props.disabled, active.value, 1),
    ArrowLeft: () => stepIndex(count, props.disabled, active.value, -1),
    ArrowDown: () => stepIndex(count, props.disabled, active.value, -1),
    Home: () => stepIndex(count, props.disabled, null, 1),
    End: () => stepIndex(count, props.disabled, null, -1),
  };
  if (event.key === 'Escape') {
    // Escape is the page's (a dialog, a menu) when there is no tooltip to close
    if (active.value === null) return;
    event.preventDefault();
    show(null);
    return;
  }
  const move = moves[event.key];
  if (!move) return;
  event.preventDefault();
  show(move());
}
</script>

<template>
  <!-- The hover and keyboard layer over a chart plot: the consumer places it over the plot box. The
       plot itself is hidden from screen readers; the layer is the chart for them: a slider over the
       days, so a screen reader in browse mode hands the arrows to it, and the value text is the
       active day with its values -->
  <div
    ref="root"
    data-chart-tooltip-layer
    role="slider"
    tabindex="0"
    :aria-label="label"
    aria-orientation="horizontal"
    :aria-valuemin="0"
    :aria-valuemax="Math.max(positions.length - 1, 0)"
    :aria-valuenow="active ?? 0"
    :aria-valuetext="active === null ? undefined : describe(active)"
    class="rounded-(--radius-sm) outline-none focus-visible:shadow-(--shadow-focus)"
    @pointermove="onPointerMove"
    @pointerleave="show(null)"
    @focus="onFocus"
    @blur="show(null)"
    @keydown="onKeydown"
  >
    <span
      v-if="cursor && activePosition !== null"
      data-chart-cursor
      aria-hidden="true"
      class="pointer-events-none absolute inset-y-0 w-px bg-(--border-default)"
      :style="{ left: `${activePosition}%` }"
    />
    <!-- the tooltip starts on the point and 24px above the top grid line (Figma 1323:162549); where
         it does not fit, it ends on the point instead. w-max: the anchor keeps the tooltip width
         instead of shrinking to the room left of it -->
    <div
      v-if="active !== null && activePosition !== null"
      ref="anchor"
      aria-hidden="true"
      class="pointer-events-none absolute -top-6 z-10 w-max"
      :class="[!placed && 'invisible']"
      :style="{ left: `${activePosition}%`, transform: `translateX(${shift}px)` }"
    >
      <slot :index="active" />
    </div>
  </div>
</template>

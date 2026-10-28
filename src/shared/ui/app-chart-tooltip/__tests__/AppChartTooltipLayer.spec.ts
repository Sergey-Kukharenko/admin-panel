// @vitest-environment jsdom
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';

import type { AppChartTooltipLayerProps } from '../AppChartTooltip.types';
import AppChartTooltipLayer from '../AppChartTooltipLayer.vue';

function render(props: Partial<AppChartTooltipLayerProps> = {}) {
  return mount(AppChartTooltipLayer, {
    props: {
      positions: [0, 50, 100],
      label: 'Chart',
      describe: (index: number) => `day ${index}`,
      ...props,
    },
    slots: { default: '<template #default="{ index }"><b data-tip>tip {{ index }}</b></template>' },
  });
}

/** jsdom has no layout: the layer box for the pointer math */
function setBox(element: Element, width: number) {
  element.getBoundingClientRect = () => ({ left: 100, width }) as DOMRect;
  Object.defineProperty(element, 'clientWidth', { value: width, configurable: true });
}

/** jsdom has no PointerEvent: a MouseEvent of that type carries clientX to the handler */
async function pointAt(wrapper: ReturnType<typeof render>, clientX: number) {
  wrapper
    .find('[data-chart-tooltip-layer]')
    .element.dispatchEvent(new MouseEvent('pointermove', { clientX }));
  // the side is chosen after the tooltip rendered (by its width)
  await flushPromises();
}

// the jsdom getter of offsetWidth, put back after every test so other suites see the real one
const nativeOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');

/** jsdom has no layout: the width of the rendered tooltip */
function setTooltipWidth(width: number) {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    get: () => width,
    configurable: true,
  });
}

afterEach(() => {
  if (nativeOffsetWidth)
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', nativeOffsetWidth);
});

const anchorOf = (wrapper: ReturnType<typeof render>) =>
  wrapper.find('[data-tip]').element.parentElement;

describe('AppChartTooltipLayer', () => {
  it('is a slider over the days for the keyboard and screen readers, named by the label', () => {
    const layer = render().find('[data-chart-tooltip-layer]');

    expect(layer.attributes('tabindex')).toBe('0');
    expect(layer.attributes('role')).toBe('slider');
    expect(layer.attributes('aria-label')).toBe('Chart');
    expect(layer.attributes('aria-valuemin')).toBe('0');
    expect(layer.attributes('aria-valuemax')).toBe('2');
    expect(layer.attributes('aria-valuetext')).toBeUndefined();
    // ARIA requires a value on a slider even before a day is chosen
    expect(layer.attributes('aria-valuenow')).toBe('0');
  });

  it('the pointer shows the tooltip of the nearest point, at the point, 24px above the plot', async () => {
    const wrapper = render();
    const layer = wrapper.find('[data-chart-tooltip-layer]');
    setBox(layer.element, 1000);

    await pointAt(wrapper, 100 + 420);

    expect(wrapper.find('[data-tip]').text()).toBe('tip 1');
    expect(anchorOf(wrapper)?.getAttribute('style')).toContain('left: 50%');
    expect(anchorOf(wrapper)?.classList).toContain('-top-6');
  });

  it('where the tooltip does not fit on the right, it ends on the point (the side with more room)', async () => {
    setTooltipWidth(241);
    const wrapper = render({ positions: [10, 50, 90] });
    const layer = wrapper.find('[data-chart-tooltip-layer]');
    setBox(layer.element, 400);

    await pointAt(wrapper, 100 + 40);
    expect(anchorOf(wrapper)?.style.transform).toBe('translateX(0px)');

    await pointAt(wrapper, 100 + 360);
    expect(anchorOf(wrapper)?.style.transform).toBe('translateX(-241px)');
    expect(anchorOf(wrapper)?.classList).not.toContain('invisible');
  });

  it('fits on neither side (a narrow chart): ends on the right edge of the layer, not past it', async () => {
    setTooltipWidth(241);
    const wrapper = render({ positions: [0, 40, 100] });
    const layer = wrapper.find('[data-chart-tooltip-layer]');
    setBox(layer.element, 300);

    await pointAt(wrapper, 100 + 120);

    // the point is at 120px: the tooltip spans 59..300px of the 300px layer
    expect(anchorOf(wrapper)?.style.transform).toBe('translateX(-61px)');
  });

  it('new days close the open tooltip; the same days in a new array keep it', async () => {
    const wrapper = render({ positions: [0, 50, 100] });
    const layer = wrapper.find('[data-chart-tooltip-layer]');
    await layer.trigger('keydown', { key: 'End' });
    expect(wrapper.find('[data-tip]').text()).toBe('tip 2');

    await wrapper.setProps({ positions: [0, 50, 100] });
    expect(wrapper.find('[data-tip]').text()).toBe('tip 2');

    await wrapper.setProps({ positions: [0, 100] });
    expect(wrapper.find('[data-tip]').exists()).toBe(false);
    expect(layer.attributes('aria-valuetext')).toBeUndefined();
  });

  it('a disabled point shows nothing under the pointer', async () => {
    const wrapper = render({ disabled: [false, true, false] });
    const layer = wrapper.find('[data-chart-tooltip-layer]');
    setBox(layer.element, 1000);

    await pointAt(wrapper, 100 + 500);

    expect(wrapper.find('[data-tip]').exists()).toBe(false);
  });

  it('leaving the layer hides the tooltip', async () => {
    const wrapper = render();
    const layer = wrapper.find('[data-chart-tooltip-layer]');
    setBox(layer.element, 1000);
    await pointAt(wrapper, 100);

    await layer.trigger('pointerleave');

    expect(wrapper.find('[data-tip]').exists()).toBe(false);
  });

  it('arrows move by point and skip the disabled ones, Home / End jump, Escape hides', async () => {
    const wrapper = render({ disabled: [false, true, false] });
    const layer = wrapper.find('[data-chart-tooltip-layer]');
    const tip = () => wrapper.find('[data-tip]');

    await layer.trigger('keydown', { key: 'ArrowRight' });
    expect(tip().text()).toBe('tip 0');
    await layer.trigger('keydown', { key: 'ArrowRight' });
    expect(tip().text()).toBe('tip 2');
    await layer.trigger('keydown', { key: 'Home' });
    expect(tip().text()).toBe('tip 0');
    await layer.trigger('keydown', { key: 'End' });
    expect(tip().text()).toBe('tip 2');
    // the vertical arrows of a slider move the same way (WAI-ARIA APG slider pattern)
    await layer.trigger('keydown', { key: 'ArrowDown' });
    expect(tip().text()).toBe('tip 0');
    await layer.trigger('keydown', { key: 'ArrowUp' });
    expect(tip().text()).toBe('tip 2');
    await layer.trigger('keydown', { key: 'Escape' });
    expect(tip().exists()).toBe(false);
  });

  it('the value text reads the active point; the visual tooltip is hidden from screen readers', async () => {
    const wrapper = render();
    const layer = wrapper.find('[data-chart-tooltip-layer]');

    expect(layer.attributes('aria-valuetext')).toBeUndefined();
    await layer.trigger('keydown', { key: 'End' });

    expect(layer.attributes('aria-valuetext')).toBe('day 2');
    expect(layer.attributes('aria-valuenow')).toBe('2');
    expect(anchorOf(wrapper)?.getAttribute('aria-hidden')).toBe('true');
  });

  it('the cursor line only on request (line charts), at the active point', async () => {
    const plain = render();
    await plain.find('[data-chart-tooltip-layer]').trigger('keydown', { key: 'Home' });
    expect(plain.find('[data-chart-cursor]').exists()).toBe(false);

    const withCursor = render({ cursor: true });
    await withCursor.find('[data-chart-tooltip-layer]').trigger('keydown', { key: 'End' });
    expect(withCursor.find('[data-chart-cursor]').attributes('style')).toContain('left: 100%');
  });

  it('Escape without an open tooltip is left to the page (a dialog may close on it)', () => {
    const wrapper = render();
    const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
    wrapper.find('[data-chart-tooltip-layer]').element.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it('the other keys are left to the page (Tab moves the focus on)', () => {
    const wrapper = render();
    const event = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    wrapper.find('[data-chart-tooltip-layer]').element.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });
});

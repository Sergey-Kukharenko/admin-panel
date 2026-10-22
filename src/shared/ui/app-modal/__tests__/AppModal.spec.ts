// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';

import { i18n, setAppLocale } from '@/shared/i18n';

import AppModal from '../AppModal.vue';

type Props = InstanceType<typeof AppModal>['$props'];

function render(props: Partial<Props> = {}, slots: Record<string, string> = {}) {
  return mount(AppModal, {
    props: { open: true, title: 'Connect REST API', ...props },
    slots: { default: '<p>Body</p>', ...slots },
    global: { plugins: [i18n] },
    attachTo: document.body,
  });
}

// The dialog is teleported to <body>
const dialog = () => document.body.querySelector<HTMLElement>('[role="dialog"]');

describe('AppModal', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    setAppLocale('ru');
  });

  it('renders the title and the body when open', async () => {
    render();
    await nextTick();

    expect(dialog()?.textContent).toContain('Connect REST API');
    expect(dialog()?.textContent).toContain('Body');
  });

  it('labels the dialog with its title', async () => {
    render();
    await nextTick();

    const titleId = dialog()?.getAttribute('aria-labelledby');
    expect(titleId && document.getElementById(titleId)?.textContent?.trim()).toBe(
      'Connect REST API',
    );
  });

  it('renders nothing when closed', async () => {
    render({ open: false });
    await nextTick();

    expect(dialog()).toBeNull();
  });

  it('renders the footer slot only when provided', async () => {
    render({}, { footer: '<button>Submit</button>' });
    await nextTick();

    expect(dialog()?.querySelector('footer')?.textContent).toContain('Submit');
  });

  it('has no footer without the footer slot', async () => {
    render();
    await nextTick();

    expect(dialog()?.querySelector('footer')).toBeNull();
  });

  it('closes via the close button with a translated aria-label', async () => {
    const wrapper = render();
    await nextTick();

    const close = dialog()?.querySelector<HTMLButtonElement>('button[aria-label="Закрыть"]');
    close?.click();
    await nextTick();

    expect(wrapper.emitted('update:open')).toEqual([[false]]);
  });

  it('uses the md width by default and sm / lg on request', async () => {
    render();
    await nextTick();
    expect(dialog()?.className).toContain('w-120');

    document.body.innerHTML = '';
    render({ size: 'sm' });
    await nextTick();
    expect(dialog()?.className).toContain('w-100');

    document.body.innerHTML = '';
    render({ size: 'lg' });
    await nextTick();
    expect(dialog()?.className).toContain('w-180');
  });
});

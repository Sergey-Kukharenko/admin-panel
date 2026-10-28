// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';

import { i18n, setAppLocale } from '@/shared/i18n';

import AppConfirmDialog from '../AppConfirmDialog.vue';

type Props = InstanceType<typeof AppConfirmDialog>['$props'];

function render(props: Partial<Props> = {}) {
  return mount(AppConfirmDialog, {
    props: { open: true, title: 'Log out?', description: 'Description', ...props },
    global: { plugins: [i18n] },
    attachTo: document.body,
  });
}

// The dialog is teleported to <body>
const button = (name: string) =>
  [...document.body.querySelectorAll('button')].find(
    (b) => b.textContent?.trim() === name || b.getAttribute('aria-label') === name,
  );

describe('AppConfirmDialog', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    setAppLocale('ru');
  });

  it('renders title and description when open', async () => {
    render();
    await nextTick();

    expect(document.body.textContent).toContain('Log out?');
    expect(document.body.textContent).toContain('Description');
  });

  it('renders nothing when closed', async () => {
    render({ open: false });
    await nextTick();

    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
  });

  it('uses translated default labels (ru)', async () => {
    render();
    await nextTick();

    expect(button('Отмена')).toBeDefined();
    expect(button('Подтвердить')).toBeDefined();
    expect(button('Закрыть')).toBeDefined();
  });

  it('uses translated default labels in English, not the Russian ones', async () => {
    setAppLocale('en');
    render();
    await nextTick();

    expect(button('Cancel')).toBeDefined();
    expect(button('Confirm')).toBeDefined();
    expect(button('Close')).toBeDefined();
    expect(document.body.textContent).not.toContain('Отмена');
  });

  it('custom labels replace the defaults', async () => {
    render({ confirmLabel: 'Выйти', cancelLabel: 'Остаться' });
    await nextTick();

    expect(button('Выйти')).toBeDefined();
    expect(button('Остаться')).toBeDefined();
    expect(button('Подтвердить')).toBeUndefined();
  });

  it.each([
    ['Cancel', 'Отмена'],
    ['the close icon', 'Закрыть'],
  ] as const)('%s closes the dialog', async (_how, name) => {
    const wrapper = render();
    await nextTick();

    button(name)!.click();

    expect(wrapper.emitted('update:open')).toEqual([[false]]);
  });

  it('Confirm emits confirm', async () => {
    const wrapper = render();
    await nextTick();

    button('Подтвердить')!.click();

    expect(wrapper.emitted('confirm')).toHaveLength(1);
  });

  it('Escape closes the dialog', async () => {
    const wrapper = render();
    await nextTick();

    document.body
      .querySelector('[role="dialog"]')!
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await nextTick();

    expect(wrapper.emitted('update:open')).toEqual([[false]]);
  });

  it.each([
    ['warning', 'bg-(--bg-warning)'],
    ['danger', 'bg-(--bg-badge-danger)'],
  ] as const)('%s variant paints the icon block with %s', async (variant, bg) => {
    render({ variant });
    await nextTick();

    expect(document.body.querySelector('[role="dialog"]')!.innerHTML).toContain(bg);
  });
});

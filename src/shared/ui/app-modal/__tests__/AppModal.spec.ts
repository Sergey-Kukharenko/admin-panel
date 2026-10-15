import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { h } from 'vue';

import { i18n } from '@/shared/i18n';

import type { AppModalProps } from '../AppModal.types';
import AppModal from '../AppModal.vue';

function mountModal(props: Partial<AppModalProps> = {}, slots: Record<string, () => unknown> = {}) {
  return mount(AppModal, {
    props: { open: true, ...props },
    slots: { default: () => h('p', { 'data-test': 'body' }, 'Body'), ...slots },
    global: { plugins: [i18n] },
    attachTo: document.body,
  });
}

function getDialog() {
  return document.body.querySelector<HTMLElement>('[role="dialog"]');
}

describe('AppModal', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('рендерит контент в портал, когда open', async () => {
    mountModal({ title: 'Заголовок' });
    await flushPromises();

    const dialog = getDialog();
    expect(dialog).not.toBeNull();
    expect(dialog?.textContent).toContain('Заголовок');
    expect(dialog?.querySelector('[data-test="body"]')).not.toBeNull();
  });

  it('ничего не рендерит, когда закрыта', async () => {
    mountModal({ open: false });
    await flushPromises();

    expect(getDialog()).toBeNull();
  });

  it('связывает заголовок с диалогом через aria-labelledby', async () => {
    mountModal({ title: 'Заголовок' });
    await flushPromises();

    const labelledBy = getDialog()?.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    expect(document.getElementById(labelledBy!)?.textContent).toContain('Заголовок');
  });

  it('снимает aria-describedby без описания и оставляет с ним', async () => {
    const withoutDescription = mountModal();
    await flushPromises();
    expect(getDialog()?.hasAttribute('aria-describedby')).toBe(false);
    withoutDescription.unmount();

    mountModal({ hasDescription: true });
    await flushPromises();
    expect(getDialog()?.hasAttribute('aria-describedby')).toBe(true);
  });

  it('эмитит close по крестику', async () => {
    const wrapper = mountModal({ title: 'Заголовок' });
    await flushPromises();

    const closeButton = getDialog()?.querySelector<HTMLButtonElement>('button[aria-label]');
    expect(closeButton?.getAttribute('aria-label')).toBe('Закрыть');
    closeButton?.click();

    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('эмитит close по Escape', async () => {
    const wrapper = mountModal();
    await flushPromises();

    getDialog()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('рендерит футер только при наличии слота', async () => {
    const withoutFooter = mountModal();
    await flushPromises();
    expect(getDialog()?.querySelector('footer')).toBeNull();
    withoutFooter.unmount();

    mountModal({}, { footer: () => h('button', 'OK') });
    await flushPromises();
    expect(getDialog()?.querySelector('footer')?.textContent).toContain('OK');
  });

  it('переключает ширину по size', async () => {
    const medium = mountModal();
    await flushPromises();
    expect(getDialog()?.classList.contains('w-120')).toBe(true);
    medium.unmount();

    mountModal({ size: 'sm' });
    await flushPromises();
    expect(getDialog()?.classList.contains('w-100')).toBe(true);
  });

  it('переключает размер заголовка по titleSize', async () => {
    const medium = mountModal({ title: 'Заголовок' });
    await flushPromises();
    expect(getDialog()?.querySelector('h2')?.classList.contains('text-base')).toBe(true);
    medium.unmount();

    mountModal({ title: 'Заголовок', titleSize: 'sm' });
    await flushPromises();
    expect(getDialog()?.querySelector('h2')?.classList.contains('text-sm')).toBe(true);
  });
});

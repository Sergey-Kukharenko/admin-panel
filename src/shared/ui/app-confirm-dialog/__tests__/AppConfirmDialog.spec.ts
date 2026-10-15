import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';

import { i18n } from '@/shared/i18n';

import AppConfirmDialog from '../AppConfirmDialog.vue';

function getDialog() {
  return document.body.querySelector<HTMLElement>('[role="dialog"]');
}

function getButton(text: string) {
  return [...(getDialog()?.querySelectorAll('button') ?? [])].find(
    (button) => button.textContent?.trim() === text,
  );
}

describe('AppConfirmDialog', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('показывает заголовок и описание, связывает их с диалогом', async () => {
    mount(AppConfirmDialog, {
      props: { open: true, title: 'Выйти?', description: 'Сессия завершится' },
      global: { plugins: [i18n] },
      attachTo: document.body,
    });
    await flushPromises();

    const dialog = getDialog();
    const describedBy = dialog?.getAttribute('aria-describedby');
    expect(
      document.getElementById(dialog?.getAttribute('aria-labelledby') ?? '')?.textContent,
    ).toContain('Выйти?');
    expect(document.getElementById(describedBy ?? '')?.textContent).toContain('Сессия завершится');
  });

  it('эмитит confirm и close по кнопкам', async () => {
    const wrapper = mount(AppConfirmDialog, {
      props: { open: true, title: 'Выйти?', confirmLabel: 'Да', cancelLabel: 'Нет' },
      global: { plugins: [i18n] },
      attachTo: document.body,
    });
    await flushPromises();

    getButton('Да')?.click();
    getButton('Нет')?.click();

    expect(wrapper.emitted('confirm')).toHaveLength(1);
    expect(wrapper.emitted('close')).toHaveLength(1);
  });
});

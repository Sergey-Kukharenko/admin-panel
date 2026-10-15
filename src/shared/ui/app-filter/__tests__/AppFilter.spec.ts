import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';

import AppFilter from '../AppFilter.vue';

const OPTIONS = [
  { label: 'Ошибка', value: 'ERROR' },
  { label: 'Успешно', value: 'SUCCESS' },
] as const;

function mountFilter(props: { multiple?: boolean; modelValue?: string | string[] }) {
  return mount(AppFilter, {
    props: { title: 'Статус', icon: 'filter-3-line', options: OPTIONS, ...props },
    attachTo: document.body,
  });
}

async function openMenu(wrapper: ReturnType<typeof mountFilter>) {
  await wrapper.get('button').trigger('keydown', { key: 'Enter' });
  await flushPromises();
}

function menuItem(label: string) {
  return [...document.body.querySelectorAll<HTMLElement>('[role^="menuitem"]')].find(
    (item) => item.textContent?.trim() === label,
  );
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('AppFilter (одиночный выбор)', () => {
  it('показывает заголовок, а после выбора — подпись значения', () => {
    expect(mountFilter({}).text()).toContain('Статус');
    expect(mountFilter({ modelValue: 'ERROR' }).text()).toContain('Ошибка');
  });

  it('эмитит выбранное значение', async () => {
    const wrapper = mountFilter({});
    await openMenu(wrapper);

    menuItem('Успешно')?.click();
    await flushPromises();

    expect(wrapper.emitted('update:modelValue')).toEqual([['SUCCESS']]);
  });

  it('крестик сбрасывает значение в пустую строку', async () => {
    const wrapper = mountFilter({ modelValue: 'ERROR' });

    await wrapper.get('button span.cursor-pointer').trigger('click');

    expect(wrapper.emitted('update:modelValue')).toEqual([['']]);
  });
});

describe('AppFilter (множественный выбор)', () => {
  it('показывает счётчик выбранных', () => {
    expect(mountFilter({ multiple: true, modelValue: ['ERROR', 'SUCCESS'] }).text()).toContain('2');
  });

  it('переключает значения в массиве', async () => {
    const wrapper = mountFilter({ multiple: true, modelValue: ['ERROR'] });
    await openMenu(wrapper);

    menuItem('Успешно')?.click();
    menuItem('Ошибка')?.click();
    await flushPromises();

    expect(wrapper.emitted('update:modelValue')).toEqual([[['ERROR', 'SUCCESS']], [[]]]);
  });

  it('крестик сбрасывает в пустой массив', async () => {
    const wrapper = mountFilter({ multiple: true, modelValue: ['ERROR'] });

    await wrapper.get('button span.cursor-pointer').trigger('click');

    expect(wrapper.emitted('update:modelValue')).toEqual([[[]]]);
  });
});

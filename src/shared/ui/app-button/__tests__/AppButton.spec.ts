import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import AppButton from '../AppButton.vue';

describe('AppButton', () => {
  it('рендерит слот в нативной кнопке', () => {
    const wrapper = mount(AppButton, { slots: { default: 'Сохранить' } });

    expect(wrapper.element.tagName).toBe('BUTTON');
    expect(wrapper.text()).toBe('Сохранить');
  });

  it('по умолчанию primary / medium', () => {
    const classes = mount(AppButton).classes();

    expect(classes).toContain('bg-(--primary)');
    expect(classes).toContain('h-9');
  });

  it('переключает классы по variant и size', () => {
    const classes = mount(AppButton, { props: { variant: 'danger', size: 'small' } }).classes();

    expect(classes).toContain('bg-(--danger)');
    expect(classes).toContain('h-8');
    expect(classes).not.toContain('bg-(--primary)');
  });

  it('у иконочной кнопки нет классов типографики', () => {
    const classes = mount(AppButton, { props: { size: 'icon' } }).classes();

    expect(classes).toContain('size-8');
    expect(classes).not.toContain('font-medium');
  });

  it('пробрасывает атрибуты на button', () => {
    const wrapper = mount(AppButton, {
      attrs: { type: 'submit', 'aria-label': 'Закрыть', form: 'f' },
    });

    expect(wrapper.attributes('type')).toBe('submit');
    expect(wrapper.attributes('aria-label')).toBe('Закрыть');
    expect(wrapper.attributes('form')).toBe('f');
  });

  it('disabled выключает кнопку и клики', async () => {
    const clicks: Event[] = [];
    const wrapper = mount(AppButton, {
      props: { disabled: true },
      attrs: { onClick: (event: Event) => clicks.push(event) },
    });

    expect(wrapper.attributes('disabled')).toBeDefined();
    await wrapper.trigger('click');
    expect(clicks).toHaveLength(0);
  });
});

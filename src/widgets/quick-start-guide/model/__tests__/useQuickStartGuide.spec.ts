import { createPinia, setActivePinia } from 'pinia';
import { afterEach, describe, expect, it } from 'vitest';
import type { App } from 'vue';

import { type UserProfile, useUserStore } from '@/entities/user';
import { withSetup } from '@/shared/lib/test';

import { useQuickStartGuide } from '../useQuickStartGuide';

const USER: UserProfile = {
  authenticated: true,
  email: 'client@example.com',
  project_id: 'project',
  authentik_user_id: 'user',
  name: 'Client',
  timezone: 'Europe/Moscow',
};

describe('useQuickStartGuide', () => {
  let app: App | undefined;

  afterEach(() => app?.unmount());

  function setup(user: UserProfile) {
    const pinia = createPinia();
    setActivePinia(pinia);
    useUserStore().user = user;

    const [result, mounted] = withSetup(() => useQuickStartGuide(), [pinia]);
    app = mounted;
    return result;
  }

  // WT-566: the backend field may be missing until it ships, the guide stays visible then
  it.each([
    ['the field is missing', USER, true],
    ['onboarding is not complete', { ...USER, is_onboarding_complete: false }, true],
    ['onboarding is complete', { ...USER, is_onboarding_complete: true }, false],
  ])('when %s, isVisible is %s', (_case, user, visible) => {
    expect(setup(user).isVisible.value).toBe(visible);
  });
});

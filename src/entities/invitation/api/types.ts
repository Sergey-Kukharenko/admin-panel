import type { components } from '@/shared/api';

type Schemas = components['schemas'];

export type InvitationStatus = Schemas['InvitationStatus'];

export type InvitationCreateRequest = Schemas['InvitationCreateSchema'];

export type Invitation = Schemas['InvitationResponseSchema'];

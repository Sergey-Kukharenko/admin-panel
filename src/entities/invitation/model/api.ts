export type InvitationStatus = 'pending' | 'accepted' | 'expired';

/** Язык письма-приглашения (OpenAPI InvitationEmailLang); по умолчанию на бэке — en */
export type InvitationEmailLang = 'en' | 'ru';

export interface InvitationCreateRequest {
  project_id: string;
  email: string;
  /** Expiry instant with timezone (RFC 3339); stored as timestamptz. */
  expires_at?: string | null;
  lang?: InvitationEmailLang;
}

export interface Invitation {
  invitation_id: string;
  email: string;
  project_id: string;
  user_id: string | null;
  authentik_invitation_id: string;
  invite_link: string;
  status: InvitationStatus;
  invited_at: string;
  expires_at: string | null;
  accepted_at: string | null;
  expired_at: string | null;
  created_at: string;
  updated_at: string | null;
}

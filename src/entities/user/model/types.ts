export interface UserProfile {
  authenticated: boolean;
  email: string;
  /** Имя пользователя из IdP (Authentik); в OpenAPI обязательное, но API ещё не финализирован */
  name?: string;
  project_id: string;
  authentik_user_id: string;
}

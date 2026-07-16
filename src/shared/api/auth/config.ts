import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

export const authConfig = {
  // Сюда завтра вставим Issuer URL от Девопса
  authority: 'https://temporary-placeholder.com',
  // Сюда завтра вставим Client ID от Девопса
  client_id: 'PLACEHOLDER_CLIENT_ID',
  // Адрес в нашем приложении, куда Authentik вернет юзера после ввода пароля
  redirect_uri: `${window.location.origin}/auth/callback`,
  // Куда редиректить пользователя после выхода из системы
  post_logout_redirect_uri: window.location.origin,
  response_type: 'code',
  scope: 'openid profile email',
  // Говорим библиотеке автоматически сохранять сессию в localStorage
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

export const userManager = new UserManager(authConfig);

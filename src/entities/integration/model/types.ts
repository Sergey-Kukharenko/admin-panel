import type { IntegrationEnvironment } from './constants';

export type IntegrationType = 'rest-api' | 's3';

export interface Integration {
  type: IntegrationType;
  name: string;
  /** Ключ секции `integrations.items` в локалях */
  i18nKey: 'restApi' | 's3';
  /** Ключи преимуществ в `integrations.items.<i18nKey>.features` */
  featureKeys: string[];
  docsUrl?: string;
  illustrationSrc?: string;
}

export interface ClientCredentials {
  clientId: string;
}

export interface ApiSecretProductAccess {
  productId: string;
  productName: string;
  writeData: boolean;
  readResults: boolean;
}

export type ApiSecretStatus = 'active' | 'revoked' | 'inactive';

export interface ApiSecret {
  id: string;
  name: string;
  environment: IntegrationEnvironment;
  productAccess: ApiSecretProductAccess[];
  createdAt: string;
  status: ApiSecretStatus;
  /** Каким был ключ до отзыва — в макете S3 у отозванной строки остаются неактивные иконки
   *  прежних действий (деактивировать для активного, активировать для неактивного) */
  revokedFrom?: Exclude<ApiSecretStatus, 'revoked'>;
}

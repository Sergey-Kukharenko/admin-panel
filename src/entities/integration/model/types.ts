import type { IntegrationEnvironment } from './constants';

export type IntegrationType = 'rest-api' | 's3';

export type IntegrationStatus = 'not_configured' | 'pending' | 'connected';

export interface IntegrationDetail {
  description: string;
  docsUrl?: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
  ctaLabel: string;
  illustrationSrc?: string;
}

export interface Integration {
  type: IntegrationType;
  name: string;
  cardDescription: string;
  features: string[];
  recommended?: boolean;
  detail: IntegrationDetail;
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

export type ApiSecretStatus = 'active' | 'revoked';

export interface ApiSecret {
  id: string;
  name: string;
  environment: IntegrationEnvironment;
  productAccess: ApiSecretProductAccess[];
  createdAt: string;
  status: ApiSecretStatus;
}

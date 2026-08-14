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

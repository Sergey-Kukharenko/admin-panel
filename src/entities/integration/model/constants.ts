export const INTEGRATION_PRODUCTS = [
  { id: 'player-intelligence', name: 'Player Intelligence' },
  { id: 'recommender-system', name: 'Recommender System' },
];

export const ENVIRONMENT_OPTIONS = [
  { value: 'production', label: 'Production' },
  { value: 'development', label: 'Development' },
] as const;

export type IntegrationEnvironment = (typeof ENVIRONMENT_OPTIONS)[number]['value'];

import type { components, operations } from '@/shared/api';

type Schemas = components['schemas'];

export type PredictionFilters = NonNullable<operations['list_predictions']['parameters']['query']>;

export type PredictionResult = Schemas['PredictionResultListItemSchema'];

export type PredictionResultListResponse = Schemas['PredictionResultListResponseSchema'];

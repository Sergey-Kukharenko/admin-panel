import type { PredictionIntegration } from './types';

const ERROR_TOOLTIP_TEXT = 'Error';

function isInErrorChain(
  integration: PredictionIntegration,
  byId: Map<string, PredictionIntegration>,
  visited: Set<string>,
): boolean {
  if (integration.tooltipIcon === 'error') return true;
  if (!integration.dependsOnId || visited.has(integration.id)) return false;

  const parent = byId.get(integration.dependsOnId);
  if (!parent) return false;

  visited.add(integration.id);

  return isInErrorChain(parent, byId, visited);
}

/**
 * Каскадное падение сервисов: если сервис, от которого зависит текущий (dependsOnId),
 * находится в статусе ERROR, текущий сервис тоже автоматически переключается в ERROR (WT-291)
 */
export function applyCascadingErrors(
  integrations: PredictionIntegration[],
): PredictionIntegration[] {
  const byId = new Map(integrations.map((integration) => [integration.id, integration]));

  return integrations.map((integration) => {
    if (!isInErrorChain(integration, byId, new Set())) return integration;

    return { ...integration, tooltipIcon: 'error' as const, tooltipText: ERROR_TOOLTIP_TEXT };
  });
}

import type {
  ApiAccessType,
  AuthentikApiAccessEnvironment,
  RestApiConnectionRequest,
  S3ConnectionRequest,
} from '../api/types';
import type { IntegrationEnvironment } from '../config/constants';

// Сборка и валидация тел заявок на подключение (типы тел — в api/types.ts)
export const MAX_IP_ADDRESSES = 10;

const IPV4_OCTET = '(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)';
const IPV4_PATTERN = new RegExp(`^${IPV4_OCTET}(\\.${IPV4_OCTET}){3}$`);

export function isValidIpv4(value: string): boolean {
  return IPV4_PATTERN.test(value.trim());
}

const API_ENVIRONMENT: Record<IntegrationEnvironment, AuthentikApiAccessEnvironment> = {
  production: 'prod',
  development: 'dev',
};

/** Непустые адреса без дублей — пустые поля списка просто игнорируются */
export function normalizeIpAddresses(ipAddresses: string[]): string[] {
  const filled = ipAddresses.map((ip) => ip.trim()).filter(Boolean);
  return [...new Set(filled)];
}

export function isRestApiConnectionFormValid(form: {
  accessType: ApiAccessType;
  ipAddresses: string[];
}): boolean {
  if (form.accessType === 'public') return true;

  const ipAddresses = normalizeIpAddresses(form.ipAddresses);
  return (
    ipAddresses.length > 0 &&
    ipAddresses.length <= MAX_IP_ADDRESSES &&
    ipAddresses.every(isValidIpv4)
  );
}

export function buildRestApiConnectionRequest(form: {
  accessType: ApiAccessType;
  ipAddresses: string[];
  environment: IntegrationEnvironment;
}): RestApiConnectionRequest {
  return {
    access_type: form.accessType,
    ip_addresses: form.accessType === 'public' ? [] : normalizeIpAddresses(form.ipAddresses),
    environments: [API_ENVIRONMENT[form.environment]],
  };
}

export function buildS3ConnectionRequest(form: {
  environment: IntegrationEnvironment;
}): S3ConnectionRequest {
  return { environments: [API_ENVIRONMENT[form.environment]] };
}

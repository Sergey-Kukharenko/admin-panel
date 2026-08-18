import type { OrganizationInfo, OrganizationMember, OrganizationTechInfo } from './types';

export const MOCK_ORGANIZATION: OrganizationInfo = {
  name: 'Casino Group Ltd.',
  projectName: 'casino-group-production',
  createdAt: '15 марта 2024 г.',
};

export const MOCK_ORGANIZATION_MEMBERS: OrganizationMember[] = [
  {
    id: 'user-1',
    name: 'Иван Петров',
    email: 'ivan.petrov@casino-group.com',
    role: 'Administrator',
  },
];

export const MOCK_ORGANIZATION_TECH_INFO: OrganizationTechInfo = {
  projectSlug: 'casino-group-prod',
  organizationId: 'casino-group-v1',
  workspaceId: 'ws_92af81c4',
};

export interface OrganizationInfo {
  name: string;
  projectName: string;
  createdAt: string;
}

export interface OrganizationMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface OrganizationTechInfo {
  projectSlug: string;
  organizationId: string;
  workspaceId: string;
}

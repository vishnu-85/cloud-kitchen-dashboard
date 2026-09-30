export interface Permission {
  _id: string;
  name: string;
  label: string;
}

export type PermissionPayload = Pick<Permission, 'name' | 'label'>;
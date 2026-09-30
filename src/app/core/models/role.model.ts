export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
}

export type RolePayload = Pick<Role, 'name' | 'description' | 'permissions' | 'isActive'>;

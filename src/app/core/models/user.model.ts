export interface User {
  _id?: string;
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
  roleName?: string;
  isActive?: boolean;
  status?: 'active' | 'inactive' | 'pending';
  avatar?: string;
  createdAt?: string;
  phone: string
}

export interface UserUpdatePayload {
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  isActive: boolean;
  phone: string
}

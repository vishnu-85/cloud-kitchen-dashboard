export interface User {
  _id?: string;
  id?: string;
  email: string;
  name: string;
  lastName: string;
  role: string | { _id: string; name: string };
  roleName?: string;
  isActive?: boolean;
  status?: 'active' | 'inactive' | 'pending';
  avatar?: string;
  createdAt?: string;
}

export interface UserUpdatePayload {
  name: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
}

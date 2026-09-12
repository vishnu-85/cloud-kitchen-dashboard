export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  createdAt?: string;
}

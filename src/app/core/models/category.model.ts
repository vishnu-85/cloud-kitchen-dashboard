export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  image?: string;
  menuCount?: number;
}

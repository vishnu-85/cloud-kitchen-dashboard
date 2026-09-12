export interface Product {
  _id: string;
  categoryId: Category;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number;
  image: string;
  images: string[];
  foodType: 'veg' | 'non-veg';
  isSpicy: boolean;
  spiceLevel: 'mild' | 'medium' | 'hot';
  preparationTime: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  rating: number;
  totalReviews: number;
  __v: number;
  createdAt: string;
  updatedAt: string;
  stock: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
}
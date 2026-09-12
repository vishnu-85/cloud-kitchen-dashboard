export interface Order {
  id: string;
  customerId: string;
  customer: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total: number;
  itemsCount: number;
  createdAt: string;
  items: any
}

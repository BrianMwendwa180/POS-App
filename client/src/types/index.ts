export interface Product {
  id: string;
  name: string;
  type: 'tire' | 'rim';
  brand: string;
  size: string;
  width?: number; // for tires
  aspectRatio?: number; // for tires
  rimDiameter?: number; // for both
  rimWidth?: number; // for rims
  offset?: number; // for rims
  boltPattern?: string; // for rims
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  sku: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  totalPurchases: number;
  lastPurchase?: string;
  createdAt: string;
  recentSales?: Sale[];
}

export interface Sale {
  id: string;
  customerId?: string;
  customerName?: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'check';
  status: 'completed' | 'pending' | 'cancelled';
  createdAt: string;
  createdBy: string;
}

export interface SaleItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'cashier';
  createdAt: string;
}
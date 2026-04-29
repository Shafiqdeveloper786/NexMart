export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  stock: number;
  sku: string;
  category: string;
  image: string | null;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  shippingCost: number;
  taxAmount: number;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingZip: string | null;
  shippingCountry: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export interface Review {
  id: string;
  productId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
}

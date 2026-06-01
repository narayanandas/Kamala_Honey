export enum NavTab {
  HOME = 'home',
  SHOP = 'shop',
  ABOUT = 'about',
  CONTACT = 'contact',
  WISHLIST = 'wishlist',
  CART = 'cart',
  CHECKOUT = 'checkout',
  SUCCESS = 'success',
  DASHBOARD = 'dashboard',
  ADMIN = 'admin'
}

export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered'
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  role: 'customer' | 'admin';
  password?: string;
}

export interface Product {
  id: string;
  name: string;
  tamilName: string;
  price: number;
  description: string;
  category: string;
  rating: number;
  image: string;
  isBestSeller?: boolean;
  inventory: number;
  ingredients: string[];
}

export interface OrderItem {
  productId: string;
  name: string;
  tamilName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  upiScreenshot?: string; // Base64 or local URL proof
  userId: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Wishlist {
  userId: string;
  productIds: string[];
}

import { ReactEventHandler } from 'react';

export interface Config {
  baseUrl: string;
}

export interface TableOrdersResponse {
  data: {
    orders: any[];
  };
}

export interface OrderResponse {
  data: any;
}

export interface OrderItem {
  id: number;
}

export interface OrderCancellationResponse {}

export interface TableOrdersFunctionParams {
  baseUrl: string;
  setTableOrders: (orders: any) => void;
  setLoading: (loading: boolean) => void;
  tableNo: number;
}

export interface OrderItemsFunctionParams {
  baseUrl: string;
  setOrder: (order: any) => void;
  setLoading: (loading: boolean) => void;
  orderId: number;
}

export interface DeleteOrderItemFunctionParams {
  orderId: number;
  item: OrderItem;
}

export interface CancelOrderFunctionParams {
  orderId: number;
}

export const tableStatus = {
  AVAILABLE: 'primary',
  OCCUPIED: 'warning',
  RESERVED: 'error',
};

export interface MenuItemType {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  COOKING = 'COOKING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export type Order = {
  id: number;
  totalAmount: number;
  discount: number;
  tax: number;
  status: OrderStatus;
  preparedBy?: string;
  tableId: number;
  waiterId: number;
  createdAt: string;
  updatedAt: string;
  paymentId?: number;
  items: Item[];
  waiter: Waiter;
  payment: Payment;
  table: Table;
  type?: 'PARCEL' | 'DINE_IN';
  customer?: Customer;
};

export enum TableStatus {
  RESERVED = 'RESERVED',
  OCCUPIED = 'OCCUPIED',
  AVAILABLE = 'AVAILABLE',
}

export type Customer = {
  name?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

type Table = {
  id: number;
  tableNo: number;
  status: TableStatus;
  capacity: number;
  createdAt: string;
  updatedAt: string;
};

type Waiter = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
};

type Item = {
  id: number;
  price: number;
  quantity: number;
  orderId: number;
  menuItemId: number;
  createdAt: string;
  updatedAt: string;
  menuItem: MenuItem;
};

type MenuItem = {
  id: 1;
  name: string;
  image: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  categoriesId: number;
  category: Object;
};

export interface BaseProps {
  toggleDarkMode: ReactEventHandler;
  darkMode: boolean;
}

export type Payment = {
  id: number;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  orderId: number;
  createdAt: string;
  updatedAt: string;
};

export type Pagination = {
  currentPage: number;
  limit: number;
  nextPage: number | null;
  previousPage: number | null;
  sort: 'asc' | 'desc';
  sortBy: string;
  total: number;
};

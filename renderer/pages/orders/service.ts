import { config } from "@/config/config";
import {
  OrderCancellationResponse,
  OrderItem,
  OrderItemsFunctionParams,
  OrderResponse,
  TableOrdersFunctionParams,
  TableOrdersResponse,
} from "@/models";
import axios from "axios";
import { ReactEventHandler } from "react";

export async function getTableOrders({
  baseUrl,
  setTableOrders,
  setLoading,
  tableNo,
}: TableOrdersFunctionParams) {
  try {
    const response = await axios.get(
      `http://${baseUrl}:5000/api/tables/${tableNo}`
    );
    setTableOrders(response.data.data.orders);
    setLoading(false);
  } catch (error) {
    console.log(error);
  }
}

export async function getOrderItems({
  baseUrl,
  setOrder,
  setLoading,
  orderId,
}: OrderItemsFunctionParams) {
  const response = await fetch(`http://${baseUrl}:5000/api/order/${orderId}`);
  const data: OrderResponse = await response.json();
  setOrder(data.data);
  setLoading(false);
}

export async function deleteOrderItem(
  this: any,
  orderId: number,
  item: OrderItem,
) {
  const response = await fetch(
    `http://${this.baseUrl}:5000/api/order/${orderId}/item/${item.id}`,
    { method: "DELETE" }
  );
  const data: any = await response.json();
  getOrderItems(this);
}

export async function cancelOrder(orderId: number, baseUrl: string) {
  const response = await axios.delete(
    `http://${baseUrl}:5000/api/order/${orderId}/cancel`
  );
  return response.data.data;
}

export async function getMenuItems({
  baseUrl,
  setMenuItems,
  setLoading,
}: {
  baseUrl: string;
  setMenuItems: any;
  setLoading: any;
}) {
  const response = await fetch(`http://${baseUrl}:5000/api/menu`);
  const data = await response.json();
  setMenuItems(data.data);
  setLoading(false);
}

export async function AddNewItems(
  order: any,
  orderId: number,
  setOrder: any,
  baseUrl: string
) {
  const payload = {
    items: [],
  };
  payload.items = Object.entries(order).map(([itemId, quantity]) => ({
    menuItemId: +itemId,
    quantity,
  })) as any;
  const response = await fetch(`http://${baseUrl}:5000/api/order/${orderId}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  setOrder(data.data);
}

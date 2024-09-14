import { config } from '@/config/config';

export async function getMenuItems({ baseUrl, setLoading, setAllMenuItems }) {
  const response = await fetch(`http://${baseUrl}:5000/api/menu`);
  const data = await response.json();
  setLoading(false);
  setAllMenuItems(data.data);
}

export async function CreateOrder(
  tableId: number | null,
  order: any,
  baseUrl: string,
  customerInfo?: any,
  type?: 'PARCEL' | 'DINE_IN',
) {
  const payload = {
    tableId,
    waiterId: 1,
    items: [],
    type,
    customerInfo,
  };
  tableId ?? delete payload.tableId;
  type ?? delete payload.type;
  customerInfo ?? delete payload.customerInfo;
  payload.items = Object.entries(order).map(([itemId, quantity]) => ({
    menuItemId: +itemId,
    quantity,
  })) as any;
  console.log(payload);

  const response = await fetch(`http://${baseUrl}:5000/api/order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  await response.json();
}

export function generateBill(order: any, menuItems: any[]) {
  const itemIds = Object.keys(order).map(Number);
  const items = menuItems.filter((item) => itemIds.includes(item.id));
  let netAmount = 0;
  const billItems = items.map((item) => {
    const total = item.price * order[item.id];
    netAmount += total;
    return {
      name: item.name,
      price: item.price,
      quantity: order[item.id],
      total,
    };
  });
  const bill = { billItems, netAmount };
  return bill;
}

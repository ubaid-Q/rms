import { config } from '@/config/config';
import { Payment } from '@/models';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

interface FetchOrderPayload {
  setOrders: any;
  setLoading?: any;
  setPagination: any;
  page: number;
  date: string;
}

export async function fetchOrders({ setOrders, setPagination, date, page, setLoading }: FetchOrderPayload) {
  const response = await axios.get(`${config.baseUrl}/order`, { params: { date, page } });
  const { data, ...pagination } = response.data.data;
  setOrders((prev) => [...prev, ...data]);
  setPagination(pagination);
  setLoading(false);
}

export async function payOrder(data: Payment) {
  try {
    const response = await axios.post(`${config.baseUrl}/order/${data.orderId}/pay`, data);
    console.log(response);
    return response.data.data;
  } catch (err: any) {
    const error = err.response.data;
    console.log({ error });
    if (error.statusCode === 400) {
      typeof error.message === 'string'
        ? enqueueSnackbar(error.message, { variant: 'error' })
        : error.message.forEach((msg: string) => enqueueSnackbar(msg, { variant: 'error' }));
    }
  }
}

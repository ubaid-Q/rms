import { config } from '@/config/config';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

export async function addExpense(body: any, { setExpenses }: { setExpenses: any }) {
  try {
    const response = await axios.post(`${config.baseUrl}/expense`, body);
    const data = response.data;
    setExpenses((prev: any) => [...prev, data.data]);
  } catch (error: any) {
    const err = error.response.data;
    if (err.statusCode == 400) {
      err.message.forEach((msg: string) => enqueueSnackbar(msg, { variant: 'error' }));
    }
  }
}

export async function getExpenses({ setExpenses, date }: { setExpenses: any; date: any }) {
  const response = await axios.get(`${config.baseUrl}/expense`, { params: { date } });
  setExpenses(response.data.data);
}

export async function deleteExpense(id: number) {
  const response = await axios.delete(`${config.baseUrl}/expense/${id}`);
  const deleted = response.data.data;
  return deleted;
}

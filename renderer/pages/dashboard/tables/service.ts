import { config } from '@/config/config';
import { tableStatus } from '@/models';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

export async function getTables({ setLoading, setTables }: { setLoading: Function; setTables: Function }) {
  const response = await fetch(`${config.baseUrl}/tables`, {
    method: 'GET',
  });
  const data = await response.json();
  setTables(data.data);
  setLoading(false);
}

export async function addTable({ tableData, setTables }: { tableData: any; setTables: Function }) {
  try {
    const response = await axios.post(`${config.baseUrl}/tables`, tableData, {
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
    });
    const data = response.data;
    setTables((prev: any) => [...prev, data.data]);
    enqueueSnackbar('Table Added.', { variant: 'success' });
  } catch (error: any) {
    const err = error.response.data;
    if (err.statusCode == 400) {
      err.message.forEach((msg: string) => enqueueSnackbar(msg, { variant: 'error' }));
    }
  }
}

export async function changeTableStatus(tableNo: number, status: keyof typeof tableStatus) {
  try {
    const response = await axios.patch(
      `${config.baseUrl}/tables/${tableNo}`,
      { status },
      {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
      },
    );
    const data = response.data;
    enqueueSnackbar('Table Status Changed!', { variant: 'info' });
    return data.data;
  } catch (error: any) {
    const err = error.response.data;
    if (err.statusCode == 400) {
      err.message.forEach((msg: string) => enqueueSnackbar(msg, { variant: 'error' }));
    }
  }
}

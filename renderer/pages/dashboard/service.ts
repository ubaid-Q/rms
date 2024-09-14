import { config } from '@/config/config';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

export async function getPendingOrders() {
  try {
    const response = await axios.get(`${config.baseUrl}/order/pending`);
    return response.data.data;
  } catch (error: any) {
    const err = error.response.data;
    if (err.statusCode == 400) {
      err.message.forEach((msg: string) => enqueueSnackbar(msg, { variant: 'error' }));
    }
  }
}

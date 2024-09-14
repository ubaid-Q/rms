import { config } from '@/config/config';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

export async function login(loginPayload: any, setAdmin) {
  try {
    const response = await axios.post(`${config.baseUrl}/auth/login`, loginPayload);
    console.log(response.data);
    enqueueSnackbar({ key: 'success', variant: 'success', message: 'Log in success' });

    setAdmin(response.data);
    return response.data;
  } catch (error) {
    enqueueSnackbar({ key: 'error', variant: 'error', message: error.response.data.message });
    return false;
  }
}

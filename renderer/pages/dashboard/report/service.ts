import { config } from '@/config/config';
import axios from 'axios';

export async function getReport({ date, setReportData }) {  
  const response = await axios.get(`${config.baseUrl}/expense/report`, {
    params: { date },
  });
  setReportData(response.data.data);
  console.log(response.data);
}

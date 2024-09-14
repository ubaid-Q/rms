import { config } from "@/config/config";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

export async function getStaff({ setStaff }: { setStaff: any }) {
  const response = await axios.get(`${config.baseUrl}/staff`);
  setStaff(response.data.data);
}

export async function addStaff(body: any, { setStaff }: { setStaff: any }) {
  try {
    const response = await axios.post(`${config.baseUrl}/staff`, body);
    const data = response.data;
    setStaff((prev: any) => [...prev, data.data]);
  } catch (error: any) {
    const err = error.response.data;
    if (err.statusCode == 400) {
      err.message.forEach((msg: string) =>
        enqueueSnackbar(msg, { variant: "error" })
      );
    }
  }
}

export async function deleteStaff(id: number) {
  const response = await axios.delete(`${config.baseUrl}/staff/${id}`);
  const deleted = response.data.data;
  return deleted;
}

export async function getSalaries(id: number, setStaffDetail) {
  try {
    if (!id) return;
    const response = await axios.get(`${config.baseUrl}/staff/${id}/salaries`);
    const data = response.data.data;
    console.log(data);
    
    setStaffDetail(data);
  } catch (error: any) {
    enqueueSnackbar(error.message, { variant: "error" });
  }
}

export async function addSalary(payload) {
  try {
    const response = await axios.post(
      `${config.baseUrl}/staff/salary`,
      payload
    );
    const data = response.data.data;
    console.log(data);
  } catch (error: any) {
    enqueueSnackbar(error.message, { variant: "error" });
  }
}

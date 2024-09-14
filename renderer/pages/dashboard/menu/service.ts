import { config } from '@/config/config';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { BaseSyntheticEvent } from 'react';

export async function getCategories({ setCategories }: { setCategories: Function }) {
  const response = await fetch(`${config.baseUrl}/categories`, {
    method: 'GET',
  });
  const data = await response.json();
  setCategories(data.data);
}

export async function getMenuItems({ setMenuItems }: { setMenuItems: any }) {
  const response = await fetch(`${config.baseUrl}/menu`);
  const data = await response.json();
  setMenuItems(data.data);
}

export async function addNewMenuItem({ setMenuItems }: { setMenuItems: any }, event: BaseSyntheticEvent) {
  try {
    const formData = new FormData(event.target);
    const response = await axios.post(`${config.baseUrl}/menu`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const data = response.data;
    setMenuItems((prev: any) => [...prev, data.data]);
    enqueueSnackbar('Successfully Added.', { variant: 'success' });
    event.target.reset();
  } catch (err: any) {
    event.target.reset();
    const error = err.response.data;
    if (error.statusCode === 400) {
      typeof error.message === 'string'
        ? enqueueSnackbar(error.message, { variant: 'error' })
        : error.message.forEach((msg: string) => enqueueSnackbar(msg, { variant: 'error' }));
    }
  }
}

export async function addCategory({ categoryName, setCategories }: { categoryName: any; setCategories: any }) {
  const response = await axios.post(`${config.baseUrl}/categories`, {
    name: categoryName,
  });
  console.log(response.data.data);
  setCategories((prev: any[]) => [...prev, response.data.data]);
}

export async function updateEditItem(id: number, formData: FormData) {
  const response = await axios.put(`${config.baseUrl}/menu/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  const data = response.data;
  if (data.statusCode === 400) {
    return;
  }
  return data.data;
}

export async function deleteMenuItem(itemId) {
  const response = await axios.delete(`${config.baseUrl}/menu/${itemId}`);
  console.log(response);
}

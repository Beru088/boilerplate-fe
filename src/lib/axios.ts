import axios, { AxiosResponse } from 'axios';
import { AppConfig } from '@/configs/api';
import authConfig from '@/configs/auth';

const API = axios.create();

API.interceptors.request.use(
  config => {
    const token = localStorage.getItem(authConfig.storageTokenKeyName) || null;

    config.baseURL = AppConfig.baseUrl;
    config.headers = {
      ...config.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
      package: AppConfig.package,
      'Accept-Language': 'en',
    } as any;

    return config;
  },
  error => Promise.reject(error)
);

export const get = (path: string, params?: any) => API.get(path, { params });

export const post = (path: string, data?: any): Promise<AxiosResponse> => {
  const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
  return API.post(path, data, { headers });
};

export const put = (path: string, data?: any): Promise<AxiosResponse> => API.put(path, data);

export const patch = (path: string, data?: any): Promise<AxiosResponse> => API.patch(path, data);

export const del = (path: string): Promise<AxiosResponse> => API.delete(path);

export const postFile = (path: string, data?: any): Promise<AxiosResponse> => {
  return API.post(path, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const downloadFile = (path: string, filename: string) => {
  return API.get(path, { responseType: 'blob' })
    .then(response => {
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch(console.error);
};

export default API;
import axios, { AxiosResponse } from 'axios';
import { AppConfig } from '@/configs/api';
import authConfig from '@/configs/auth';

axios.interceptors.request.use(
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

const get = (path: string, params?: any) => {
  return axios.get(path, {
    params: params
  })
}

const post = (path: string, data?: any): Promise<AxiosResponse> => {
  const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};

  return axios.post(path, data, { headers });
};

const put = (path: string, data?: any): Promise<AxiosResponse> => axios.put(path, data);

const patch = (path: string, data?: any): Promise<AxiosResponse> => axios.patch(path, data);

const del = (path: string): Promise<AxiosResponse> => axios.delete(path);

const downloadFile = (path: string, filename: string) => {
  return axios.get(path, { responseType: 'blob' })
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

export { get, post, patch, put, del, downloadFile };
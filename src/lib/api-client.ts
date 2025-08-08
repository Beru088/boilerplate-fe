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

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem(authConfig.storageTokenKeyName);
      localStorage.removeItem('user');

      if (typeof window !== 'undefined') {
        window.location.href = '#';
      }
    }

    return Promise.reject(error);
  }
);

export const service = {
  get: (path: string, params?: any) => {
    return axios.get(path, { params });
  },

  post: (path: string, data?: any): Promise<AxiosResponse> => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    return axios.post(path, data, { headers });
  },

  put: (path: string, data?: any): Promise<AxiosResponse> => {
    return axios.put(path, data);
  },

  patch: (path: string, data?: any): Promise<AxiosResponse> => {
    return axios.patch(path, data);
  },

  del: (path: string): Promise<AxiosResponse> => {
    return axios.delete(path);
  },

  downloadFile: (path: string, filename: string) => {
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
  }
};
import axios, { AxiosError, AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      console.error(`API Error ${status}:`, data?.detail || data?.message || 'Unknown error');

      if (status === 401) {
        // Handle unauthorized
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('Network Error: No response received');
    }
    return Promise.reject(error);
  }
);

// Generic CRUD helpers
export async function getAll<T>(endpoint: string, params?: Record<string, any>): Promise<T[]> {
  const response = await api.get<T[] | { items: T[] }>(endpoint, { params });
  return Array.isArray(response.data) ? response.data : response.data.items;
}

export async function getOne<T>(endpoint: string, id: string): Promise<T> {
  const response = await api.get<T>(`${endpoint}/${id}`);
  return response.data;
}

export async function create<T>(endpoint: string, data: Partial<T>): Promise<T> {
  const response = await api.post<T>(endpoint, data);
  return response.data;
}

export async function update<T>(endpoint: string, id: string, data: Partial<T>): Promise<T> {
  const response = await api.put<T>(`${endpoint}/${id}`, data);
  return response.data;
}

export async function remove(endpoint: string, id: string): Promise<void> {
  await api.delete(`${endpoint}/${id}`);
}

export default api;

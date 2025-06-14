import axios, { AxiosResponse } from 'axios';
import { axiosInstance } from '../config/axiosConfig';

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  withCredentials?: boolean;
}

const defaultHeaders = (token?: string | null) => ({
  Authorization: token ? `Bearer ${token}` : '',
  'Content-Type': 'application/json',
});

// GET request
export const getRequest = async <T>(
  url: string,
  options?: RequestOptions,
  token?: string | null
): Promise<AxiosResponse<T>> => {
  try {
    const response = await axiosInstance.get<T>(url, {
      ...options,
      headers: { ...defaultHeaders(token), ...options?.headers },
      withCredentials: options?.withCredentials ?? true, // Ensure credentials are sent with requests
    });
    return response; // Return the full response object
  } catch (error) {
    throw error; // Re-throw the error for further handling if needed
  }
};

// POST request
export const postRequest = async <T, U>(
  url: string,
  data: U,
  options?: RequestOptions,
  token?: string | null
): Promise<AxiosResponse<T>> => {
  try {
    console.log('POST:', axiosInstance.defaults.baseURL + url);
    
    const response = await axiosInstance.post<T>(url, data, {
      ...options,
      headers: { ...defaultHeaders(token), ...options?.headers },
      withCredentials: options?.withCredentials ?? true, // Ensure credentials are sent with requests
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Re-throw the error so it can be caught in React Query's `onError`
      throw error.response || new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

// PUT request
export const putRequest = async <T, U>(
  url: string,
  data: U,
  options?: RequestOptions,
  token?: string | null
): Promise<AxiosResponse<T>> => {
  try {
    const response = await axiosInstance.put<T>(url, data, {
      ...options,
      headers: { ...defaultHeaders(token), ...options?.headers },
      withCredentials: options?.withCredentials ?? true, // Ensure credentials are sent with requests
    });
    return response; // Return the full response object
  } catch (error) {
    console.error('PUT request failed:', error);
    throw error; // Re-throw the error for further handling if needed
  }
};

// DELETE request
export const deleteRequest = async <T>(
  url: string,
  options?: RequestOptions,
  token?: string | null
): Promise<AxiosResponse<T>> => {
  try {
    const response = await axiosInstance.delete<T>(url, {
      ...options,
      headers: { ...defaultHeaders(token), ...options?.headers },
      withCredentials: options?.withCredentials ?? true, // Ensure credentials are sent with requests
    });
    return response; // Return the full response object
  } catch (error) {
    console.error('DELETE request failed:', error);
    throw error; // Re-throw the error for further handling if needed
  }
};

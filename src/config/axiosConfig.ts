import axios, { AxiosInstance } from 'axios';

// const API_URL_LOCAL = 'http://localhost:3000/api';
const API_URL_LIVE = 'backend-pms-five.vercel.app'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL_LIVE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { API_URL_LIVE, axiosInstance };

import axios from 'axios';
import { API_URL } from '../config/constants';

export const baseApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

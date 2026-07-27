import axios from 'axios';
import { AuthService } from '../auth/authService';
import { API_URL } from '../settings';

const authService = new AuthService();

export const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: `Bearer ${authService.getAccessToken()}`,
    },
});

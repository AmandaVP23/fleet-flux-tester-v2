import axios from 'axios';
import { AuthService } from '../auth/authService';

const authService = new AuthService();

export const setupAxiosInterceptor = () => {
    axios.interceptors.request.use(
        (config) => {
            const token = authService.getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        },
    );
};

import axios from 'axios';
import { auth } from './auth';

const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
});

client.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

client.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401) {
            const refresh = localStorage.getItem('jwt_refresh');
            if (refresh) {
                try {
                    const response = await axios.post('http://localhost:8000/api/token/refresh/', { refresh });
                    localStorage.setItem('jwt_token', response.data.access);
                    error.config.headers.Authorization = `Bearer ${response.data.access}`;
                    return client(error.config);
                } catch {
                    auth.logout();
                    window.location.href = '/login';
                }
            } else {
                auth.logout();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default client;
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { auth } from './auth';

const client = axios.create({
    baseURL: 'http://172.23.168.187:8000/api',
});

client.interceptors.request.use(async (config) => {
    const token = await auth.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

client.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401) {
            if (error.config.url?.includes('/token/')) {
                return Promise.reject(error);
            }
            const refresh = await AsyncStorage.getItem('jwt_refresh');
            if (refresh) {
                try {
                    const response = await axios.post('http://YOUR_LOCAL_IP:8000/api/token/refresh/', { refresh });
                    await auth.setToken(response.data.access);
                    error.config.headers.Authorization = `Bearer ${response.data.access}`;
                    return client(error.config);
                } catch {
                    await auth.logout();
                    router.replace('/(auth)/login');
                }
            } else {
                await auth.logout();
                router.replace('/(auth)/login');
            }
        }
        return Promise.reject(error);
    }
);

export default client;
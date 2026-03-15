import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';

const client = axios.create({
    baseURL: 'http://192.168.68.100:8000/api',
});

client.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('jwt_token');
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
                    const response = await axios.post('http://192.168.68.100:8000/api/token/refresh/', { refresh });
                    await AsyncStorage.setItem('jwt_token', response.data.access);
                    error.config.headers.Authorization = `Bearer ${response.data.access}`;
                    return client(error.config);
                } catch {
                    await AsyncStorage.removeItem('jwt_token');
                    await AsyncStorage.removeItem('jwt_refresh');
                    router.replace('/(auth)/login');
                }
            } else {
                await AsyncStorage.removeItem('jwt_token');
                await AsyncStorage.removeItem('jwt_refresh');
                router.replace('/(auth)/login');
            }
        }
        return Promise.reject(error);
    }
);

export default client;
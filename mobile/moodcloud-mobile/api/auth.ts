import AsyncStorage from '@react-native-async-storage/async-storage';
import client from './client';

interface AuthResponse {
    refresh: string;
    access: string;
    user: {
        id: string;
        username: string;
    };
}

interface LoginCredentials {
    username: string;
    password: string;
}

interface RegisterCredentials extends LoginCredentials {}

const TOKEN_KEY = 'jwt_token';
const REFRESH_KEY = 'jwt_refresh';

export const auth = {
    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const response = await client.post<AuthResponse>('/register/', credentials);
        await this.setToken(response.data.access);
        await AsyncStorage.setItem(REFRESH_KEY, response.data.refresh);
        return response.data;
    },
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await client.post<AuthResponse>('/token/', credentials);
        await this.setToken(response.data.access);
        await AsyncStorage.setItem(REFRESH_KEY, response.data.refresh);
        return response.data;
    },
    async changePassword(old_password: string, new_password: string, new_password_confirm: string): Promise<void> {
        await client.post('/change-password/', { old_password, new_password, new_password_confirm });
    },
    async changeUsername(username: string): Promise<void> {
        await client.patch('/me/', { username });
    },
    async deleteAccount(): Promise<void> {
        await client.delete('/me/');
    },
    async logout(): Promise<void> {
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem(REFRESH_KEY);
    },
    async setToken(token: string): Promise<void> {
        await AsyncStorage.setItem(TOKEN_KEY, token);
    },
    async getToken(): Promise<string | null> {
        return await AsyncStorage.getItem(TOKEN_KEY);
    },
    async isAuthenticated(): Promise<boolean> {
        const token = await this.getToken();
        return !!token;
    },
    async clearToken(): Promise<void> {
        await AsyncStorage.removeItem(TOKEN_KEY);
    },
};
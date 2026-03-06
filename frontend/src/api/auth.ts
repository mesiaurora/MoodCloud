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

interface RegisterCredentials extends LoginCredentials {
}

const TOKEN_KEY = 'jwt_token';

export const auth = {
    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const response = await client.post<AuthResponse>('/register/', credentials);
        this.setToken(response.data.access);
        localStorage.setItem('jwt_refresh', response.data.refresh);
        return response.data;
    },

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await client.post<AuthResponse>('/token/', credentials);
        this.setToken(response.data.access);
        localStorage.setItem('jwt_refresh', response.data.refresh);
        return response.data;
    },

    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('jwt_refresh');
    },

    setToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
    },

    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    },

    clearToken(): void {
        localStorage.removeItem(TOKEN_KEY);
    },
};
/**
 * Centralized API client with error handling and authentication
 */
import {
    AppError,
    NetworkError,
    AuthenticationError,
    createErrorFromStatus,
    ErrorMessages
} from './errors';

export interface ApiResponse<T> {
    data: T;
    total?: number;
    success: boolean;
    message?: string;
}

export interface RequestConfig extends RequestInit {
    skipAuth?: boolean;
    timeout?: number;
}

class ApiClient {
    private baseURL: string;
    private defaultTimeout: number = 30000; // 30 seconds

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    /**
     * Get authentication token
     */
    private getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    /**
     * Handle authentication errors
     */
    private handleAuthError(): void {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
    }

    /**
     * Build headers with authentication
     */
    private buildHeaders(config: RequestConfig = {}): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...config.headers,
        };

        if (!config.skipAuth) {
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    /**
     * Make HTTP request with timeout
     */
    private async fetchWithTimeout(
        url: string,
        config: RequestConfig = {}
    ): Promise<Response> {
        const timeout = config.timeout || this.defaultTimeout;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...config,
                signal: controller.signal,
                headers: this.buildHeaders(config),
            });

            clearTimeout(timeoutId);
            return response;
        } catch (error: any) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new NetworkError('La requête a expiré');
            }

            throw new NetworkError(ErrorMessages.NETWORK);
        }
    }

    /**
     * Parse response and handle errors
     */
    private async handleResponse<T>(response: Response): Promise<T> {
        // Handle authentication errors
        if (response.status === 401) {
            this.handleAuthError();
            throw new AuthenticationError();
        }

        // Try to parse JSON response
        let data: any;
        try {
            data = await response.json();
        } catch {
            // If JSON parsing fails and response is not ok, throw error
            if (!response.ok) {
                throw createErrorFromStatus(response.status);
            }
            // If response is ok but no JSON, return empty object
            return {} as T;
        }

        // Handle error responses
        if (!response.ok) {
            const message = data.detail || data.message || ErrorMessages.UNKNOWN;
            throw createErrorFromStatus(response.status, message);
        }

        return data;
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const response = await this.fetchWithTimeout(url, {
            ...config,
            method: 'GET',
        });
        return this.handleResponse<T>(response);
    }

    /**
     * POST request
     */
    async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const response = await this.fetchWithTimeout(url, {
            ...config,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
        return this.handleResponse<T>(response);
    }

    /**
     * PUT request
     */
    async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const response = await this.fetchWithTimeout(url, {
            ...config,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
        return this.handleResponse<T>(response);
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const response = await this.fetchWithTimeout(url, {
            ...config,
            method: 'DELETE',
        });
        return this.handleResponse<T>(response);
    }

    /**
     * Build query string from params
     */
    buildQueryString(params: Record<string, any>): string {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                searchParams.append(key, String(value));
            }
        });

        const queryString = searchParams.toString();
        return queryString ? `?${queryString}` : '';
    }
}

// Export singleton instance
import { API_CONFIG } from '@/config/api';
export const apiClient = new ApiClient(API_CONFIG.BASE_URL);

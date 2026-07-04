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

// Global getter for selected owner ID (will be set by App)
let getSelectedOwnerIdFn: (() => string | null) | null = null;

export const setOwnerIdGetter = (fn: () => string | null) => {
    getSelectedOwnerIdFn = fn;
};

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

type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue>;

class ApiClient {
    private baseURL: string;
    private defaultTimeout: number = 60000; // 60 seconds (useful for free tier cold starts)

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
        } catch (error: unknown) {
            clearTimeout(timeoutId);

            if (error instanceof DOMException && error.name === 'AbortError') {
                throw new NetworkError('La requête a expiré');
            }

            throw new NetworkError(ErrorMessages.NETWORK);
        }
    }

    /**
     * Parse response and handle errors
     */
    private async handleResponse<T>(response: Response, asBlob: boolean = false): Promise<T> {
        // Handle authentication errors
        if (response.status === 401) {
            this.handleAuthError();
            throw new AuthenticationError();
        }

        // Handle binary responses (like PDFs)
        if (asBlob) {
            if (!response.ok) {
                throw createErrorFromStatus(response.status);
            }
            return (await response.blob()) as unknown as T;
        }

        // Try to parse JSON response
        let data: unknown;
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
            const errorData = data as { detail?: string; message?: string };
            const message = errorData.detail || errorData.message || ErrorMessages.UNKNOWN;
            throw createErrorFromStatus(response.status, message);
        }

        return data;
    }

    private getSelectedOwnerId(): string | null {
        return getSelectedOwnerIdFn?.() ?? null;
    }

    private buildUrl(endpoint: string, params?: QueryParams): string {
        const selectedOwnerId = this.getSelectedOwnerId();
        // Skip owner_id for passport endpoints as they don't use it
        const shouldSkipOwnerId = endpoint.startsWith('/api/v1/passport');
        const allParams = {
            ...params,
            ...(selectedOwnerId && !shouldSkipOwnerId && !endpoint.includes('owner_id=') && { owner_id: selectedOwnerId }),
        };
        const queryString = this.buildQueryString(allParams);

        if (!queryString) {
            return `${this.baseURL}${endpoint}`;
        }

        const separator = endpoint.includes('?') ? '&' : '?';
        return `${this.baseURL}${endpoint}${separator}${queryString.slice(1)}`;
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, params?: QueryParams, config?: RequestConfig, asBlob: boolean = false): Promise<T> {
        const url = this.buildUrl(endpoint, params);
        const response = await this.fetchWithTimeout(url, {
            ...config,
            method: 'GET',
        });
        return this.handleResponse<T>(response, asBlob);
    }

    async getText(endpoint: string, params?: QueryParams, config?: RequestConfig): Promise<string> {
        const url = this.buildUrl(endpoint, params);
        const response = await this.fetchWithTimeout(url, {
            ...config,
            method: 'GET',
        });

        if (!response.ok) {
            throw createErrorFromStatus(response.status);
        }

        return response.text();
    }

    /**
     * POST request
     */
    async post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
        const url = this.buildUrl(endpoint);
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
    async put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
        const url = this.buildUrl(endpoint);
        const response = await this.fetchWithTimeout(url, {
            ...config,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
        return this.handleResponse<T>(response);
    }

    /**
     * PATCH request
     */
    async patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
        const url = this.buildUrl(endpoint);
        const response = await this.fetchWithTimeout(url, {
            ...config,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        });
        return this.handleResponse<T>(response);
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
        const url = this.buildUrl(endpoint);
        const response = await this.fetchWithTimeout(url, {
            ...config,
            method: 'DELETE',
        });
        return this.handleResponse<T>(response);
    }

    /**
     * Build query string from params
     */
    buildQueryString(params: QueryParams): string {
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

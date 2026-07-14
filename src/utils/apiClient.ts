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
import { refreshManager } from './refreshManager';

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
    _retry?: boolean; // Marqueur interne pour éviter les boucles infinies
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
     * Handle authentication errors
     * Note: Redirection will be handled by React Router via callback
     */
    private handleAuthError(): void {
        // Cookies HttpOnly are managed by the browser
        // No localStorage cleanup needed
        // Navigation will be handled by AuthContext
        throw new AuthenticationError();
    }

    /**
     * Build headers (no Authorization header - cookies handle auth)
     */
    private buildHeaders(config: RequestConfig = {}): HeadersInit {
        const hasFormDataBody = config.body instanceof FormData;
        const headers: HeadersInit = {
            ...(hasFormDataBody ? {} : { 'Content-Type': 'application/json' }),
            ...config.headers,
        };

        // No Authorization header - cookies HttpOnly handle authentication
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
                credentials: 'include', // CRITICAL: Include HttpOnly cookies
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
    private async handleResponse<T>(
        response: Response,
        asBlob: boolean = false,
        originalRequestFn?: (overrideConfig?: RequestConfig) => Promise<T>,
        endpoint: string = '',
        config: RequestConfig = {}
    ): Promise<T> {
        // Handle authentication errors with refresh token
        if (response.status === 401) {
            // Skip auth refresh for refresh endpoint itself to avoid infinite loop
            const isRefreshEndpoint = response.url.includes('/auth/refresh');

            if (!isRefreshEndpoint && originalRequestFn) {
                // Use RefreshManager to handle 401 and retry
                return refreshManager.handle401Error(originalRequestFn, endpoint, config);
            }

            // For refresh endpoint or if no retry function, throw error
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

        return data as T;
    }

    private getSelectedOwnerId(): string | null {
        return getSelectedOwnerIdFn?.() ?? null;
    }

    private buildUrl(endpoint: string, params?: QueryParams): string {
        const selectedOwnerId = this.getSelectedOwnerId();
        // Skip owner_id for endpoint groups that don't accept owner filtering
        const shouldSkipOwnerId =
            endpoint.startsWith(API_ENDPOINTS.PASSPORT.BASE) ||
            endpoint.startsWith(API_ENDPOINTS.AUTH.BASE);
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
        const requestFn = (overrideConfig?: RequestConfig) => this.fetchWithTimeout(url, { ...config, ...overrideConfig, method: 'GET' });
        const response = await requestFn();
        return this.handleResponse<T>(response, asBlob, (overrideConfig?: RequestConfig) => this.get<T>(endpoint, params, { ...config, ...overrideConfig }, asBlob), endpoint, config);
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
        const isFormData = data instanceof FormData;
        const requestFn = (overrideConfig?: RequestConfig) => this.fetchWithTimeout(url, {
            ...config,
            ...overrideConfig,
            method: 'POST',
            body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
        });
        const response = await requestFn();
        return this.handleResponse<T>(response, false, (overrideConfig?: RequestConfig) => this.post<T>(endpoint, data, { ...config, ...overrideConfig }), endpoint, config);
    }

    /**
     * PUT request
     */
    async put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
        const url = this.buildUrl(endpoint);
        const requestFn = (overrideConfig?: RequestConfig) => this.fetchWithTimeout(url, {
            ...config,
            ...overrideConfig,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
        const response = await requestFn();
        return this.handleResponse<T>(response, false, (overrideConfig?: RequestConfig) => this.put<T>(endpoint, data, { ...config, ...overrideConfig }), endpoint, config);
    }

    /**
     * PATCH request
     */
    async patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
        const url = this.buildUrl(endpoint);
        const requestFn = (overrideConfig?: RequestConfig) => this.fetchWithTimeout(url, {
            ...config,
            ...overrideConfig,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        });
        const response = await requestFn();
        return this.handleResponse<T>(response, false, (overrideConfig?: RequestConfig) => this.patch<T>(endpoint, data, { ...config, ...overrideConfig }), endpoint, config);
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
        const url = this.buildUrl(endpoint);
        const requestFn = (overrideConfig?: RequestConfig) => this.fetchWithTimeout(url, {
            ...config,
            ...overrideConfig,
            method: 'DELETE',
        });
        const response = await requestFn();
        return this.handleResponse<T>(response, false, (overrideConfig?: RequestConfig) => this.delete<T>(endpoint, { ...config, ...overrideConfig }), endpoint, config);
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
import { API_CONFIG, API_ENDPOINTS } from '@/config/api';
export const apiClient = new ApiClient(API_CONFIG.BASE_URL);

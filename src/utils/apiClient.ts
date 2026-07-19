/**
 * Centralized API client with error handling and authentication
 */
import {
    NetworkError,
    AuthenticationError,
    ForbiddenError,
    createErrorFromStatus,
    ErrorMessages
} from './errors';
import { refreshManager } from './refreshManager';

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
    private readonly CSRF_COOKIE_NAME = 'csrf_token';
    private readonly CSRF_HEADER_NAME = 'X-CSRF-Token';
    private readonly CSRF_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    /**
     * Reads the CSRF token from the (non-HttpOnly) csrf_token cookie.
     * The backend sets this cookie after login so that the frontend can
     * implement the Double Submit Cookie pattern.
     */
    private getCsrfToken(): string | null {
        const match = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${this.CSRF_COOKIE_NAME}=`));
        return match ? decodeURIComponent(match.split('=')[1]) : null;
    }

    /**
     * Build headers (no Authorization header - cookies handle auth)
     * Automatically injects the X-CSRF-Token header for mutable methods
     * by reading the csrf_token cookie (Double Submit Cookie pattern).
     */
    private buildHeaders(config: RequestConfig = {}): HeadersInit {
        const hasFormDataBody = config.body instanceof FormData;
        const method = (config.method || 'GET').toUpperCase();

        const headers: HeadersInit = {
            ...(hasFormDataBody ? {} : { 'Content-Type': 'application/json' }),
            ...config.headers,
        };

        // Inject CSRF token for mutable methods (Double Submit Cookie pattern)
        if (this.CSRF_METHODS.includes(method)) {
            const csrfToken = this.getCsrfToken();
            if (csrfToken) {
                (headers as Record<string, string>)[this.CSRF_HEADER_NAME] = csrfToken;
            }
        }

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

        // Handle forbidden errors (403) - RBAC restriction
        if (response.status === 403) {
            throw new ForbiddenError('Accès non autorisé pour ce rôle');
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

    private buildUrl(endpoint: string, params?: QueryParams): string {
        const allParams = {
            ...params,
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
import { API_CONFIG } from '@/config/api';
export const apiClient = new ApiClient(API_CONFIG.BASE_URL);

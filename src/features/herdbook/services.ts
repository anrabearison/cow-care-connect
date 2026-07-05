import { API_ENDPOINTS } from '@/config/api';
import { apiClient } from '@/utils/apiClient';
import { HerdBook, HerdBookCattle, HerdBookCattleWithDetails } from '@/types/herdbook';

export interface HerdBookFilters {
    year?: number;
    owner_id?: string;
    page?: number;
    per_page?: number;
}

export const herdBookService = {
    /**
     * Get list of herd books with optional filters
     */
    getHerdBookList: async (filters?: HerdBookFilters) => {
        return apiClient.get<{ data: HerdBook[]; total: number }>(API_ENDPOINTS.HERD_BOOKS.BASE, filters);
    },

    /**
     * Get herd books by owner ID
     */
    getHerdBooksByOwner: async (ownerId?: string) => {
        const params = ownerId ? { owner_id: ownerId } : undefined;
        return apiClient.get<{ data: HerdBook[]; total: number }>(API_ENDPOINTS.HERD_BOOKS.BASE, params);
    },

    /**
     * Get a single herd book by ID
     */
    getHerdBookById: async (id: string) => {
        return apiClient.get<HerdBook>(API_ENDPOINTS.HERD_BOOKS.byId(id));
    },

    /**
     * Create a new herd book
     */
    createHerdBook: async (data: {
        year: number;
        reference: string;
        owner_id?: string;
        description?: string;
    }) => {
        return apiClient.post<HerdBook>(API_ENDPOINTS.HERD_BOOKS.BASE, data);
    },

    /**
     * Update a herd book
     */
    updateHerdBook: async (id: string, data: {
        year?: number;
        reference?: string;
        description?: string;
    }) => {
        return apiClient.put<HerdBook>(API_ENDPOINTS.HERD_BOOKS.byId(id), data);
    },

    /**
     * Delete a herd book
     */
    deleteHerdBook: async (id: string) => {
        return apiClient.delete(API_ENDPOINTS.HERD_BOOKS.byId(id));
    },

    /**
     * Get cattle registered in a herd book
     */
    getCattleInHerdBook: async (herdBookId: string, page = 1, perPage = 10) => {
        return apiClient.get<{ data: HerdBookCattleWithDetails[]; total: number }>(
            API_ENDPOINTS.HERD_BOOK_CATTLE.BY_HERD_BOOK(herdBookId),
            { page, per_page: perPage }
        );
    },

    /**
     * Get cattle history across all herd books
     */
    getCattleHistory: async (cattleId: string) => {
        return apiClient.get<{ data: HerdBookCattleWithDetails[] }>(
            API_ENDPOINTS.HERD_BOOK_CATTLE.CATTLE_HISTORY(cattleId)
        );
    },

    /**
     * Register a cattle in a herd book
     */
    registerCattle: async (herdBookId: string, data: {
        cattle_id: string;
        n_carnet?: string;
        category_id: string;
        status_id: string;
    }) => {
        return apiClient.post<HerdBookCattle>(API_ENDPOINTS.HERD_BOOKS.CATTLE(herdBookId), data);
    },

    /**
     * Update a cattle registration
     */
    updateRegistration: async (registrationId: string, data: {
        n_carnet?: string;
        category_id?: string;
        status_id?: string;
    }) => {
        return apiClient.put<HerdBookCattle>(API_ENDPOINTS.HERD_BOOK_CATTLE.CATTLE_REGISTRATION(registrationId), data);
    },

    /**
     * Unregister a cattle from a herd book
     */
    unregisterCattle: async (registrationId: string) => {
        return apiClient.delete(API_ENDPOINTS.HERD_BOOK_CATTLE.CATTLE_REGISTRATION(registrationId));
    },
};

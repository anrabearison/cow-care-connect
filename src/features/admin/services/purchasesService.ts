import { apiClient, ApiResponse } from '@/utils/apiClient';

// ─── Supplier ────────────────────────────────────────────────────────────────

export interface Supplier {
    id: string;
    name: string;
    contactInfo?: string;
    phone?: string;
    email?: string;
    address?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSupplierData {
    name: string;
    contactInfo?: string;
    phone?: string;
    email?: string;
    address?: string;
}

export type UpdateSupplierData = Partial<CreateSupplierData>;

// ─── Purchase ────────────────────────────────────────────────────────────────

export interface PurchaseItem {
    id: string;
    purchaseId: string;
    cattleId: string;
    cattle?: { id: string; name: string; nCarnet?: string };
    price: number;
    weightAtPurchase?: number;
    healthStatus?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Purchase {
    id: string;
    ownerId: string;
    supplierId?: string;
    supplier?: Supplier;
    purchaseDate: string;
    totalAmount: number;
    invoiceNumber?: string;
    healthStatus?: string;
    notes?: string;
    items: PurchaseItem[];
    createdAt: string;
    updatedAt: string;
}

export interface CreatePurchaseItemData {
    cattleId: string;
    price: number;
    weightAtPurchase?: number;
    healthStatus?: string;
}

export interface CreatePurchaseData {
    ownerId: string;
    purchaseDate: string;
    supplierId?: string;
    invoiceNumber?: string;
    healthStatus?: string;
    notes?: string;
    items: CreatePurchaseItemData[];
}

export interface UpdatePurchaseData {
    purchaseDate?: string;
    supplierId?: string;
    invoiceNumber?: string;
    healthStatus?: string;
    notes?: string;
    items?: Array<{
        id?: string;
        cattleId?: string;
        price?: number;
        weightAtPurchase?: number;
        healthStatus?: string;
    }>;
}

// ─── Service ─────────────────────────────────────────────────────────────────

class PurchasesService {
    private readonly purchasesEndpoint = '/api/v1/purchases';
    private readonly suppliersEndpoint = '/api/v1/suppliers';

    // Purchases
    async getPurchasesList(filters?: { page?: number; per_page?: number; supplierId?: string }): Promise<ApiResponse<Purchase[]>> {
        const queryString = apiClient.buildQueryString(filters || {});
        const result = await apiClient.get<{ data: Purchase[]; total: number }>(`${this.purchasesEndpoint}${queryString}`);
        return { data: result.data || [], total: result.total, success: true };
    }

    async getPurchaseById(id: string): Promise<ApiResponse<Purchase>> {
        const result = await apiClient.get<Purchase>(`${this.purchasesEndpoint}/${id}`);
        return { data: result, success: true };
    }

    async createPurchase(data: CreatePurchaseData): Promise<ApiResponse<Purchase>> {
        const result = await apiClient.post<Purchase>(this.purchasesEndpoint, data);
        return { data: result, success: true, message: 'Achat créé avec succès' };
    }

    async updatePurchase(id: string, data: UpdatePurchaseData): Promise<ApiResponse<Purchase>> {
        const result = await apiClient.put<Purchase>(`${this.purchasesEndpoint}/${id}`, data);
        return { data: result, success: true, message: 'Achat mis à jour avec succès' };
    }

    async deletePurchase(id: string): Promise<ApiResponse<boolean>> {
        await apiClient.delete(`${this.purchasesEndpoint}/${id}`);
        return { data: true, success: true, message: 'Achat supprimé avec succès' };
    }

    // Suppliers
    async getSuppliersList(filters?: { q?: string; page?: number; per_page?: number }): Promise<ApiResponse<Supplier[]>> {
        const queryString = apiClient.buildQueryString(filters || {});
        const result = await apiClient.get<{ data: Supplier[]; total: number }>(`${this.suppliersEndpoint}${queryString}`);
        return { data: result.data || [], total: result.total, success: true };
    }

    async getSupplierById(id: string): Promise<ApiResponse<Supplier>> {
        const result = await apiClient.get<Supplier>(`${this.suppliersEndpoint}/${id}`);
        return { data: result, success: true };
    }

    async createSupplier(data: CreateSupplierData): Promise<ApiResponse<Supplier>> {
        const result = await apiClient.post<Supplier>(this.suppliersEndpoint, data);
        return { data: result, success: true, message: 'Fournisseur créé avec succès' };
    }

    async updateSupplier(id: string, data: UpdateSupplierData): Promise<ApiResponse<Supplier>> {
        const result = await apiClient.put<Supplier>(`${this.suppliersEndpoint}/${id}`, data);
        return { data: result, success: true, message: 'Fournisseur mis à jour avec succès' };
    }

    async deleteSupplier(id: string): Promise<ApiResponse<boolean>> {
        await apiClient.delete(`${this.suppliersEndpoint}/${id}`);
        return { data: true, success: true, message: 'Fournisseur supprimé avec succès' };
    }
}

export const purchasesService = new PurchasesService();

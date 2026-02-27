import { api } from './api';

export interface Product {
    id: string; // Changed to string to match backend ID generation
    name: string;
    price: number;
    category: string;
    stock: number;
    status: "In Stock" | "Low Stock" | "Out of Stock";
    image: string;
}

export const productService = {
    getAll: async (): Promise<Product[]> => {
        return api.get('/inventory/quants/');
    },

    create: async (product: Omit<Product, 'id' | 'status'>): Promise<{ success: boolean; product: Product }> => {
        return api.post('/inventory/quants/', product);
    },

    update: async (id: string, updates: Partial<Product>): Promise<{ success: boolean; product: Product }> => {
        return api.put(`/inventory/quants/${id}/`, updates);
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
        return api.delete(`/inventory/quants/${id}/`);
    }
};

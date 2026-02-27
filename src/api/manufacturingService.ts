import { api } from './api';

export interface ProductionOrder {
    id: string;
    product: string;
    quantity: number;
    startDate: string;
    deadline: string;
    status: "Planned" | "In Production" | "Quality Check" | "Completed";
    efficiency: string;
}

export const manufacturingService = {
    getAll: async (): Promise<ProductionOrder[]> => {
        return api.get('/manufacturing/productions/');
    },

    create: async (order: Omit<ProductionOrder, 'id' | 'efficiency'>): Promise<{ success: boolean; order: ProductionOrder }> => {
        return api.post('/manufacturing/productions/', order);
    },

    update: async (id: string, updates: Partial<ProductionOrder>): Promise<{ success: boolean; order: ProductionOrder }> => {
        return api.put(`/manufacturing/productions/${id}/`, updates);
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
        return api.delete(`/manufacturing/productions/${id}/`);
    }
};

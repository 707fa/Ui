import { api } from './api';
import type { Product } from './productService';

export interface OrderItem extends Product {
    quantity: number;
}

export interface Order {
    id: string;
    date: string;
    customer: string;
    total: number;
    status: "Paid" | "Pending" | "Cancelled";
    items: number;
    details?: OrderItem[];
}

export interface DashboardStats {
    revenue: number;
    ordersCount: number;
    stockValue: number;
    activities: {
        id: string;
        text: string;
        subtext: string;
        type: string;
    }[];
}

export const orderService = {
    getAll: async (): Promise<Order[]> => {
        return api.get('/sale/orders/');
    },

    create: async (order: { items: { id: string, quantity: number }[], total: number, customer?: string, status?: string }): Promise<{ success: boolean; order: Order }> => {
        return api.post('/sale/orders/', order);
    },

    getDashboardStats: async (): Promise<DashboardStats> => {
        try {
            const data = await api.get('/sale/orders/');
            // If it's an array (from /sale/orders/), calculate basic stats
            if (Array.isArray(data)) {
                return {
                    revenue: data.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0),
                    ordersCount: data.length,
                    stockValue: 0,
                    activities: []
                };
            }
            // Return defaults if data is not as expected
            return {
                revenue: (data as any)?.revenue || 0,
                ordersCount: (data as any)?.ordersCount || 0,
                stockValue: (data as any)?.stockValue || 0,
                activities: (data as any)?.activities || []
            };
        } catch (error) {
            return {
                revenue: 0,
                ordersCount: 0,
                stockValue: 0,
                activities: []
            };
        }
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
        return api.delete(`/sale/orders/${id}/`);
    }
};

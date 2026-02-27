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
            // Используем специальный эндпоинт для статистики
            return await api.get('/dashboard-stats');
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
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

import { api } from './api';

export interface Invoice {
    id: string;
    client: string;
    amount: string;
    dueDate: string;
    status: "Paid" | "Unpaid" | "Overdue";
}

export const accountingService = {
    getAllInvoices: async (): Promise<Invoice[]> => {
        return api.get('/accounting/invoices/');
    },

    createInvoice: async (invoice: Omit<Invoice, 'id'>): Promise<{ success: boolean; invoice: Invoice }> => {
        return api.post('/accounting/invoices/', invoice);
    },

    updateInvoice: async (id: string, updates: Partial<Invoice>): Promise<{ success: boolean; invoice: Invoice }> => {
        return api.put(`/accounting/invoices/${id}/`, updates);
    },

    deleteInvoice: async (id: string): Promise<{ success: boolean }> => {
        return api.delete(`/accounting/invoices/${id}/`);
    }
};

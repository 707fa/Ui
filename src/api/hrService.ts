import { api } from './api';

export interface Employee {
    id: string;
    name: string;
    role: string;
    department: string;
    status: "Active" | "On Leave" | "Terminated";
    email: string;
    avatar: string;
}

export const hrService = {
    getAll: async (): Promise<Employee[]> => {
        return api.get('/hr/employees/');
    },

    create: async (employee: Omit<Employee, 'id'>): Promise<{ success: boolean; employee: Employee }> => {
        return api.post('/hr/employees/', employee);
    },

    update: async (id: string, updates: Partial<Employee>): Promise<{ success: boolean; employee: Employee }> => {
        return api.put(`/hr/employees/${id}/`, updates);
    },

    delete: async (id: string): Promise<{ success: boolean }> => {
        return api.delete(`/hr/employees/${id}/`);
    }
};

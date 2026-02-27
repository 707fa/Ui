import { api } from './api';

export interface KanbanItem {
    id: string;
    title: string;
    tag: string;
    date: string;
    members: number;
}

export interface KanbanColumn {
    title: string;
    color: string;
    items: KanbanItem[];
}

export const projectService = {
    getBoard: async (): Promise<KanbanColumn[]> => {
        return api.get('/crm/leads/');
    },

    addTask: async (task: Omit<KanbanItem, 'id'>, columnTitle: string): Promise<{ success: boolean; task: KanbanItem }> => {
        return api.post('/crm/leads/', { ...task, column: columnTitle });
    },

    updateTask: async (id: string, updates: Partial<KanbanItem>): Promise<{ success: boolean; task: KanbanItem }> => {
        return api.put(`/crm/leads/${id}/`, updates);
    },

    deleteTask: async (id: string): Promise<{ success: boolean }> => {
        return api.delete(`/crm/leads/${id}/`);
    }
};

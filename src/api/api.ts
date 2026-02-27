// Оставляем только путь, так как Vite проксирует запросы
const API_BASE_URL = '/api';

export const api = {
    get: async (endpoint: string) => {
        const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const response = await fetch(`${API_BASE_URL}${url}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Ошибка API: ${response.status}`);
        }
        return response.json();
    },

    post: async (endpoint: string, data: any) => {
        const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Ошибка API: ${response.status}`);
        }
        return response.json();
    },

    put: async (endpoint: string, data: any) => {
        const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.status.toString().startsWith('2')) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Ошибка API: ${response.status}`);
        }
        return response.json();
    },

    delete: async (endpoint: string) => {
        const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method: 'DELETE',
        });

        if (!response.status.toString().startsWith('2')) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Ошибка API: ${response.status}`);
        }
        return response.json();
    }
};
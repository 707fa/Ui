import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface OrderFormProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export function OrderForm({ onSubmit, onCancel }: OrderFormProps) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        customer: '',
        items: '',
        total: '',
        status: 'Pending'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            date: new Date().toLocaleDateString(),
            total: Number(formData.total)
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('sales.customer')}</label>
                <input
                    type="text"
                    required
                    value={formData.customer}
                    onChange={e => setFormData({ ...formData, customer: e.target.value.replace(/[0-9]/g, '') })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('sales.items')}</label>
                <input
                    type="text"
                    required
                    value={formData.items}
                    onChange={e => setFormData({ ...formData, items: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('sales.total')}</label>
                <input
                    type="number"
                    required
                    value={formData.total}
                    onChange={e => setFormData({ ...formData, total: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('sales.status')}</label>
                <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                >
                    <option value="Pending">{t('sales.status_pending')}</option>
                    <option value="Paid">{t('sales.status_paid')}</option>
                    <option value="Cancelled">{t('sales.status_cancelled')}</option>
                </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">{t('common.cancel')}</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20">{t('sales.new_order')}</button>
            </div>
        </form>
    );
}

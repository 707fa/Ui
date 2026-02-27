import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type Employee } from '../../api/hrService';

interface EmployeeFormProps {
    onSubmit: (data: Omit<Employee, 'id' | 'avatar'>) => void;
    onCancel: () => void;
    initialData?: Employee;
}

export function EmployeeForm({ onSubmit, onCancel, initialData }: EmployeeFormProps) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<Omit<Employee, 'id' | 'avatar'>>({
        name: initialData?.name || '',
        role: initialData?.role || '',
        department: initialData?.department || '',
        email: initialData?.email || '',
        status: initialData?.status || 'Active'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Strict validation: No digits in Name, Role, or Department
        if (['name', 'role', 'department'].includes(name)) {
            const cleanedValue = value.replace(/[0-9]/g, '');
            setFormData(prev => ({ ...prev, [name]: cleanedValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('hr.form.name')}
                </label>
                <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder={t('hr.form.name')}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('hr.form.role')}
                </label>
                <input
                    type="text"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder={t('hr.form.role')}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('hr.form.department')}
                </label>
                <input
                    type="text"
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder={t('hr.form.department')}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('hr.form.email')}
                </label>
                <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder={t('hr.form.email')}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('hr.form.status')}
                </label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                >
                    <option value="Active">{t('hr.status_active')}</option>
                    <option value="On Leave">{t('hr.status_on_leave')}</option>
                    <option value="Terminated">{t('hr.status_terminated')}</option>
                </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    {t('common.cancel')}
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 text-sm font-black text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/25"
                >
                    {initialData ? t('hr.form.update') : t('hr.form.add')}
                </button>
            </div>
        </form>
    );
}

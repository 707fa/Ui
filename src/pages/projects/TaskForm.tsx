import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TaskFormProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        title: '',
        tag: 'Dev',
        date: 'Today',
        members: 1,
        column: 'To Do'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('projects.task_title')}</label>
                <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value.replace(/[0-9]/g, '') })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('projects.tag')}</label>
                    <select
                        value={formData.tag}
                        onChange={e => setFormData({ ...formData, tag: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                    >
                        <option value="Dev">Dev</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                        <option value="Product">Product</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('projects.status')}</label>
                    <select
                        value={formData.column}
                        onChange={e => setFormData({ ...formData, column: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                    >
                        <option value="To Do">{t('projects.status_todo')}</option>
                        <option value="In Progress">{t('projects.status_in_progress')}</option>
                        <option value="Review">{t('projects.status_review')}</option>
                        <option value="Done">{t('projects.status_done')}</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('projects.members')}</label>
                <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.members}
                    onChange={e => setFormData({ ...formData, members: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                />
            </div>
            <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">{t('common.cancel')}</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20">{t('projects.new_task')}</button>
            </div>
        </form>
    );
}

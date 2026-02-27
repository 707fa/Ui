import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { User, AtSign, Edit2, Check, X, LogOut, Shield, Calendar, Settings, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Profile() {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [newDisplayName, setNewDisplayName] = useState(user?.displayName || user?.username || '');

    const handleSave = () => {
        if (newDisplayName.trim()) {
            updateUser(newDisplayName.trim());
            setIsEditing(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    const displayName = user.displayName || user.username || 'User';
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

    return (
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('profile.title')}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{t('profile.subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Profile Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                            {/* Banner */}
                            <div className="h-32 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
                            </div>

                            {/* Avatar */}
                            <div className="relative px-6">
                                <div className="absolute -top-14">
                                    <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 border-4 border-white dark:border-zinc-900 shadow-xl flex items-center justify-center">
                                        <span className="text-3xl font-bold text-white">{initials}</span>
                                    </div>
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="pt-16 pb-6 px-6">
                                <div className="space-y-6">
                                    {/* Display Name */}
                                    <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-4">
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                                            <User className="w-4 h-4" />
                                            {t('profile.display_name')}
                                        </label>
                                        {isEditing ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={newDisplayName}
                                                    onChange={(e) => setNewDisplayName(e.target.value)}
                                                    className="flex-1 px-4 py-2.5 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={handleSave}
                                                    className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setNewDisplayName(user.displayName || user.username || '');
                                                    }}
                                                    className="p-2.5 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition-colors"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between">
                                                <span className="text-xl font-semibold text-gray-900 dark:text-white">{displayName}</span>
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Username (Login) */}
                                    <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-4">
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                                            <AtSign className="w-4 h-4" />
                                            {t('profile.username')}
                                        </label>
                                        <span className="text-lg text-gray-900 dark:text-white font-mono">@{user.username}</span>
                                    </div>

                                    {/* Email */}
                                    {user.email && (
                                        <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-4">
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                {t('profile.email')}
                                            </label>
                                            <span className="text-lg text-gray-900 dark:text-white">{user.email}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Account Info Card */}
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-500" />
                                {t('profile.account')}
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600 dark:text-gray-300">{t('profile.registration_date')}:</span>
                                    <span className="text-gray-900 dark:text-white ml-auto">
                                        {new Date(parseInt(user.id)).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Key className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600 dark:text-gray-300">{t('profile.user_id')}:</span>
                                    <span className="text-gray-900 dark:text-white ml-auto font-mono text-xs">{user.id}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Card */}
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('profile.quick_actions')}</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => navigate('/settings')}
                                    className="w-full py-3 px-4 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-white font-medium rounded-xl flex items-center gap-3 transition-colors"
                                >
                                    <Settings className="w-5 h-5 text-gray-500" />
                                    {t('profile.settings')}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium rounded-xl flex items-center gap-3 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    {t('profile.logout')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

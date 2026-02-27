import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Toaster, toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export function AppLayout() {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const toggleLanguage = () => {
        const current = i18n.language;
        if (current === 'en') {
            i18n.changeLanguage('ru');
        } else if (current === 'ru') {
            i18n.changeLanguage('uz');
        } else {
            i18n.changeLanguage('en');
        }
    };

    const displayName = user?.displayName || user?.username || 'User';
    const initials = displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex">
            <Toaster position="top-right" richColors />
            <Sidebar />

            <div className="flex-1 ml-64 flex flex-col min-w-0 transition-all duration-300">
                <header className="h-16 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-20 px-6 flex items-center justify-between shadow-sm">
                    <div className="flex items-center w-96">
                        <div className="relative w-full">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </span>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg leading-5 bg-gray-50 dark:bg-zinc-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-zinc-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                                placeholder={t('app.search_placeholder')}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        toast.info(`${t('common.search')}: ${(e.target as HTMLInputElement).value}`);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button onClick={toggleLanguage} className="px-3 py-1 text-xs font-bold border border-gray-300 dark:border-zinc-700 rounded uppercase hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-gray-700 dark:text-gray-300">
                            {i18n.language}
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none transition-colors"
                        >
                            {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                        </button>
                        <button className="p-2 mr-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none transition-colors relative">
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-900"></span>
                            <Bell className="h-6 w-6" />
                        </button>
                        <div
                            onClick={() => navigate('/profile')}
                            className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">{initials}</div>
                            <div className="hidden md:block text-sm">
                                <p className="font-medium text-gray-700 dark:text-gray-200">{user?.displayName || user?.username || 'User'}</p>
                                <p className="text-gray-500 dark:text-gray-400 text-xs">@{user?.username}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

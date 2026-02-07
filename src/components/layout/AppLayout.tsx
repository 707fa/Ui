import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Bell, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'sonner';

export function AppLayout() {
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'en' ? 'ru' : 'en');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Toaster position="top-right" richColors />
            <Sidebar />

            <div className="flex-1 ml-64 flex flex-col min-w-0 transition-all duration-300">
                <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-20 px-6 flex items-center justify-between shadow-sm">
                    <div className="flex items-center w-96">
                        <div className="relative w-full">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </span>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                                placeholder={t('app.search_placeholder')}
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button onClick={toggleLanguage} className="px-3 py-1 text-xs font-bold border border-gray-300 rounded uppercase hover:bg-gray-100 transition-colors">
                            {i18n.language}
                        </button>
                        <button className="p-2 mr-2 text-gray-400 hover:text-gray-500 focus:outline-none transition-colors relative">
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                            <Bell className="h-6 w-6" />
                        </button>
                        <div className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">JD</div>
                            <div className="hidden md:block text-sm">
                                <p className="font-medium text-gray-700">John Doe</p>
                                <p className="text-gray-500 text-xs">Administrator</p>
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

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Globe, Save, Check, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';

export default function Settings() {
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        toast.success(t('settings.saved'));
    };


    const toggleLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 max-w-4xl"
        >
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('settings.title')}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">{t('settings.subtitle')}</p>
            </div>

            {/* Appearance */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                <h2 className="font-bold text-lg mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                    <Palette className="h-5 w-5 text-purple-600" />
                    {t('settings.appearance')}
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center gap-3">
                            {theme === 'dark' ? <Moon className="h-5 w-5 text-blue-500" /> : <Sun className="h-5 w-5 text-yellow-500" />}
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{t('settings.dark_mode')}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.dark_mode_desc')}</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`relative w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}
                        >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${theme === 'dark' ? 'left-7' : 'left-1'}`}></span>
                        </button>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                            <Globe className="h-5 w-5 text-green-500" />
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{t('settings.language')}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.language_desc')}</p>
                            </div>
                        </div>
                        <select
                            value={i18n.language}
                            onChange={(e) => toggleLanguage(e.target.value)}
                            className="bg-gray-100 dark:bg-zinc-800 border-none rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="ru">Русский</option>
                            <option value="en">English</option>
                            <option value="uz">O'zbekcha</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                >
                    {isSaving ? (
                        <>
                            <Check className="h-5 w-5 animate-pulse" />
                            {t('settings.saving')}
                        </>
                    ) : (
                        <>
                            <Save className="h-5 w-5" />
                            {t('settings.save')}
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
}

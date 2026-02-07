import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "app": {
                "name": "NEURYNTH",
                "search_placeholder": "Search modules, documents, employees...",
                "settings": "Settings",
                "logout": "Logout",
                "welcome": "Welcome back to NEURYNTH ERP. Here's what's happening today."
            },
            "menu": {
                "main": "Main",
                "modules": "Modules",
                "dashboard": "Dashboard",
                "sales": "Sales & CRM",
                "accounting": "Accounting",
                "hr": "HR",
                "inventory": "Inventory",
                "manufacturing": "Manufacturing",
                "projects": "Projects",
                "pos": "POS",
                "web": "Web Portal"
            },
            "dashboard": {
                "overview": "Dashboard Overview",
                "total_revenue": "Total Revenue",
                "active_employees": "Active Employees",
                "inventory_value": "Inventory Value",
                "sales_pipeline": "Sales Pipeline",
                "sales_chart": "Sales Performance Chart",
                "recent_activities": "Recent Activities"
            }
        }
    },
    ru: {
        translation: {
            "app": {
                "name": "NEURYNTH",
                "search_placeholder": "Поиск модулей, документов, сотрудников...",
                "settings": "Настройки",
                "logout": "Выйти",
                "welcome": "С возвращением в NEURYNTH ERP. Вот сводка на сегодня."
            },
            "menu": {
                "main": "Главное",
                "modules": "Модули",
                "dashboard": "Дашборд",
                "sales": "Продажи и CRM",
                "accounting": "Бухгалтерия",
                "hr": "Кадры",
                "inventory": "Склад",
                "manufacturing": "Производство",
                "projects": "Проекты",
                "pos": "Точки продаж (POS)",
                "web": "Веб-портал"
            },
            "dashboard": {
                "overview": "Обзор Дашборда",
                "total_revenue": "Общая выручка",
                "active_employees": "Сотрудники",
                "inventory_value": "Стоимость склада",
                "sales_pipeline": "Воронка продаж",
                "sales_chart": "График продаж",
                "recent_activities": "Недавняя активность"
            }
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "ru", // Default to Russian as requested
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        },
        react: {
            useSuspense: false
        }
    });

export default i18n;

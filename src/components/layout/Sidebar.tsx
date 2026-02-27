import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    DollarSign,
    Users,
    Package,
    Factory,
    ClipboardList,
    Store,
    Globe,
    Settings,
    LogOut,
    ChevronRight
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const menuGroups = (t: (key: string) => string) => [
    {
        label: t('menu.main'),
        items: [
            { icon: LayoutDashboard, label: t('menu.dashboard'), to: "/" },
        ]
    },
    {
        label: t('menu.modules'),
        items: [
            { icon: Briefcase, label: t('menu.sales'), to: "/sales" },
            { icon: DollarSign, label: t('menu.accounting'), to: "/accounting" },
            { icon: Users, label: t('menu.hr'), to: "/hr" },
            { icon: Package, label: t('menu.inventory'), to: "/inventory" },
            { icon: Factory, label: t('menu.manufacturing'), to: "/manufacturing" },
            { icon: ClipboardList, label: t('menu.projects'), to: "/projects" },
            { icon: Store, label: t('menu.pos'), to: "/pos" },
            { icon: Globe, label: t('menu.web'), to: "/web" },
        ]
    }
];

export function Sidebar() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-30 transition-all duration-300">
            <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">N</span>
                </div>
                <span className="font-bold text-xl text-sidebar-foreground tracking-tight">NEURYNTH</span>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
                {menuGroups(t).map((group, idx) => (
                    <div key={idx}>
                        <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            {group.label}
                        </div>
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) => clsx(
                                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                                        isActive
                                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                            : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                    )}
                                >
                                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0 opacity-70 group-hover:opacity-100" />
                                    <span className="flex-1">{item.label}</span>
                                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-sidebar-border space-y-1">
                <NavLink
                    to="/settings"
                    className={({ isActive }) => clsx(
                        "flex w-full items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                            : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    )}
                >
                    <Settings className="mr-3 h-5 w-5" />
                    {t('app.settings')}
                </NavLink>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    {t('app.logout')}
                </button>
            </div>
        </aside>
    );
}

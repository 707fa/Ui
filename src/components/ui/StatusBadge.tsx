import type { LucideIcon } from 'lucide-react';

interface StatusBadgeProps {
    status: string;
    variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
    icon?: LucideIcon;
    animate?: boolean;
}

export function StatusBadge({ status, variant, icon: Icon, animate }: StatusBadgeProps) {
    const variants = {
        success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        neutral: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-400",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${variants[variant]}`}>
            {Icon && <Icon className={`h-3 w-3 ${animate ? 'animate-pulse' : ''}`} />}
            {status}
        </span>
    );
}

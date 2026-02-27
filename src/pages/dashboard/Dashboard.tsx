import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    TrendingUp,
    Users,
    Package,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    Plus,
    FileText,
    Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { orderService, type DashboardStats } from '../../api/orderService';
import { toast } from 'sonner';

const chartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 6890 },
    { name: 'Jun', value: 4390 },
    { name: 'Jul', value: 7490 },
    { name: 'Aug', value: 8000 },
    { name: 'Sep', value: 6000 },
    { name: 'Oct', value: 5000 },
    { name: 'Nov', value: 4780 },
    { name: 'Dec', value: 9890 },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
    const { t } = useTranslation();
    const [statsData, setStatsData] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const navigate = useNavigate();

    const loadStats = async () => {
        try {
            const data = await orderService.getDashboardStats();
            setStatsData(data as any);
        } catch (error) {
            console.error(error);
            toast.error(t('auth.errors.generic'));
        } finally {
            setIsLoading(false);
        }
    };

    const stats = [
        {
            label: t('dashboard.total_revenue'),
            value: statsData ? `${(statsData.revenue || 0).toLocaleString()} сум` : "...",
            change: "+20.1%",
            trend: "up",
            icon: DollarSign,
            gradient: "from-emerald-500/20 to-teal-500/20",
            iconColor: "text-emerald-500"
        },
        {
            label: t('dashboard.active_users'),
            value: "2,482",
            change: "+12.5%",
            trend: "up",
            icon: Users,
            gradient: "from-blue-500/20 to-indigo-500/20",
            iconColor: "text-blue-500"
        },
        {
            label: t('dashboard.inventory_value'),
            value: statsData ? `${(statsData.stockValue || 0).toLocaleString()} сум` : "...",
            change: "-2.3%",
            trend: "down",
            icon: Package,
            gradient: "from-orange-500/20 to-red-500/20",
            iconColor: "text-orange-500"
        },
        {
            label: t('dashboard.total_orders'),
            value: statsData ? statsData.ordersCount : "...",
            change: "+15.2%",
            trend: "up",
            icon: TrendingUp,
            gradient: "from-purple-500/20 to-pink-500/20",
            iconColor: "text-purple-500"
        },
    ];

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
            />
        </div>
    );

    return (
        <motion.div
            className="space-y-8 pb-10"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {/* Cinematic Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse delay-1000" />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {t('dashboard.overview').split(' ')[0]} <span className="text-blue-600">{t('dashboard.overview').split(' ')[1]}</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-500" />
                        {t('dashboard.efficiency_status')}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/sales')}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all active:scale-95"
                    >
                        <FileText className="h-4 w-4" /> {t('common.reports')}
                    </button>
                    <button
                        onClick={() => navigate('/projects')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-extrabold shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all active:scale-95"
                    >
                        <Plus className="h-4 w-4" /> {t('common.new_project')}
                    </button>
                </div>
            </div>

            {/* Stats Grid with Glassmorphism */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                    {stats.map((stat) => (
                        <motion.div
                            key={stat.label}
                            variants={itemVariants}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="relative group overflow-hidden bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/20 dark:border-zinc-800/50 shadow-xl shadow-gray-200/20 dark:shadow-none"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className={`p-3 rounded-2xl bg-white dark:bg-zinc-900 shadow-inner ${stat.iconColor}`}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                    <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold ${stat.trend === 'up' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                        <span>{stat.change}</span>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-2 tabular-nums tracking-tight">{stat.value}</h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Advanced Multi-Line Chart */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/20 dark:border-zinc-800/50 shadow-xl shadow-gray-200/20 dark:shadow-none min-h-[450px]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1">{t('common.growth_matrix')}</h3>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('dashboard.growth_matrix_desc')}</p>
                        </div>
                        <select className="bg-transparent border-none text-sm font-bold text-blue-600 outline-none cursor-pointer">
                            <option>{t('dashboard.last_12_months')}</option>
                            <option>{t('dashboard.last_30_days')}</option>
                        </select>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.1)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                                    tickFormatter={(val) => `${val / 1000}k сум`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '20px',
                                        border: 'none',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                        backgroundColor: '#18181b',
                                        color: '#fff',
                                        padding: '12px 16px'
                                    }}
                                    itemStyle={{ color: '#fff', fontWeight: 800 }}
                                    cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Animated Activity Feed */}
                <motion.div variants={itemVariants} className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/20 dark:border-zinc-800/50 shadow-xl shadow-gray-200/20 dark:shadow-none flex flex-col">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6">{t('common.live_stream')}</h3>
                    <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide">
                        {statsData?.activities && statsData.activities.length > 0 ? (
                            statsData.activities.map((activity, i) => (
                                <motion.div
                                    key={activity.id || i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group flex items-start space-x-4"
                                >
                                    <div className="relative">
                                        <div className="p-2.5 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-500/20">
                                            <Activity className="h-4 w-4" />
                                        </div>
                                        {i === 0 && (
                                            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 border-2 border-white dark:border-zinc-900 rounded-full animate-ping" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-gray-800 dark:text-gray-100 group-hover:text-blue-500 transition-colors">
                                            {activity.text}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                                {activity.subtext}
                                            </span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">
                                                {activity.type}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50 space-y-3">
                                <Zap className="h-10 w-10 animate-bounce" />
                                <p className="text-xs font-bold uppercase tracking-widest">{t('common.system_pulse')}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => toast.info(t('common.view_telemetry'))}
                        className="mt-6 w-full py-4 text-xs font-black text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all"
                    >
                        {t('common.view_telemetry')}
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
}


import { useTranslation } from 'react-i18next';
import {
    TrendingUp,
    Users,
    Package,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    CreditCard,
    ShoppingCart
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const data = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
    { name: 'Aug', value: 4000 },
    { name: 'Sep', value: 3000 },
    { name: 'Oct', value: 2000 },
    { name: 'Nov', value: 2780 },
    { name: 'Dec', value: 3890 },
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

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
    const { t } = useTranslation();

    const stats = [
        { label: t('dashboard.total_revenue'), value: "$45,231.89", change: "+20.1%", trend: "up", icon: DollarSign, color: "bg-green-100 text-green-600" },
        { label: t('dashboard.active_employees'), value: "2,350", change: "+4.5%", trend: "up", icon: Users, color: "bg-blue-100 text-blue-600" },
        { label: t('dashboard.inventory_value'), value: "$1.2M", change: "-2.3%", trend: "down", icon: Package, color: "bg-orange-100 text-orange-600" },
        { label: t('dashboard.sales_pipeline'), value: "$340k", change: "+12.2%", trend: "up", icon: TrendingUp, color: "bg-purple-100 text-purple-600" },
    ];

    return (
        <motion.div
            className="space-y-6"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.overview')}</h1>
                <p className="text-gray-500 mt-1">{t('app.welcome')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <motion.div
                        key={stat.label}
                        variants={item}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-lg ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div className={`flex items-center space-x-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                <span>{stat.change}</span>
                                {stat.trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart Widget */}
                <motion.div variants={item} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{t('dashboard.sales_chart')}</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Recent Activity Widget */}
                <motion.div variants={item} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 overflow-y-auto">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{t('dashboard.recent_activities')}</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-start space-x-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="bg-blue-100 p-2 rounded-full">
                                    <Activity className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">New Order #ORD-202{i}</p>
                                    <p className="text-xs text-gray-500">2 minutes ago • Sales Module</p>
                                </div>
                            </div>
                        ))}
                        <div className="flex items-start space-x-3 pb-3 border-b border-gray-50">
                            <div className="bg-green-100 p-2 rounded-full">
                                <CreditCard className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800">Payment Received $450.00</p>
                                <p className="text-xs text-gray-500">15 minutes ago • Accounting</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 pb-3 border-b border-gray-50">
                            <div className="bg-orange-100 p-2 rounded-full">
                                <ShoppingCart className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800">Low Stock Warning: Coffee Beans</p>
                                <p className="text-xs text-gray-500">1 hour ago • Inventory</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

import { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable';
import { useTranslation } from 'react-i18next';
import { BadgeCheck, Clock, AlertCircle, ShoppingCart, TrendingUp, Filter, Plus, FileText } from 'lucide-react';
import { orderService, type Order } from '../../api/orderService';
import { toast } from 'sonner';
import { Modal } from '../../components/ui/Modal';
import { OrderForm } from './OrderForm';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { motion } from 'framer-motion';

export default function Sales() {
    const { t } = useTranslation();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => { loadOrders(); }, []);

    const loadOrders = async () => {
        try {
            const data = await orderService.getAll();
            setOrders(data);
        } catch (error) {
            console.error(error);
            toast.error(t('sales.sync_error'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateOrder = async (formData: any) => {
        try {
            await orderService.create(formData);
            toast.success(t('sales.sync_success'));
            setIsModalOpen(false);
            loadOrders();
        } catch (error) {
            toast.error(t('sales.sync_failed'));
        }
    };

    const handleDeleteOrder = async (order: Order) => {
        if (confirm(`${t('common.confirm_delete') || 'Delete'} ${order.id}?`)) {
            try {
                await orderService.delete(order.id);
                toast.success(t('common.success'));
                loadOrders();
            } catch (error) {
                toast.error(t('sales.sync_failed'));
            }
        }
    };

    const columns = [
        { header: t('sales.order_id'), accessorKey: "id" as keyof Order },
        { header: t('sales.customer'), accessorKey: "customer" as keyof Order },
        { header: t('sales.date'), accessorKey: "date" as keyof Order },
        { header: t('sales.items'), accessorKey: "items" as keyof Order },
        {
            header: t('sales.total'),
            accessorKey: "total" as keyof Order,
            cell: (item: Order) => <span className="font-black text-gray-900 dark:text-white">{(item.total || 0).toLocaleString()} сум</span>
        },
        {
            header: t('sales.status'),
            accessorKey: "status" as keyof Order,
            cell: (item: Order) => {
                const variant = item.status === 'Paid' ? 'success' : item.status === 'Cancelled' ? 'danger' : 'warning';
                const icons = { Paid: BadgeCheck, Pending: Clock, Cancelled: AlertCircle };
                const translatedStatus = item.status === 'Paid' ? t('sales.status_paid') : item.status === 'Cancelled' ? t('sales.status_cancelled') : t('sales.status_pending');
                return <StatusBadge status={translatedStatus} variant={variant} icon={icons[item.status]} animate={item.status === 'Pending'} />;
            }
        },
    ];

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-lg" />
            <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 animate-pulse">{t('sales.scanning')}</p>
        </div>
    );

    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    return (
        <div className="space-y-10 pb-10">
            {/* Background cinematic elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-pink-600/5 blur-[120px] rounded-full animate-pulse delay-1000" />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {t('sales.title').split(' ')[0]} <span className="text-blue-600">{t('sales.title').split(' ')[1]}</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                        {t('sales.efficiency_status')}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => toast.info(t('sales.filter'))}
                        className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-black shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all active:scale-95"
                    >
                        <Filter className="h-4 w-4" /> {t('sales.filter')}
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95"
                    >
                        <Plus className="h-5 w-5" /> {t('sales.new_order')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: t('sales.total_revenue'), value: `${totalRevenue.toLocaleString()} сум`, change: "+24.2%", icon: TrendingUp, color: "text-emerald-500" },
                    { label: t('sales.active_orders'), value: orders.length, change: t('sales.live_sync'), icon: ShoppingCart, color: "text-blue-500" },
                    { label: t('sales.high_impact_leads'), value: "842", change: "+12.5%", icon: BadgeCheck, color: "text-purple-500" }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl p-8 rounded-[32px] border border-white/20 dark:border-zinc-800/50 shadow-xl shadow-gray-200/20 dark:shadow-none"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className={`p-4 rounded-2xl bg-white dark:bg-zinc-800 shadow-inner ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-2 tabular-nums">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl rounded-[40px] border border-white/20 dark:border-zinc-800/50 shadow-2xl p-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <FileText className="h-32 w-32" />
                </div>
                <DataTable
                    data={orders}
                    columns={columns}
                    title={t('sales.telemetry_output')}
                    searchKey="customer"
                    searchPlaceholder={t('sales.search_placeholder')}
                    onDelete={handleDeleteOrder}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={t('sales.initialize_transaction')}
            >
                <OrderForm
                    onSubmit={handleCreateOrder}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}

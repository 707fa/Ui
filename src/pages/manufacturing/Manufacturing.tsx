import { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable';
import { useTranslation } from 'react-i18next';
import { Settings, CheckCircle2, Clock, AlertTriangle, Factory, Zap, ShieldAlert, Plus } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { ProductionForm } from './ProductionForm';
import { toast } from 'sonner';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { manufacturingService, type ProductionOrder } from '../../api/manufacturingService';
import { motion } from 'framer-motion';

export default function Manufacturing() {
    const { t } = useTranslation();
    const [orders, setOrders] = useState<ProductionOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => { loadOrders(); }, []);

    const loadOrders = async () => {
        try {
            const data = await manufacturingService.getAll();
            setOrders(data);
        } catch (error) {
            console.error(error);
            toast.error(t('manufacturing.sync_error'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreatePlan = async (formData: any) => {
        try {
            await manufacturingService.create(formData);
            toast.success(t('manufacturing.sync_success'));
            setIsModalOpen(false);
            loadOrders();
        } catch (error) {
            toast.error(t('manufacturing.sync_failed'));
        }
    };

    const columns = [
        { header: t('manufacturing.line_id'), accessorKey: "id" as keyof ProductionOrder },
        { header: t('manufacturing.product'), accessorKey: "product" as keyof ProductionOrder },
        { header: t('manufacturing.quantity'), accessorKey: "quantity" as keyof ProductionOrder },
        { header: t('manufacturing.start_date'), accessorKey: "startDate" as keyof ProductionOrder },
        { header: t('manufacturing.deadline'), accessorKey: "deadline" as keyof ProductionOrder },
        { header: t('manufacturing.efficiency'), accessorKey: "efficiency" as keyof ProductionOrder },
        {
            header: t('manufacturing.status'),
            accessorKey: "status" as keyof ProductionOrder,
            cell: (item: ProductionOrder) => {
                const variant = item.status === 'Completed' ? 'success' : item.status === 'Planned' ? 'neutral' : item.status === 'Quality Check' ? 'warning' : 'info';
                const icons = { "Planned": Clock, "In Production": Settings, "Quality Check": AlertTriangle, "Completed": CheckCircle2 };
                const translatedStatus = item.status === 'Planned' ? t('manufacturing.status_planned') : item.status === 'Completed' ? t('manufacturing.status_completed') : item.status === 'Quality Check' ? t('manufacturing.status_quality') : t('manufacturing.status_production');
                return <StatusBadge status={translatedStatus} variant={variant} icon={icons[item.status as keyof typeof icons]} animate={item.status === 'In Production'} />;
            }
        },
    ];

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="relative">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-2 border-dashed border-blue-600/40 rounded-full"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute top-2 left-2 w-12 h-12 border-2 border-dashed border-purple-600/40 rounded-full"
                />
                <Settings className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 animate-pulse">{t('manufacturing.loading')}</p>
        </div>
    );

    return (
        <div className="space-y-10 pb-10">
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/[0.02] blur-[160px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/[0.02] blur-[130px] rounded-full" />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {t('manufacturing.title').split(' ')[0]} <span className="text-blue-600">{t('manufacturing.title').split(' ')[1]}</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-500" />
                        {t('manufacturing.efficiency_status')}
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 w-fit uppercase tracking-widest"
                >
                    <Plus className="h-5 w-5" /> {t('manufacturing.new_plan')}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: t('manufacturing.oee'), value: "94.2%", icon: Zap, color: "text-amber-500" },
                    { label: t('manufacturing.active_lines'), value: orders.filter(o => o.status === 'In Production').length, icon: Factory, color: "text-blue-500" },
                    { label: t('manufacturing.quality_rate'), value: "99.8%", icon: CheckCircle2, color: "text-emerald-500" },
                    { label: t('manufacturing.alerts'), value: "0", icon: ShieldAlert, color: "text-gray-400" }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl p-6 rounded-[24px] border border-white/20 dark:border-zinc-800/50 shadow-lg"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl bg-white dark:bg-zinc-800 shadow-inner ${stat.color}`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">{stat.value}</h4>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-3xl rounded-[40px] border border-white/20 dark:border-zinc-800/50 shadow-2xl p-2">
                <DataTable data={orders} columns={columns} title={t('manufacturing.ledger_title')} searchKey="product" searchPlaceholder={t('manufacturing.search_placeholder')} />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={t('manufacturing.sync_modal_title')}
            >
                <ProductionForm
                    onSubmit={handleCreatePlan}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}

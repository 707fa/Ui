import { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable';
import { useTranslation } from 'react-i18next';
import { FileText, CheckCircle, Clock, Wallet, BarChart3, Receipt, Plus } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { InvoiceForm } from './InvoiceForm';
import { toast } from 'sonner';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { accountingService, type Invoice } from '../../api/accountingService';
import { motion } from 'framer-motion';

export default function Accounting() {
    const { t } = useTranslation();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => { loadInvoices(); }, []);

    const loadInvoices = async () => {
        try {
            const data = await accountingService.getAllInvoices();
            setInvoices(data);
        } catch (error) {
            console.error(error);
            toast.error(t('accounting.sync_error'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateInvoice = async (formData: any) => {
        try {
            await accountingService.createInvoice(formData);
            toast.success(t('accounting.sync_success'));
            setIsModalOpen(false);
            loadInvoices();
        } catch (error) {
            toast.error(t('accounting.integrity_breach'));
        }
    };

    const columns = [
        { header: t('accounting.invoice_id'), accessorKey: "id" as keyof Invoice },
        { header: t('accounting.client'), accessorKey: "client" as keyof Invoice },
        { header: t('accounting.due_date'), accessorKey: "dueDate" as keyof Invoice },
        {
            header: t('accounting.amount'),
            accessorKey: "amount" as keyof Invoice,
            cell: (item: Invoice) => <span className="font-black">${(item.amount || 0).toLocaleString()}</span>
        },
        {
            header: t('accounting.status'),
            accessorKey: "status" as keyof Invoice,
            cell: (item: Invoice) => {
                const variant = item.status === 'Paid' ? 'success' : item.status === 'Overdue' ? 'danger' : 'warning';
                const icons = { Paid: CheckCircle, Unpaid: Clock, Overdue: FileText };
                const translatedStatus = item.status === 'Paid' ? t('accounting.status_paid') : item.status === 'Overdue' ? t('accounting.status_overdue') : t('accounting.status_unpaid');
                return <StatusBadge status={translatedStatus} variant={variant} icon={icons[item.status as keyof typeof icons]} animate={item.status === 'Overdue'} />;
            }
        },
    ];

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
            <motion.div
                animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center border-2 border-blue-600/20"
            >
                <Wallet className="h-10 w-10 text-blue-600" />
            </motion.div>
            <p className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-500 animate-pulse">{t('accounting.loading')}</p>
        </div>
    );

    const totalReceivables = invoices.reduce((sum: number, inv: Invoice) => sum + (inv.status !== 'Paid' ? Number(inv.amount) || 0 : 0), 0);

    return (
        <div className="space-y-10 pb-10">
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/[0.03] blur-[150px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/[0.03] blur-[130px] rounded-full" />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {t('accounting.title').split(' ')[0]} <span className="text-blue-600">{t('accounting.title').split(' ')[1]}</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-emerald-500" />
                        {t('accounting.efficiency_status')}
                    </p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => toast.info(t('accounting.report'))}
                        className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl text-xs font-black shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all uppercase tracking-widest"
                    >
                        {t('accounting.report')}
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95"
                    >
                        <Plus className="h-5 w-5" /> {t('accounting.new_invoice')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: t('accounting.receivables'), value: `$${totalReceivables.toLocaleString()}`, change: "-12.4%", icon: Receipt, color: "text-blue-500" },
                    { label: t('accounting.margin'), value: "32.8%", change: "+4.2%", icon: BarChart3, color: "text-emerald-500" },
                    { label: t('accounting.health'), value: t('accounting.optimal'), change: t('accounting.verified'), icon: CheckCircle, color: "text-purple-500" }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl p-8 rounded-[32px] border border-white/20 dark:border-zinc-800/50 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className={`p-4 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-3 tracking-tighter tabular-nums">{stat.value}</h3>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="text-[10px] font-black text-emerald-500">{stat.change}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('accounting.since_last_cycle')}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-3xl rounded-[40px] border border-white/20 dark:border-zinc-800/50 shadow-2xl p-2 relative">
                <DataTable data={invoices} columns={columns} title={t('accounting.ledger_entries')} searchKey="client" searchPlaceholder={t('accounting.search_placeholder')} />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={t('accounting.initialize_document')}
            >
                <InvoiceForm
                    onSubmit={handleCreateInvoice}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}

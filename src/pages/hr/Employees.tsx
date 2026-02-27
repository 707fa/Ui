import { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { EmployeeForm } from './EmployeeForm';
import { toast } from 'sonner';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { hrService, type Employee } from '../../api/hrService';
import { Plus, Users, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';


export default function Employees() {
    const { t } = useTranslation();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    useEffect(() => { loadEmployees(); }, []);

    const loadEmployees = async () => {
        try {
            const data = await hrService.getAll();
            setEmployees(data);
        } catch (error) {
            console.error(error);
            toast.error(t('hr.sync_error'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmployeeSubmit = async (formData: Omit<Employee, 'id' | 'avatar'>) => {
        try {
            if (selectedEmployee) {
                await hrService.update(selectedEmployee.id, formData);
                toast.success(t('common.success'));
            } else {
                await hrService.create({ ...formData, avatar: '' });
                toast.success(t('common.success'));
            }
            setIsModalOpen(false);
            setSelectedEmployee(null);
            loadEmployees();
        } catch (error) {
            toast.error(t('hr.sync_error'));
        }
    };

    const handleDeleteEmployee = async (employee: Employee) => {
        if (confirm(t('common.confirm_delete') || `Delete ${employee.name}?`)) {
            try {
                await hrService.delete(employee.id);
                toast.success(t('common.success'));
                loadEmployees();
            } catch (error) {
                toast.error(t('hr.sync_error'));
            }
        }
    };

    const handleEditEmployee = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    };

    const columns = [
        { header: t('hr.form.name'), accessorKey: "name" as keyof Employee },
        { header: t('hr.form.role'), accessorKey: "role" as keyof Employee },
        { header: t('hr.form.department'), accessorKey: "department" as keyof Employee },
        {
            header: t('hr.form.status'),
            accessorKey: "status" as keyof Employee,
            cell: (item: Employee) => {
                const variant = item.status === 'Active' ? 'success' : item.status === 'Terminated' ? 'danger' : 'warning';
                const statusLabel = item.status === 'Active' ? t('hr.status_active') : item.status === 'Terminated' ? t('hr.status_terminated') : t('hr.status_on_leave');
                return <StatusBadge status={statusLabel} variant={variant} animate={item.status === 'Active'} />;
            }
        },
    ];

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">{t('common.loading')}</p>
        </div>
    );

    return (
        <div className="space-y-10 pb-10">
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-5%] right-[-5%] w-[35%] h-[35%] bg-blue-600/5 blur-[100px] rounded-full animate-pulse" />
                <div className="absolute bottom-[20%] left-[-5%] w-[30%] h-[30%] bg-indigo-600/5 blur-[100px] rounded-full animate-pulse delay-700" />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {t('hr.title').split(' ')[0]} <span className="text-blue-600">{t('hr.title').split(' ').slice(1).join(' ')}</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium flex items-center gap-2">
                        <Users className="h-4 w-4 text-emerald-500" />
                        {t('hr.subtitle')} ({employees.length})
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 w-fit"
                >
                    <Plus className="h-5 w-5" /> {t('common.add_node')}
                </button>
            </div>

            <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl rounded-[32px] border border-white/20 dark:border-zinc-800/50 shadow-2xl p-2 overflow-hidden">
                <DataTable
                    data={employees}
                    columns={columns}
                    title={t('hr.title')}
                    searchKey="name"
                    searchPlaceholder={t('common.search')}
                    onEdit={handleEditEmployee}
                    onDelete={handleDeleteEmployee}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedEmployee(null);
                }}
                title={selectedEmployee ? t('hr.edit_employee') : t('hr.integrate_title')}
            >
                <div className="p-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <ShieldCheck className="h-3 w-3 text-blue-500" /> {t('hr.security_clearance')}
                    </p>
                    <EmployeeForm
                        onSubmit={handleEmployeeSubmit}
                        onCancel={() => {
                            setIsModalOpen(false);
                            setSelectedEmployee(null);
                        }}
                        initialData={selectedEmployee || undefined}
                    />
                </div>
            </Modal>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreHorizontal, Calendar, Star, Layout } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/ui/Modal';
import { TaskForm } from './TaskForm';
import { toast } from 'sonner';
import { projectService, type KanbanColumn } from '../../api/projectService';


// initialColumns removed as it is now handled via projectService

export default function Projects() {
    const { t } = useTranslation();
    const [kanbanData, setKanbanData] = useState<KanbanColumn[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadBoard();
    }, []);

    const loadBoard = async () => {
        try {
            const data = await projectService.getBoard();
            setKanbanData(data);
        } catch (error) {
            console.error(error);
            toast.error(t('projects.sync_error'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddTask = async (formData: any) => {
        try {
            await projectService.addTask({
                title: formData.title,
                tag: formData.tag,
                date: formData.date,
                members: formData.members
            }, formData.column);
            toast.success(t('projects.sync_success'));
            setIsModalOpen(false);
            loadBoard();
        } catch (error) {
            toast.error(t('projects.sync_failed'));
        }
    };
    if (isLoading) return <div className="p-6 text-center text-gray-500 font-bold uppercase tracking-widest animate-pulse">{t('projects.loading')}</div>;

    return (
        <div className="h-full flex flex-col space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {t('projects.title').split(' ')[0]} <span className="text-blue-600">{t('projects.title').split(' ')[1]}</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium flex items-center gap-2">
                        <Layout className="h-4 w-4 text-purple-500" />
                        {t('projects.subtitle')}
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95 w-fit"
                >
                    <Plus className="h-5 w-5" /> {t('projects.new_perspective')}
                </button>
            </div>

            <div className="flex-1 overflow-x-auto scrollbar-hide">
                <div className="flex gap-6 min-w-max pb-8 h-full">
                    {kanbanData.map((col) => (
                        <div key={col.title} className="w-85 rounded-[32px] p-6 flex flex-col bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 shadow-2xl shadow-gray-200/20 dark:shadow-none">
                            <div className="flex items-center justify-between mb-6 px-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-black text-gray-900 dark:text-white tracking-tight uppercase text-sm">{col.title}</h3>
                                    <span className="bg-white/80 dark:bg-zinc-800/80 px-2.5 py-0.5 rounded-full text-[10px] font-black text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                                        {col.items.length}
                                    </span>
                                </div>
                                <Star className="h-4 w-4 text-amber-500" />
                            </div>

                            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                                <AnimatePresence>
                                    {col.items.map((task, i) => (
                                        <motion.div
                                            key={task.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                                            className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-100 dark:border-zinc-700/50 shadow-md hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-[9px] font-black uppercase tracking-tighter text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-lg">
                                                    {task.tag}
                                                </span>
                                                <button className="text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition-colors">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <h4 className="font-extrabold text-gray-900 dark:text-gray-100 text-sm leading-snug group-hover:text-blue-600 transition-colors">{task.title}</h4>

                                            <div className="flex items-center justify-between mt-6 border-t border-gray-50 dark:border-zinc-800 pt-4">
                                                <div className="flex items-center text-[10px] font-bold text-gray-400 dark:text-gray-500 gap-1.5 uppercase tracking-tighter">
                                                    <Calendar className="h-3.5 w-3.5" /> {task.date}
                                                </div>
                                                <div className="flex -space-x-2">
                                                    {Array.from({ length: Math.min(task.members, 3) }).map((_, i) => (
                                                        <div key={i} className={`h-7 w-7 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-700 dark:to-zinc-800 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[8px] font-black text-gray-600 dark:text-gray-300 shadow-sm`}>
                                                            {String.fromCharCode(65 + i)}
                                                        </div>
                                                    ))}
                                                    {task.members > 3 && (
                                                        <div className="h-7 w-7 rounded-full bg-blue-600 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[8px] font-black text-white shadow-sm">
                                                            +{task.members - 3}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <button className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl text-xs font-black text-gray-400 dark:text-gray-600 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                                    <Plus className="h-4 w-4" /> {t('projects.drop_reality')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={t('projects.add_task_title')}
            >
                <TaskForm
                    onSubmit={handleAddTask}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}

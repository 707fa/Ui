import { motion } from 'framer-motion';
import { Plus, MoreHorizontal, Calendar } from 'lucide-react';


const columns = [
    {
        title: "To Do",
        color: "bg-gray-50 dark:bg-zinc-900",
        items: [
            { id: "1", title: "Design System Update", tag: "Design", date: "Tomorrow", members: 3 },
            { id: "2", title: "Quarterly Report", tag: "Finance", date: "Next Week", members: 1 },
        ]
    },
    {
        title: "In Progress",
        color: "bg-blue-50 dark:bg-blue-900/10",
        items: [
            { id: "3", title: "Client Feedback Review", tag: "Product", date: "Today", members: 4 },
            { id: "4", title: "API Integration", tag: "Dev", date: "Today", members: 2 },
            { id: "5", title: "Marketing Campaign", tag: "Marketing", date: "Today", members: 5 },
        ]
    },
    {
        title: "Review",
        color: "bg-purple-50 dark:bg-purple-900/10",
        items: [
            { id: "6", title: "Homepage Redesign", tag: "Design", date: "Yesterday", members: 2 },
        ]
    },
    {
        title: "Done",
        color: "bg-green-50 dark:bg-green-900/10",
        items: [
            { id: "7", title: "Server Migration", tag: "DevOps", date: "Last Week", members: 3 },
            { id: "8", title: "Competitor Analysis", tag: "Strategy", date: "Last Week", members: 1 },
        ]
    }
];

export default function Projects() {
    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Manage tasks and workflows with Kanban.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
                    <Plus className="h-5 w-5" /> New Task
                </button>
            </div>

            <div className="flex-1 overflow-x-auto">
                <div className="flex gap-6 min-w-max pb-4 h-full">
                    {columns.map((col) => (
                        <div key={col.title} className={`w-80 rounded-xl p-4 flex flex-col ${col.color} border border-gray-200 dark:border-transparent`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-700 dark:text-gray-200">{col.title}</h3>
                                <span className="bg-white dark:bg-zinc-800 px-2 py-0.5 rounded text-xs font-semibold text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-zinc-700">
                                    {col.items.length}
                                </span>
                            </div>

                            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                                {col.items.map((task) => (
                                    <motion.div
                                        key={task.id}
                                        layout
                                        whileHover={{ y: -2 }}
                                        className="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-gray-200 dark:border-zinc-700 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                                                {task.tag}
                                            </span>
                                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-3">{task.title}</h4>

                                        <div className="flex items-center justify-between mt-4 border-t border-gray-50 dark:border-zinc-700 pt-3">
                                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1">
                                                <Calendar className="h-3 w-3" /> {task.date}
                                            </div>
                                            <div className="flex -space-x-2">
                                                {Array.from({ length: task.members }).map((_, i) => (
                                                    <div key={i} className="h-6 w-6 rounded-full bg-gray-200 dark:bg-zinc-600 border-2 border-white dark:border-zinc-800 flex items-center justify-center text-[8px] font-bold">
                                                        {String.fromCharCode(65 + i)}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                <button className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2">
                                    <Plus className="h-4 w-4" /> Add Card
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

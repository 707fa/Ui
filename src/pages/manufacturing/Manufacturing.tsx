import { DataTable } from '../../components/ui/DataTable';
import { Settings, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface ProductionOrder {
    id: string;
    product: string;
    quantity: number;
    startDate: string;
    deadline: string;
    status: "Planned" | "In Production" | "Quality Check" | "Completed";
    efficiency: string;
}

const data: ProductionOrder[] = [
    { id: "MFG-8821", product: "Wireless Headphones", quantity: 500, startDate: "2024-03-20", deadline: "2024-03-25", status: "In Production", efficiency: "98%" },
    { id: "MFG-8822", product: "Ergonomic Office Chair", quantity: 150, startDate: "2024-03-22", deadline: "2024-03-28", status: "Planned", efficiency: "-" },
    { id: "MFG-8823", product: "Mechanical Keyboard", quantity: 1000, startDate: "2024-03-15", deadline: "2024-03-20", status: "Quality Check", efficiency: "95%" },
    { id: "MFG-8824", product: "Gaming Mouse", quantity: 800, startDate: "2024-03-10", deadline: "2024-03-15", status: "Completed", efficiency: "99%" },
    { id: "MFG-8825", product: "Laptop Sleeve", quantity: 2000, startDate: "2024-03-25", deadline: "2024-04-01", status: "Planned", efficiency: "-" },
];

export default function Manufacturing() {
    const columns = [
        { header: "Order ID", accessorKey: "id" as keyof ProductionOrder },
        { header: "Product", accessorKey: "product" as keyof ProductionOrder },
        { header: "Quantity", accessorKey: "quantity" as keyof ProductionOrder },
        { header: "Start Date", accessorKey: "startDate" as keyof ProductionOrder },
        { header: "Deadline", accessorKey: "deadline" as keyof ProductionOrder },
        { logo: <div></div>, header: "Efficiency", accessorKey: "efficiency" as keyof ProductionOrder },
        {
            header: "Status",
            accessorKey: "status" as keyof ProductionOrder,
            cell: (item: ProductionOrder) => {
                const styles = {
                    "Planned": "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-400",
                    "In Production": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                    "Quality Check": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
                    "Completed": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                };
                const icons = {
                    "Planned": Clock,
                    "In Production": Settings,
                    "Quality Check": AlertTriangle,
                    "Completed": CheckCircle2
                };
                const Icon = icons[item.status];
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${styles[item.status]}`}>
                        <Icon className="h-3 w-3 animate-pulse" /> {item.status}
                    </span>
                );
            }
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manufacturing (MRP)</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Oversee production lines, orders, and efficiency.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
                    + Production Plan
                </button>
            </div>

            <DataTable data={data} columns={columns} title="Production Orders" searchKey="product" searchPlaceholder="Search production..." />
        </div>
    );
}

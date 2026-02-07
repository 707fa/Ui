import { DataTable } from '../../components/ui/DataTable';
import { FileText, CheckCircle, Clock } from 'lucide-react';

interface Invoice {
    id: string;
    client: string;
    amount: string;
    dueDate: string;
    status: "Paid" | "Unpaid" | "Overdue";
}

const data: Invoice[] = [
    { id: "INV-2024-001", client: "Acme Corp", amount: "$15,000.00", dueDate: "2024-04-01", status: "Paid" },
    { id: "INV-2024-002", client: "Globex Inc", amount: "$8,500.00", dueDate: "2024-04-10", status: "Unpaid" },
    { id: "INV-2024-003", client: "Soylent Corp", amount: "$22,000.00", dueDate: "2024-03-25", status: "Overdue" },
    { id: "INV-2024-004", client: "Massive Dynamic", amount: "$12,300.25", dueDate: "2024-04-05", status: "Paid" },
    { id: "INV-2024-005", client: "Stark Ind", amount: "$50,000.00", dueDate: "2024-04-15", status: "Unpaid" },
    { id: "INV-2024-006", client: "Initech", amount: "$4,200.00", dueDate: "2024-03-20", status: "Overdue" },
    { id: "INV-2024-007", client: "Hooli", amount: "$35,000.00", dueDate: "2024-04-12", status: "Unpaid" },
];

export default function Accounting() {
    const columns = [
        { header: "Invoice #", accessorKey: "id" as keyof Invoice },
        { header: "Client / Company", accessorKey: "client" as keyof Invoice },
        { header: "Due Date", accessorKey: "dueDate" as keyof Invoice },
        { header: "Amount", accessorKey: "amount" as keyof Invoice },
        {
            header: "Status",
            accessorKey: "status" as keyof Invoice,
            cell: (item: Invoice) => {
                const styles = {
                    Paid: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                    Unpaid: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
                    Overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                };
                const icons = {
                    Paid: CheckCircle,
                    Unpaid: Clock,
                    Overdue: FileText
                };
                const Icon = icons[item.status];
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${styles[item.status]}`}>
                        <Icon className="h-3 w-3" />
                        {item.status}
                    </span>
                );
            }
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Accounting & Finance</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Monitor cash flow, expenses, and invoices.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white dark:bg-zinc-800 text-gray-700 dark:text-white border border-gray-200 dark:border-zinc-700 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                        New Expense
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
                        + Create Invoice
                    </button>
                </div>
            </div>

            <DataTable data={data} columns={columns} title="Invoices" searchKey="client" searchPlaceholder="Search clients..." />
        </div>
    );
}

import { DataTable } from '../../components/ui/DataTable';
import { BadgeCheck, Clock, AlertCircle } from 'lucide-react';

interface Order {
    id: string;
    customer: string;
    date: string;
    total: string;
    status: "Paid" | "Pending" | "Cancelled";
    items: number;
}

const data: Order[] = [
    { id: "#ORD-7829", customer: "Acme Corp", date: "2024-03-10", total: "$1,200.00", status: "Paid", items: 4 },
    { id: "#ORD-7830", customer: "Globex Inc", date: "2024-03-11", total: "$540.50", status: "Pending", items: 2 },
    { id: "#ORD-7831", customer: "Soylent Corp", date: "2024-03-12", total: "$2,300.00", status: "Paid", items: 12 },
    { id: "#ORD-7832", customer: "Initech", date: "2024-03-12", total: "$120.00", status: "Cancelled", items: 1 },
    { id: "#ORD-7833", customer: "Umbrella Corp", date: "2024-03-13", total: "$5,600.00", status: "Paid", items: 25 },
    { id: "#ORD-7834", customer: "Stark Ind", date: "2024-03-14", total: "$8,900.00", status: "Pending", items: 8 },
    { id: "#ORD-7835", customer: "Wayne Ent", date: "2024-03-15", total: "$450.00", status: "Paid", items: 3 },
    { id: "#ORD-7836", customer: "Cyberdyne", date: "2024-03-15", total: "$3,200.00", status: "Pending", items: 10 },
];

export default function Sales() {
    const columns = [
        { header: "Order ID", accessorKey: "id" as keyof Order },
        { header: "Customer", accessorKey: "customer" as keyof Order },
        { header: "Date", accessorKey: "date" as keyof Order },
        { header: "Items", accessorKey: "items" as keyof Order },
        { header: "Total", accessorKey: "total" as keyof Order },
        {
            header: "Status",
            accessorKey: "status" as keyof Order,
            cell: (item: Order) => {
                const styles = {
                    Paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                    Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                    Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                };
                const icons = {
                    Paid: BadgeCheck,
                    Pending: Clock,
                    Cancelled: AlertCircle
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales & CRM</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Manage orders, customers, and revenue pipeline.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
                    + New Order
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">$45,231.89</p>
                    <span className="text-green-500 text-xs font-medium">+20.1% vs last month</span>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Orders</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">1,245</p>
                    <span className="text-blue-500 text-xs font-medium">+5 New today</span>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">3.2%</p>
                    <span className="text-gray-500 text-xs font-medium">Stable</span>
                </div>
            </div>

            <DataTable data={data} columns={columns} title="Recent Orders" searchKey="customer" searchPlaceholder="Search customers..." />
        </div>
    );
}

import { DataTable } from '../../components/ui/DataTable';
import { Package, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ProductItem {
    id: string;
    name: string;
    category: string;
    stock: number;
    price: string;
    status: "In Stock" | "Low Stock" | "Out of Stock";
}

const data: ProductItem[] = [
    { id: "SKU-1001", name: "Wireless Headphones", category: "Electronics", stock: 120, price: "$149.99", status: "In Stock" },
    { id: "SKU-1002", name: "Ergonomic Office Chair", category: "Furniture", stock: 45, price: "$299.00", status: "In Stock" },
    { id: "SKU-1003", name: "Mechanical Keyboard", category: "Electronics", stock: 8, price: "$89.50", status: "Low Stock" },
    { id: "SKU-1004", name: "USB-C Hub", category: "Accessories", stock: 200, price: "$35.00", status: "In Stock" },
    { id: "SKU-1005", name: "Monitor Stand", category: "Accessories", stock: 0, price: "$49.99", status: "Out of Stock" },
    { id: "SKU-1006", name: "Gaming Mouse", category: "Electronics", stock: 15, price: "$59.99", status: "Low Stock" },
    { id: "SKU-1007", name: "Desk Lamp", category: "Furniture", stock: 88, price: "$25.00", status: "In Stock" },
    { id: "SKU-1008", name: "Laptop Sleeve", category: "Accessories", stock: 300, price: "$15.99", status: "In Stock" },
];

export default function Inventory() {
    const columns = [
        { header: "SKU", accessorKey: "id" as keyof ProductItem },
        { header: "Product Name", accessorKey: "name" as keyof ProductItem },
        { header: "Category", accessorKey: "category" as keyof ProductItem },
        { header: "Price", accessorKey: "price" as keyof ProductItem },
        { header: "Stock Level", accessorKey: "stock" as keyof ProductItem },
        {
            header: "Status",
            accessorKey: "status" as keyof ProductItem,
            cell: (item: ProductItem) => {
                const styles = {
                    "In Stock": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                    "Low Stock": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                    "Out of Stock": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                };
                const icons = {
                    "In Stock": CheckCircle2,
                    "Low Stock": AlertTriangle,
                    "Out of Stock": Package
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Track stock levels, products, and movements.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
                    + Add Product
                </button>
            </div>

            <DataTable data={data} columns={columns} title="Product List" searchKey="name" searchPlaceholder="Search products..." />
        </div>
    );
}

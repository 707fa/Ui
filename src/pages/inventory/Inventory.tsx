import { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable';
import { useTranslation } from 'react-i18next';
import { Package, AlertTriangle, CheckCircle, Plus, Layers, Database, Box } from 'lucide-react';
import { productService, type Product } from '../../api/productService';
import { Modal } from '../../components/ui/Modal';
import { toast } from 'sonner';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { motion } from 'framer-motion';

export default function Inventory() {
    const { t } = useTranslation();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        name: '',
        category: 'Food',
        price: 0,
        stock: 0,
        image: 'bg-blue-100 text-blue-600'
    });

    useEffect(() => { loadProducts(); }, []);

    const loadProducts = async () => {
        try {
            const data = await productService.getAll();
            setProducts(data);
        } catch (error) {
            console.error(error);
            toast.error(t('inventory.sync_error'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveProduct = async () => {
        if (!newProduct.name || !newProduct.price) {
            toast.error(t('inventory.validation_error'));
            return;
        }

        try {
            if (selectedProduct) {
                await productService.update(selectedProduct.id, {
                    name: newProduct.name,
                    price: Number(newProduct.price),
                    category: newProduct.category || 'General',
                    stock: Number(newProduct.stock) || 0
                });
                toast.success(t('common.success'));
            } else {
                await productService.create({
                    name: newProduct.name,
                    price: Number(newProduct.price),
                    category: newProduct.category || 'General',
                    stock: Number(newProduct.stock) || 0,
                    image: newProduct.image || 'bg-gray-100 text-gray-600'
                });
                toast.success(t('inventory.sync_success'));
            }
            setIsModalOpen(false);
            setSelectedProduct(null);
            setNewProduct({ name: '', category: 'Food', price: 0, stock: 0, image: 'bg-blue-100 text-blue-600' });
            loadProducts();
        } catch (error) {
            toast.error(t('inventory.sync_failed'));
        }
    };

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setNewProduct({
            name: product.name,
            category: product.category,
            price: product.price,
            stock: product.stock,
            image: product.image
        });
        setIsModalOpen(true);
    };

    const handleDeleteProduct = async (product: Product) => {
        if (confirm(`${t('common.confirm_delete') || 'Delete'} ${product.name}?`)) {
            try {
                await productService.delete(product.id);
                toast.success(t('common.success'));
                loadProducts();
            } catch (error) {
                toast.error(t('inventory.sync_failed'));
            }
        }
    };

    const columns = [
        { header: t('inventory.asset_name'), accessorKey: "name" as keyof Product },
        { header: t('inventory.category'), accessorKey: "category" as keyof Product },
        {
            header: t('inventory.price'),
            accessorKey: "price" as keyof Product,
            cell: (item: Product) => <span className="font-bold">${(item.price || 0).toLocaleString()}</span>
        },
        { header: t('inventory.stock'), accessorKey: "stock" as keyof Product },
        {
            header: t('inventory.status'),
            accessorKey: "status" as keyof Product,
            cell: (item: Product) => {
                const variant = item.status === 'In Stock' ? 'success' : item.status === 'Out of Stock' ? 'danger' : 'warning';
                const icons = { "In Stock": CheckCircle, "Low Stock": AlertTriangle, "Out of Stock": Package };
                const translatedStatus = item.status === 'In Stock' ? t('inventory.status_in_stock') : item.status === 'Out of Stock' ? t('inventory.status_out_of_stock') : t('inventory.status_low_stock');
                return <StatusBadge status={translatedStatus} variant={variant} icon={icons[item.status as keyof typeof icons]} animate={item.status === 'Low Stock'} />;
            }
        },
    ];

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 rounded-3xl bg-blue-600/20 backdrop-blur-xl border border-blue-600/30 flex items-center justify-center"
            >
                <Package className="h-8 w-8 text-blue-600" />
            </motion.div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 animate-pulse">{t('inventory.loading')}</p>
        </div>
    );

    return (
        <div className="space-y-10 pb-10">
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[30%] right-[-10%] w-[45%] h-[45%] bg-blue-600/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] bg-teal-600/5 blur-[100px] rounded-full animate-pulse delay-500" />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {t('inventory.title').split(' ')[0]} <span className="text-blue-600">{t('inventory.title').split(' ')[1]}</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium flex items-center gap-2">
                        <Layers className="h-4 w-4 text-blue-500" />
                        {t('inventory.monitoring_status', { count: products.length })}
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 w-fit"
                >
                    <Plus className="h-5 w-5" /> {t('inventory.new_product')}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: t('inventory.capacity'), value: "92%", icon: Database, color: "text-blue-500" },
                    { label: t('inventory.critical'), value: products.filter((p: Product) => p.status !== 'In Stock').length, icon: AlertTriangle, color: "text-amber-500" },
                    { label: t('inventory.in_stock'), value: products.filter((p: Product) => p.status === 'In Stock').length, icon: CheckCircle, color: "text-emerald-500" },
                    { label: t('inventory.recent'), value: "+12", icon: Box, color: "text-purple-500" }
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
                                <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                <h4 className="text-xl font-black text-gray-900 dark:text-white">{stat.value}</h4>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl rounded-[40px] border border-white/20 dark:border-zinc-800/50 shadow-2xl p-2">
                <DataTable
                    data={products}
                    columns={columns}
                    title={t('inventory.matrix_title')}
                    searchKey="name"
                    searchPlaceholder={t('inventory.search_placeholder')}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedProduct(null);
                    setNewProduct({ name: '', category: 'Food', price: 0, stock: 0, image: 'bg-blue-100 text-blue-600' });
                }}
                title={selectedProduct ? t('inventory.edit_product') : t('inventory.add_new_title')}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('inventory.name_label')}</label>
                        <input
                            type="text"
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value.replace(/[0-9]/g, '') })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('inventory.category_label')}</label>
                        <select
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        >
                            <option value="Food">{t('inventory.cat_food')}</option>
                            <option value="Drinks">{t('inventory.cat_drinks')}</option>
                            <option value="Dessert">{t('inventory.cat_dessert')}</option>
                            <option value="General">{t('inventory.cat_general')}</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('inventory.price_label')}</label>
                            <input
                                type="number"
                                className="w-full p-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('inventory.stock_label')}</label>
                            <input
                                type="number"
                                className="w-full p-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                                value={newProduct.stock}
                                onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-2">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
                        >
                            {t('inventory.cancel')}
                        </button>
                        <button
                            onClick={handleSaveProduct}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {t('inventory.save_button')}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

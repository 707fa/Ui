import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, ShoppingCart, Trash2, CreditCard, Plus, Minus, Receipt } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { productService, type Product } from '../../api/productService';

interface CartItem extends Product {
    quantity: number;
}

export default function POS() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [calculatorInput, setCalculatorInput] = useState("");

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await productService.getAll();
            setProducts(data);
        } catch (error) {
            toast.error(t('common.error'));
            console.error(error);
        }
    };

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                toast.info(t('pos.quantity_increased', { name: product.name }));
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            toast.success(t('pos.added_to_order', { name: product.name }));
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        }));
    };

    const handleCheckout = () => {
        if (cart.length === 0) {
            toast.error(t('pos.cart_empty'));
            return;
        }
        navigate('/pos/payment', { state: { cart, total } });
    };

    const handleCalculatorInput = (key: string | number) => {
        if (key === 'C') {
            setCalculatorInput("");
        } else if (key === '⌫') {
            setCalculatorInput(prev => prev.slice(0, -1));
        } else if (key === '+') {
            if (!calculatorInput) return;
            const price = parseFloat(calculatorInput);
            if (isNaN(price) || price <= 0) return;

            const customItem: Product = {
                id: Date.now().toString(),
                name: t('pos.custom_price'),
                price: price,
                category: "Custom",
                image: "bg-gray-100 text-gray-600",
                stock: 999,
                status: "In Stock"
            };
            addToCart(customItem);
            setCalculatorInput("");
        } else {
            setCalculatorInput(prev => prev + key.toString());
        }
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const categoryMap: { [key: string]: string } = {
        'all': 'all',
        'food': 'Food',
        'drinks': 'Drinks',
        'dessert': 'Dessert'
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (activeCategory === "all" || p.category === categoryMap[activeCategory])
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-[calc(100vh-8rem)] flex gap-6"
        >
            {/* Left Side: Product Grid */}
            <div className="flex-[2] bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder={t('pos.search_placeholder')}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {/* Categories */}
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                        {['all', 'food', 'drinks', 'dessert'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${activeCategory === cat
                                    ? "bg-blue-600 text-white shadow-md transform scale-105"
                                    : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                                    }`}
                            >
                                {t(`pos.categories.${cat}`)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 content-start">
                    <AnimatePresence>
                        {filteredProducts.map(product => (
                            <motion.button
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="flex flex-col items-center justify-center aspect-square p-2 bg-gray-50 dark:bg-zinc-800 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-transparent hover:border-blue-200 dark:hover:border-blue-700 transition-all group active:scale-95"
                            >
                                <div className={`w-16 h-16 rounded-full mb-3 flex items-center justify-center text-3xl shadow-sm ${product.image}`}>
                                    {product.name[0]}
                                </div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100 text-center text-sm group-hover:text-blue-700 dark:group-hover:text-blue-400">{product.name}</h3>
                                <div className="flex flex-col items-center mt-1">
                                    <span className="text-blue-600 dark:text-blue-400 font-bold shadow-sm px-2 py-0.5 bg-white dark:bg-zinc-700 rounded-md text-xs">{product.price} сум</span>
                                    {product.stock <= 5 && (
                                        <span className="text-[10px] text-red-500 font-medium mt-1">{t('pos.stock_left')}: {product.stock}</span>
                                    )}
                                </div>
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right Side: Cart & Calculator */}
            <div className="flex-1 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800 flex flex-col overflow-hidden relative">
                {/* Receipt Top Pattern */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-gray-200 dark:via-zinc-700 to-transparent opacity-50"></div>

                <div className="p-4 bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 flex items-center justify-between z-10">
                    <h2 className="font-bold text-lg flex items-center gap-2 text-gray-800 dark:text-gray-200">
                        <Receipt className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        {t('pos.new_order')}
                    </h2>
                    <button
                        onClick={() => { setCart([]); toast.error(t('pos.order_cancelled')); }}
                        className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fffdfa] dark:bg-zinc-900">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                            <ShoppingCart className="h-16 w-16 mb-4" />
                            <p className="text-sm">{t('pos.empty_cart')}</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {cart.map(item => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex items-center justify-between bg-white dark:bg-zinc-800 p-3 rounded-lg border border-gray-100 dark:border-zinc-700 shadow-sm"
                                >
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">{item.name}</h4>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{item.price} сум x {item.quantity}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-700 rounded-lg p-1">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white dark:hover:bg-zinc-600 hover:shadow-sm rounded transition-all text-gray-700 dark:text-gray-200">
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="w-5 text-center text-sm font-bold text-gray-700 dark:text-gray-200">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white dark:hover:bg-zinc-600 hover:shadow-sm rounded transition-all text-gray-700 dark:text-gray-200">
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                    <div className="ml-3 font-bold text-gray-900 dark:text-white text-sm w-16 text-right">
                                        {item.price * item.quantity} сум
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* Calculator / Checkout Area */}
                <div className="border-t border-gray-200 dark:border-zinc-700 p-4 bg-white dark:bg-zinc-800 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-10">
                    <div className="flex justify-between items-end mb-4 px-2">
                        <div className="flex flex-col">
                            <span className="text-gray-500 dark:text-gray-400 font-medium text-xs">{t('pos.input')} {calculatorInput || "0"}</span>
                            <span className="text-gray-500 dark:text-gray-400 font-medium">{t('pos.to_pay')}</span>
                        </div>
                        <span className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{total} <span className="text-lg text-gray-400 font-normal">сум</span></span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-4">
                        {[7, 8, 9, 'C', 4, 5, 6, '⌫', 1, 2, 3, '+', 0, '.', '00'].map((key) => (
                            <button
                                key={key}
                                onClick={() => handleCalculatorInput(key)}
                                className={`h-12 rounded-lg shadow-sm border font-medium text-lg active:scale-95 transition-all
                                    ${key === '+'
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                                        : 'bg-gray-50 dark:bg-zinc-700 border-gray-100 dark:border-zinc-600 hover:bg-gray-100 dark:hover:bg-zinc-600 text-gray-900 dark:text-gray-100'}`}
                            >
                                {key === '+' ? t('pos.add_item') : key}
                            </button>
                        ))}
                        <button className="h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg shadow-sm border border-blue-100 dark:border-blue-800 font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 active:scale-95 transition-all hidden">
                            =
                        </button>
                    </div>

                    <div className="mt-4">
                        <button
                            onClick={handleCheckout}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            <CreditCard className="h-6 w-6" />
                            {t('pos.checkout')}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

import { useState } from 'react';
import { Search, ShoppingCart, Trash2, CreditCard, Plus, Minus, Receipt } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Product {
    id: number;
    name: string;
    price: number;
    image: string; // Placeholder for image URL/color
    category: string;
}

interface CartItem extends Product {
    quantity: number;
}

const PRODUCTS: Product[] = [
    { id: 1, name: "Кофе Латте", price: 350, category: "Drinks", image: "bg-amber-100 text-amber-600" },
    { id: 2, name: "Круассан", price: 180, category: "Food", image: "bg-orange-100 text-orange-600" },
    { id: 3, name: "Чизкейк", price: 250, category: "Dessert", image: "bg-yellow-100 text-yellow-600" },
    { id: 4, name: "Эспрессо", price: 150, category: "Drinks", image: "bg-amber-900/10 text-amber-900" },
    { id: 5, name: "Сэндвич", price: 300, category: "Food", image: "bg-green-100 text-green-600" },
    { id: 6, name: "Чай Зеленый", price: 120, category: "Drinks", image: "bg-emerald-100 text-emerald-600" },
];

export default function POS() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("Все");

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                toast.info(`Increased quantity: ${product.name}`);
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            toast.success(`Added to order: ${product.name}`);
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        }));
    };

    const handleCheckout = () => {
        if (cart.length === 0) {
            toast.error("Cart is empty!");
            return;
        }
        toast.success(`Payment of ${total} ₽ processed successfully!`);
        setCart([]);
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const filteredProducts = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (activeCategory === "Все" || p.category === (activeCategory === "Напитки" ? "Drinks" : activeCategory === "Еда" ? "Food" : activeCategory === "Десерты" ? "Dessert" : activeCategory))
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-[calc(100vh-8rem)] flex gap-6"
        >
            {/* Left Side: Product Grid */}
            <div className="flex-[2] bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Поиск товаров..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {/* Categories */}
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                        {["Все", "Еда", "Напитки", "Десерты"].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${activeCategory === cat
                                        ? "bg-blue-600 text-white shadow-md transform scale-105"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {cat}
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
                                className="flex flex-col items-center justify-center aspect-square p-2 bg-gray-50 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all group active:scale-95"
                            >
                                <div className={`w-16 h-16 rounded-full mb-3 flex items-center justify-center text-3xl shadow-sm ${product.image}`}>
                                    {product.name[0]}
                                </div>
                                <h3 className="font-medium text-gray-900 text-center text-sm group-hover:text-blue-700">{product.name}</h3>
                                <span className="text-blue-600 font-bold mt-1 shadow-sm px-2 py-0.5 bg-white rounded-md text-xs">{product.price} ₽</span>
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right Side: Cart & Calculator */}
            <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col overflow-hidden relative">
                {/* Receipt Top Pattern */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50"></div>

                <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between z-10">
                    <h2 className="font-bold text-lg flex items-center gap-2 text-gray-800">
                        <Receipt className="h-5 w-5 text-gray-500" />
                        Заказ #2024
                    </h2>
                    <button
                        onClick={() => { setCart([]); toast.error("Order cancelled"); }}
                        className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fffdfa]">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                            <ShoppingCart className="h-16 w-16 mb-4" />
                            <p className="text-sm">Выберите товары из меню</p>
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
                                    className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
                                >
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm text-gray-900">{item.name}</h4>
                                        <span className="text-xs text-gray-500">{item.price} ₽ x {item.quantity}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white hover:shadow-sm rounded transition-all">
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="w-5 text-center text-sm font-bold text-gray-700">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white hover:shadow-sm rounded transition-all">
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                    <div className="ml-3 font-bold text-gray-900 text-sm w-16 text-right">
                                        {item.price * item.quantity} ₽
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* Calculator / Checkout Area */}
                <div className="border-t border-gray-200 p-4 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-10">
                    <div className="flex justify-between items-end mb-4 px-2">
                        <span className="text-gray-500 font-medium">К оплате:</span>
                        <span className="text-3xl font-extrabold text-gray-900 tracking-tight">{total} <span className="text-lg text-gray-400 font-normal">₽</span></span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-4">
                        {[7, 8, 9, 'C', 4, 5, 6, '⌫', 1, 2, 3, '%', 0, '.', '00'].map((key) => (
                            <button
                                key={key}
                                className="h-12 bg-gray-50 rounded-lg shadow-sm border border-gray-100 font-medium text-lg hover:bg-gray-100 active:bg-gray-200 active:scale-95 transition-all"
                            >
                                {key}
                            </button>
                        ))}
                        <button className="h-12 bg-blue-50 text-blue-600 rounded-lg shadow-sm border border-blue-100 font-bold hover:bg-blue-100 active:scale-95 transition-all">
                            =
                        </button>
                    </div>

                    <button
                        onClick={handleCheckout}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <CreditCard className="h-6 w-6" />
                        Оплатить заказ
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

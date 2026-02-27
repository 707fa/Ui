import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Banknote, CheckCircle, ArrowLeft, Loader2, Calendar, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { orderService } from '../../api/orderService';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export default function Payment() {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { cart, total } = location.state as { cart: CartItem[], total: number } || { cart: [], total: 0 };

    const [method, setMethod] = useState<'card' | 'cash' | 'payme' | 'click'>('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form States
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        if (!location.state) {
            navigate('/pos');
        }
    }, [location, navigate]);

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const parts = [];
        for (let i = 0; i < v.length; i += 4) {
            parts.push(v.substring(i, i + 4));
        }
        return parts.join(' ').substring(0, 19);
    };

    const formatPhoneNumber = (value: string) => {
        const v = value.replace(/\D/g, '');
        if (v.length <= 9) return v;
        return v.substring(0, 9);
    };

    const handlePayment = async () => {
        if (method === 'card') {
            if (cardNumber.replace(/\s/g, '').length < 16 || !cardHolder || expiry.length < 5 || cvv.length < 3) {
                toast.error(t('auth.errors.fill_all'));
                return;
            }
        }

        if (method === 'payme' || method === 'click') {
            if (phoneNumber.length < 9) {
                toast.error(t('auth.errors.fill_all'));
                return;
            }
        }

        setIsProcessing(true);
        try {
            const orderItems = cart.map(item => ({ id: item.id, quantity: item.quantity }));

            let customerInfo = "";
            switch (method) {
                case 'card': customerInfo = `Card: ${cardHolder}`; break;
                case 'payme': customerInfo = `Payme: +998${phoneNumber}`; break;
                case 'click': customerInfo = `Click: +998${phoneNumber}`; break;
                default: customerInfo = "Walk-in (Cash)";
            }

            await orderService.create({
                items: orderItems,
                total: total,
                customer: customerInfo,
                status: 'Paid'
            });

            // Realistic delay for Payme/Click
            if (method === 'payme' || method === 'click') {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            setIsProcessing(false);
            setIsSuccess(true);
            toast.success(t('pos.payment_success'));
        } catch (error) {
            console.error(error);
            setIsProcessing(false);
            toast.error(t('pos.sync_failed'));
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
                >
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('pos.payment_success')}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        {t('pos.amount_debited')} ({total} {t('pos.total')})
                    </p>

                    <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 mb-8 text-left">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500 dark:text-gray-400 text-sm">{t('pos.status')}</span>
                            <span className="text-green-600 dark:text-green-400 font-medium text-sm">{t('pos.completed')}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500 dark:text-gray-400 text-sm">{t('pos.payment_method')}</span>
                            <span className="text-gray-900 dark:text-white font-medium text-sm">
                                {method.toUpperCase()}
                            </span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 dark:border-zinc-700 pt-2 mt-2">
                            <span className="text-gray-900 dark:text-white font-bold">{t('pos.total')}</span>
                            <span className="text-blue-600 dark:text-blue-400 font-bold">{total} сум</span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/pos')}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                    >
                        {t('pos.new_order')}
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col">
            <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-6 py-4 flex items-center gap-4">
                <button
                    onClick={() => navigate('/pos')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('pos.payment_processing')}</h1>
            </div>

            <div className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-zinc-800">
                        <h2 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">{t('pos.order_summary')}</h2>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {cart.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-800 last:border-0">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.quantity} x {item.price} сум</p>
                                    </div>
                                    <span className="font-semibold text-gray-900 dark:text-white">{item.quantity * item.price} сум</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-dashed border-gray-300 dark:border-zinc-700 flex justify-between items-center">
                            <span className="text-gray-500 dark:text-gray-400 font-medium">{t('pos.to_pay_label')}</span>
                            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{total} сум</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-zinc-800 h-fit">
                    <h2 className="font-bold text-lg mb-6 text-gray-800 dark:text-gray-100">{t('pos.payment_method')}</h2>

                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <button
                            onClick={() => setMethod('card')}
                            className={`py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 font-medium transition-all ${method === 'card'
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                : 'border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-zinc-600'
                                }`}
                        >
                            <CreditCard className="h-5 w-5" />
                            {t('pos.card')}
                        </button>
                        <button
                            onClick={() => setMethod('cash')}
                            className={`py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 font-medium transition-all ${method === 'cash'
                                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                                : 'border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-zinc-600'
                                }`}
                        >
                            <Banknote className="h-5 w-5" />
                            {t('pos.cash')}
                        </button>
                        <button
                            onClick={() => setMethod('payme')}
                            className={`py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 font-medium transition-all ${method === 'payme'
                                ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400'
                                : 'border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-zinc-600'
                                }`}
                        >
                            <div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">P</div>
                            Payme
                        </button>
                        <button
                            onClick={() => setMethod('click')}
                            className={`py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 font-medium transition-all ${method === 'click'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                : 'border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-zinc-600'
                                }`}
                        >
                            <div className="w-5 h-5 bg-blue-500 rounded-lg flex items-center justify-center text-[10px] text-white font-bold">C</div>
                            Click
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {method === 'card' && (
                            <motion.div
                                key="card"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-xl p-6 text-white shadow-lg mb-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-12 h-8 bg-yellow-400/80 rounded"></div>
                                        <span className="font-mono text-sm opacity-80">DEBIT</span>
                                    </div>
                                    <div className="font-mono text-xl tracking-widest mb-4">
                                        {cardNumber || '•••• •••• •••• ••••'}
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-[10px] uppercase opacity-70 mb-1">{t('pos.card_holder')}</div>
                                            <div className="font-medium text-sm tracking-wide">{cardHolder || t('pos.owner_name')}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase opacity-70 mb-1">{t('pos.expiry')}</div>
                                            <div className="font-medium text-sm">{expiry || 'MM/YY'}</div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('pos.card_number')}</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type="text"
                                            maxLength={19}
                                            value={cardNumber}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^0-9\s]/g, '');
                                                setCardNumber(formatCardNumber(val));
                                            }}
                                            placeholder="0000 0000 0000 0000"
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('pos.expiry')}</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                type="text"
                                                maxLength={5}
                                                value={expiry}
                                                onChange={(e) => {
                                                    let v = e.target.value.replace(/[^0-9]/g, '');
                                                    if (v.length > 4) v = v.substring(0, 4);
                                                    if (v.length >= 2) {
                                                        setExpiry(`${v.substring(0, 2)}/${v.substring(2)}`);
                                                    } else {
                                                        setExpiry(v);
                                                    }
                                                }}
                                                placeholder="MM/YY"
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVV / CVC</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                type="password"
                                                maxLength={3}
                                                value={cvv}
                                                onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                                                placeholder="123"
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('pos.card_holder')}</label>
                                    <input
                                        type="text"
                                        value={cardHolder}
                                        onChange={(e) => setCardHolder(e.target.value.replace(/[0-9]/g, '').toUpperCase())}
                                        placeholder="Full Name"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow uppercase"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {(method === 'payme' || method === 'click') && (
                            <motion.div
                                key="digital"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6 text-center py-4"
                            >
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-lg border-2 ${method === 'payme' ? 'bg-cyan-500 border-cyan-400' : 'bg-blue-500 border-blue-400'}`}>
                                    <span className="text-white font-black text-3xl">{method[0].toUpperCase()}</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 uppercase">{method}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('pos.enter_phone_for_invoice') || 'Enter phone number to receive payment request'}</p>
                                </div>
                                <div className="text-left">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('pos.phone_number')}</label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-500 text-sm font-bold">
                                            +998
                                        </span>
                                        <input
                                            type="text"
                                            maxLength={9}
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                                            placeholder="90 123 45 67"
                                            className="flex-1 px-4 py-3 rounded-r-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow font-mono text-lg"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {method === 'cash' && (
                            <motion.div
                                key="cash"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-center py-8"
                            >
                                <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-100 dark:border-emerald-800">
                                    <Banknote className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('pos.cash')}</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">{t('pos.cash_desc')}</p>
                                <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-xl inline-block">
                                    <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">{t('pos.amount_to_receive')}</span>
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{total} сум</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-zinc-700">
                        <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all flex items-center justify-center gap-2 ${isProcessing
                                ? 'bg-zinc-400 dark:bg-zinc-700 cursor-not-allowed'
                                : method === 'cash' || method === 'card'
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30 active:scale-95'
                                    : method === 'payme'
                                        ? 'bg-cyan-500 hover:bg-cyan-600 shadow-cyan-500/30'
                                        : 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/30'
                                }`}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    {t('pos.processing')}
                                </>
                            ) : (
                                <>
                                    {method === 'card' ? t('pos.pay_with_card') : (method === 'payme' || method === 'click') ? `${t('pos.checkout')} ${method.toUpperCase()}` : t('pos.confirm_payment')}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

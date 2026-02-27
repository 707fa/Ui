
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { sendVerificationEmail, generateVerificationCode } from '../../api/emailService';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Lock, User, AlertCircle, Check, Mail, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Step = 'email' | 'verify' | 'details';

export default function Register() {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [enteredCode, setEnteredCode] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register, checkEmailExists, checkUsernameExists } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSendCode = async () => {
        setError('');
        setIsLoading(true);

        try {
            if (!email) {
                setError(t('auth.errors.fill_all'));
                setIsLoading(false);
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setError(t('auth.errors.invalid_email'));
                setIsLoading(false);
                return;
            }

            if (await checkEmailExists(email)) {
                setError(t('auth.errors.email_exists'));
                setIsLoading(false);
                return;
            }

            const code = generateVerificationCode();
            setVerificationCode(code);

            const sent = await sendVerificationEmail(email, code);

            if (sent) {
                setStep('verify');
            } else {
                setError(t('auth.errors.send_failed'));
            }
        } catch (err) {
            console.error('Send code error:', err);
            setError(t('auth.errors.send_failed'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = () => {
        setError('');

        if (enteredCode !== verificationCode) {
            setError(t('auth.errors.invalid_code'));
            return;
        }

        setStep('details');
    };

    const handleRegister = async () => {
        setError('');
        setIsLoading(true);

        try {
            if (!username || !password || !confirmPassword) {
                setError(t('auth.errors.fill_all'));
                setIsLoading(false);
                return;
            }

            if (username.length < 3) {
                setError(t('auth.errors.username_length'));
                setIsLoading(false);
                return;
            }

            // Removed sync checks for email and username as we now rely on backend validation
            // during the actual registration call or we would need to make these async.
            // For simplicity and to match the backend shift, we verify at the end.

            if (await checkUsernameExists(username)) {
                setError(t('auth.errors.username_exists'));
                setIsLoading(false);
                return;
            }

            // We can still do password mismatch checks here
            if (password !== confirmPassword) {
                setError(t('auth.errors.password_mismatch'));
                setIsLoading(false);
                return;
            }

            if (password.length < 6) {
                setError(t('auth.errors.password_length'));
                setIsLoading(false);
                return;
            }

            const result = await register(username, email, password);

            if (result.success) {
                navigate('/');
            } else {
                setError(result.error || t('auth.errors.registration_failed'));
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError(t('auth.errors.generic'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        setIsLoading(true);
        try {
            const code = generateVerificationCode();
            setVerificationCode(code);
            setEnteredCode('');

            const sent = await sendVerificationEmail(email, code);
            if (!sent) {
                setError(t('auth.errors.send_failed'));
            }
        } catch (err) {
            console.error('Resend code error:', err);
            setError(t('auth.errors.send_failed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">{t('auth.register_title')}</h1>
                        <p className="text-gray-400">
                            {step === 'email' && t('auth.register_subtitle.email')}
                            {step === 'verify' && t('auth.register_subtitle.verify')}
                            {step === 'details' && t('auth.register_subtitle.details')}
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {['email', 'verify', 'details'].map((s, i) => (
                            <div key={s} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step === s
                                    ? 'bg-emerald-500 text-white'
                                    : ['email', 'verify', 'details'].indexOf(step) > i
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-zinc-800 text-gray-500'
                                    }`}>
                                    {['email', 'verify', 'details'].indexOf(step) > i ? (
                                        <Check className="w-4 h-4" />
                                    ) : (
                                        i + 1
                                    )}
                                </div>
                                {i < 2 && (
                                    <div className={`w-8 h-0.5 ${['email', 'verify', 'details'].indexOf(step) > i
                                        ? 'bg-emerald-500/50'
                                        : 'bg-zinc-800'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Error */}
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm">{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Step 1: Email */}
                    <AnimatePresence mode="wait">
                        {step === 'email' && (
                            <motion.div
                                key="email"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('auth.email')}</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleSendCode}
                                    disabled={isLoading}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {t('auth.send_code')}
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        )}

                        {/* Step 2: Verify */}
                        {step === 'verify' && (
                            <motion.div
                                key="verify"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                <div className="text-center mb-4">
                                    <p className="text-gray-400 text-sm">
                                        {t('auth.code_sent', { email })}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('auth.verification_code')}</label>
                                    <input
                                        type="text"
                                        value={enteredCode}
                                        onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-center text-2xl tracking-widest font-mono placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                        placeholder="000000"
                                        maxLength={6}
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep('email')}
                                        className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-gray-300 font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={handleVerifyCode}
                                        disabled={enteredCode.length !== 6}
                                        className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {t('auth.verify_code')}
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>

                                <button
                                    onClick={handleResendCode}
                                    disabled={isLoading}
                                    className="w-full text-center text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                                >
                                    {isLoading ? t('settings.saving') : t('auth.resend_code')}
                                </button>
                            </motion.div>
                        )}

                        {/* Step 3: Details */}
                        {step === 'details' && (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                <div className="text-center mb-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-sm">
                                        <Check className="w-4 h-4" />
                                        {t('auth.email_verified')}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('auth.username')}</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                            placeholder={t('auth.username_placeholder')}
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">{t('auth.username_hint')}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('auth.password')}</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">{t('auth.password_hint')}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('auth.confirm_password')}</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                            placeholder="••••••••"
                                        />
                                        {confirmPassword && password === confirmPassword && (
                                            <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={handleRegister}
                                    disabled={isLoading}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <UserPlus className="w-5 h-5" />
                                            {t('auth.register_button')}
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            {t('auth.have_account')}{' '}
                            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                                {t('auth.login_button')}
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

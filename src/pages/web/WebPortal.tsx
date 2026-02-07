import { ShoppingBag, BarChart3, Settings as SettingsIcon, ExternalLink, Image as ImageIcon } from 'lucide-react';

export default function WebPortal() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Web Portal & E-commerce</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your online storefront, products, and SEO.</p>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" /> Match Live Site
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Live Preview Card */}
                <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="relative z-10">
                        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Live Status: Online</span>
                        <h2 className="text-3xl font-bold mb-4">Summer Collection Launch</h2>
                        <p className="text-indigo-100 max-w-lg mb-8">Currently featured on the homepage. Conversion rate is up by 15% since the last update.</p>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
                                <p className="text-indigo-200 text-xs uppercase font-bold">Visitors</p>
                                <p className="text-2xl font-bold mt-1">12,450</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
                                <p className="text-indigo-200 text-xs uppercase font-bold">Orders</p>
                                <p className="text-2xl font-bold mt-1">482</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
                                <p className="text-indigo-200 text-xs uppercase font-bold">Revenue</p>
                                <p className="text-2xl font-bold mt-1">$45k</p>
                            </div>
                        </div>
                    </div>

                    {/* Mock visuals */}
                    <div className="absolute right-0 bottom-0 w-1/3 h-[120%] bg-white/5 skew-x-12 translate-x-10 translate-y-10 group-hover:translate-x-5 transition-transform duration-500"></div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm cursor-pointer hover:border-blue-500 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                <ShoppingBag className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Products Management</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Add, edit, or remove store items</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm cursor-pointer hover:border-purple-500 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                                <ImageIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Banner & Assets</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Update homepage visuals</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm cursor-pointer hover:border-orange-500 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg group-hover:scale-110 transition-transform">
                                <BarChart3 className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">SEO & Analytics</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Optimize search ranking</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm cursor-pointer hover:border-gray-500 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-100 dark:bg-zinc-800 text-gray-600 rounded-lg group-hover:scale-110 transition-transform">
                                <SettingsIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Store Settings</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Shipping, taxes, and domains</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// src/components/profile/profile-action.tsx

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { BarChart3, ArrowLeftRight, CreditCard, Bell, BellOff } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { toast } from 'sonner';

const insightItems = [
    { label: 'Process Sale',    href: '/dashboard/process-sale',    icon: CreditCard,     exact: true },
    // { label: 'Stock Transfers', href: '/dashboard/stock-transfers', icon: ArrowLeftRight, },
    // { label: 'Transactions',    href: '/dashboard/transactions',    icon: BarChart3 },
];

export default function ProfileInsights() {
    const { 
        isSupported, 
        isSubscribed, 
        permission, 
        isLoading, 
        error,
        toggle 
    } = usePushNotifications();
    
    const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

    // Show error toast if there's an error
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleToggle = async () => {
        if (!isSupported) {
            toast.error('Push notifications are not supported in your browser');
            return;
        }

        if (permission === 'denied') {
            toast.error('Notification permission was denied. Please enable it in your browser settings.');
            setShowPermissionPrompt(true);
            return;
        }

        await toggle();
        
        if (isSubscribed) {
            toast.success('Notifications disabled');
        } else {
            toast.success('Notifications enabled!');
        }
    };

    return (
        <main className="w-full px-4 py-4">
            <p className="text-sm font-semibold text-(--pry-clr) capitalize mb-3 px-1 pry-ff">
                Insights
            </p>
            <div className="rounded-2xl border border-gray-200 bg-(--txt-clr) overflow-hidden pry-ff">
                
                {/* Push Notification Toggle - iOS Style Switch */}
                <div className="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-(--tet-clr) flex items-center justify-center shrink-0">
                        {isSubscribed ? (
                            <Bell size={18} className="text-white" />
                        ) : (
                            <BellOff size={18} className="text-white" />
                        )}
                    </div>
                    <div className="flex-1">
                        <span className="text-sm font-medium text-gray-800">
                            Push Notifications
                        </span>
                        {!isSupported && (
                            <p className="text-xs text-red-500 mt-0.5">
                                Not supported in this browser
                            </p>
                        )}
                        {permission === 'denied' && (
                            <p className="text-xs text-red-500 mt-0.5">
                                Blocked - check browser settings
                            </p>
                        )}
                        {isLoading && (
                            <p className="text-xs text-gray-500 mt-0.5">
                                Loading...
                            </p>
                        )}
                    </div>
                    
                    {/* Custom Toggle Switch */}
                    <button
                        onClick={handleToggle}
                        disabled={isLoading || !isSupported || permission === 'denied'}
                        className={`
                            relative inline-flex h-7 w-12 items-center rounded-full transition-colors
                            focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2
                            ${isLoading || !isSupported || permission === 'denied' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            ${isSubscribed 
                                ? 'bg-(--tet-clr)' 
                                : 'bg-gray-300'
                            }
                        `}
                    >
                        <span
                            className={`
                                inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform
                                ${isSubscribed ? 'translate-x-6' : 'translate-x-1'}
                            `}
                        />
                    </button>
                </div>

                {/* Existing Insight Items */}
                {insightItems.map(({ label, href, icon: Icon }, index) => (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-4 px-4 py-4 hover:bg-gray-50 transition-colors ${
                            index !== insightItems.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                    >
                        <div className="w-10 h-10 rounded-xl bg-(--tet-clr) flex items-center justify-center shrink-0">
                            <Icon size={18} className="text-white" />
                        </div>
                        <span className="flex-1 text-sm font-medium text-gray-800">{label}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </Link>
                ))}
            </div>

            {/* Permission Denied Helper Modal */}
            {showPermissionPrompt && permission === 'denied' && (
                <div className="fixed inset-0 bg-(--tet-clr) bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                        <h3 className="text-xl font-semibold mb-3">Notifications Blocked</h3>
                        <p className="text-gray-600 mb-4">
                            You&apos;ve blocked notifications for this site. To enable them:
                        </p>
                        <ol className="text-sm text-gray-600 mb-6 list-decimal list-inside space-y-2">
                            <li>Click the lock/info icon in your browser&apos;s address bar</li>
                            <li>Find notification settings</li>
                            <li>Allow notifications for this site</li>
                            <li>Refresh the page and try again</li>
                        </ol>
                        <button
                            onClick={() => setShowPermissionPrompt(false)}
                            className="w-full bg-(--pry-clr) text-white font-medium py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
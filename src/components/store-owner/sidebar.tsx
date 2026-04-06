// src/components/store-owner/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import {
    Store,
    MapPin,
    Package,
    Boxes,
    ArrowLeftRight,
    Users,
    BarChart3,
    FileText,
    ClipboardList,
    LogOut,
    ChevronLeft,
    ChevronRight,
    CreditCard,
} from 'lucide-react';
import Image from 'next/image';
import { useSidebar } from '@/components/sidebar-context';
import { useProfileStore } from '@/store/userStore';
import { logoutOwner } from '@/lib/auth';

const navItems = [
    { label: 'Store',              href: '/dashboard',                icon: Store,          exact: true },
    { label: 'Store and location', href: '/dashboard/store-location', icon: MapPin },
    { label: 'Products',           href: '/dashboard/products',       icon: Package },
    { label: 'Inventory',          href: '/dashboard/inventory',      icon: Boxes },
    // { label: 'Stock transfers',    href: '/dashboard/stock-transfers', icon: ArrowLeftRight },
    { label: 'Manage staff',       href: '/dashboard/staff',          icon: Users },
    // { label: 'Transactions',       href: '/dashboard/transactions',   icon: BarChart3 },
    // { label: 'Reports',            href: '/dashboard/reports',        icon: FileText },
    // { label: 'Audit Log',          href: '/dashboard/audit-log',      icon: ClipboardList },
    // { label: 'Process Sale',            href: '/dashboard/process-sale',        icon: CreditCard },
];

export default function Sidebar() {
    const { collapsed, setCollapsed } = useSidebar();
    const pathname = usePathname();
    const { profile, isLoading, fetchProfile, clearProfile } = useProfileStore();

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const userInitial =
        profile?.name?.charAt(0)?.toUpperCase() ||
        profile?.email?.charAt(0)?.toUpperCase() ||
        'U';

    const displayName = profile?.name || profile?.email || 'User';

    const handleLogout = () => {
        logoutOwner();
        clearProfile();
        window.location.href = '/auth';
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`hidden md:flex fixed top-0 left-0 h-screen ${
                    collapsed ? 'w-20' : 'w-64'
                } bg-(--txt-clr) text-(--pry-clr) flex-col z-40 transition-all duration-300 border-r border-(--sec-clr)`}
            >
                {/* Logo + Toggle */}
                <div
                    className={`flex items-center ${
                        collapsed ? 'justify-center px-4' : 'justify-between px-5'
                    } py-5 border-b border-(--sec-clr)`}
                >
                    {!collapsed && (
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <Image
                                src="/brand-logo.png"
                                alt="Swiftly Logo"
                                width={36}
                                height={36}
                                style={{ width: 'auto', height: '36px' }}
                                className="object-contain rounded-lg"
                            />
                            <span className="text-lg font-bold text-(--pry-clr)" style={{ fontFamily: 'var(--pry-ff)' }}>
                                Swiftly
                            </span>
                        </Link>
                    )}
                    {collapsed && (
                        <Image
                            src="/brand-logo.png"
                            alt="Swiftly Logo"
                            width={36}
                            height={36}
                            style={{ width: 'auto', height: '36px' }}
                            className="object-contain rounded-lg mb-2"
                        />
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-8 h-8 rounded-lg bg-(--acc-clr)/10 hover:bg-(--acc-clr)/20 flex items-center justify-center transition-colors text-(--pry-clr)"
                    >
                        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    {navItems.map(({ label, href, icon: Icon, exact }) => {
                        const isActive = exact ? pathname === href : pathname.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center ${
                                    collapsed ? 'justify-center px-2' : 'gap-3 px-3'
                                } py-2.5 rounded-lg transition-all duration-150 group relative ${
                                    isActive
                                        ? 'bg-(--acc-clr)/15 text-(--pry-clr)'
                                        : 'text-(--sec-clr) hover:text-(--pry-clr) hover:bg-gray-50'
                                }`}
                            >
                                {/* Left bar indicator */}
                                {isActive && !collapsed && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-(--acc-clr)" />
                                )}
                                <Icon className={`w-[18px] h-[18px] shrink-0 ${
                                    isActive ? 'text-(--pry-clr)' : 'text-(--sec-clr) group-hover:text-(--pry-clr)'
                                }`} />
                                {!collapsed && (
                                    <span className={`text-sm ${isActive ? 'font-semibold text-(--pry-clr)' : 'font-medium'}`} style={{ fontFamily: 'var(--sec-ff)' }}>
                                        {label}
                                    </span>
                                )}
                                {collapsed && (
                                    <div className="absolute left-full ml-3 px-2 py-1 bg-(--pry-clr) text-(--txt-clr) text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                        {label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User + Logout */}
                <div className="p-3 border-t border-(--sec-clr) space-y-1">
                    <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-3'} py-2`}>
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-(--acc-clr) flex items-center justify-center font-semibold text-(--pry-clr) text-sm shrink-0">
                            {profile?.photo ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={profile.photo} alt={displayName} className="w-full h-full object-cover" />
                            ) : (
                                <span>{isLoading ? '' : userInitial}</span>
                            )}
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-(--pry-clr) truncate" style={{ fontFamily: 'var(--pry-ff)' }}>
                                    {isLoading ? 'Loading...' : displayName}
                                </p>
                                <p className="text-xs text-(--sec-clr) truncate" style={{ fontFamily: 'var(--sec-ff)' }}>
                                    {profile?.email || ''}
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleLogout}
                        className={`flex items-center ${
                            collapsed ? 'justify-center px-2' : 'gap-3 px-3'
                        } w-full py-2.5 rounded-lg text-(--sec-clr) hover:bg-red-50 hover:text-red-500 transition-all duration-150 cursor-pointer group relative`}
                    >
                        <LogOut className="w-[18px] h-[18px] shrink-0" />
                        {!collapsed && (
                            <span className="text-sm font-medium" style={{ fontFamily: 'var(--sec-ff)' }}>
                                Logout
                            </span>
                        )}
                        {collapsed && (
                            <div className="absolute left-full ml-3 px-2 py-1 bg-(--pry-clr) text-(--txt-clr) text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                Logout
                            </div>
                        )}
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-(--txt-clr) border-t border-(--sec-clr)">
                <div className="flex justify-around items-center py-2 px-2">
                    {navItems.slice(0, 5).map(({ label, href, icon: Icon, exact }) => {
                        const isActive = exact ? pathname === href : pathname.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-200 ${
                                    isActive ? 'text-(--pry-clr)' : 'text-(--sec-clr)'
                                }`}
                            >
                                <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                                    isActive ? 'bg-(--acc-clr)/20' : ''
                                }`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`} style={{ fontFamily: 'var(--sec-ff)' }}>
                                    {label.split(' ')[0]}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Mobile spacer */}
            <div className="md:hidden h-20" />
        </>
    );
}
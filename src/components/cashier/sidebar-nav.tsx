// src/components/store-owner/sidebar-nav.tsx

'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut, CreditCard } from 'lucide-react';
import { useProfileStore } from '@/store/userStore';

export default function SidebarNav() {
    const { profile, fetchProfile } = useProfileStore();
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/auth');
    };

    const userInitial =
        profile?.name?.charAt(0)?.toUpperCase() ||
        profile?.email?.charAt(0)?.toUpperCase() ||
        'U';

    return (
        <header className="flex items-center justify-between bg-(--txt-clr) px-4 md:px-12 pt-4">

            {/* LEFT — Institution logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
                <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image
                        src="/brand-logo.png"
                        alt="Institution logo"
                        width={32}
                        height={32}
                        style={{ width: 'auto', height: '32px' }}
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            {/* RIGHT — User avatar with dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="w-8 h-8 rounded-full overflow-hidden bg-(--acc-clr) flex items-center justify-center font-semibold text-(--pry-clr) text-sm"
                >
                    {profile?.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={profile.photo}
                            alt={profile.name || 'User'}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span>{userInitial}</span>
                    )}
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden">
                        <Link
                            href="/dashboard/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-(--pry-clr) sec-ff hover:bg-gray-50 transition-colors"
                        >
                            <User size={14} className="text-(--pry-clr)/60" />
                            View Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 sec-ff hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={14} />
                            Logout
                        </button>
                    </div>
                )}
            </div>

        </header>
    );
}
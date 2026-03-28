// src/components/store-owner/sidebar-nav.tsx
'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProfileStore } from '@/store/userStore';

export default function SidebarNav() {
    const { profile, fetchProfile } = useProfileStore();

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const userInitial =
        profile?.name?.charAt(0)?.toUpperCase() ||
        profile?.email?.charAt(0)?.toUpperCase() ||
        'U';

    return (
        <header className="flex items-center justify-between bg-(--txt-clr) px-4 md:px-12 pt-4">

            {/* LEFT — Institution logo */}
            <div className="flex items-center gap-2 cursor-pointer" title="Change campus">
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

            {/* RIGHT — User avatar */}
            <div className="flex items-center gap-3">
                <Link href="/dashboard/profile">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-(--acc-clr) flex items-center justify-center font-semibold text-(--pry-clr) text-sm">
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
                    </div>
                </Link>
            </div>

        </header>
    );
}
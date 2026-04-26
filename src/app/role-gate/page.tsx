// src/app/role-gate/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/store/userStore';
import { Loader2 } from 'lucide-react';

export default function RoleGatePage() {
    const router = useRouter();
    const { profile, isLoading, fetchProfile } = useProfileStore();

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (isLoading || !profile) return;

        const role = profile.is_owner ? 'owner' : profile.role.toLowerCase();

        if (role === 'owner') router.replace('/dashboard');
        else if (role === 'store_manager') router.replace('/store-manager/dashboard');
        else if (role === 'cashier') router.replace('/cashier/dashboard');
        else router.replace('/auth');
    }, [profile, isLoading, router]);

    return (
        <main className="flex items-center justify-center min-h-screen bg-(--txt-clr)">
            <div className="flex flex-col items-center gap-3">
                <Loader2 size={28} className="animate-spin text-(--pry-clr)" />
                <p className="text-sm text-(--pry-clr)/50 sec-ff">Setting up your workspace...</p>
            </div>
        </main>
    );
}
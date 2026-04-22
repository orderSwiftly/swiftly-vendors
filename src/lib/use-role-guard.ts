// src/lib/use-role-guard.ts
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/store/userStore';

export function useRoleGuard(allowedRoles: string[]) {
    const router = useRouter();
    const profile = useProfileStore((s) => s.profile);

    useEffect(() => {
        if (!profile) return;

        const role = profile.is_owner ? 'owner' : profile.role.toLowerCase();

        if (!allowedRoles.includes(role)) {
            if (role === 'owner') router.replace('/dashboard');
            else if (role === 'store_manager') router.replace('/cashier/dashboard');
            else if (role === 'cashier') router.replace('/cashier/dashboard');
            else router.replace('/auth');
        }
    }, [profile, allowedRoles, router]);
}
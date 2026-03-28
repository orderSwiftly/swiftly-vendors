// src/store/userStore.ts
import { create } from 'zustand';
import { getProfile } from '@/lib/profile';

interface Profile {
    _id?: string;
    name?: string;
    email?: string;
    photo?: string;
}

interface ProfileStore {
    profile: Profile | null;
    isLoading: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    clearProfile: () => void;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
    profile: null,
    isLoading: false,
    error: null,

    fetchProfile: async () => {
        if (get().profile) return;

        const token = localStorage.getItem('token');
        if (!token) return; // ← silently bail, no error thrown

        set({ isLoading: true, error: null });
        try {
            const data = await getProfile();
            set({ profile: data, isLoading: false });
        } catch (err: unknown) {
            set({
                error: err instanceof Error ? err.message : 'Failed to load profile.',
                isLoading: false,
            });
        }
    },

    clearProfile: () => set({ profile: null, error: null, isLoading: false }),
}));
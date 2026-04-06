// src/lib/profile.ts
import { AxiosError } from "axios";
import { api } from "@/utils/api";

export interface Profile {
    first_name: string;
    last_name: string;
    email: string;
    name: string;
    is_owner: boolean;
    permissions: string[];
}

export const getProfile = async (): Promise<Profile> => {
    try {
        const token = localStorage.getItem('token');
        const response = await api.get('/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to fetch profile.');
        }
        throw new Error('An unexpected error occurred.');
    }
};
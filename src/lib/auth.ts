// src/lib/auth.ts

import { AxiosError } from "axios";
import { api } from "@/utils/api";

export const loginOwner = async (email: string, password: string) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'An error occurred during login.');
        }
        throw new Error('An unexpected error occurred.');
    }
}

export const logoutOwner = () => {
    localStorage.removeItem('token');
};
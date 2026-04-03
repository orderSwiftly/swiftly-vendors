// src/lib/access.ts

import { api } from "@/utils/api";
import { AxiosError } from "axios";

export interface Role {
    id: string;
    name: string;
    permissions: string[];
}

interface GrantAccessBody {
    level: string;
    store_id: string;
    role_ids: string[];
}

export const grantAccess = async (staffId: string, grant: GrantAccessBody): Promise<void> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("No token found");
        }
 
        await api.post(`/staff/${staffId}/access`, { grant }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to grant access.');
        }
        throw new Error('An unexpected error occurred.');
    }
}

export const getRoles = async (): Promise<Role[]> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("No token found");
        }

        const response = await api.get('/roles', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to fetch roles.');
        }
        throw new Error('An unexpected error occurred.');
    }
}
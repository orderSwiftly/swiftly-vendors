// src/lib/access.ts

import { api } from "@/utils/api";
import { AxiosError } from "axios";
export type { Role } from "./role";
export { getRoles } from "./role";

type AllStoresAccess = {
    type: "all_stores";
};

type SpecificStoresAccess = {
    type: "specific_stores";
    store_ids: string[];
};

type OneStoreAccess = {
    type: "one_store";
    store_id: string;
    locations: {
        locked: false;
    } | {
        locked: true;
        location_ids: string[];
    };
};

export type GrantAccessBody = {
    role_id: string;
    access: AllStoresAccess | SpecificStoresAccess | OneStoreAccess;
};

export const grantAccess = async (staffId: string, body: GrantAccessBody): Promise<void> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");

        await api.post(`/staff/${staffId}/access`, body, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to grant access.');
        }
        throw new Error('An unexpected error occurred.');
    }
}

export const revokeAccess = async (staffId: string): Promise<void> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");

        await api.delete(`/staff/${staffId}/access`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to revoke access.');
        }
        throw new Error('An unexpected error occurred.');
    }
}
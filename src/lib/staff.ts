// src/lib/staff.ts

import { api } from "@/utils/api";
import { AxiosError } from "axios";

interface StaffAccess {
    level: string;
    store: {
        id: string;
        name: string;
    };
}

export interface StaffMember {
    id: string;
    name: string;
    email: string | null;
    access: string | null;
}

export interface StaffResponse {
    staff: StaffMember[];
    total: number;
}

export interface InviteStaffBody {
    first_name: string;
    last_name: string;
    email: string;
}

export const inviteStaff = async (people: InviteStaffBody[]): Promise<{ invited: number }> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");

        const response = await api.post('/staff/invite', people, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to send invite.');
        }
        throw new Error('An unexpected error occurred.');
    }
}

export const getStaffs = async (store_id?: string): Promise<{ staff: StaffMember[]; total: number }> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");

        const params = new URLSearchParams();
        if (store_id) params.set('store_id', store_id);

        const response = await api.get(`/staff?${params.toString()}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to fetch staff members.');
        }
        throw new Error('An unexpected error occurred.');
    }
}
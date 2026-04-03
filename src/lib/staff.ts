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
    email: string;
    is_active: boolean;
    access: StaffAccess | null;
}

interface InviteStaffBody {
    name: string;
    email: string;
}

export const inviteStaff = async (staffData: InviteStaffBody) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return ("No token found");

        const response = await api.post('/staff/invite', staffData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to invite staff member.');
        }
        throw new Error('An unexpected error occurred.');
    }
}

export const getStaffs = async (): Promise<StaffMember[]> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("No token found");
        }
 
        const response = await api.get('/staff', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
 
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to fetch staff members.');
        }
        throw new Error('An unexpected error occurred.');
    }
}
// src/lib/role.ts

import { api } from "@/utils/api";
import { AxiosError } from "axios";

export interface Role {
    id: string;
    name: string;
    staff_count: number;
    permissions: string[];
}

export interface RoleDetails {
    id: string;
    name: string;
    permissions: string[];
    staff: {
        id: string;
        name: string;
        email: string | null;
        access_summary: string;
    }[];
}

export interface CreateRoleBody {
    name: string;
    permissions: string[];
}

export const getRoles = async (): Promise<Role[]> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");

        const response = await api.get('/roles', {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to fetch roles.');
        }
        throw new Error('An unexpected error occurred.');
    }
}

export const getRoleDetails = async (roleId: string): Promise<RoleDetails> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");

        const response = await api.get(`/roles/${roleId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to fetch role details.');
        }
        throw new Error('An unexpected error occurred.');
    }
}

export const createRole = async (body: CreateRoleBody): Promise<Role> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");

        // API expects permissions as an object with boolean values
        const permissionsObj = ALL_PERMISSIONS.reduce((acc, perm) => {
            acc[perm] = body.permissions.includes(perm);
            return acc;
        }, {} as Record<string, boolean>);

        const response = await api.post('/roles', {
            name: body.name,
            permissions: permissionsObj,
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to create role.');
        }
        throw new Error('An unexpected error occurred.');
    }
}

export const ALL_PERMISSIONS = [
    "organization__manage",
    "store__manage",
    "location__manage",
    "product__manage",
    "product__list",
    "staff__manage",
    "inventory__adjust",
    "inventory__view",
    "inventory__inflow",
    "sales__process",
] as const;

export const revokeRole = async (roleId: string): Promise<void> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");

        const response = await api.delete(`/roles/${roleId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to revoke role.');
        }
        throw new Error('An unexpected error occurred.');
    }
};
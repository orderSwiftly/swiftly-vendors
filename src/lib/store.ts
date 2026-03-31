// src/lib/store.ts

import { AxiosError } from "axios";
import { api } from "@/utils/api";

interface StoreLocation {
    name: string;
    address: string;
}

interface CreateStoreBody {
    store_name: string;
    locations: StoreLocation[];
}

interface EditStoreNameBody {
    new_name: string;
}

interface EditLocationBody {
    new_name?: string;
    new_address?: string;
}

export const createStore = async (storeData: CreateStoreBody) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return ("No token found");
        const response = await api.post('/stores', storeData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to create store.');
        }
        throw new Error('An unexpected error occurred.');
    }
}

export const getStores = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return ("No token found");

        const response = await api.get('/stores', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to fetch stores.');
        }
        throw new Error('An unexpected error occurred.');
    }
}

export const editStoreName = async (storeId: string, body: EditStoreNameBody) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await api.patch(`/stores/${storeId}`, body, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to edit store name.');
        }
        throw new Error('An unexpected error occurred.');
    }
}

export const editLocation = async (locationId: string, body: EditLocationBody) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await api.patch(`/locations/${locationId}`, body, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to edit location.');
        }
        throw new Error('An unexpected error occurred.');
    }
}

export const deactivateStore = async (storeId: string) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await api.post(`/stores/${storeId}/deactivate`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to deactivate store.');
        }
        throw new Error('An unexpected error occurred.');
    }
}

export const reactivateStore = async (storeId: string) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await api.post(`/stores/${storeId}/activate`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to reactivate store.');
        }
        throw new Error('An unexpected error occurred.');
    }
}

export const deactivateLocation = async (locationId: string) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await api.post(`/locations/${locationId}/deactivate`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to deactivate location.');
        }
        throw new Error('An unexpected error occurred.');
    }
}

export const activateLocation = async (locationId: string) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await api.post(`/locations/${locationId}/activate`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to activate location.');
        }
        throw new Error('An unexpected error occurred.');
    }
}
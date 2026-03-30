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
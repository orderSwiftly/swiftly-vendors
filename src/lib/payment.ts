// src/libs/payment.ts

import { api } from "@/utils/api";
import { AxiosError } from "axios";

// create subaccount interface
export interface CreateSubaccount {
    account_number: string;
    account_bank: string;
}

export const listBanks = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication token not found');
        }
        const response = await api.get('/subaccounts/flutterwave/banks', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to fetch banks');
        }
        throw new Error('An unexpected error occurred');
    }
}

export const resolveAccount = async (accountNumber: string, accountBank: string) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication token not found');

        const response = await api.post('/subaccounts/resolve',
            { account_number: accountNumber, account_bank: accountBank },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to resolve account');
        }
        throw new Error('An unexpected error occurred');
    }
}

export const createSubaccount = async (data: CreateSubaccount) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication token not found');

        const response = await api.post('/subaccounts/create', data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to create subaccount');
        }
        throw new Error('An unexpected error occurred');
    }
}

export const listSubaccounts = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication token not found');

        const response = await api.get('/subaccounts', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Failed to fetch subaccounts');
        }
        throw new Error('An unexpected error occurred');
    }
}
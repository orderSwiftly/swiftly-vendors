// src/lib/auth.ts

import { AxiosError } from "axios";
import { api } from "@/utils/api";

interface SignupData {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
}

export const signupOwner = async (data: SignupData) => {
    try {
        const response = await api.post('/auth/owners/register', data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'An error occurred during signup.');
        }
        throw new Error('An unexpected error occurred.');
    }
}

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

export const requestOtp = async (email: string) => {
    try {
        const response = await api.post('/otp/request', { email });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'An error occurred while requesting OTP.');
        }
        throw new Error('An unexpected error occurred.');
    }
}

export const verifyOtp = async (email: string, code: string) => {
    try {
        const response = await api.post('/otp/verify', { email, code });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'An error occurred while verifying OTP.');
        }
        throw new Error('An unexpected error occurred.');
    }
}

export const resetPassword = async (new_password: string, confirm_password: string, otpToken: string) => {
    try {
        const response = await api.post('/auth/reset-password', { new_password, confirm_password }, {
            headers: {
                Authorization: `Bearer ${otpToken}`,
            }
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'An error occurred while resetting password.');
        }
        throw new Error('An unexpected error occurred.');
    }
}
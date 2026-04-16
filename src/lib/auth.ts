// src/lib/auth.ts

import axios, { AxiosError } from "axios";
import { api } from "@/utils/api";

interface SignupData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
    phone: string;
}

// Define possible error response shapes
interface ErrorResponse {
    title?: string;
    message?: string;
    error?: string;
    detail?: string;
    errors?: Record<string, string[]>;
}

// Type guard to check if error has message property
function hasMessage(error: unknown): error is { message: string } {
    return typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: unknown }).message === 'string';
}

// Type guard to check if error has title property
function hasTitle(error: unknown): error is { title: string } {
    return typeof error === 'object' && error !== null && 'title' in error && typeof (error as { title: unknown }).title === 'string';
}

// Type guard to check if error has error property
function hasError(error: unknown): error is { error: string } {
    return typeof error === 'object' && error !== null && 'error' in error && typeof (error as { error: unknown }).error === 'string';
}

// Type guard to check if error has detail property
function hasDetail(error: unknown): error is { detail: string } {
    return typeof error === 'object' && error !== null && 'detail' in error && typeof (error as { detail: unknown }).detail === 'string';
}

// Type guard to check if error has errors property
function hasErrors(error: unknown): error is { errors: Record<string, string[]> } {
    return typeof error === 'object' && error !== null && 'errors' in error && typeof (error as { errors: unknown }).errors === 'object';
}

export const signupOwner = async (data: SignupData) => {
    try {
        const response = await api.post('/auth/owners/register', data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorData = error.response?.data as ErrorResponse;
            
            let message = 'An error occurred during signup.';
            
            if (errorData) {
                if (hasTitle(errorData)) {
                    message = errorData.title;
                } else if (hasMessage(errorData)) {
                    message = errorData.message;
                } else if (hasError(errorData)) {
                    message = errorData.error;
                } else if (hasDetail(errorData)) {
                    message = errorData.detail;
                } else if (hasErrors(errorData)) {
                    // Handle field-specific errors
                    const errorMessages = Object.values(errorData.errors).flat();
                    message = errorMessages.join(', ');
                }
            } else if (error.message) {
                message = error.message;
            }
            
            throw new Error(message);
        }
        throw new Error('An unexpected error occurred.');
    }
}

// login
export class LoginError extends Error {
    constructor(message: string, public statusCode?: number) {
        super(message);
        this.name = "LoginError";
    }
}

export const loginOwner = async (email: string, password: string) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorData = error.response?.data as ErrorResponse;
            
            let message = 'An error occurred during login.';
            
            if (errorData) {
                if (hasTitle(errorData)) {
                    message = errorData.title;
                } else if (hasMessage(errorData)) {
                    message = errorData.message;
                } else if (hasError(errorData)) {
                    message = errorData.error;
                } else if (hasDetail(errorData)) {
                    message = errorData.detail;
                }
            } else if (error.message) {
                message = error.message;
            }
            
            throw new Error(message);
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
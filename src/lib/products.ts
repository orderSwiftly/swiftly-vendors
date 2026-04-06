// src/lib/products.ts

import { api } from "@/utils/api";
import { AxiosError } from "axios";

// fetch products by store
export interface Product {
    id: string;
    name: string;
    sku: string;
    price: string;
    category: string;
    is_active: boolean;
    images_url: string[];
}

export interface ProductResponse {
    data: Product[];
    total: number;
}

export const fetchProductsByStore = async (
    storeId: string,
    page = 1,
    search = "",
): Promise<ProductResponse> => {
    try {
        const token = localStorage.getItem("token");
        const params = new URLSearchParams({
            page: page.toString(),
            limit: "10",
        });
        if (search) {
            params.append("search", search);
        }
        const response = await api.get(`/stores/${storeId}/products?${params}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to fetch products");
        }
        throw new Error("An unexpected error occurred.");
    }
};

// create product
export interface ProductInput {
    name: string;
    sku: string;
    price: number;
    category: string;
    status?: boolean;
}

export const createProduct = async (
    storeId: string,
    productData: ProductInput,
): Promise<void> => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.post(`/stores/${storeId}/products`, productData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to create product.");
        }
        throw new Error("An unexpected error occurred.");
    }
};

// edit product
export const editProduct = async (
    productId: string,
    productData: ProductInput,
): Promise<void> => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.patch(`/products/${productId}`, productData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to edit product.");
        }
        throw new Error("An unexpected error occurred.");
    }
};

// upload product
export const uploadProductImage = async (
    productId: string,
    files: File[],
): Promise<void> => {
    try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        files.forEach((file) => formData.append("photo", file));
        const response = await api.patch(`/products/${productId}/images`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to upload image.");
        }
        throw new Error("An unexpected error occurred.");
    }
};
// src/lib/inventory.ts

import { api } from "@/utils/api";
import { AxiosError } from "axios";

export interface InventoryItem {
    product_id: string;
    name: string;
    sku: string;
    price: string;
    category: string;
    is_active: boolean;
    current_stock: number;
    last_adjusted: string;
}

export interface InventoryResponse {
    data: InventoryItem[];
    location_name: string;
    total: number;
}

export interface StockAdjustment {
    adjusted_quantity: number;
    reason: string;
}

export const fetchInventoryByLocation = async (
    locationId: string,
    page = 1,
    search = "",
): Promise<InventoryResponse> => {
    try {
        const token = localStorage.getItem("token");
        const params = new URLSearchParams({
            page: page.toString(),
            limit: "10",
        });
        if (search) {
            params.append("search", search);
        }
        const response = await api.get(`/locations/${locationId}/inventory?${params}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to fetch inventory.");
        }
        throw new Error("An unexpected error occurred.");
    }
};

export const adjustStock = async (
    locationId: string,
    productId: string,
    adjustmentData: StockAdjustment,
): Promise<void> => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.post(
            `/inventory/${locationId}/${productId}/adjust`,
            adjustmentData,
            {
                headers: { Authorization: `Bearer ${token}` },
            },
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to adjust stock.");
        }
        throw new Error("An unexpected error occurred.");
    }
};
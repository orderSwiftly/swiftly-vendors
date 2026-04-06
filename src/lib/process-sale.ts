// src/lib/process-sale.ts

import { api } from "@/utils/api";
import { AxiosError } from "axios";

export interface SaleItem {
    product_id: string;
    quantity: number;
}

export interface ProcessSaleInput {
    items: SaleItem[];
}

export interface ProcessSaleResponse {
    sale_id: string;
}

export const processSale = async (
    locationId: string,
    saleData: ProcessSaleInput,
): Promise<ProcessSaleResponse> => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.post(`/locations/${locationId}/sales`, saleData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to process sale.");
        }
        throw new Error("An unexpected error occurred.");
    }
};
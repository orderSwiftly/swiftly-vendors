import { api } from "@/utils/api";
import { AxiosError } from "axios";

export interface OrderItem {
    productId: string;
    title: string;
    price: string;
    quantity: number;
    lineTotal: number;
    productOwnerId: string;
    productImg: string[];
}

export interface OrderPricing {
    subtotal: number;
    serviceFee: number;
    deliveryFee: number;
    total: number;
}

export interface ShippingAddress {
    building: string;
    room: string;
    institutionId: string;
}

export interface Order {
    _id: string;
    userId: string;
    store_id: string;
    store_name: string;
    store_address: string;
    reservation_group_id: string;
    items: OrderItem[];
    pricing: OrderPricing;
    shippingAddress: ShippingAddress;
    orderStatus: "pending" | "confirmed" | "shipped" | "awaiting_verification" | "verified" | "delivered" | "collected";
    paymentStatus: "paid" | "unpaid";
    createdAt: string;
    paystackReference: string;
    confirmed: boolean;
    deliveryCode: number;
    escrowStatus: "held" | "released";
    paymentConfirmedAt: string;
}

export const getOrders = async (storeId: string): Promise<Order[]> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        const response = await api.get(`/stores/${storeId}/orders`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.orders ?? [];
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        throw new Error(error.response?.data?.message || "Failed to fetch orders.");
    }
};

export const shipOrder = async (orderId: string): Promise<void> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        await api.patch(`/orders/${orderId}/ship`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        throw new Error(error.response?.data?.message || "Failed to ship order.");
    }
};


export const getOrderById = async (orderId: string): Promise<Order | null> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        
        const response = await api.get(`/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        
        return response.data.order || response.data;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        console.error('Error fetching order:', error.response?.data?.message || error.message);
        return null;
    }
};
// src/components/orders/get-confirmed-orders.tsx

// src/components/orders/get-confirmed-orders.tsx

"use client";

import { useEffect, useState } from "react";
import { getConfirmedOrders, Order } from "@/lib/order";
import { useOrderStore } from "@/store/orderStore";
import Spinner from "@/components/ui/spinner";
import { ShoppingBag } from "lucide-react";

export default function GetConfirmedOrders() {
    const { storeId } = useOrderStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!storeId) return;
            setLoading(true);
            setError(null);
            try {
                const data = await getConfirmedOrders(storeId);
                setOrders(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch confirmed orders.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [storeId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return <p className="text-red-500 text-sm px-4">{error}</p>;
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                    <ShoppingBag size={22} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-500">No confirmed orders yet</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 px-4 py-4">
            {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
            ))}
        </div>
    );
}

function OrderCard({ order }: Readonly<{ order: Order }>) {
    const firstItem = order.items[0];
    const itemCount = order.items.length;

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    })}
                </p>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
                    Confirmed
                </span>
            </div>

            {/* Items preview */}
            <div className="flex items-center gap-3">
                {firstItem?.productImg?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={firstItem.productImg[0]}
                        alt={firstItem.title}
                        className="w-14 h-14 rounded-lg object-cover shrink-0 border border-gray-100"
                    />
                )}
                <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{firstItem?.title}</p>
                    {itemCount > 1 && (
                        <p className="text-xs text-gray-400">+{itemCount - 1} more item{itemCount - 1 !== 1 ? "s" : ""}</p>
                    )}
                    <p className="text-xs text-gray-400">Qty: {firstItem?.quantity}</p>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-gray-400">Delivery to</p>
                    <p className="text-sm font-medium text-gray-700">
                        {order.shippingAddress.building}, Room {order.shippingAddress.room}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="text-sm font-semibold text-gray-800">
                        ₦{order.pricing.total.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Delivery code */}
            <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2 flex items-center justify-between">
                <p className="text-xs text-gray-400">Delivery Code</p>
                <p className="text-sm font-bold text-gray-800 tracking-widest">{order.deliveryCode}</p>
            </div>
        </div>
    );
}
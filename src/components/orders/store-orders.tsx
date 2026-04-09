"use client";

import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Store } from "@/lib/store";
import { getOrders, Order } from "@/lib/order";
import OrderTab from "./order-tab";

function getInitials(name: string) {
    return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

interface StoreOrdersProps {
    store: Store;
    colorClass: string;
    onBack: () => void;
}

interface OrdersState {
    storeId: string;
    data: Order[];
    error: string | null;
    fetched: boolean;
}

export default function StoreOrders({ store, colorClass, onBack }: Readonly<StoreOrdersProps>) {
    const [ordersState, setOrdersState] = useState<OrdersState>({
        storeId: store.id,
        data: [],
        error: null,
        fetched: false,
    });

    const displayName = store.store_name ?? store.name;

    const isCurrent = ordersState.storeId === store.id;
    const loading = !isCurrent || !ordersState.fetched;
    const orders = isCurrent ? ordersState.data : [];
    const error = isCurrent ? ordersState.error : null;

    useEffect(() => {
        getOrders(store.id)
            .then(data => setOrdersState({ storeId: store.id, data, error: null, fetched: true }))
            .catch(err => setOrdersState({ storeId: store.id, data: [], error: err.message, fetched: true }));
    }, [store.id]);

    return (
        <div className="w-full">
            {/* back button */}
            <button
                onClick={onBack}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6 pry-ff"
            >
                <ChevronLeft size={16} />
                All stores
            </button>

            {/* store header */}
            <div className="flex items-center justify-between mb-6 sec-ff">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold ${colorClass}`}>
                        {getInitials(displayName)}
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-800">{displayName}</h1>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {loading
                                ? "Loading orders..."
                                : `${orders.length} order${orders.length !== 1 ? "s" : ""}`
                            }
                        </p>
                    </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    store.is_active
                        ? "border border-green-200 text-green-700"
                        : "border border-red-200 text-red-500"
                }`}>
                    {store.is_active ? "Active" : "Inactive"}
                </span>
            </div>

            <OrderTab orders={orders} loading={loading} error={error} />
        </div>
    );
}
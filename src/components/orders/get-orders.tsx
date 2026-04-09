// src/components/orders/get-orders.tsx

"use client";

import { useState } from "react";
import { Store } from "@/lib/store";
import StoreList from "./storeList";
import StoreOrders from "@/components/orders/store-orders";

interface SelectedStore {
    store: Store;
    colorClass: string;
}

export default function GetOrdersComponent() {
    const [selected, setSelected] = useState<SelectedStore | null>(null);

    if (selected) {
        return (
            <StoreOrders
                store={selected.store}
                colorClass={selected.colorClass}
                onBack={() => setSelected(null)}
            />
        );
    }

    return (
        <StoreList
            onSelectStore={(store, colorClass) => setSelected({ store, colorClass })}
        />
    );
}
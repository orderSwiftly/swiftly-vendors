// src/components/orders/ship-btn.tsx

"use client";

import { useState } from "react";
import { PackageCheckIcon } from "lucide-react";
import { shipOrder } from "@/lib/order";
import { toast } from "sonner";

interface ShipBtnProps {
    orderId: string;
    onShipped: () => void;
}

export default function ShipBtn({ orderId, onShipped }: Readonly<ShipBtnProps>) {
    const [shipping, setShipping] = useState(false);

    const handleShip = async () => {
        setShipping(true);
        try {
            await shipOrder(orderId);
            onShipped();
            toast.success("Order has been prepared.");
        } catch {
            toast.error("Failed to prepare order. Please try again.");
        } finally {
            setShipping(false);
        }
    };

    return (
        <button
            onClick={handleShip}
            disabled={shipping}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
            <PackageCheckIcon size={13} className={shipping ? "animate-pulse" : ""} />
            {shipping ? "Preparing" : "Order Prepared"}
        </button>
    );
}
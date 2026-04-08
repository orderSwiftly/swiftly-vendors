// src/dashboard/orders/page.tsx

import type { Metadata } from "next";
import OrderTab from "@/components/orders/order-tab";

export const metadata: Metadata = {
  title: "Orders",
};

export default function OrdersPage() {
    return (
        <main className="flex items-start justify-center w-full min-h-screen p-8">
            <OrderTab />
        </main>
    );
}
// src/dashboard/orders/page.tsx

import type { Metadata } from "next";
import GetOrdersPage from "./get-orders/page";

export const metadata: Metadata = {
  title: "Orders",
};

export default function OrdersPage() {
    return (
        <main className="flex items-start justify-center w-full min-h-screen p-8 mb-20">
            <GetOrdersPage />
        </main>
    );
}
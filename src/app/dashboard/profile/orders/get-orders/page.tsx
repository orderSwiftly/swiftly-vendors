// src/app/dashboard/profile/orders/get-orders/page.tsx
import GetOrdersComponent from "@/components/orders/get-orders";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Orders",
};

export default function GetOrdersPage() {
    return <GetOrdersComponent />
}
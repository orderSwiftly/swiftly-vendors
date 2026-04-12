// src/app/dashboard/profile/orders/[orderId]/page.tsx

import OrderDetailsClient from "./client";

interface PageProps {
    params: Promise<{
        orderId: string;
    }>;
}

export default async function OrderDetailsPage({ params }: PageProps) {
    const { orderId } = await params;
    
    // Just pass the orderId to the client component
    return <OrderDetailsClient orderId={orderId} />;
}
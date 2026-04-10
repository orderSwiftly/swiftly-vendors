// src/app/dashboard/profile/wallet/page.tsx

import PaymentCard from "@/components/payment/payment-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Wallet",
};

export default function WalletPage() {
    return (
        <main className="w-full min-h-screen p-6 sm:p-8 lg:p-10">
            <div className="w-full max-w-4xl mx-auto">
                <PaymentCard />
            </div>
        </main>
    );
}
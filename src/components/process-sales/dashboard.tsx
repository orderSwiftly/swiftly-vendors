// src/app/dashboard/page.tsx

"use client";
import { ShoppingCart, Package } from "lucide-react";

export default function Dashboard() {
    const today = new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Alfa Hostel · {today}</p>

            <div className="grid grid-cols-2 gap-4">
                <ActionCard
                    icon={<ShoppingCart size={24} className="text-green-600" />}
                    title="Process sale"
                    description="Scan or search to complete a transaction"
                    onClick={() => {}}
                />
                <ActionCard
                    icon={<Package size={24} className="text-green-600" />}
                    title="Record stock inflow"
                    description="Log new inventory received here"
                    onClick={() => {}}
                />
            </div>
        </div>
    );
}

function ActionCard({
    icon,
    title,
    description,
    onClick,
}: Readonly<{
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}>) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col gap-3 p-5 bg-white border border-gray-200 rounded-xl text-left hover:bg-gray-50 transition-colors cursor-pointer"
        >
            <div className="p-2 bg-green-50 rounded-lg w-fit">
                {icon}
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-800">{title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{description}</p>
            </div>
        </button>
    );
}
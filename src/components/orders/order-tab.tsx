// src/components/orders/order-tab.tsx

"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import GetConfirmedOrders from "./get-confirmed-orders";

const tabs = ["Orders", "Active Orders", "Delivered Orders"] as const;
type Tab = typeof tabs[number];

function EmptyState({ message }: Readonly<{ message: string }>) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center sec-ff">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                <Package size={22} className="text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">{message}</p>
        </div>
    );
}

export default function OrderTab() {
    const [activeTab, setActiveTab] = useState<Tab>("Orders");

    return (
        <div className="w-full pry-ff">
            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex items-center justify-center">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 text-sm font-medium transition-all duration-150 border-b-2 -mb-px whitespace-nowrap ${
                                activeTab === tab
                                    ? "border-(--acc-clr) text-(--pry-clr)"
                                    : "border-transparent text-gray-400 hover:text-(--pry-clr)"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="w-full">
                {activeTab === "Orders" && (
                    <EmptyState message="You have no pending orders" />
                )}
                {activeTab === "Active Orders" && (
                    <GetConfirmedOrders />
                )}
                {activeTab === "Delivered Orders" && (
                    <EmptyState message="You have no delivered orders" />
                )}
            </div>
        </div>
    );
}
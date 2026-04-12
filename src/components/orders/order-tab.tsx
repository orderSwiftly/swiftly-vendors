// src/components/orders/order-tab.tsx

"use client";

import { useState } from "react";
import { Package, ShoppingBag, MapPin, Hash } from "lucide-react";
import { Order } from "@/lib/order";
import Spinner from "../ui/spinner";
import ShipBtn from "./ship-btn";
import Link from "next/link";

// ─── tab definitions ──────────────────────────────────────────────────────────

const TABS = ["Orders", "Active Orders", "Delivered"] as const;
type Tab = typeof TABS[number];

const PENDING_STATUSES   = new Set(["pending"]);
const ACTIVE_STATUSES    = new Set(["confirmed", "shipped", "collected", "awaiting_verification", "verified"]);
const DELIVERED_STATUSES = new Set(["delivered"]);

function filterByTab(orders: Order[], tab: Tab): Order[] {
    if (tab === "Orders")        return orders.filter(o => PENDING_STATUSES.has(o.orderStatus));
    if (tab === "Active Orders") return orders.filter(o => ACTIVE_STATUSES.has(o.orderStatus));
    if (tab === "Delivered")     return orders.filter(o => DELIVERED_STATUSES.has(o.orderStatus));
    return orders;
}

const EMPTY_MESSAGES: Record<Tab, string> = {
    "Orders":        "No pending orders",
    "Active Orders": "No active orders",
    "Delivered":     "No delivered orders",
};

// ─── status config ────────────────────────────────────────────────────────────

export const ORDER_STATUS_STYLES: Record<string, { bar: string; dot: string; badge: string }> = {
    pending:               { bar: "border-amber-200 text-amber-700",     dot: "bg-amber-400",   badge: "border-amber-200 text-amber-700 bg-amber-50" },
    confirmed:             { bar: "border-green-200 text-green-700",     dot: "bg-green-400",   badge: "border-green-200 text-green-700 bg-green-50" },
    shipped:               { bar: "border-blue-200 text-blue-700",       dot: "bg-blue-400",    badge: "border-blue-200 text-blue-700 bg-blue-50" },
    awaiting_verification: { bar: "border-amber-200 text-amber-700",     dot: "bg-amber-400",   badge: "border-amber-200 text-amber-700 bg-amber-50" },
    verified:              { bar: "border-teal-200 text-teal-700",       dot: "bg-teal-400",    badge: "border-teal-200 text-teal-700 bg-teal-50" },
    delivered:             { bar: "border-emerald-200 text-emerald-700", dot: "bg-emerald-400", badge: "border-emerald-200 text-emerald-700 bg-emerald-50" },
    collected:             { bar: "border-purple-200 text-purple-700",   dot: "bg-purple-400",  badge: "border-purple-200 text-purple-700 bg-purple-50" },
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
    pending:               "Awaiting payment from customer",
    confirmed:             "Payment received — order confirmed",
    shipped:               "Order prepared and dispatched to rider",
    awaiting_verification: "Rider nearby — awaiting customer verification",
    verified:              "Customer verified the rider",
    collected:             "Rider has collected the order",
    delivered:             "Order successfully delivered to customer",
};

// ─── status badge ─────────────────────────────────────────────────────────────

const STATUS_BADGE_LABELS: Record<string, string> = {
    pending:               "Pending",
    confirmed:             "Confirmed",
    shipped:               "Shipped",
    awaiting_verification: "Awaiting Verification",
    verified:              "Verified",
    collected:             "Collected",
    delivered:             "Delivered",
};

function StatusBadge({ status }: { status: string }) {
    const config = ORDER_STATUS_STYLES[status] ?? { badge: "border-gray-200 text-gray-500 bg-gray-50" };
    const label  = STATUS_BADGE_LABELS[status] ?? status.replace(/_/g, " ");
    return (
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${config.badge}`}>
            {label}
        </span>
    );
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency", currency: "NGN", minimumFractionDigits: 0,
    }).format(n);
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-NG", {
        day: "numeric", month: "short", year: "numeric",
    });
}

function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-NG", {
        hour: "2-digit", minute: "2-digit",
    });
}

// ─── order card ───────────────────────────────────────────────────────────────

function OrderCard({ order, onRefresh }: Readonly<{ order: Order; onRefresh: () => void }>) {
    const statusConfig = ORDER_STATUS_STYLES[order.orderStatus] ?? { bar: "border-gray-200 text-gray-500", dot: "bg-gray-300", badge: "border-gray-200 text-gray-500 bg-gray-50" };
    const statusLabel  = ORDER_STATUS_LABELS[order.orderStatus] ?? order.orderStatus.replace(/_/g, " ");
    const shortId      = order._id.slice(-8).toUpperCase();
    const totalQty     = order.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="bg-(--txt-clr) border border-gray-200 rounded-xl overflow-hidden hover:border-(--sec-clr) hover:shadow-sm transition-all">

            {/* ── top strip: status dot + label + time ── */}
            <div className={`flex items-center justify-between px-4 py-2 border-b ${statusConfig.bar}`}>
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusConfig.dot}`} />
                    <span className="text-xs font-medium">{statusLabel}</span>
                </div>
                <span className="text-[11px] text-gray-400">{formatTime(order.createdAt)}</span>
            </div>

            {/* ── main row ── */}
            <div className="flex items-stretch">

                {/* product images — stacked thumbnails */}
                <div className="w-20 flex-shrink-0 flex flex-col">
                    {order.items.slice(0, 2).map((item, i) => (
                        item.productImg?.[0] ? (
                            <img
                                key={i}
                                src={item.productImg[0]}
                                alt={item.title}
                                className="flex-1 w-full object-cover"
                                style={{ borderBottom: i === 0 && order.items.length > 1 ? "2px solid white" : "none" }}
                            />
                        ) : (
                            <div key={i} className="flex-1 w-full border-r border-gray-100 flex items-center justify-center">
                                <Package size={18} className="text-gray-200" />
                            </div>
                        )
                    ))}
                    {order.items.length === 0 && (
                        <div className="flex-1 w-full border-r border-gray-100 flex items-center justify-center">
                            <Package size={18} className="text-gray-200" />
                        </div>
                    )}
                </div>

                {/* content */}
                <div className="flex-1 min-w-0 p-3 flex flex-col justify-between gap-2">

                    {/* row 1: items + qty */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            {order.items.map((item, i) => (
                                <p key={i} className="text-sm font-semibold text-gray-800 truncate leading-snug">
                                    {item.title}
                                    <span className="text-gray-400 font-normal"> × {item.quantity}</span>
                                </p>
                            ))}
                        </div>
                        <span className="flex-shrink-0 text-[11px] font-semibold border border-gray-200 text-gray-500 rounded-full px-2 py-0.5 whitespace-nowrap">
                            {totalQty} item{totalQty !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* row 2: delivery address */}
                    {order.shippingAddress && (
                        <div className="flex items-center gap-1.5">
                            <MapPin size={11} className="text-gray-300 flex-shrink-0" />
                            <p className="text-xs text-gray-400 truncate">
                                {order.shippingAddress.building}
                                {order.shippingAddress.room ? `, Room ${order.shippingAddress.room}` : ""}
                            </p>
                        </div>
                    )}

                    {/* row 3: price + payment */}
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-gray-800">
                            {formatCurrency(order.pricing.total)}
                        </p>
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                            order.paymentStatus === "paid"
                                ? "border-green-200 text-green-700"
                                : "border-red-200 text-red-500"
                        }`}>
                            {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── footer: order id + date + status badge + action ── */}
<div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 gap-3">
    <div className="flex items-center gap-1.5 min-w-0">
        <Hash size={11} className="text-gray-300 flex-shrink-0" />
        <span className="text-[11px] font-mono text-gray-400">{shortId}</span>
        <span className="text-gray-200 text-xs mx-1">·</span>
        <span className="text-[11px] text-gray-400 flex-shrink-0">{formatDate(order.createdAt)}</span>
    </div>

    <div className="flex items-center gap-2 flex-shrink-0">
        <StatusBadge status={order.orderStatus} />
        
        {/* Add View Details link */}
        <Link
            href={`/dashboard/profile/orders/${order._id}`}
            className="text-[11px] font-medium px-2 py-0.5 rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
        >
            View Details
        </Link>
        
        {order.orderStatus === "confirmed" && (
            <ShipBtn orderId={order._id} onShipped={onRefresh} />
        )}
    </div>
</div>
        </div>
    );
}

// ─── empty state ──────────────────────────────────────────────────────────────

function EmptyState({ message }: Readonly<{ message: string }>) {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center">
                <ShoppingBag size={22} className="text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">{message}</p>
        </div>
    );
}

// ─── component ───────────────────────────────────────────────────────────────

interface OrderTabProps {
    orders: Order[];
    loading: boolean;
    error: string | null;
    onRefresh: () => void;
}

export default function OrderTab({ orders, loading, error, onRefresh }: Readonly<OrderTabProps>) {
    const [activeTab, setActiveTab] = useState<Tab>("Orders");
    const tabOrders = filterByTab(orders, activeTab);

    return (
        <div className="w-full pry-ff">
            {/* tab bar */}
            <div className="border-b border-gray-200 mb-5">
                <div className="flex items-center">
                    {TABS.map(tab => {
                        const count = filterByTab(orders, tab).length;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 text-sm font-medium transition-all duration-150 border-b-2 -mb-px whitespace-nowrap flex items-center justify-center gap-1.5 ${
                                    activeTab === tab
                                        ? "border-(--acc-clr) text-(--prof-clr)"
                                        : "border-transparent text-gray-400 hover:text-(--pry-clr)"
                                }`}
                            >
                                {tab}
                                {!loading && count > 0 && (
                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
                                        activeTab === tab
                                            ? "border-(--acc-clr) text-(--pry-clr)"
                                            : "border-gray-200 text-gray-400"
                                    }`}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* content */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Spinner />
                </div>
            ) : error ? (
                <p className="text-red-500 text-sm">{error}</p>
            ) : tabOrders.length === 0 ? (
                <EmptyState message={EMPTY_MESSAGES[activeTab]} />
            ) : (
                <div className="flex flex-col gap-3">
                    {tabOrders.map(order => (
                        <OrderCard key={order._id} order={order} onRefresh={onRefresh} />
                    ))}
                </div>
            )}
        </div>
    );
}
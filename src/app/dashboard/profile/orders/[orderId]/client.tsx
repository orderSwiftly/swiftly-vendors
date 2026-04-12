// src/app/dashboard/profile/orders/[orderId]/client.tsx

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, Package, MapPin, Hash, CreditCard, Truck, Store } from "lucide-react";
import { getOrderById, Order } from "@/lib/order";
import Spinner from "@/components/ui/spinner";

interface OrderDetailsClientProps {
    orderId: string;
}

function formatCurrency(n: number) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency", currency: "NGN", minimumFractionDigits: 0,
    }).format(n);
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-NG", {
        day: "numeric", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

export default function OrderDetailsClient({ orderId }: Readonly<OrderDetailsClientProps>) {
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const data = await getOrderById(orderId);
                setOrder(data);
            } catch (err) {
                console.error('Error fetching order:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch order');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="text-red-500">{error || 'Order not found'}</p>
                <button
                    onClick={() => router.back()}
                    className="text-blue-500 hover:text-blue-600"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const shortId = order._id.slice(-8).toUpperCase();
    const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-6 sec-ff mb-20">
            {/* back button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6 pry-ff"
            >
                <ChevronLeft size={16} />
                Back to orders
            </button>

            {/* order header */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {/* Store info */}
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2">
                        <Store size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{order.store_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{order.store_address}</span>
                    </div>

                </div>

                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 mb-1">
                                Order #{shortId}
                            </h1>
                            <p className="text-sm text-gray-500">
                                Placed on {formatDate(order.createdAt)}
                            </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.orderStatus === "delivered" 
                                ? "bg-green-100 text-green-700"
                                : order.orderStatus === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                        }`}>
                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </div>
                    </div>

                    {/* order items */}
                    <div className="border-t border-gray-100 pt-4">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Package size={18} /> Order Items ({totalQty} items)
                        </h3>
                        <div className="space-y-3">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
                                    {item.productImg?.[0] && (
                                        <img 
                                            src={item.productImg[0]} 
                                            alt={item.title}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{item.title}</p>
                                        <p className="text-sm text-gray-500">
                                            {formatCurrency(Number(item.price))} × {item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-semibold text-gray-800">
                                        {formatCurrency(item.lineTotal)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* pricing summary */}
                    <div className="border-t border-gray-100 mt-4 pt-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="text-gray-800">{formatCurrency(order.pricing.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Service Fee</span>
                                <span className="text-gray-800">{formatCurrency(order.pricing.serviceFee)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Delivery Fee</span>
                                <span className="text-gray-800">{formatCurrency(order.pricing.deliveryFee)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100">
                                <span>Total</span>
                                <span>{formatCurrency(order.pricing.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* payment status */}
                    <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CreditCard size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-600">Payment Status:</span>
                        </div>
                        <span className={`text-sm font-medium ${
                            order.paymentStatus === "paid" ? "text-green-600" : "text-red-600"
                        }`}>
                            {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                        </span>
                    </div>

                    {/* delivery address */}
                    {order.shippingAddress && (
                        <div className="border-t border-gray-100 mt-4 pt-4">
                            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <MapPin size={16} /> Delivery Address
                            </h3>
                            <p className="text-sm text-gray-600">
                                {order.shippingAddress.building}
                                {order.shippingAddress.room && `, Room ${order.shippingAddress.room}`}
                            </p>
                        </div>
                    )}

                    {/* tracking info if available */}
                    {order.orderStatus === "shipped" && (
                        <div className="border-t border-gray-100 mt-4 pt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Truck size={16} className="text-blue-500" />
                                <span>Your order is on the way!</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
// src/components/process-sales/process-sale.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2, Search, X, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { getStores, type StoreLocation } from "@/lib/store";
import { fetchInventoryByLocation, type InventoryItem } from "@/lib/inventory";
import { processSale, type SaleItem } from "@/lib/process-sale";

interface CartItem extends InventoryItem {
    quantity: number;
}

type Step = "location" | "sale";

export default function ProcessSale({ onBack }: Readonly<{ onBack?: () => void }>) {
    const [step, setStep] = useState<Step>("location");

    const [locations, setLocations] = useState<StoreLocation[]>([]);
    const [locationsLoading, setLocationsLoading] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState<StoreLocation | null>(null);

    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [inventoryLoading, setInventoryLoading] = useState(false);
    const [search, setSearch] = useState("");

    const [cart, setCart] = useState<CartItem[]>([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        getStores()
            .then((stores) => {
                const allLocations = stores.flatMap((s) => s.locations ?? []);
                setLocations(allLocations);
            })
            .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load locations."))
            .finally(() => setLocationsLoading(false));
    }, []);

    const handleSelectLocation = async (location: StoreLocation) => {
        setSelectedLocation(location);
        setStep("sale");
        setCart([]);
        setInventoryLoading(true);
        try {
            const data = await fetchInventoryByLocation(location.id);
            setInventory(data.data);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to load inventory.");
            setInventory([]);
        } finally {
            setInventoryLoading(false);
        }
    };

    const filteredInventory = useMemo(() => {
        if (!search.trim()) return inventory;
        const q = search.toLowerCase();
        return inventory.filter(
            (item) =>
                item.name.toLowerCase().includes(q) ||
                item.sku.toLowerCase().includes(q) ||
                item.category.toLowerCase().includes(q)
        );
    }, [inventory, search]);

    const addToCart = (item: InventoryItem) => {
        if (item.current_stock === 0) return;
        setCart((prev) => {
            const existing = prev.find((c) => c.product_id === item.product_id);
            if (existing) {
                if (existing.quantity >= item.current_stock) return prev;
                return prev.map((c) =>
                    c.product_id === item.product_id ? { ...c, quantity: c.quantity + 1 } : c
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart((prev) =>
            prev
                .map((c) => c.product_id === productId ? { ...c, quantity: c.quantity + delta } : c)
                .filter((c) => c.quantity > 0)
        );
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((sum, c) => sum + Number(c.price) * c.quantity, 0);

    const handleSubmit = async () => {
        if (!selectedLocation) return;
        if (cart.length === 0) return toast.error("Add at least one item to the cart.");

        const items: SaleItem[] = cart.map((c) => ({
            product_id: c.product_id,
            quantity: c.quantity,
        }));

        try {
            setSubmitting(true);
            const result = await processSale(selectedLocation.id, { items });
            toast.success(`Sale processed! ID: ${result.sale_id}`);
            setCart([]);
            setStep("location");
            setSelectedLocation(null);
            setSearch("");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to process sale.");
        } finally {
            setSubmitting(false);
        }
    };

    // ─── Location Picker ───────────────────────────────────────────────
    if (step === "location") {
        return (
            <div className="w-full flex flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold text-(--pry-clr) sec-ff">Process sale</h1>
                    <p className="text-sm text-(--pry-clr)/50 sec-ff mt-0.5">Select a location to begin.</p>
                </div>

                {locationsLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 size={22} className="animate-spin text-(--pry-clr)" />
                    </div>
                ) : locations.length === 0 ? (
                    <p className="text-sm text-(--pry-clr)/50 sec-ff text-center py-16">No locations found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
                        {locations.map((loc) => (
                            <button
                                key={loc.id}
                                onClick={() => handleSelectLocation(loc)}
                                className="w-full flex flex-col gap-3 p-5 rounded-xl border border-gray-200 hover:border-(--pry-clr)/40 hover:bg-(--pry-clr)/5 transition-all text-left"
                            >
                                <div className="flex items-start justify-between gap-2 w-full">
                                    <p className="text-base font-bold text-(--pry-clr) sec-ff">{loc.name}</p>
                                    <span className={`text-xs px-2 py-1 rounded-md font-medium sec-ff shrink-0 ${
                                        loc.is_active
                                            ? "bg-green-500/10 text-green-600"
                                            : "bg-gray-100 text-gray-500"
                                    }`}>
                                        {loc.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                {loc.address && (
                                    <p className="text-sm text-(--pry-clr)/50 sec-ff">{loc.address}</p>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // ─── Sale Screen ───────────────────────────────────────────────────
    return (
        <div className="w-full flex flex-col gap-4 p-6">
            <div>
                <h1 className="text-2xl font-bold text-(--pry-clr) sec-ff">Process sale</h1>
                <button
                    onClick={() => { setStep("location"); setSelectedLocation(null); setCart([]); setSearch(""); }}
                    className="text-sm text-(--pry-clr)/50 sec-ff hover:text-(--pry-clr) transition-colors mt-0.5"
                >
                    {selectedLocation?.name}
                </button>
            </div>

            <div className="w-full flex flex-col lg:flex-row gap-4 items-start">
                {/* Left — Product Table */}
                <div className="flex-1 w-full rounded-xl border border-gray-200 bg-white overflow-hidden">
                    <div className="p-3 border-b border-gray-100">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products..."
                                className="w-full pl-9 pr-8 py-2 rounded-lg border border-gray-200 text-sm text-(--pry-clr) sec-ff outline-none focus:border-(--pry-clr) transition-colors placeholder:text-gray-400 bg-gray-50"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={13} />
                                </button>
                            )}
                        </div>
                    </div>

                    {inventoryLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 size={20} className="animate-spin text-(--pry-clr)" />
                        </div>
                    ) : filteredInventory.length === 0 ? (
                        <p className="text-sm text-gray-400 sec-ff text-center py-16">
                            {search ? `No products match "${search}".` : "No inventory available."}
                        </p>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 sec-ff">PRICE</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 sec-ff">PRODUCT</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 sec-ff">STOCK</th>
                                    <th className="py-3 px-4" />
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInventory.map((item) => {
                                    const outOfStock = item.current_stock === 0;
                                    return (
                                        <tr key={item.product_id} className={`border-b border-gray-100 last:border-0 ${outOfStock ? "opacity-50" : ""}`}>
                                            <td className="py-3 px-4 text-sm text-(--pry-clr) sec-ff font-medium">
                                                ₦{Number(item.price).toLocaleString()}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-(--pry-clr) sec-ff">{item.name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-400 sec-ff">
                                                {outOfStock ? "Out Of Stock" : `${item.current_stock} units`}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <button
                                                    onClick={() => addToCart(item)}
                                                    disabled={outOfStock}
                                                    className="px-4 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-(--pry-clr) sec-ff hover:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    Add
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Right — Cart */}
                <div className="w-full lg:w-80 shrink-0 rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-4">
                    <h3 className="text-base font-bold text-(--pry-clr) sec-ff">Cart</h3>

                    {cart.length === 0 ? (
                        <p className="text-sm text-gray-400 sec-ff text-center py-8">No items added yet.</p>
                    ) : (
                        <>
                            <div className="flex flex-col gap-3">
                                {cart.map((item) => (
                                    <div key={item.product_id} className="flex items-center justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-(--pry-clr) sec-ff truncate">{item.name}</p>
                                            <p className="text-xs text-gray-400 sec-ff">₦{Number(item.price).toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => updateQuantity(item.product_id, -1)}
                                                className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                            >
                                                <Minus size={11} className="text-(--pry-clr)" />
                                            </button>
                                            <span className="text-sm font-semibold text-(--pry-clr) sec-ff w-4 text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.product_id, 1)}
                                                disabled={item.quantity >= item.current_stock}
                                                className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <Plus size={11} className="text-(--pry-clr)" />
                                            </button>
                                            <span className="text-sm font-semibold text-(--pry-clr) sec-ff w-14 text-right">
                                                ₦{(Number(item.price) * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <span className="text-sm font-bold text-(--pry-clr) sec-ff">Total</span>
                                <span className="text-sm font-bold text-(--pry-clr) sec-ff">
                                    ₦{cartTotal.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={clearCart}
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-(--pry-clr) hover:bg-gray-50 transition-colors sec-ff disabled:opacity-50"
                                >
                                    Clear Cart
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold sec-ff transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                                    style={{ backgroundColor: "#4CAF50", color: "#fff" }}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            Processing…
                                        </>
                                    ) : (
                                        "Confirm Sale"
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
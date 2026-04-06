// src/components/inventory/get-inventory.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2, Search, X, Package } from "lucide-react";
import { toast } from "sonner";
import { fetchInventoryByLocation, type InventoryItem } from "@/lib/inventory";
import AdjustStock from "./adjust-stock";

interface GetInventoryProps {
    locationId: string;
    locationName?: string;
}

const ITEMS_PER_PAGE = 10;

export default function GetInventory({ locationId, locationName }: GetInventoryProps) {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

    const loadInventory = async () => {
        try {
            setLoading(true);
            const data = await fetchInventoryByLocation(locationId);
            setInventory(data.data);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to load inventory.");
            setInventory([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInventory();
    }, [locationId]);

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

    const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);
    const paginated = filteredInventory.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    return (
        <>
            {selectedItem && (
                <AdjustStock
                    item={selectedItem}
                    locationId={locationId}
                    onClose={() => setSelectedItem(null)}
                    onSuccess={() => {
                        setSelectedItem(null);
                        loadInventory();
                    }}
                />
            )}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                        <h2 className="text-lg font-bold text-(--pry-clr) sec-ff">
                            {locationName ? `${locationName} Inventory` : "Inventory"}
                        </h2>
                        <p className="text-sm text-(--pry-clr)/60 sec-ff mt-0.5">
                            {inventory.length} item{inventory.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--pry-clr)/40 pointer-events-none" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        placeholder="Search by name, SKU or category…"
                        className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm text-(--pry-clr) sec-ff outline-none focus:border-(--pry-clr) transition-colors placeholder:text-(--pry-clr)/30"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-(--pry-clr)/40 hover:text-(--pry-clr) transition-colors"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 size={22} className="animate-spin text-(--pry-clr)" />
                    </div>
                ) : filteredInventory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <Package size={32} className="text-(--pry-clr)/20" />
                        <p className="text-sm text-(--pry-clr)/50 sec-ff">
                            {search ? `No items match "${search}".` : "No inventory items found for this location."}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-(--pry-clr)/60 sec-ff">Product</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-(--pry-clr)/60 sec-ff">SKU</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-(--pry-clr)/60 sec-ff">Category</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-(--pry-clr)/60 sec-ff">Price</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-(--pry-clr)/60 sec-ff">Stock</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-(--pry-clr)/60 sec-ff">Last Adjusted</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-(--pry-clr)/60 sec-ff">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginated.map((item) => (
                                        <tr key={item.product_id} className="border-b border-gray-100 hover:bg-(--pry-clr)/5 transition-colors">
                                            <td className="py-3 px-4">
                                                <span className="text-sm font-semibold text-(--pry-clr) sec-ff">{item.name}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-sm text-(--pry-clr)/60 sec-ff">{item.sku}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-xs px-2 py-1 rounded-md bg-blue-500/10 text-blue-600 sec-ff font-medium">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-sm font-medium text-(--pry-clr) sec-ff">
                                                    ₦{Number(item.price).toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`text-xs px-2 py-1 rounded-md font-medium sec-ff ${
                                                    item.current_stock > 0
                                                        ? "bg-green-500/10 text-green-600"
                                                        : "bg-red-500/10 text-red-500"
                                                }`}>
                                                    {item.current_stock} units
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-sm text-(--pry-clr)/50 sec-ff">
                                                    {new Date(item.last_adjusted).toLocaleDateString("en-GB", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <button
                                                    onClick={() => setSelectedItem(item)}
                                                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-(--pry-clr) hover:bg-(--pry-clr)/5 transition-colors sec-ff"
                                                >
                                                    Adjust Stock
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="flex flex-col gap-3 md:hidden">
                            {paginated.map((item) => (
                                <div key={item.product_id} className="p-4 rounded-xl border border-gray-200 flex flex-col gap-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-(--pry-clr) sec-ff">{item.name}</p>
                                            <p className="text-xs text-(--pry-clr)/50 sec-ff mt-0.5">SKU: {item.sku}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-md font-medium sec-ff shrink-0 ${
                                            item.current_stock > 0
                                                ? "bg-green-500/10 text-green-600"
                                                : "bg-red-500/10 text-red-500"
                                        }`}>
                                            {item.current_stock} units
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 flex-wrap gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs px-2 py-1 rounded-md bg-blue-500/10 text-blue-600 sec-ff font-medium">
                                                {item.category}
                                            </span>
                                            <span className="text-sm font-semibold text-(--pry-clr) sec-ff">
                                                ₦{Number(item.price).toLocaleString()}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => setSelectedItem(item)}
                                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-(--pry-clr) hover:bg-(--pry-clr)/5 transition-colors sec-ff"
                                        >
                                            Adjust Stock
                                        </button>
                                    </div>
                                    <p className="text-xs text-(--pry-clr)/40 sec-ff">
                                        Last adjusted:{" "}
                                        {new Date(item.last_adjusted).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-2">
                                <p className="text-xs text-(--pry-clr)/50 sec-ff">
                                    Page {currentPage} of {totalPages} · {filteredInventory.length} total
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-(--pry-clr) hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors sec-ff"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-(--pry-clr) hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors sec-ff"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
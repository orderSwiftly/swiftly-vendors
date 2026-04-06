// src/components/products/get-products.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2, Search, X, Package } from "lucide-react";
import { toast } from "sonner";
import { fetchProductsByStore, type Product } from "@/lib/products";
import CreateProduct from "./create-product";
import EditProduct from "./edit-product";

const ITEMS_PER_PAGE = 10;

interface GetProductsProps {
    storeId: string;
    storeName?: string;
}

export default function GetProducts({ storeId, storeName }: Readonly<GetProductsProps>) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await fetchProductsByStore(storeId);
            setProducts(data.data);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to load products.");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, [storeId]);

    const filteredProducts = useMemo(() => {
        if (!search.trim()) return products;
        const q = search.toLowerCase();
        return products.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.sku.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
        );
    }, [products, search]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
    <p className="text-sm text-(--pry-clr)/60 sec-ff">
        {storeName ? `${storeName} · ` : ""}{products.length} product{products.length !== 1 ? "s" : ""}
    </p>
</div>
            {/* Search + Actions */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-48">
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
                <CreateProduct storeId={storeId} onCreated={loadProducts} />
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 size={22} className="animate-spin text-(--pry-clr)" />
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <Package size={32} className="text-(--pry-clr)/20" />
                    <p className="text-sm text-(--pry-clr)/50 sec-ff">
                        {search ? `No products match "${search}".` : "No products found for this store."}
                    </p>
                    {!search && <CreateProduct storeId={storeId} onCreated={loadProducts} />}
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
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-(--pry-clr)/60 sec-ff">Status</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-(--pry-clr)/60 sec-ff">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProducts.map((product) => (
                                    <tr key={product.id} className="border-b border-gray-100 hover:bg-(--pry-clr)/5 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                {product.images_url?.[0] ? (
                                                    <img
                                                        src={product.images_url[0]}
                                                        alt={product.name}
                                                        className="w-9 h-9 rounded-lg object-cover shrink-0 border border-gray-100"
                                                    />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-lg bg-(--pry-clr)/10 flex items-center justify-center shrink-0">
                                                        <Package size={14} className="text-(--pry-clr)/40" />
                                                    </div>
                                                )}
                                                <span className="text-sm font-semibold text-(--pry-clr) sec-ff">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-(--pry-clr)/60 sec-ff">{product.sku}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-xs px-2 py-1 rounded-md bg-blue-500/10 text-blue-600 sec-ff font-medium">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm font-medium text-(--pry-clr) sec-ff">
                                                ₦{Number(product.price).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`text-xs px-2 py-1 rounded-md font-medium sec-ff ${
                                                product.is_active
                                                    ? "bg-green-500/10 text-green-600"
                                                    : "bg-gray-200 text-gray-500"
                                            }`}>
                                                {product.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td>
                                            <EditProduct product={product} onEdited={loadProducts} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="flex flex-col gap-3 md:hidden">
                        {paginatedProducts.map((product) => (
                            <div key={product.id} className="p-4 rounded-xl border border-gray-200 flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    {product.images_url?.[0] ? (
                                        <img
                                            src={product.images_url[0]}
                                            alt={product.name}
                                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-xl bg-(--pry-clr)/10 flex items-center justify-center shrink-0">
                                            <Package size={18} className="text-(--pry-clr)/40" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-(--pry-clr) sec-ff truncate">{product.name}</p>
                                        <p className="text-xs text-(--pry-clr)/50 sec-ff mt-0.5">SKU: {product.sku}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-md font-medium sec-ff shrink-0 ${
                                        product.is_active
                                            ? "bg-green-500/10 text-green-600"
                                            : "bg-gray-200 text-gray-500"
                                    }`}>
                                        {product.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                    <span className="text-xs px-2 py-1 rounded-md bg-blue-500/10 text-blue-600 sec-ff font-medium">
                                        {product.category}
                                    </span>
                                    <span className="text-sm font-semibold text-(--pry-clr) sec-ff">
                                        ₦{Number(product.price).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-2">
                            <p className="text-xs text-(--pry-clr)/50 sec-ff">
                                Page {currentPage} of {totalPages} · {filteredProducts.length} total
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
    );
}
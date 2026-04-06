// src/components/products/create-product.tsx

"use client";

import { useState } from "react";
import { X, Plus, Loader2, Package, Tag, DollarSign, Hash } from "lucide-react";
import { toast } from "sonner";
import { createProduct, type ProductInput } from "@/lib/products";

interface CreateProductProps {
    storeId: string;
    onCreated?: () => void;
}

const EMPTY_FORM: ProductInput = {
    name: "",
    sku: "",
    price: 0,
    category: "",
    status: true,
};

export default function CreateProduct({ storeId, onCreated }: Readonly<CreateProductProps>) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<ProductInput>(EMPTY_FORM);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleClose = () => {
        setOpen(false);
        setForm(EMPTY_FORM);
    };

    const handleSubmit = async () => {
        if (!form.name.trim()) return toast.error("Product name is required.");
        if (!form.sku.trim()) return toast.error("SKU is required.");
        if (!form.price || Number(form.price) <= 0) return toast.error("A valid price is required.");
        if (!form.category.trim()) return toast.error("Category is required.");

        try {
            setLoading(true);
            await createProduct(storeId, {
                ...form,
                price: Number(form.price),
            });
            toast.success("Product created successfully.");
            handleClose();
            onCreated?.();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to create product.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-(--prof-clr) text-(--txt-clr) text-sm font-semibold sec-ff hover:bg-(--prof-clr)/90 transition-colors cursor-pointer"
            >
                <Plus size={15} />
                Add Product
            </button>

            {open && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 cursor-pointer"
                    onClick={handleClose}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-md p-6 flex flex-col gap-5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-(--pry-clr) sec-ff">New Product</h2>
                                <p className="text-xs text-(--pry-clr)/50 sec-ff mt-0.5">Fill in the details below to add a product.</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={17} className="text-(--pry-clr)/60" />
                            </button>
                        </div>

                        {/* Fields */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-(--pry-clr)/70 sec-ff flex items-center gap-1.5">
                                    <Package size={12} />
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Octopus"
                                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-(--pry-clr) sec-ff outline-none focus:border-(--pry-clr) transition-colors placeholder:text-(--pry-clr)/30"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-(--pry-clr)/70 sec-ff flex items-center gap-1.5">
                                    <Hash size={12} />
                                    SKU
                                </label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={form.sku}
                                    onChange={handleChange}
                                    placeholder="e.g. bread"
                                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-(--pry-clr) sec-ff outline-none focus:border-(--pry-clr) transition-colors placeholder:text-(--pry-clr)/30"
                                />
                            </div>

                            <div className="flex gap-3">
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <label className="text-xs font-semibold text-(--pry-clr)/70 sec-ff flex items-center gap-1.5">
                                        <DollarSign size={12} />
                                        Price
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={form.price || ""}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        min={0}
                                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-(--pry-clr) sec-ff outline-none focus:border-(--pry-clr) transition-colors placeholder:text-(--pry-clr)/30"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <label className="text-xs font-semibold text-(--pry-clr)/70 sec-ff flex items-center gap-1.5">
                                        <Tag size={12} />
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        placeholder="e.g. Food"
                                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-(--pry-clr) sec-ff outline-none focus:border-(--pry-clr) transition-colors placeholder:text-(--pry-clr)/30"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-200">
                                <div>
                                    <p className="text-sm font-semibold text-(--pry-clr) sec-ff">Active</p>
                                    <p className="text-xs text-(--pry-clr)/40 sec-ff">Product will be visible in the store</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="status"
                                        checked={form.status ?? true}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-5 bg-gray-200 peer-checked:bg-(--pry-clr) rounded-full transition-colors" />
                                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                                </label>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-1">
                            <button
                                onClick={handleClose}
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-(--pry-clr) hover:bg-gray-50 transition-colors sec-ff disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 bg-(--prof-clr) text-(--txt-clr) rounded-xl text-sm font-semibold sec-ff hover:bg-(--prof-clr)/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        Creating…
                                    </>
                                ) : (
                                    <>
                                        <Plus size={14} />
                                        Create Product
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
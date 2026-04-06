// src/components/products/edit-product.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { X, Loader2, Package, Tag, DollarSign, Hash, Pencil, ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { editProduct, uploadProductImage, type ProductInput, type Product } from "@/lib/products";

interface EditProductProps {
    product: Product;
    onEdited?: () => void;
}

export default function EditProduct({ product, onEdited }: Readonly<EditProductProps>) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<ProductInput>({
        name: product.name,
        sku: product.sku,
        price: Number(product.price),
        category: product.category,
        status: product.is_active,
    });

    useEffect(() => {
        setForm({
            name: product.name,
            sku: product.sku,
            price: Number(product.price),
            category: product.category,
            status: product.is_active,
        });
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleClose = () => {
        setOpen(false);
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async () => {
        if (!form.name.trim()) return toast.error("Product name is required.");
        if (!form.sku.trim()) return toast.error("SKU is required.");
        if (!form.price || Number(form.price) <= 0) return toast.error("A valid price is required.");
        if (!form.category.trim()) return toast.error("Category is required.");

        try {
            setLoading(true);

            // Run edit and image upload in parallel if there's an image
            const tasks: Promise<void>[] = [
                editProduct(product.id, { ...form, price: Number(form.price) }),
            ];
            if (imageFile) {
                tasks.push(uploadProductImage(product.id, imageFile));
            }

            await Promise.all(tasks);

            toast.success("Product updated successfully.");
            handleClose();
            onEdited?.();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update product.");
        } finally {
            setLoading(false);
        }
    };

    // Current image to show as existing (first image from product)
    const existingImage = product.images_url?.[0];

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-(--pry-clr) hover:bg-(--pry-clr)/5 transition-colors sec-ff"
            >
                <Pencil size={12} />
                Edit
            </button>

            {open && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={handleClose}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-md p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-(--pry-clr) sec-ff">Edit Product</h2>
                                <p className="text-xs text-(--pry-clr)/50 sec-ff mt-0.5">Update the details for {product.name}.</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={17} className="text-(--pry-clr)/60" />
                            </button>
                        </div>

                        {/* Image Upload */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-(--pry-clr)/70 sec-ff flex items-center gap-1.5">
                                <ImagePlus size={12} />
                                Product Image
                            </label>

                            {/* Preview */}
                            {(imagePreview || existingImage) && (
                                <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200">
                                    <img
                                        src={imagePreview ?? existingImage}
                                        alt="Product preview"
                                        className="w-full h-full object-cover"
                                    />
                                    {imagePreview && (
                                        <button
                                            onClick={handleRemoveImage}
                                            className="absolute top-2 right-2 p-1.5 bg-white rounded-lg shadow border border-gray-200 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 size={13} className="text-red-400" />
                                        </button>
                                    )}
                                    {imagePreview && (
                                        <span className="absolute bottom-2 left-2 text-xs px-2 py-1 bg-white/90 rounded-md sec-ff text-(--pry-clr)/60 border border-gray-200">
                                            New image selected
                                        </span>
                                    )}
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full px-3 py-2.5 rounded-xl border border-dashed border-gray-300 text-sm text-(--pry-clr)/50 sec-ff hover:border-(--pry-clr) hover:text-(--pry-clr) transition-colors flex items-center justify-center gap-2"
                            >
                                <ImagePlus size={14} />
                                {existingImage ? "Replace image" : "Upload image"}
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
                                    placeholder="e.g. Butter"
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
                                    placeholder="e.g. butter"
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
                                        placeholder="e.g. Beans"
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
                                className="flex-1 px-4 py-2.5 bg-(--pry-clr) text-white rounded-xl text-sm font-semibold sec-ff hover:bg-(--pry-clr)/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        Saving…
                                    </>
                                ) : (
                                    <>
                                        <Pencil size={14} />
                                        Save Changes
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
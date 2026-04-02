"use client";
import { useState } from "react";
import { addProduct, editProduct } from "@/lib/products";

export default function ProductModal({
  onClose,
  product,
  storeId,
  onSave,
}: {
  onClose: () => void;
  product?: any;
  storeId?: string;
  onSave?: (product: any) => void;
}) {
  const [name, setName] = useState(product?.name ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [status, setStatus] = useState(
    product?.status === "Active" || product?.status === true
      ? "Active"
      : "Inactive",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!name || !sku) {
      setError("Product name and SKU are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const productData = {
        name,
        sku,
        price: price ? parseFloat(price.toString()) : 0,
        category,
        status: status === "Active",
      };

      if (product?.id || product?._id) {
        // Edit existing product
        await editProduct(product.id || product._id, productData);
      } else if (storeId) {
        // Add new product
        await addProduct(storeId, productData);
      } else {
        throw new Error("Store ID is required to add a product");
      }

      onSave?.({
        id: product?.id,
        name,
        sku,
        price,
        category,
        status,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-start justify-center pt-20 z-50">
      <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-[32px] font-semibold text-center">
          {product ? "Edit product" : "Add product"}
        </h2>
        <p className="text-[16px] text-[#101828] text-center mt-1">
          SuperStore · Products
        </p>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-600">Product name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="w-full border rounded px-3 py-2 mt-1 text-sm disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">SKU *</label>
            <input
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              disabled={loading}
              className="w-full border rounded px-3 py-2 mt-1 text-sm disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">Selling price (N) *</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={loading}
              className="w-full border rounded px-3 py-2 mt-1 text-sm disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
              className="w-full border rounded px-3 py-2 mt-1 text-sm disabled:bg-gray-100"
            >
              <option value="">Select</option>
              <option>Food</option>
              <option>Toiletries</option>
            </select>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setStatus("Active")}
            disabled={loading}
            className={`px-3 py-2 rounded border transition-all cursor-pointer disabled:opacity-50 ${status === "Active" ? "border-green-500" : "border-gray-200"}`}
            style={{
              backgroundColor: status === "Active" ? "#D8FF9C" : "transparent",
              color: status === "Active" ? "#166534" : "#333",
            }}
          >
            <div className="text-sm font-medium">Active</div>
            <div className="text-xs text-[#101828]">Available for sale</div>
          </button>
          <button
            type="button"
            onClick={() => setStatus("Inactive")}
            disabled={loading}
            className={`px-3 py-2 rounded border transition-all cursor-pointer disabled:opacity-50 ${status === "Inactive" ? "border-red-300" : "border-gray-200"}`}
            style={{
              backgroundColor:
                status === "Inactive" ? "#FEE2E2" : "transparent",
              color: status === "Inactive" ? "#991B1B" : "#333",
            }}
          >
            <div className="text-sm font-medium">Inactive</div>
            <div className="text-xs text-[#101828]">Hidden from sale</div>
          </button>
        </div>

        <div className="mt-4 flex justify-between gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded font-medium cursor-pointer disabled:opacity-50"
            style={{
              backgroundColor: "var(--prof-clr)",
              color: "var(--txt-clr)",
            }}
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";

export default function ProductModal({
  onClose,
  product,
  onSave,
}: {
  onClose: () => void;
  product?: any;
  onSave?: (product: any) => void;
}) {
  const [name, setName] = useState(product?.name ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [status, setStatus] = useState(product?.status ?? "Active");

  const handleSave = () => {
    if (!name || !sku) {
      alert("Product name and SKU are required");
      return;
    }
    onSave?.({
      name,
      sku,
      price,
      category,
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-start justify-center pt-20 z-50">
      <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-center">
          {product ? "Edit product" : "Add product"}
        </h2>
        <p className="text-xs text-gray-500 text-center mt-1">
          SuperStore · Products
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-600">Product name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">SKU *</label>
            <input
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">Selling price (N) *</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1 text-sm"
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
            className={`px-3 py-2 rounded border transition-all ${status === "Active" ? "border-green-500" : "border-gray-200"}`}
            style={{
              backgroundColor:
                status === "Active"
                  ? "var(--prof-clr, #dff5c2)"
                  : "transparent",
              color: status === "Active" ? "#166534" : "#333",
            }}
          >
            <div className="text-sm font-medium">Active</div>
            <div className="text-xs text-gray-500">Available for sale</div>
          </button>
          <button
            type="button"
            onClick={() => setStatus("Inactive")}
            className={`px-3 py-2 rounded border transition-all ${status === "Inactive" ? "border-red-300" : "border-gray-200"}`}
            style={{
              backgroundColor:
                status === "Inactive" ? "#FEE2E2" : "transparent",
              color: status === "Inactive" ? "#991B1B" : "#333",
            }}
          >
            <div className="text-sm font-medium">Inactive</div>
            <div className="text-xs text-gray-500">Hidden from sale</div>
          </button>
        </div>

        <div className="mt-4 flex justify-between gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 rounded font-medium"
            style={{
              backgroundColor: "var(--prof-clr)",
              color: "var(--txt-clr)",
            }}
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}

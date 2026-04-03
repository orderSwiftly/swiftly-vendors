"use client";
import { useState } from "react";
import { adjustStock } from "@/lib/inventory";

interface InventoryItem {
  _id?: string;
  sku: string;
  name: string;
  current_stock?: number;
  productId?: string;
}

export default function AdjustStockModal({
  item,
  storeName,
  locationId,
  onClose,
  onSuccess,
}: {
  item: InventoryItem;
  storeName: string;
  locationId?: string;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add");
  const [quantity, setQuantity] = useState("50");
  const [reason, setReason] = useState("Supplier delivery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentStock = item.current_stock || 0;
  const newTotal =
    adjustmentType === "add"
      ? currentStock + parseInt(quantity)
      : currentStock - parseInt(quantity);

  const handleConfirm = async () => {
    if (!locationId || !item.productId) {
      setError("Missing location or product information");
      return;
    }

    if (!quantity || parseInt(quantity) === 0) {
      setError("Please enter a quantity");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await adjustStock(locationId, item.productId, {
        adjusted_quantity: newTotal,
        reason,
      });

      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to adjust stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-start justify-center pt-20 z-50">
      <div className="w-full max-w-md bg-white text-[#101828] rounded-2xl p-6 shadow-lg">
        <h2 className="text-[32px] font-semibold text-center">Adjust stock</h2>
        <p className="text-[16px] text-center mt-1">
          {item.name} · {storeName}
        </p>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-[16px] font-medium text-gray-700">
              Current stock
            </label>
            <input
              type="text"
              value={`${currentStock} units`}
              disabled
              className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 text-[16px] bg-gray-50"
            />
          </div>

          <div>
            <label className="text-[16px] font-medium text-gray-700">
              Adjustment type
            </label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button
                onClick={() => setAdjustmentType("add")}
                disabled={loading}
                className="px-4 py-2 rounded-lg border-2 font-medium text-[16px] transition-all cursor-pointer disabled:opacity-50"
                style={{
                  backgroundColor:
                    adjustmentType === "add" ? "#D8FF9C" : "transparent",
                  borderColor: adjustmentType === "add" ? "#D8FF9C" : "#D1D5DB",
                  color: adjustmentType === "add" ? "#669917" : "#333",
                }}
              >
                Add stock +
              </button>
              <button
                onClick={() => setAdjustmentType("remove")}
                disabled={loading}
                className="px-4 py-2 rounded-lg border-2 font-medium text-[16px] transition-all cursor-pointer disabled:opacity-50"
                style={{
                  backgroundColor:
                    adjustmentType === "remove" ? "#FFB0A8" : "transparent",
                  borderColor:
                    adjustmentType === "remove" ? "#FCA5A5" : "#D1D5DB",
                  color: adjustmentType === "remove" ? "#55150F" : "#333",
                }}
              >
                Remove stock -
              </button>
            </div>
          </div>

          <div>
            <label className="text-[16px] font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={loading}
              className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 text-[16px] disabled:bg-gray-100"
            />
            <p className="text-xs text-gray-600 mt-1">
              New total will be {newTotal} units
            </p>
          </div>

          <div>
            <label className="text-[16px] font-medium text-gray-700">
              Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading}
              className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 text-[16px] disabled:bg-gray-100"
            >
              <option>Supplier delivery</option>
              <option>Customer return</option>
              <option>Damaged goods</option>
              <option>Inventory count correction</option>
              <option>Retail sale</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-[16px] cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-lg font-medium text-[16px] cursor-pointer disabled:opacity-50"
            style={{
              backgroundColor: "var(--prof-clr)",
              color: "var(--txt-clr)",
            }}
          >
            {loading ? "Confirming..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

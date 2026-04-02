"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import InventoryTable from "./InventoryTable";
import AdjustStockModal from "./AdjustStockModal";

interface InventoryItem {
  sku: string;
  name: string;
  stockLevel: string;
  productId?: string;
  status: "In Stock" | "Out Of Stock" | "Low Stock";
}

const ITEMS_PER_PAGE = 10;

export default function InventoryPageClient({
  storeId,
  storeName,
  locations,
}: {
  storeId: string;
  storeName: string;
  locations: { _id: string; location_name: string }[];
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(
    locations[0]?.location_name || "",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Sample inventory data
  const inventoryData: InventoryItem[] = [
    {
      sku: "SW-001",
      name: "Indomie Chicken 70g",
      stockLevel: "400/500",
      status: "In Stock",
    },
    {
      sku: "SW-002",
      name: "Milo 400g Tin",
      stockLevel: "60/90",
      status: "Out Of Stock",
    },
    {
      sku: "SW-003",
      name: "Closeup Toothpaste",
      stockLevel: "0/65",
      status: "Out Of Stock",
    },
    {
      sku: "SW-004",
      name: "Biro (Blue)",
      stockLevel: "9/54",
      status: "Low Stock",
    },
    {
      sku: "SW-005",
      name: "Peak Milk 170g",
      stockLevel: "6/70",
      status: "Low Stock",
    },
  ];

  const filteredItems = inventoryData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div>
          <h1 className="text-[32px] font-bold text-[#191D23]">
            {storeName} Inventory
          </h1>
          <p className="text-[16px] text-[#191D23] mt-1">
            Stock levels by location
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 p-6 bg-white">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Search products..."
          />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            {locations.map((loc) => (
              <option key={loc._id} value={loc.location_name}>
                {loc.location_name}
              </option>
            ))}
          </select>
        </div>

        <InventoryTable
          items={paginatedItems}
          onAdjustStock={(item) => setSelectedItem(item)}
        />

        <div className="flex items-center justify-between mt-6">
          <div className="text-xs text-gray-500">
            {filteredItems.length === 0
              ? "No items"
              : `Page ${currentPage} of ${totalPages}`}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selectedItem && (
        <AdjustStockModal
          item={selectedItem}
          storeName={selectedLocation}
          locationId={
            locations.find((l) => l.location_name === selectedLocation)?._id
          }
          onClose={() => setSelectedItem(null)}
          onSuccess={() => {
            // Refresh inventory or handle success
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}

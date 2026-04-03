"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InventoryTable from "./InventoryTable";
import AdjustStockModal from "./AdjustStockModal";
import { fetchInventoryByLocation } from "@/lib/inventory";
import { getStores } from "@/lib/store";

interface InventoryItem {
  _id?: string;
  sku: string;
  name: string;
  current_stock?: number;
  productId?: string;
}

const ITEMS_PER_PAGE = 10;

export default function InventoryPageClient({
  storeId,
  storeName: initialStoreName,
  locations: initialLocations,
}: {
  storeId: string;
  storeName?: string;
  locations?: { _id: string; location_name: string }[];
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [storeName, setStoreName] = useState(initialStoreName || "Store");
  const [locations, setLocations] = useState<
    { _id: string; location_name: string }[]
  >(initialLocations || []);
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocations?.[0]?.location_name || "",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storeLoading, setStoreLoading] = useState(!initialLocations);
  const [storeNotFound, setStoreNotFound] = useState(false);

  // Fetch store data if not provided
  useEffect(() => {
    if (initialLocations && initialLocations.length > 0) {
      setLocations(initialLocations);
      setSelectedLocation(initialLocations[0]?.location_name || "");
      setStoreLoading(false);
      return;
    }

    const loadStoreData = async () => {
      try {
        const hasToken =
          typeof window !== "undefined" && !!localStorage.getItem("token");
        console.log("Has token:", hasToken);
        const response = await getStores();
        console.log("Store response:", response);
        const stores = Array.isArray(response) ? response : response.data || [];
        console.log("Parsed stores:", stores);
        const store = stores.find(
          (s: any) => s._id === storeId || s.id === storeId,
        );
        console.log("Found store:", store);
        if (store) {
          setStoreName(store.store_name || store.name || "Store");
          const storeLocations = (store.locations || []).map((loc: any) => ({
            _id: loc._id || loc.id,
            location_name: loc.location_name || loc.name,
          }));
          console.log("Normalized store locations:", storeLocations);
          setLocations(storeLocations);
          if (storeLocations.length > 0) {
            setSelectedLocation(storeLocations[0].location_name);
          }
        } else {
          console.warn(`Store with ID ${storeId} not found in stores list`);
          setStoreNotFound(true);
        }
      } catch (err) {
        console.error("Failed to fetch store data:", err);
        setStoreNotFound(true);
      } finally {
        setStoreLoading(false);
      }
    };

    loadStoreData();
  }, [storeId, initialLocations, initialStoreName]);

  // Get current location ID
  const selectedLocationId = locations.find(
    (l) => l.location_name === selectedLocation,
  )?._id;

  // Fetch inventory when location or search changes
  useEffect(() => {
    if (!selectedLocationId) return;

    const loadInventory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchInventoryByLocation(
          selectedLocationId,
          currentPage,
          searchQuery,
        );
        setInventoryData(response.data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch inventory",
        );
        setInventoryData([]);
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, [selectedLocationId, currentPage, searchQuery]);

  return (
    <div>
      {storeLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-sm text-gray-500">Loading store inventory...</p>
          </div>
        </div>
      ) : storeNotFound ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-sm text-red-500 mb-4">Store not found</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Go Back
            </button>
          </div>
        </div>
      ) : (
        <>
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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex-1 min-w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Search products..."
              />
              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option key="default" value="">
                  Select a location...
                </option>
                {locations.map((loc) => (
                  <option key={loc._id} value={loc.location_name}>
                    {loc.location_name}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                  <p className="text-sm text-gray-500">Loading inventory...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-sm text-red-500 mb-2">{error}</p>
                  <p className="text-xs text-gray-400">
                    Please make sure the backend endpoint is available
                  </p>
                </div>
              </div>
            ) : inventoryData.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-gray-500">
                  No inventory items found
                </p>
              </div>
            ) : (
              <>
                <InventoryTable
                  items={inventoryData}
                  onAdjustStock={(item) => setSelectedItem(item)}
                />

                <div className="flex items-center justify-between mt-6">
                  <div className="text-xs text-gray-500">
                    {inventoryData.length === 0
                      ? "No items"
                      : `Showing ${inventoryData.length} items`}
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
                      onClick={() => setCurrentPage((p) => p + 1)}
                      disabled={inventoryData.length < ITEMS_PER_PAGE}
                      className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {selectedItem && (
            <AdjustStockModal
              item={selectedItem}
              storeName={selectedLocation}
              locationId={selectedLocationId}
              onClose={() => setSelectedItem(null)}
              onSuccess={() => {
                setSelectedItem(null);
                // Reset page and reload inventory
                setCurrentPage(1);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

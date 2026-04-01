"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStores } from "@/lib/store";

interface Store {
  _id?: string;
  id?: string;
  store_name?: string;
  name?: string;
  is_active: boolean;
  locations?: any[];
  product_count?: number;
  products_count?: number;
}

export default function InventoryOverviewClient({
  stores: initialStores,
}: {
  stores?: Store[];
}) {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>(initialStores || []);
  const [loading, setLoading] = useState(
    !initialStores || initialStores.length === 0,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (stores.length > 0) return; // Already have stores

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getStores();
        if (!mounted) return;
        const list = Array.isArray(data) ? data : data?.data || [];
        setStores(list);
      } catch (err: unknown) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load stores",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          View Your Inventory
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Select a store to view your inventory
        </p>
      </div>

      {loading ? (
        <div className="py-10 text-gray-500">Loading stores...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : stores.length === 0 ? (
        <div className="py-10 text-gray-500">No stores found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stores.map((store) => {
            const storeId = store._id || store.id;
            const storeName = store.store_name || store.name || "Store";
            const productCount =
              store.product_count || store.products_count || 0;

            return (
              <button
                key={storeId}
                onClick={() => router.push(`/dashboard/inventory/${storeId}`)}
                className="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-left cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {storeName}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {store.locations?.length || 0} location
                  {(store.locations?.length || 0) !== 1 ? "s" : ""} ·{" "}
                  <span
                    style={{
                      color: store.is_active ? "var(--prof-clr)" : "#991B1B",
                    }}
                  >
                    {store.is_active ? "active" : "inactive"}
                  </span>
                </p>

                <div className="mt-3 flex gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: store.is_active ? "#D8FF9C" : "#FFEFC3",
                      color: store.is_active ? "#166534" : "#991B1B",
                    }}
                  >
                    {store.is_active ? "Active" : "Inactive"}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "#FDEDC3",
                      color: "#8A6500",
                    }}
                  >
                    {productCount} product
                    {productCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </main>
  );
}

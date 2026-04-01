"use client";
import { useEffect, useState } from "react";
import { getStores } from "@/lib/store";
import { useRouter } from "next/navigation";

interface StoreData {
  id: string;
  name: string;
  is_active: boolean;
  locations?: Array<any>;
  products_count?: number;
}

export default function ProductsOverviewClient() {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getStores();
        if (!mounted) return;
        // normalize response
        const list = Array.isArray(data) ? data : data?.data || [];
        setStores(list);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load stores");
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <h1 className="text-[32px] font-bold text-[#191D23]">
        View Your Products
      </h1>
      <p className="text-[16px] text-[#191D23] mt-1 mb-4">
        Select a store to view your products
      </p>

      {loading ? (
        <div className="py-10 text-gray-500">Loading stores...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.map((store) => (
            <div
              key={store.id}
              role="button"
              onClick={() => router.push(`/dashboard/products/${store.id}`)}
              className="rounded-[10px] border border-gray-200 bg-white p-4 flex flex-col gap-3 cursor-pointer hover:border-(--prof-clr) hover:shadow-sm transition-all"
            >
              <div>
                <h3 className="font-bold text-[24px] text-[#191D23]">
                  {store.name}
                </h3>
                <p className="text-[18px] text-[#191D23] mt-0.5">
                  {store.locations?.length ?? 0} location
                  {(store.locations?.length ?? 0) !== 1 ? "s" : ""} ·{" "}
                  {store.is_active ? "active" : "inactive"}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: store.is_active ? "#D8FF9C" : "#FFEFC3",
                    color: store.is_active ? "#166534" : "#991B1B",
                  }}
                >
                  {store.is_active ? "Active" : "Inactive"}
                </span>
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ backgroundColor: "#FDEDC3", color: "#553F03" }}
                >
                  {store.products_count ?? 0} products
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

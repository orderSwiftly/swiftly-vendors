"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStores } from "@/lib/store";
import { fetchProductsByStore } from "@/lib/products";
import Spinner from "../ui/spinner";

interface StoreData {
  id: string;
  _id?: string;
  name: string;
  store_name?: string;
  is_active: boolean;
  locations?: Array<any>;
}

export default function TransactionsOverviewClient() {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productCounts, setProductCounts] = useState<Record<string, number>>(
    {},
  );
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getStores();
        if (!mounted) return;
        const list = Array.isArray(data) ? data : data?.data || [];
        setStores(list);

        // Fetch product count for each store
        const counts: Record<string, number> = {};
        for (const store of list) {
          try {
            const storeId = store._id || store.id;
            const productData = await fetchProductsByStore(storeId, 1, "");
            const productList = Array.isArray(productData)
              ? productData
              : productData?.data || [];
            counts[storeId] = productList.length;
          } catch (err) {
            console.error(
              `Failed to fetch products for store ${store.id}:`,
              err,
            );
            counts[store._id || store.id] = 0;
          }
        }
        if (mounted) {
          setProductCounts(counts);
        }
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
    <div>
      <h1 className="text-[32px] font-bold text-[#191D23]">Transactions</h1>
      <p className="text-[16px] text-[#191D23] mt-1 mb-6">
        Select store to View Transactions
      </p>

      {loading ? (
        <div className="py-10 text-gray-500">
          <Spinner />
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : stores.length === 0 ? (
        <div className="py-10 text-gray-500">No stores found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.map((store) => {
            const storeId = store._id || store.id;
            const locations = store.locations || [];
            const productCount = productCounts[storeId] ?? 0;
            return (
              <button
                key={storeId}
                onClick={() =>
                  router.push(`/dashboard/transactions/${storeId}`)
                }
                className="rounded-[10px] border border-gray-200 bg-white p-4 flex flex-col gap-3 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all text-left"
              >
                <div>
                  <h3 className="font-bold text-[24px] text-[#191D23]">
                    {store.store_name || store.name}
                  </h3>
                  <p className="text-[16px] text-[#84919A] mt-0.5">
                    {locations.length} location
                    {locations.length !== 1 ? "s" : ""} ·{" "}
                    <span
                      style={{
                        color: store.is_active ? "var(--prof-clr)" : "#991B1B",
                      }}
                    >
                      {store.is_active ? "active" : "inactive"}
                    </span>
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
                    {productCount} product{productCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

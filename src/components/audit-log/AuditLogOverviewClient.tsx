"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStores } from "@/lib/store";
import Spinner from "@/components/ui/spinner";

interface Store {
  _id: string;
  name: string;
  is_active: boolean;
  locations?: Array<{ _id: string; name: string; is_active: boolean }>;
}

export default function AuditLogOverviewClient() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const data = await getStores();
        setStores(data);
        setError(null);
      } catch (err) {
        setError("Failed to load stores");
        console.error("Error fetching stores:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleStoreClick = (storeId: string) => {
    router.push(`/dashboard/audit-log/${storeId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 pry-ff">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#191D23] mb-2">Audit log</h1>
        <p className="text-gray-600">Select store to view Audit log</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => {
          const locationCount = store.locations?.length ?? 0;
          const isActive = store.is_active;

          return (
            <div
              key={store._id}
              onClick={() => handleStoreClick(store._id)}
              className="border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
            >
              <h3 className="text-lg font-bold text-[#191D23] mb-1">
                {store.name}
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                {locationCount} location{locationCount !== 1 ? "s" : ""} ·{" "}
                {isActive ? "active" : "inactive"}
              </p>

              <div className="flex gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: isActive ? "#D8FF9C" : "#FFB0A8",
                    color: isActive ? "#166534" : "#991B1B",
                  }}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: "#FFE5A6",
                    color: "#8A6500",
                  }}
                >
                  {locationCount} location{locationCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

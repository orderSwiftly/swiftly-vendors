import type { Metadata } from "next";
import InventoryPageClient from "@/components/inventory/InventoryPageClient";
import { getStores } from "@/lib/store";

export const metadata: Metadata = {
  title: "Store Inventory",
};

interface Props {
  params: { id: string };
}

export default async function StoreInventoryPage({ params }: Props) {
  const { id } = params;
  let storeName = "Store";
  let locations: any[] = [];

  try {
    const response = await getStores();
    const stores = Array.isArray(response) ? response : response.data || [];
    const store = stores.find((s: any) => s._id === id || s.id === id);
    if (store) {
      storeName = store.store_name || store.name || "Store";
      locations = store.locations || [];
    }
  } catch (error) {
    console.error("Failed to fetch store:", error);
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <InventoryPageClient
        storeId={id}
        storeName={storeName}
        locations={locations}
      />
    </main>
  );
}

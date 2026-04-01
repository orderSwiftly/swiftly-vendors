import type { Metadata } from "next";
import InventoryOverviewClient from "@/components/inventory/InventoryOverviewClient";
import { getStores } from "@/lib/store";

export const metadata: Metadata = {
  title: "Inventory",
};

export default async function InventoryPage() {
  let stores: any[] = [];

  try {
    const response = await getStores();
    stores = Array.isArray(response) ? response : response.data || [];
  } catch (error) {
    console.error("Failed to fetch stores:", error);
  }

  return <InventoryOverviewClient stores={stores} />;
}

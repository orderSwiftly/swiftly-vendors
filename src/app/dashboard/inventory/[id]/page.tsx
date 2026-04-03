import type { Metadata } from "next";
import InventoryPageClient from "@/components/inventory/InventoryPageClient";

export const metadata: Metadata = {
  title: "Store Inventory",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StoreInventoryPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <InventoryPageClient storeId={id} />
    </main>
  );
}

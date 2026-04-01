import type { Metadata } from "next";
import ProductsPageClient from "@/components/products/ProductsPageClient";
import { getStores } from "@/lib/store";

export const metadata: Metadata = {
  title: "Products",
};

interface Props {
  params: { id: string };
}

export default async function ProductViewPage({ params }: Props) {
  const { id } = params;
  let storeName = "Store";

  try {
    const response = await getStores();
    const stores = Array.isArray(response) ? response : response.data || [];
    const store = stores.find((s: any) => s._id === id || s.id === id);
    if (store) {
      storeName = store.store_name || store.name || "Store";
    }
  } catch (error) {
    console.error("Failed to fetch store:", error);
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <ProductsPageClient storeId={id} storeName={storeName} />
    </main>
  );
}

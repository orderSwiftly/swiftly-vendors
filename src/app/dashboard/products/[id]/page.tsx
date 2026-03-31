import type { Metadata } from "next";
import ProductsPageClient from "@/components/products/ProductsPageClient";

export const metadata: Metadata = {
  title: "Products",
};

interface Props {
  params: { id: string };
}

export default function ProductViewPage({ params }: Props) {
  const { id } = params;

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <p className="text-sm text-gray-500 mt-1">Store · {id}</p>
      </div>

      <ProductsPageClient storeId={id} />
    </main>
  );
}

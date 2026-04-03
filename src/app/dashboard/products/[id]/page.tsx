import type { Metadata } from "next";
import ProductsPageClient from "@/components/products/ProductsPageClient";

export const metadata: Metadata = {
  title: "Products",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductViewPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <ProductsPageClient storeId={id} />
    </main>
  );
}

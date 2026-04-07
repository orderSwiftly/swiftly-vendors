// src/app/dashboard/products/[id]/page.tsx

import type { Metadata } from "next";
import ProductsPageClient from "@/components/products/ProductsPageClient";

export const metadata: Metadata = {
  title: "Product Details",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductViewPage({ params }: Readonly<Props>) {
  const { id } = await params;

  return (
    <main className="p-6 max-w-6xl mx-auto mb-14">
      <ProductsPageClient storeId={id} />
    </main>
  );
}
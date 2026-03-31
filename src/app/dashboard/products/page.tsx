import type { Metadata } from "next";
import ProductsOverviewClient from "@/components/products/ProductsOverviewClient";

export const metadata: Metadata = {
  title: "Products",
};

export default function ProductsPage() {
  return (
    <main className="p-6 max-w-6xl mx-auto">
      <ProductsOverviewClient />
    </main>
  );
}

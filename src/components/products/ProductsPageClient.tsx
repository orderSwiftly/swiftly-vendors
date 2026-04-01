"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductsTable from "./ProductsTable";
import ImportModal from "./ImportModal";
import ProductModal from "./ProductModal";

interface Product {
  sku: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  status: string;
}

const ITEMS_PER_PAGE = 10;

export default function ProductsPageClient({
  storeId,
  storeName,
}: {
  storeId?: string;
  storeName?: string;
}) {
  const router = useRouter();
  const [showImport, setShowImport] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([
    {
      sku: "SW-001",
      name: "Indomie Chicken 70g",
      category: "Food",
      price: "₦1,200",
      stock: "500",
      status: "Active",
    },
    {
      sku: "SW-002",
      name: "Milo 400g Tin",
      category: "Toiletries",
      price: "₦4,500",
      stock: "67",
      status: "Inactive",
    },
    {
      sku: "SW-003",
      name: "Closeup Toothpaste",
      category: "Stationery",
      price: "₦1,200",
      stock: "Out Of Stock",
      status: "Active",
    },
    {
      sku: "SW-004",
      name: "Biro (Blue)",
      category: "Food",
      price: "₦8,750",
      stock: "34",
      status: "Active",
    },
    {
      sku: "SW-005",
      name: "Peak Milk 170g",
      category: "Stationery",
      price: "₦2,600",
      stock: "87",
      status: "Inactive",
    },
  ]);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSaveProduct = (product: any) => {
    if (editingProduct?.sku === product.sku) {
      setProducts((prev) =>
        prev.map((p) => (p.sku === product.sku ? product : p)),
      );
    } else {
      setProducts((prev) => [...prev, { ...product, sku: product.sku }]);
    }
    setEditingProduct(null);
  };

  const handleExport = () => {
    if (filteredProducts.length === 0) {
      alert("No products to export");
      return;
    }

    // Prepare CSV header
    const headers = ["SKU", "Name", "Category", "Price", "Stock", "Status"];
    const rows = filteredProducts.map((p) => [
      p.sku,
      p.name,
      p.category,
      p.price,
      p.stock,
      p.status,
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `products-export-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div>
          <h1 className="text-[32px] font-bold text-[#191D23]">Products</h1>
          <p className="text-[16px] text-[#191D23] mt-1">
            {storeName} · {products.length} product
            {products.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 p-6 bg-white">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Search by name or SKU..."
          />
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>All Locations</option>
          </select>
          <button
            onClick={() => setShowImport(true)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 cursor-pointer"
          >
            Import
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 cursor-pointer"
          >
            Export
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
            style={{
              backgroundColor: "var(--prof-clr)",
              color: "var(--txt-clr)",
            }}
          >
            + Add Product
          </button>
        </div>

        <ProductsTable
          products={paginatedProducts}
          onEdit={(p) => setEditingProduct(p)}
        />

        <div className="flex items-center justify-between mt-6">
          <div className="text-xs text-gray-500">
            {filteredProducts.length === 0
              ? "No products"
              : `Page ${currentPage} of ${totalPages} • ${filteredProducts.length} total`}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

        {showImport && <ImportModal onClose={() => setShowImport(false)} />}
        {showAdd && (
          <ProductModal
            onClose={() => setShowAdd(false)}
            onSave={handleSaveProduct}
          />
        )}
        {editingProduct && (
          <ProductModal
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSave={handleSaveProduct}
          />
        )}
      </div>
    </div>
  );
}

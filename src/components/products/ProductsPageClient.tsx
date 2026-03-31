"use client";
import { useState } from "react";
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

export default function ProductsPageClient({ storeId }: { storeId?: string }) {
  const [showImport, setShowImport] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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

  return (
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
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
        >
          Import
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
          Export
        </button>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{
            backgroundColor: "var(--prof-clr)",
            color: "var(--txt-clr)",
          }}
        >
          + Add Product
        </button>
      </div>

      <ProductsTable
        products={filteredProducts}
        onEdit={(p) => setEditingProduct(p)}
      />

      <div className="flex items-center justify-between mt-6">
        <div className="text-xs text-gray-400">Page 1 of 10</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
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
  );
}

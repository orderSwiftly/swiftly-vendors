"use client";
import React from "react";

interface Product {
  sku: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  status: string;
}

export default function ProductsTable({
  products,
  onEdit,
}: {
  products: Product[];
  onEdit?: (p: Product) => void;
}) {
  return (
    <table className="w-full table-auto text-left text-sm">
      <thead>
        <tr className="text-[#84919A] border-b">
          <th className="py-3 px-2 w-24">SKU</th>
          <th className="py-3 px-2">NAME</th>
          <th className="py-3 px-2">CATEGORY</th>
          <th className="py-3 px-2">PRICE</th>
          <th className="py-3 px-2">STOCK</th>
          <th className="py-3 px-2">STATUS</th>
          <th className="py-3 px-2">&nbsp;</th>
        </tr>
      </thead>
      <tbody className="text-gray-700">
        {products.map((p) => (
          <tr key={p.sku} className="border-b last:border-b-0">
            <td className="py-3 px-2 text-xs text-gray-500">{p.sku}</td>
            <td className="py-3 px-2">{p.name}</td>
            <td className="py-3 px-2">
              <span className="text-xs px-2 py-1 rounded-md border bg-gray-50">
                {p.category}
              </span>
            </td>
            <td className="py-3 px-2">{p.price}</td>
            <td className="py-3 px-2">{p.stock}</td>
            <td className="py-3 px-2">
              <span
                style={{
                  backgroundColor:
                    p.status === "Active"
                      ? "#D8FF9C"
                      : "#FFB0A8",
                  color: p.status === "Active" ? "#355505" : "#991B1B",
                }}
                className="text-xs px-2 py-1 rounded-md"
              >
                {p.status}
              </span>
            </td>
            <td className="py-3 px-2">
              <button
                onClick={() => onEdit?.(p)}
                className="px-3 py-1 border rounded text-xs cursor-pointer"
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

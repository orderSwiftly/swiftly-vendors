"use client";

interface InventoryItem {
  _id?: string;
  sku: string;
  name: string;
  current_stock?: number;
}

export default function InventoryTable({
  items,
  onAdjustStock,
}: {
  items: InventoryItem[];
  onAdjustStock: (item: InventoryItem) => void;
}) {
  const getStatusColor = (stock: number | undefined) => {
    if (stock === undefined) return { background: "#F3F4F6", text: "#6B7280" };
    if (stock === 0) return { background: "#FFB0A8", text: "#553F03" }; // Out of Stock
    if (stock < 50) return { background: "#FFD970", text: "#553F03" }; // Low Stock
    return { background: "#D8FF9C", text: "#553F03" }; // In Stock
  };

  const getStatusText = (stock: number | undefined) => {
    if (stock === undefined) return "Unknown";
    if (stock === 0) return "Out Of Stock";
    if (stock < 50) return "Low Stock";
    return "In Stock";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-[#84919A]">SKU</th>
            <th className="text-left py-3 px-4 text-[#84919A]">PRODUCT</th>
            <th className="text-left py-3 px-4 text-[#84919A]">
              CURRENT STOCK
            </th>
            <th className="text-left py-3 px-4 text-[#84919A]">STATUS</th>
            <th className="text-left py-3 px-4 text-[#84919A]">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => {
            const statusColor = getStatusColor(item.current_stock);
            const statusText = getStatusText(item.current_stock);
            return (
              <tr
                key={idx}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-4 text-gray-900">{item.sku}</td>
                <td className="py-3 px-4 text-gray-900">{item.name}</td>
                <td className="py-3 px-4 text-gray-900">
                  {item.current_stock ?? "N/A"}
                </td>
                <td className="py-3 px-4">
                  <span
                    className="px-2 py-1 rounded-lg text-sm font-medium"
                    style={{
                      backgroundColor: statusColor.background,
                      color: statusColor.text,
                    }}
                  >
                    {statusText}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => onAdjustStock(item)}
                    className="border border-[#D0D5DD] rounded-lg hover:text-blue-800 px-2 py-1 text-sm cursor-pointer"
                  >
                    Adjust Stock
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

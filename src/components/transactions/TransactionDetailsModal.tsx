"use client";

interface TransactionItem {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Transaction {
  _id?: string;
  transaction_id?: string;
  timestamp?: string;
  location?: string;
  source?: string;
  amount?: number;
  items?: TransactionItem[];
  status?: string;
  payment_status?: string;
  processed_by?: string;
}

interface TransactionDetailsModalProps {
  transaction: Transaction;
  onClose: () => void;
}

export default function TransactionDetailsModal({
  transaction,
  onClose,
}: TransactionDetailsModalProps) {
  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "successful":
        return { background: "#D8FF9C", color: "#166534" };
      case "pending":
        return { background: "#FFE5A6", color: "#8A6500" };
      case "failed":
        return { background: "#FFB0A8", color: "#991B1B" };
      default:
        return { background: "#F3F4F6", color: "#6B7280" };
    }
  };

  const statusColor = getStatusColor(transaction.status);
  const total =
    transaction.items?.reduce((sum, item) => sum + item.subtotal, 0) ??
    transaction.amount ??
    0;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-[#191D23]">
              Transaction #{transaction.transaction_id}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{transaction.timestamp}</p>
          </div>
          <span
            className="px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap ml-4"
            style={{
              backgroundColor: statusColor.background,
              color: statusColor.color,
            }}
          >
            {transaction.status}
          </span>
        </div>

        {transaction.items && transaction.items.length > 0 && (
          <div className="mb-2">
            <h3 className="border-y py-3 border-gray-200 text-sm text-gray-700 tracking-wide">Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-0 font-bold">
                      Product
                    </th>
                    <th className="text-center py-3 px-4 font-bold">Qty</th>
                    <th className="text-right py-3 px-4 font-bold">Price</th>
                    <th className="text-right py-3 px-0 font-bold">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transaction.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-3 px-0 text-gray-900">{item.name}</td>
                      <td className="py-3 px-4 text-gray-900 text-center">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-4 text-gray-900 text-right">
                        ₦{item.price?.toLocaleString()}
                      </td>
                      <td className="py-3 px-0 text-gray-900 text-right">
                        ₦{item.subtotal?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="flex justify-between items-center font-bold">
            <span>Total</span>
            <span>
              ₦{total?.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex justify-between mb-8">
          <div>
            <p className="text-sm text-gray-600 mb-1 tracking-wide font-medium">Location</p>
            <p className="font-semibold text-[#191D23]">
              {transaction.location}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1 tracking-wide font-medium">Processed by</p>
            <p className="font-semibold text-[#191D23]">
              {transaction.processed_by}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1 tracking-wide font-medium">Payment status</p>
            <span
              className="px-2 py-1 rounded text-xs font-medium inline-block"
              style={{
                backgroundColor:
                  transaction.payment_status === "Paid"
                    ? "#D8FF9C"
                    : "#FFB0A8",
                color:
                  transaction.payment_status === "Paid"
                    ? "#166534"
                    : "#991B1B",
              }}
            >
              {transaction.payment_status}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1 tracking-wide font-medium">Source</p>
            <p className="border border-[#D0D5DD] px-4 py-1 rounded-lg inline-block font-semibold text-[#191D23]">
              {transaction.source}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition"
        >
          Back to History
        </button>
      </div>
    </div>
  );
}

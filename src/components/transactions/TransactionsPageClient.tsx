"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStores } from "@/lib/store";
import TransactionDetailsModal from "./TransactionDetailsModal";

interface Transaction {
  _id?: string;
  id?: string;
  transaction_id?: string;
  date?: string;
  timestamp?: string;
  location?: string;
  location_id?: string;
  source?: string;
  amount?: number;
  total?: number;
  items_count?: number;
  items?: Array<any>;
  status?: string;
  payment_status?: string;
  processed_by?: string;
}

interface Location {
  _id?: string;
  id?: string;
  name?: string;
  location_name?: string;
}

const ITEMS_PER_PAGE = 10;

export default function TransactionsPageClient({
  storeId,
}: {
  storeId: string;
}) {
  const router = useRouter();
  const [storeName, setStoreName] = useState("Store");
  const [storeLoading, setStoreLoading] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  useEffect(() => {
    const loadStoreData = async () => {
      try {
        const response = await getStores();
        const stores = Array.isArray(response) ? response : response.data || [];
        const store = stores.find(
          (s: any) => s._id === storeId || s.id === storeId,
        );
        if (store) {
          setStoreName(store.store_name || store.name || "Store");
          const storeLocations = (store.locations || []).map((loc: any) => ({
            _id: loc._id || loc.id,
            location_name: loc.location_name || loc.name,
          }));
          setLocations(storeLocations);
        }
      } catch (err) {
        console.error("Failed to fetch store data:", err);
      } finally {
        setStoreLoading(false);
      }
    };

    loadStoreData();
  }, [storeId]);

  // Mock transactions data
  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call when backend endpoint is available
        // const response = await fetchTransactionsByStore(storeId, currentPage, { location: selectedLocation, status: selectedStatus, date: selectedDate });

        const mockTransactions: Transaction[] = [
          {
            _id: "txn-1",
            transaction_id: "TXN-2847",
            timestamp: "Mar 24, 2:14 PM",
            location: "Alfa Hostel",
            source: "POS",
            amount: 1200,
            items_count: 3,
            status: "successful",
            payment_status: "Paid",
            processed_by: "Emeka Obi",
            items: [
              {
                name: "Indomie Chicken 70g",
                quantity: 2,
                price: 150,
                subtotal: 300,
              },
              {
                name: "Milo 400g Tin",
                quantity: 1,
                price: 1800,
                subtotal: 1800,
              },
              { name: "Biro (Blue)", quantity: 4, price: 80, subtotal: 400 },
            ],
          },
          {
            _id: "txn-2",
            transaction_id: "TXN-2846",
            timestamp: "Mar 24, 1:58 PM",
            location: "Joshua Hostel",
            source: "POS",
            amount: 4500,
            items_count: 1,
            status: "failed",
            payment_status: "Failed",
            processed_by: "John Doe",
          },
          {
            _id: "txn-3",
            transaction_id: "TXN-2845",
            timestamp: "Mar 24, 1:30 PM",
            location: "Deborah Hostel",
            source: "POS",
            amount: 1200,
            items_count: 5,
            status: "successful",
            payment_status: "Paid",
            processed_by: "Jane Smith",
          },
          {
            _id: "txn-4",
            transaction_id: "TXN-2844",
            timestamp: "Mar 24, 12:47 PM",
            location: "Alfa Hostel",
            source: "POS",
            amount: 8750,
            items_count: 3,
            status: "successful",
            payment_status: "Paid",
            processed_by: "Emeka Obi",
          },
          {
            _id: "txn-5",
            transaction_id: "TXN-2843",
            timestamp: "Mar 23, 4:11 PM",
            location: "Joshua Hostel",
            source: "POS",
            amount: 2600,
            items_count: 2,
            status: "failed",
            payment_status: "Failed",
            processed_by: "John Doe",
          },
        ];

        setTransactions(mockTransactions);
        setTotalPages(Math.ceil(mockTransactions.length / ITEMS_PER_PAGE));
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!storeLoading) {
      loadTransactions();
    }
  }, [
    storeId,
    storeLoading,
    selectedLocation,
    selectedStatus,
    selectedDate,
    currentPage,
  ]);

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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[32px] font-bold text-[#191D23]">
          Transaction history
        </h1>
        <p className="text-[16px] text-[#84919A] mt-1">{storeName}</p>
      </div>

      {storeLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 p-6 bg-white">
          <div className="flex justify-between mb-6 flex-wrap">
            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option>All Locations</option>
              {locations.map((loc) => (
                <option key={loc._id} value={loc.location_name || loc.name}>
                  {loc.location_name || loc.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option>All Statuses</option>
                <option value="successful">Successful</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-10 text-center text-gray-500">
              Loading transactions...
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              No transactions found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto pry-ff">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-[#84919A]">
                        DATE & TIME
                      </th>
                      <th className="text-left py-3 px-4 text-[#84919A]">
                        LOCATION
                      </th>
                      <th className="text-left py-3 px-4 text-[#84919A]">
                        SOURCE
                      </th>
                      <th className="text-left py-3 px-4 text-[#84919A]">
                        AMOUNT
                      </th>
                      <th className="text-left py-3 px-4 text-[#84919A]">
                        ITEMS
                      </th>
                      <th className="text-left py-3 px-4 text-[#84919A]">
                        STATUS
                      </th>
                      <th className="text-left py-3 px-4 text-[#84919A]">
                        ACTION
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => {
                      const statusColor = getStatusColor(transaction.status);
                      return (
                        <tr
                          key={transaction._id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 text-gray-900">
                            {transaction.timestamp}
                          </td>
                          <td className="py-3 px-4 text-gray-900">
                            {transaction.location}
                          </td>
                          <td className="py-3 px-4 text-gray-900">
                            <span className="border border-[#D0D5DD] px-4 py-1 rounded-lg">
                              {transaction.source}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-900">
                            ₦{transaction.amount?.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-gray-900">
                            {transaction.items_count}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className="px-2 py-1 rounded-lg text-xs font-medium"
                              style={{
                                backgroundColor: statusColor.background,
                                color: statusColor.color,
                              }}
                            >
                              {transaction.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() =>
                                setSelectedTransaction(transaction)
                              }
                              className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 cursor-pointer"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="text-xs text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}

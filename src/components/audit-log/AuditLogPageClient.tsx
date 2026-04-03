"use client";

import { useEffect, useState } from "react";
import { getStores } from "@/lib/store";
import Spinner from "@/components/ui/spinner";

interface AuditLogEntry {
  _id?: string;
  action_type: string;
  timestamp: string;
  user: string;
  description: string;
  location?: string;
}

interface Store {
  _id: string;
  name: string;
  locations?: Array<{ _id: string; name: string }>;
}

const ITEMS_PER_PAGE = 10;

const getActionTypeColor = (
  actionType: string,
): { bg: string; text: string } => {
  switch (actionType?.toLowerCase()) {
    case "inventory adjustment":
      return { bg: "#F3F4F6", text: "#374151" };
    case "transaction":
      return { bg: "#F3F4F6", text: "#374151" };
    case "stock transfer":
      return { bg: "#F3F4F6", text: "#374151" };
    case "product change":
      return { bg: "#F3F4F6", text: "#374151" };
    case "staff change":
      return { bg: "#F3F4F6", text: "#374151" };
    default:
      return { bg: "#F3F4F6", text: "#374151" };
  }
};

// Mock audit log data
const mockAuditLogs: AuditLogEntry[] = [
  {
    action_type: "Inventory adjustment",
    timestamp: "2025-03-24 2:14 PM",
    user: "Emeka Obi",
    description: "Indomie 70g at Alfa Hostel: 412 → 462 units",
    location: "Alfa Hostel",
  },
  {
    action_type: "Transaction",
    timestamp: "2025-03-24 2:14 PM",
    user: "Emeka Obi",
    description: "Sale TXN-2847 · ₦4,500 · Alfa Hostel",
    location: "Alfa Hostel",
  },
  {
    action_type: "Stock transfer",
    timestamp: "2025-03-24 10:14 AM",
    user: "Adaeze Okafor",
    description: "Transfer #TR-041: Alfa → Joshua · 3 products",
    location: "Joshua",
  },
  {
    action_type: "Product change",
    timestamp: "2025-03-24 9:02 AM",
    user: "Adaeze Okafor",
    description: "Peak Milk 170g status → inactive",
    location: "Joshua",
  },
  {
    action_type: "Staff change",
    timestamp: "2025-03-23 5:10 PM",
    user: "Adaeze Okafor",
    description: "Kunle Adeyemi deactivated at Joshua Hostel",
    location: "Joshua Hostel",
  },
  {
    action_type: "Product change",
    timestamp: "2025-03-23 4:11 PM",
    user: "Fatima Bello",
    description: "Sale TXN-2846 · ₦6,100 · Joshua Hostel",
    location: "Joshua Hostel",
  },
];

interface AuditLogPageClientProps {
  storeId: string;
}

export default function AuditLogPageClient({
  storeId,
}: AuditLogPageClientProps) {
  const [storeName, setStoreName] = useState<string>("");
  const [storeLoading, setStoreLoading] = useState(true);
  const [locations, setLocations] = useState<
    Array<{ _id: string; name: string }>
  >([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch store data
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setStoreLoading(true);
        const stores = await getStores();
        const store = stores.find((s: Store) => s._id === storeId);

        if (store) {
          setStoreName(store.name);
          setLocations(store.locations ?? []);
        }
      } catch (error) {
        console.error("Error fetching store:", error);
      } finally {
        setStoreLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId]);

  useEffect(() => {
    setAuditLogs(mockAuditLogs);
  }, []);

  useEffect(() => {
    let filtered = [...auditLogs];

    if (selectedLocation !== "all") {
      filtered = filtered.filter((log) => log.location === selectedLocation);
    }

    if (selectedStatus !== "all") {
      // TODO: Add status filtering based on action type or status field
    }

    if (selectedDate) {
      // TODO: Add date filtering
    }

    const total = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    setTotalPages(total || 1);
    setCurrentPage(1);
    setFilteredLogs(filtered);
  }, [auditLogs, selectedLocation, selectedStatus, selectedDate]);

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (storeLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6 pry-ff">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#191D23] mb-2">Audit log</h1>
        <p className="text-gray-600">All critical actions across {storeName}</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex gap-4 flex-wrap">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Locations</option>
            {locations.map((loc) => (
              <option key={loc._id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="successful">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        {paginatedLogs.map((log, idx) => {
          const actionColor = getActionTypeColor(log.action_type);
          return (
            <div
              key={idx}
              className="flex gap-3 items-center border border-gray-200 rounded-lg p-4"
            >
              <span
                className="px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap"
                style={{
                  backgroundColor: actionColor.bg,
                  color: actionColor.text,
                }}
              >
                {log.action_type}
              </span>

              <p className="text-sm text-gray-900 flex-1">
                {log.user} · {log.timestamp} {log.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-3">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

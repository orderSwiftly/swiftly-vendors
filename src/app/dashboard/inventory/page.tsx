// src/app/dashboard/inventory/page.tsx

import type { Metadata } from "next";
import InventoryOverviewClient from "@/components/inventory/InventoryOverviewClient";

export const metadata: Metadata = {
  title: "Inventory",
};

export default function InventoryPage() {
  return <InventoryOverviewClient />;
}
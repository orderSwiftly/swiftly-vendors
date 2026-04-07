// src/app/dashboard/staff/[storeId]/page.tsx

import StoreStaffCard from "@/components/staff/store-staff-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store Staff",
};

export default async function StoreStaffPage({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await params;
  return (
    <main className="w-full">
      <StoreStaffCard storeId={storeId} />
    </main>
  );
}
// src/app/dashboard/staff/[storeId]/page.tsx

import StoreStaffCard from "@/components/staff/store-staff-card";

export default async function StoreStaffPage({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await params;
  return (
    <main className="w-full">
      <StoreStaffCard storeId={storeId} />
    </main>
  );
}
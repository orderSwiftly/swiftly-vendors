// src/app/dashboard/staff/[storeId]/[staffId]/page.tsx

import StaffView from "@/components/staff/view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staff Profile",
};

export default async function StaffProfilePage({
    params,
}: {
    readonly params: Promise<{ readonly storeId: string; readonly staffId: string }>;
}) {
    const { storeId, staffId } = await params;
    return (
        <main className="w-full">
            <StaffView staffId={staffId} storeId={storeId} />
        </main>
    );
}
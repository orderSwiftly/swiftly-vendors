// src/app/dashboard/staff/page.tsx

import StaffCard from "@/components/staff/staff-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staff",
};

export default function StaffPage() {
  return (
    <main className="w-full">
      <StaffCard />
    </main>
  );
}
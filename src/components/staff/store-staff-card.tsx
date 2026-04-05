// src/components/staff/store-staff-card.tsx

"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import GetStaff from "./get-staff";

interface StoreStaffCardProps {
    storeId: string;
}

export default function StoreStaffCard({ storeId }: Readonly<StoreStaffCardProps>) {
    const [refreshKey, setRefreshKey] = useState(0);
    const router = useRouter();

    const handleInvited = useCallback(() => {
        setRefreshKey((k) => k + 1);
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <div className="rounded-2xl bg-(--txt-clr) p-6 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-(--pry-clr)/5 transition-colors"
                        >
                            <ArrowLeft size={16} className="text-(--pry-clr)" />
                        </button>
                        <div>
                            <h2 className="text-lg font-bold text-(--pry-clr) sec-ff">Staff</h2>
                            <p className="text-sm text-(--pry-clr)/70 sec-ff mt-0.5">
                                Manage team members for this store
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/dashboard/roles"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-(--pry-clr) text-sm font-semibold sec-ff hover:bg-(--pry-clr)/5 transition-colors"
                        >
                            View Roles
                        </Link>
                    </div>
                </div>

                {/* Staff list */}
                <GetStaff key={refreshKey} storeId={storeId} />
            </div>
        </div>
    );
}
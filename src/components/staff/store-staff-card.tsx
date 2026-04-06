// src/components/staff/store-staff-card.tsx

"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import GetStaff from "./get-staff";
import ViewRoles from "./view-roles";

interface StoreStaffCardProps {
    storeId: string;
}

type View = "staff" | "roles";

export default function StoreStaffCard({ storeId }: Readonly<StoreStaffCardProps>) {
    const [refreshKey, setRefreshKey] = useState(0);
    const [view, setView] = useState<View>("staff");
    const router = useRouter();

    const handleInvited = useCallback(() => {
        setRefreshKey((k) => k + 1);
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <div className="rounded-2xl bg-(--txt-clr) p-6 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    {/* Left — back + title */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => view === "roles" ? setView("staff") : router.back()}
                            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-(--pry-clr)/5 transition-colors shrink-0"
                        >
                            <ArrowLeft size={16} className="text-(--pry-clr)" />
                        </button>
                        <div>
                            <h2 className="text-lg font-bold text-(--pry-clr) sec-ff">
                                {view === "roles" ? "Roles" : "Staff"}
                            </h2>
                            <p className="text-sm text-(--pry-clr)/70 sec-ff mt-0.5">
                                {view === "roles"
                                    ? "Permissions assigned to each role"
                                    : "Manage team members for this store"}
                            </p>
                        </div>
                    </div>

                    {/* Right — actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        {view === "roles" ? (
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-(--prof-clr) text-(--txt-clr) text-sm font-semibold sec-ff cursor-pointer">
                                <Plus size={15} />
                                Create Role
                            </button>
                        ) : (
                            <button
                                onClick={() => setView("roles")}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-(--pry-clr) text-sm font-semibold sec-ff hover:bg-(--pry-clr)/5 transition-colors"
                            >
                                View Roles
                            </button>
                        )}
                    </div>
                </div>

                {/* View */}
                {view === "staff" ? (
                    <GetStaff key={refreshKey} storeId={storeId} />
                ) : (
                    <ViewRoles />
                )}
            </div>
        </div>
    );
}
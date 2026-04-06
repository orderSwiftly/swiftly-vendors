// src/components/staff/store-staff-card.tsx

"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import GetStaff from "./get-staff";
import ViewRoles from "./view-roles";
import CreateRole from "./create-role";
import RoleDetail from "./role-detail";
import { type Role } from "@/lib/role";

interface StoreStaffCardProps {
    storeId: string;
}

type View = "staff" | "roles" | "create-role" | "role-detail";

export default function StoreStaffCard({ storeId }: Readonly<StoreStaffCardProps>) {
    const [refreshKey, setRefreshKey] = useState(0);
    const [rolesKey, setRolesKey] = useState(0);
    const [view, setView] = useState<View>("staff");
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const router = useRouter();

useEffect(() => {
    const handleFocus = () => setRefreshKey((k) => k + 1);
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
}, []);

    const handleBack = () => {
        if (view === "role-detail") { setView("roles"); return; }
        if (view === "create-role") { setView("roles"); return; }
        if (view === "roles") { setView("staff"); return; }
        router.back();
    };

    const titles: Record<View, { title: string; subtitle: string }> = {
        "staff":       { title: "Staff", subtitle: "Manage team members for this store" },
        "roles":       { title: "Roles", subtitle: "Permissions assigned to each role" },
        "create-role": { title: "Create Role", subtitle: "Define a name and set permissions" },
        "role-detail": { title: selectedRole?.name ?? "Role", subtitle: `${selectedRole?.staff_count ?? 0} staff assigned` },
    };

    return (
        <div className="flex flex-col gap-6 mb-20">
            <div className="rounded-2xl bg-(--txt-clr) p-6 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleBack}
                            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-(--pry-clr)/5 transition-colors shrink-0"
                        >
                            <ArrowLeft size={16} className="text-(--pry-clr)" />
                        </button>
                        <div>
                            <h2 className="text-lg font-bold text-(--pry-clr) sec-ff">
                                {titles[view].title}
                            </h2>
                            <p className="text-sm text-(--pry-clr)/70 sec-ff mt-0.5">
                                {titles[view].subtitle}
                            </p>
                        </div>
                    </div>

                    <div className="shrink-0">
                        {view === "staff" && (
                            <button
                                onClick={() => setView("roles")}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-(--pry-clr) text-sm font-semibold sec-ff hover:bg-(--pry-clr)/5 transition-colors"
                            >
                                View Roles
                            </button>
                        )}
                        {view === "roles" && (
                            <button
                                onClick={() => setView("create-role")}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-(--prof-clr) text-(--txt-clr) text-sm font-semibold sec-ff hover:bg-(--prof-clr)/90 transition-colors cursor-pointer"
                            >
                                <Plus size={15} />
                                Create Role
                            </button>
                        )}
                    </div>
                </div>

                {/* Views */}
                {view === "staff" && <GetStaff key={refreshKey} storeId={storeId} />}
                {view === "roles" && (
                    <ViewRoles
                        key={rolesKey}
                        onSelectRole={(role) => { setSelectedRole(role); setView("role-detail"); }}
                    />
                )}
                {view === "create-role" && (
                    <CreateRole onCreated={() => { setRolesKey((k) => k + 1); setView("roles"); }} />
                )}
                {view === "role-detail" && selectedRole && (
                    <RoleDetail
                        role={selectedRole}
                        onSaved={() => { setRolesKey((k) => k + 1); setView("roles"); }}
                    />
                )}
            </div>
        </div>
    );
}
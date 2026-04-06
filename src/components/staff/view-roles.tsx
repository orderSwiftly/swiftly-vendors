// src/components/staff/view-roles.tsx

"use client";

import { useEffect, useState } from "react";
import { Loader2, Briefcase, Users, ChevronRight } from "lucide-react";
import { getRoles, type Role } from "@/lib/role";
import { toast } from "sonner";
import RoleDetail from "./role-detail";

const PERMISSION_LABELS: Record<string, string> = {
    "organization__manage": "Manage Organization",
    "store__manage": "Manage Stores",
    "location__manage": "Manage Locations",
    "product__manage": "Manage Products",
    "product__list": "View Products",
    "staff__manage": "Manage Staff",
    "inventory__adjust": "Adjust Inventory",
    "inventory__view": "View Inventory",
    "inventory__inflow": "Inventory Inflow",
    "sales__process": "Process Sales",
};

interface ViewRolesProps {
    onSelectRole: (role: Role) => void;
}

export default function ViewRoles({ onSelectRole }: Readonly<ViewRolesProps>) {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRoles()
            .then(setRoles)
            .catch((err: Error) => toast.error(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-10">
                <Loader2 size={20} className="animate-spin text-(--pry-clr)" />
            </div>
        );
    }

    if (roles.length === 0) {
        return (
            <p className="text-sm text-(--pry-clr)/50 sec-ff text-center py-10">
                No roles found.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {roles.map((role) => (
                <button
                    key={role.id}
                    onClick={() => onSelectRole(role)}
                    className="rounded-xl border border-gray-100 p-4 flex flex-col gap-3 text-left hover:border-(--pry-clr)/20 hover:bg-(--pry-clr)/3 transition-colors group"
                >
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-(--pry-clr)/8 flex items-center justify-center shrink-0">
                                <Briefcase size={13} className="text-(--pry-clr)" />
                            </div>
                            <p className="text-sm font-semibold text-(--pry-clr) sec-ff">{role.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-xs text-(--prof-clr) sec-ff bg-(--acc-clr)/20 px-2 py-1 rounded-full">
                                <Users size={12} />
                                {role.staff_count} staff
                            </div>
                            <ChevronRight size={15} className="text-(--pry-clr)/30 group-hover:text-(--pry-clr)/60 transition-colors" />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {role.permissions.map((perm) => (
                            <span
                                key={perm}
                                className="text-xs px-2.5 py-1 rounded-lg bg-(--acc-clr)/15 text-(--pry-clr)/80 sec-ff font-medium"
                            >
                                {PERMISSION_LABELS[perm] ?? perm}
                            </span>
                        ))}
                    </div>
                </button>
            ))}
        </div>
    );
}
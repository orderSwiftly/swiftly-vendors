// src/components/staff/get-roles.tsx

"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/utils/api";

interface GetRolesProps {
    staffId?: string;
    storeId?: string;
}

interface Role {
    id: string;
    name: string;
    description: string;
}

export default function GetRoles({ staffId, storeId }: Readonly<GetRolesProps>) {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No token found");

                // Build URL with query params if storeId is provided
                let url = "/roles";
                if (storeId) {
                    url += `?store_id=${storeId}`;
                }

                const response = await api.get(url, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setRoles(response.data.roles || response.data || []);
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to fetch roles");
                setRoles([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, [storeId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-4">
                <Loader2 size={16} className="animate-spin text-(--pry-clr)" />
            </div>
        );
    }

    if (roles.length === 0) {
        return (
            <p className="text-sm text-(--pry-clr)/50 sec-ff text-center py-4">
                No roles available for this store.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {roles.map((role) => (
                <div key={role.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                    <div>
                        <p className="text-sm font-semibold text-(--pry-clr) sec-ff">{role.name}</p>
                        {role.description && (
                            <p className="text-xs text-(--pry-clr)/50 sec-ff mt-0.5">{role.description}</p>
                        )}
                    </div>
                    {staffId && (
                        <button className="text-xs px-3 py-1 rounded-md border border-gray-200 text-(--pry-clr) hover:bg-(--pry-clr)/5 transition-colors">
                            Assign
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
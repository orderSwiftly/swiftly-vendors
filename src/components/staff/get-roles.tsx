// src/components/staff/get-roles.tsx

"use client";

import { useEffect, useState } from "react";
import { Loader2, Shield, Crown } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { isProtectedRole, isOrganizationManager } from "@/lib/protected-roles";

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

    const getRoleBadge = (roleName: string) => {
        if (!isProtectedRole(roleName)) return null;
        
        if (isOrganizationManager(roleName)) {
            return {
                icon: <Crown size={12} />,
                text: "Super Admin",
                className: "bg-purple-100 text-purple-700 border-purple-200 pry-ff"
            };
        }
        
        // For Cashier and Store Manager
        return {
            icon: <Shield size={12} />,
            text: "System Role",
            className: "bg-amber-100 text-amber-700 border-amber-200 pry-ff"
        };
    };

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
            {roles.map((role) => {
                const badge = getRoleBadge(role.name);
                
                return (
                    <div 
                        key={role.id} 
                        className={`flex items-center justify-between p-3 rounded-lg border border-gray-100
                            ${badge ? 'bg-gray-50/50' : 'bg-white'}`}
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-semibold text-(--pry-clr) sec-ff">
                                    {role.name}
                                </p>
                                
                                {/* Protection Badge */}
                                {badge && (
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border ${badge.className}`}>
                                        {badge.icon}
                                        {badge.text}
                                    </span>
                                )}
                            </div>
                            
                            {role.description && (
                                <p className="text-xs text-(--pry-clr)/50 sec-ff mt-0.5">
                                    {role.description}
                                </p>
                            )}
                        </div>
                        
                        {staffId && (
                            <button 
                                className="text-xs px-3 py-1 rounded-md border border-gray-200 text-(--pry-clr) hover:bg-(--pry-clr)/5 transition-colors"
                                disabled={!!badge} // Optional: Disable assignment for system roles
                                title={badge ? `${role.name} is a system role and cannot be assigned` : "Assign role"}
                            >
                                Assign
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
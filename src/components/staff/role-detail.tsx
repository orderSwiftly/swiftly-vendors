// src/components/staff/role-detail.tsx

"use client";

import { useEffect, useState } from "react";
import { Loader2, Users, Shield, Crown } from "lucide-react";
import { toast } from "sonner";
import { getRoleDetails, editRole, type Role, type RoleDetails, type RolePermissions, ALL_PERMISSIONS } from "@/lib/role";
import { isProtectedRole, getRoleProtectionStatus, isOrganizationManager, isStoreManager, isCashier } from "@/lib/protected-roles";
import RevokeRoleModal from "./revoke-role-modal";

const PERMISSION_LABELS: Record<string, { label: string; description: string }> = {
    "organization__manage": { label: "Manage Organization", description: "Full control over organization settings" },
    "store__manage":        { label: "Manage Stores", description: "Create, edit and deactivate stores" },
    "location__manage":     { label: "Manage Locations", description: "Add and manage store locations" },
    "product__manage":      { label: "Manage Products", description: "Create, edit and delete products" },
    "product__list":        { label: "View Products", description: "Read-only access to product listings" },
    "staff__manage":        { label: "Manage Staff", description: "Invite, edit and dismiss staff members" },
    "inventory__adjust":    { label: "Adjust Inventory", description: "Make manual inventory adjustments" },
    "inventory__view":      { label: "View Inventory", description: "Read-only access to inventory data" },
    "inventory__inflow":    { label: "Inventory Inflow", description: "Record incoming stock" },
    "sales__process":       { label: "Process Sales", description: "Handle sales transactions" },
};

interface RoleDetailProps {
    role: Role;
    onSaved: () => void;
}

export default function RoleDetailView({ role, onSaved }: Readonly<RoleDetailProps>) {
    const [detail, setDetail] = useState<RoleDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState(role.name);
    const [selected, setSelected] = useState<Set<string>>(new Set(role.permissions));
    const [saving, setSaving] = useState(false);
    const [originalPermissions, setOriginalPermissions] = useState<Set<string>>(new Set());

    // Check if current role is protected
    const isProtected = isProtectedRole(role.name);
    const isOrgManager = isOrganizationManager(role.name);
    const isStoreMgr = isStoreManager(role.name);
    const isCashierRole = isCashier(role.name);
    const protectionStatus = getRoleProtectionStatus(role.name);

    // Revoke modal state
    const [revokeModalOpen, setRevokeModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        setLoading(true);
        getRoleDetails(role.id)
            .then((data) => {
                setDetail(data);
                setName(data.name);
                const permsSet = new Set(data.permissions);
                setSelected(permsSet);
                setOriginalPermissions(permsSet);
            })
            .catch((err: Error) => toast.error(err.message))
            .finally(() => setLoading(false));
    }, [role.id]);

    const toggle = (perm: string) => {
        // Prevent toggling if role is protected
        if (isProtected) {
            toast.error(protectionStatus.message);
            return;
        }
        
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(perm) ? next.delete(perm) : next.add(perm);
            return next;
        });
    };

    const handleSave = async () => {
        // Prevent saving if role is protected
        if (isProtected) {
            toast.error(protectionStatus.message);
            return;
        }

        if (!name.trim()) { 
            toast.error("Role name is required."); 
            return; 
        }
        
        if (selected.size === 0) { 
            toast.error("Select at least one permission."); 
            return; 
        }

        setSaving(true);
        try {
            const permissionsObj = ALL_PERMISSIONS.reduce((acc, perm) => {
                acc[perm] = selected.has(perm);
                return acc;
            }, {} as RolePermissions);

            await editRole(role.id, {
                name: name.trim(),
                permissions: permissionsObj,
            });
            toast.success(`Role "${name.trim()}" updated.`);
            setOriginalPermissions(new Set(selected));
            onSaved();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update role.");
        } finally {
            setSaving(false);
        }
    };

    const handleRevokeClick = (staffId: string, staffName: string) => {
        setSelectedStaff({ id: staffId, name: staffName });
        setRevokeModalOpen(true);
    };

    const handleRevokeSuccess = () => {
        getRoleDetails(role.id)
            .then((data) => {
                setDetail(data);
                setName(data.name);
                const permsSet = new Set(data.permissions);
                setSelected(permsSet);
                setOriginalPermissions(permsSet);
            })
            .catch((err: Error) => toast.error(err.message));
    };

    const getRoleIcon = () => {
        if (isOrgManager) return <Crown size={18} className="text-purple-600" />;
        if (isStoreMgr) return <Shield size={18} className="text-blue-600" />;
        if (isCashierRole) return <Shield size={18} className="text-green-600" />;
        return null;
    };

    const getRoleBadgeColor = () => {
        if (isOrgManager) return "bg-purple-50 border-purple-200 text-purple-700";
        if (isStoreMgr) return "bg-blue-50 border-blue-200 text-blue-700";
        if (isCashierRole) return "bg-green-50 border-green-200 text-green-700";
        return "bg-amber-50 border-amber-200 text-amber-700";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-10">
                <Loader2 size={20} className="animate-spin text-(--pry-clr)" />
            </div>
        );
    }

    // Check if any changes were made
    const hasChanges = !isProtected && (
        name !== detail?.name || 
        selected.size !== originalPermissions.size ||
        !Array.from(selected).every(p => originalPermissions.has(p))
    );

    return (
        <div className="flex flex-col gap-6 mb-20">
            {/* Protected Role Warning Banner */}
            {isProtected && (
                <div className={`flex items-start gap-3 p-4 rounded-xl border ${getRoleBadgeColor()}`}>
                    <div className="flex items-center gap-2">
                        {getRoleIcon()}
                        {/* <Shield size={18} /> */}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold sec-ff">
                            System Role - Read Only
                        </p>
                        <p className="text-xs sec-ff mt-1">
                            {protectionStatus.message} This role&apos;s name and permissions are fixed by the system and cannot be modified.
                        </p>
                    </div>
                </div>
            )}

            {/* Revoke Modal */}
            {selectedStaff && (
                <RevokeRoleModal
                    isOpen={revokeModalOpen}
                    onClose={() => {
                        setRevokeModalOpen(false);
                        setSelectedStaff(null);
                    }}
                    onSuccess={handleRevokeSuccess}
                    roleId={role.id}
                    roleName={role.name}
                    staffName={selectedStaff.name}
                    permissionsToRemove={role.permissions}
                />
            )}

            {/* Staff assigned section - remains functional for all roles */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-(--pry-clr)/60 sec-ff uppercase tracking-wide">
                        Assigned Staff
                    </label>
                    <div className="flex items-center gap-1 text-xs text-(--prof-clr) sec-ff bg-(--acc-clr)/20 px-2 py-1 rounded-full">
                        <Users size={12} />
                        {detail?.staff.length ?? 0} staff
                    </div>
                </div>

                {!detail?.staff.length ? (
                    <p className="text-sm text-(--pry-clr)/40 sec-ff py-3 text-center">
                        No staff assigned to this role yet.
                    </p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {detail.staff.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-gray-100 bg-gray-50"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-(--pry-clr)/10 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-bold text-(--pry-clr) sec-ff">
                                            {member.name.slice(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold text-(--pry-clr) sec-ff">{member.name}</p>
                                </div>
                                <span className="text-xs text-(--pry-clr)/50 sec-ff">{member.access_summary}</span>
                                <button
                                    onClick={() => handleRevokeClick(member.id, member.name)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-(--pry-clr) text-sm font-semibold sec-ff hover:bg-(--pry-clr)/5 transition-colors cursor-pointer"
                                >
                                    Revoke
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="border-t border-gray-100" />

            {/* Name - Disabled for protected roles */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-(--pry-clr)/60 sec-ff uppercase tracking-wide">
                    Role Name
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => !isProtected && setName(e.target.value)}
                    disabled={isProtected}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm sec-ff outline-none transition-colors bg-(--txt-clr)
                        ${isProtected 
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' 
                            : 'border-gray-200 text-(--pry-clr) focus:border-(--pry-clr)'
                        }`}
                />
                {isProtected && (
                    <p className="text-xs text-amber-600 sec-ff mt-1">
                        System role names cannot be changed
                    </p>
                )}
            </div>

            {/* Permissions - Disabled for protected roles */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center bg-yellow-200 border border-yellow-500 sec-ff text-yellow-700 p-6 rounded-lg">
                    Changes apply immediately to all {detail?.staff.length ?? 0} staff with this role.
                </div>
                <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-(--pry-clr)/60 sec-ff uppercase tracking-wide">
                        Permissions
                    </label>
                    <span className="text-xs text-(--pry-clr)/40 sec-ff">
                        {selected.size} of {ALL_PERMISSIONS.length} selected
                    </span>
                </div>
                <div className="flex flex-col gap-2">
                    {ALL_PERMISSIONS.map((perm) => {
                        const { label, description } = PERMISSION_LABELS[perm];
                        const checked = selected.has(perm);
                        return (
                            <button
                                key={perm}
                                onClick={() => toggle(perm)}
                                disabled={isProtected}
                                className={`flex items-center justify-between gap-4 p-3.5 rounded-xl border text-left transition-colors
                                    ${isProtected ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
                                    ${checked
                                        ? "border-(--pry-clr)/30 bg-(--pry-clr)/5"
                                        : "border-gray-100 bg-gray-50 hover:border-gray-200"
                                    }`}
                            >
                                <div>
                                    <p className={`text-sm font-semibold sec-ff ${checked ? "text-(--pry-clr)" : "text-(--pry-clr)/70"}`}>
                                        {label}
                                    </p>
                                    <p className="text-xs text-(--pry-clr)/40 sec-ff mt-0.5">{description}</p>
                                </div>
                                <div className={`w-9 h-5 rounded-full transition-colors shrink-0 relative ${checked ? "bg-(--prof-clr)" : "bg-gray-200"}`}>
                                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-(--txt-clr) shadow-sm transition-all ${checked ? "left-4" : "left-0.5"}`} />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Save Button - Only shown for non-protected roles */}
            {!isProtected && (
                <button
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                    className={`w-full py-3 rounded-xl text-sm font-semibold sec-ff flex items-center justify-center gap-2 transition-colors
                        ${hasChanges && !saving
                            ? 'bg-(--prof-clr) text-(--txt-clr) hover:bg-(--prof-clr)/90 cursor-pointer'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : "Save Changes"}
                </button>
            )}
        </div>
    );
}
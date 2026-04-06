// src/components/staff/revoke-role-modal.tsx

"use client";

import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { revokeRole } from "@/lib/role";

interface RevokeRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    roleId: string;
    roleName: string;
    staffName: string;
    permissionsToRemove: string[];
}

const PERMISSION_DISPLAY_NAMES: Record<string, string> = {
    "sales__process": "Process Sale",
    "inventory__view": "View Inventory",
    "inventory__inflow": "Record Inflow",
};

export default function RevokeRoleModal({
    isOpen,
    onClose,
    onSuccess,
    roleId,
    roleName,
    staffName,
    permissionsToRemove,
}: Readonly<RevokeRoleModalProps>) {
    const [revoking, setRevoking] = useState(false);

    const handleRevoke = async () => {
        setRevoking(true);
        try {
            await revokeRole(roleId);
            toast.success(`Role "${roleName}" revoked from ${staffName}`);
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to revoke role");
        } finally {
            setRevoking(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center sec-ff">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
                <div className="p-6">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertTriangle size={24} className="text-red-600" />
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                        Revoke {roleName} role?
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-600 text-center mb-4">
                        From <span className="font-semibold text-gray-900">{staffName}</span>
                    </p>
                    
                    <div className="text-sm text-yellow-600 text-center mb-6 bg-yellow-100 rounded-lg p-3 border border-yellow-300">
                        Revoking this role means {staffName} will lose all access until a new role is assigned. 
                        They will not be dismissed.
                    </div>

                    {/* Permissions to be removed */}
                    {permissionsToRemove.length > 0 && (
                        <div className="mb-6">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Permissions that will be removed
                            </p>
                            <div className="bg-gray-100 rounded-lg p-3 space-y-1">
                                {permissionsToRemove.map((perm) => (
                                    <div key={perm} className="flex items-center gap-2 text-sm text-gray-700">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                        {PERMISSION_DISPLAY_NAMES[perm] || perm}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleRevoke}
                            disabled={revoking}
                            className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {revoking ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Revoking...
                                </>
                            ) : (
                                "Revoke Role"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
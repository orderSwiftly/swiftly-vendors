// src/components/staff/create-role.tsx

"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createRole, ALL_PERMISSIONS } from "@/lib/role";

const PERMISSION_LABELS: Record<string, { label: string; description: string }> = {
    "organization__manage": { label: "Manage Organisation", description: "Full control over organisation settings" },
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

interface CreateRoleProps {
    onCreated: () => void;
}

export default function CreateRole({ onCreated }: Readonly<CreateRoleProps>) {
    const [name, setName] = useState("");
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [saving, setSaving] = useState(false);

    const toggle = (perm: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(perm) ? next.delete(perm) : next.add(perm);
            return next;
        });
    };

    const handleSubmit = async () => {
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
            await createRole({ name: name.trim(), permissions: Array.from(selected) });
            toast.success(`Role "${name.trim()}" created.`);
            onCreated();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to create role.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-(--pry-clr)/60 sec-ff uppercase tracking-wide">
                    Role Name
                </label>
                <input
                    type="text"
                    placeholder="e.g. Cashier, Store Manager…"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-(--pry-clr) sec-ff outline-none focus:border-(--pry-clr) transition-colors bg-white placeholder:text-(--pry-clr)/30"
                />
            </div>

            {/* Permissions */}
            <div className="flex flex-col gap-2">
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
                                className={`flex items-center justify-between gap-4 p-3.5 rounded-xl border text-left transition-colors ${
                                    checked
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
                                {/* Toggle */}
                                <div className={`w-9 h-5 rounded-full transition-colors shrink-0 relative ${checked ? "bg-(--prof-clr)" : "bg-gray-200"}`}>
                                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${checked ? "left-4" : "left-0.5"}`} />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full py-3 rounded-xl bg-(--prof-clr) text-(--txt-clr) text-sm font-semibold sec-ff hover:bg-(--prof-clr)/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
            >
                {saving ? (
                    <>
                        <Loader2 size={15} className="animate-spin" />
                        Creating…
                    </>
                ) : (
                    "Create Role"
                )}
            </button>
        </div>
    );
}
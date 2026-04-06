// src/components/staff/view.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getStaffs, type StaffMember } from "@/lib/staff";
import GetRoles from "./get-roles";
import GrantAccess from "./grant-access";
import DismissStaff from "./dismiss";

interface StaffViewProps {
    staffId: string;
    storeId: string;
}

export default function StaffView({ staffId, storeId }: Readonly<StaffViewProps>) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [member, setMember] = useState<StaffMember | null>(null);
    const [form, setForm] = useState({ first_name: "", last_name: "" });
    const [accessKey, setAccessKey] = useState(0);
    const [dismissOpen, setDismissOpen] = useState(false);

    useEffect(() => {
        const fetchMember = async () => {
            try {
                const data = await getStaffs();
                const found = data.staff.find((s) => s.id === staffId);
                if (!found) {
                    toast.error("Staff member not found.");
                    router.back();
                    return;
                }
                setMember(found);
                const [first_name, ...rest] = found.name.split(" ");
                setForm({ first_name, last_name: rest.join(" ") });
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to load staff member.");
            } finally {
                setLoading(false);
            }
        };
        fetchMember();
    }, [staffId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            toast.success("Changes saved.");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 size={22} className="animate-spin text-(--pry-clr)" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-6 mb-20">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-(--pry-clr)/5 transition-colors"
                    >
                        <ArrowLeft size={16} className="text-(--pry-clr)" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-(--pry-clr) sec-ff">
                            {member?.name ?? "Staff Profile"}
                        </h1>
                        <p className="text-sm text-(--pry-clr)/50 sec-ff">Staff profile</p>
                    </div>
                </div>
                <button
                    onClick={() => router.push(`/dashboard/staff/${storeId}`)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-(--pry-clr) text-sm font-semibold sec-ff hover:bg-(--pry-clr)/5 transition-colors"
                >
                    <ArrowLeft size={14} />
                    Back to Staff
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Left column */}
                <div className="flex flex-col gap-6">
                    {/* Member details */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
                        <p className="text-xs font-semibold text-(--pry-clr)/40 sec-ff uppercase tracking-wide">
                            Member details
                        </p>

                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-base font-bold text-(--pry-clr) sec-ff">
                                    {member?.name ?? "—"}
                                </p>
                                <p className="text-xs text-(--pry-clr)/50 sec-ff mt-0.5">
                                    {member?.email ?? "—"}
                                </p>
                            </div>
                            <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 font-semibold sec-ff">
                                Active
                            </span>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label className="text-xs font-medium text-(--pry-clr)/60 sec-ff">First Name</label>
                                <input
                                    name="first_name"
                                    type="text"
                                    placeholder="First name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                    className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-(--pry-clr) sec-ff outline-none focus:border-(--pry-clr) transition-colors bg-white"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label className="text-xs font-medium text-(--pry-clr)/60 sec-ff">Last Name</label>
                                <input
                                    name="last_name"
                                    type="text"
                                    placeholder="Last name"
                                    value={form.last_name}
                                    onChange={handleChange}
                                    className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-(--pry-clr) sec-ff outline-none focus:border-(--pry-clr) transition-colors bg-white"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full py-2.5 rounded-xl bg-(--bg-clr) text-white text-sm font-semibold sec-ff hover:bg-(--bg-clr)/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Saving…
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>

                    {/* Roles */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
                        <p className="text-xs font-semibold text-(--pry-clr)/40 sec-ff uppercase tracking-wide">
                            Roles
                        </p>
                        <GetRoles />
                    </div>

                    {/* Danger zone */}
<div className="bg-red-100 rounded-2xl border border-red-300 p-6 flex flex-col gap-3">
    <p className="text-xs font-semibold text-(--pry-clr)/40 sec-ff uppercase tracking-wide">
        Danger zone
    </p>
    <div className="flex items-center justify-between gap-4">
        <div>
            <p className="text-sm font-semibold text-red-500 sec-ff">Dismiss staff member</p>
            <p className="text-xs text-(--pry-clr)/50 sec-ff mt-0.5">Permanent. Cannot be undone.</p>
        </div>
        <button
            onClick={() => setDismissOpen(true)}
            className="px-4 py-2 rounded-xl border border-red-300 text-sm font-semibold text-red-500 sec-ff hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
        >
            Dismiss
        </button>
    </div>
</div>

                </div>

                {/* Right column — Grant Access */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <GrantAccess
                        key={accessKey}
                        staffId={staffId}
                        onGranted={() => setAccessKey((k) => k + 1)}
                    />
                </div>
            </div>
            <DismissStaff
    staffId={staffId}
    staffName={member?.name ?? "this staff member"}
    open={dismissOpen}
    onClose={() => setDismissOpen(false)}
    onDismissed={() => router.push(`/dashboard/staff/${storeId}`)}
/>
        </div>
    );
}
// src/components/staff/get-dismissed-staff.tsx

"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, UserX } from "lucide-react";
import { toast } from "sonner";
import { getDismissedStaff, type DismissedStaffMember } from "@/lib/staff";

export default function GetDismissedStaff() {
    const [dismissed, setDismissed] = useState<DismissedStaffMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDismissedStaff()
            .then((data) => setDismissed(data.dismissed_staff))
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

    if (dismissed.length === 0) {
        return (
            <p className="text-sm text-(--pry-clr)/50 sec-ff text-center py-10">
                No dismissed staff.
            </p>
        );
    }

    return (
        <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-xs font-semibold text-(--pry-clr)/60 sec-ff">Staff Member</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-(--pry-clr)/60 sec-ff">Email</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-(--pry-clr)/60 sec-ff">Status</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-(--pry-clr)/60 sec-ff">Dismissed On</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dismissed.map((member) => (
                            <tr key={member.id} className="border-b border-gray-100 hover:bg-(--pry-clr)/5 transition-colors">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                                            <span className="text-xs font-bold text-red-400 sec-ff">
                                                {member.name.slice(0, 2).toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="text-sm font-semibold text-(--pry-clr) sec-ff">{member.name}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-1">
                                        <Mail size={12} className="text-(--pry-clr)/40" />
                                        <span className="text-sm text-(--pry-clr)/70 sec-ff">{member.email || "—"}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-red-500/10 text-red-400 sec-ff font-medium">
                                        <UserX size={11} />
                                        Dismissed
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <span className="text-sm text-(--pry-clr)/60 sec-ff">
                                        {new Date(member.dismissed_at).toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="flex flex-col gap-3 md:hidden">
                {dismissed.map((member) => (
                    <div
                        key={member.id}
                        className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                                <span className="text-sm font-bold text-red-400 sec-ff">
                                    {member.name.slice(0, 2).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-(--pry-clr) sec-ff">{member.name}</p>
                                {member.email && (
                                    <p className="text-xs text-(--pry-clr)/50 sec-ff flex items-center gap-1 mt-0.5">
                                        <Mail size={10} />
                                        {member.email}
                                    </p>
                                )}
                            </div>
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-red-500/10 text-red-400 sec-ff font-medium shrink-0">
                                <UserX size={11} />
                                Dismissed
                            </span>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                            <p className="text-xs text-(--pry-clr)/40 sec-ff">
                                Dismissed on{" "}
                                <span className="font-medium text-(--pry-clr)/60">
                                    {new Date(member.dismissed_at).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
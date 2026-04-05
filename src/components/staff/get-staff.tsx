// src/components/staff/get-staff.tsx

"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, Eye } from "lucide-react";
import { toast } from "sonner";
import { getStaffs, type StaffMember } from "@/lib/staff";
import Link from "next/link";

function RoleBadge({ label }: Readonly<{ label: string }>) {
    const color =
        label === "Unassigned"
            ? "bg-red-100 text-red-500"
            : label.toLowerCase().includes("manager")
            ? "bg-green-100 text-green-600"
            : "bg-yellow-100 text-yellow-600";

    return (
        <span className={`inline-block text-xs px-2.5 py-1 rounded-md font-semibold sec-ff ${color}`}>
            {label}
        </span>
    );
}

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

interface GetStaffProps {
    storeId?: string;
}

export default function GetStaff({ storeId }: Readonly<GetStaffProps>) {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const data = await getStaffs();
            setStaff(data.staff);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to load staff members.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, [storeId]);

    const filtered = staff.filter((m) => {
        const q = search.toLowerCase();
        return (
            m.name.toLowerCase().includes(q) ||
            (m.email ?? "").toLowerCase().includes(q)
        );
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-10">
                <Loader2 size={22} className="animate-spin text-(--pry-clr)" />
            </div>
        );
    }

    if (staff.length === 0) {
        return (
            <p className="text-sm text-(--pry-clr)/70 sec-ff text-center py-10">
                No staff members yet. Invite someone to get started.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Toolbar */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-(--txt-clr) flex-1 min-w-[180px]">
                    <Search size={14} className="text-(--pry-clr)/40 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search staff by name or email"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent text-sm text-(--pry-clr) placeholder:text-(--pry-clr)/40 outline-none sec-ff"
                    />
                </div>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm sec-ff">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-(--pry-clr)/50 uppercase tracking-wide">Name</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-(--pry-clr)/50 uppercase tracking-wide">Email</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-(--pry-clr)/50 uppercase tracking-wide">Access</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-(--pry-clr)/50 uppercase tracking-wide">Role</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-(--pry-clr)/50 uppercase tracking-wide">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-sm text-(--pry-clr)/50 sec-ff">
                                    No staff match your search.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((member, i) => (
                                <tr
                                    key={member.id}
                                    className={`transition-colors hover:bg-gray-50 ${
                                        i !== filtered.length - 1 ? "border-b border-gray-100" : ""
                                    }`}
                                >
                                    <td className="px-4 py-3">
                                        <span className="font-medium text-(--pry-clr) truncate max-w-[160px] block">
                                            {member.name}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-(--pry-clr)/60 text-xs">
                                        {member.email ?? "—"}
                                    </td>
                                    <td className="px-4 py-3 text-(--pry-clr)/70 text-xs">
                                        {member.access ?? "—"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <RoleBadge label={member.access ?? "Unassigned"} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link
                                            href={`/dashboard/staff/${storeId}/${member.id}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-(--pry-clr) text-xs font-semibold sec-ff hover:bg-(--pry-clr)/5 transition-colors"
                                        >
                                            <Eye size={13} />
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col gap-2 md:hidden sec-ff">
                {filtered.length === 0 ? (
                    <p className="text-sm text-(--pry-clr)/50 sec-ff text-center py-6">
                        No staff match your search.
                    </p>
                ) : (
                    filtered.map((member) => (
                        <div
                            key={member.id}
                            className="rounded-xl border border-gray-200 bg-(--txt-clr) p-4 flex flex-col gap-3"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 rounded-full bg-(--pry-clr)/10 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-bold text-(--pry-clr)">
                                            {getInitials(member.name)}
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-(--pry-clr) truncate">{member.name}</p>
                                        <p className="text-xs text-(--pry-clr)/60 truncate">{member.email ?? "—"}</p>
                                    </div>
                                </div>
                                <RoleBadge label={member.access ?? "Unassigned"} />
                            </div>
                            {member.access && (
                                <p className="text-xs text-(--pry-clr)/50 sec-ff">
                                    Access: <span className="text-(--pry-clr)/80 font-medium">{member.access}</span>
                                </p>
                            )}
                            <div className="pt-1 border-t border-gray-100">
                                <Link
                                    href={`/dashboard/staff/${storeId}/${member.id}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-(--pry-clr) text-xs font-semibold sec-ff hover:bg-(--pry-clr)/5 transition-colors"
                                >
                                    <Eye size={13} />
                                    View
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
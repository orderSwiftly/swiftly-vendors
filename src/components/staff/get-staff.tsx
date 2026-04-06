// src/components/staff/get-staff.tsx

"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Mail, Key, X, Eye, Briefcase, Users, UserMinus, Search, UserX, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { getStaffs, type StaffMember } from "@/lib/staff";
import InviteStaff from "./invite-staff";

interface GetStaffProps {
    storeId?: string;
}

type FilterTab = "all" | "unassigned" | "dismissed";

const FILTER_OPTIONS: { key: FilterTab; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: "All Staff", icon: <Users size={13} /> },
    { key: "unassigned", label: "Unassigned", icon: <UserMinus size={13} /> },
    { key: "dismissed", label: "Dismissed", icon: <UserX size={13} /> },
];

export default function GetStaff({ storeId: propStoreId }: Readonly<GetStaffProps>) {
    const params = useParams();
    const router = useRouter();
    const storeId = propStoreId || (params?.storeId as string);

    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
    const [search, setSearch] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchStaff = async () => {
        if (!storeId) { setLoading(false); return; }
        try {
            setLoading(true);
            const data = await getStaffs(storeId);
            setStaff(data.staff);
            setTotal(data.total);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to load staff members.");
            setStaff([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStaff(); }, [storeId]);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleViewStaff = (staffId: string) => {
        router.push(`/dashboard/staff/${storeId}/${staffId}`);
    };

    const filteredStaff = useMemo(() => {
        let list = staff;

        if (activeFilter === "unassigned") list = list.filter((m) => !m.role);
        else if (activeFilter === "dismissed") list = list.filter((m) => m.dismissed);

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (m) =>
                    m.name.toLowerCase().includes(q) ||
                    (m.email ?? "").toLowerCase().includes(q)
            );
        }

        return list;
    }, [staff, activeFilter, search]);

    const activeOption = FILTER_OPTIONS.find((o) => o.key === activeFilter)!;

    const emptyMessage = () => {
        if (activeFilter === "dismissed") return "No dismissed staff.";
        if (activeFilter === "unassigned") return "All staff members have roles assigned.";
        if (search) return `No staff match "${search}".`;
        return null;
    };

    if (!storeId) {
        return (
            <div className="rounded-2xl bg-(--txt-clr) p-6">
                <p className="text-sm text-(--pry-clr)/70 sec-ff text-center py-10">
                    No store selected. Please select a store first.
                </p>
            </div>
        );
    }

    return (
        <>
            {selectedStaff && (
                <StaffDetailsModal
                    staff={selectedStaff}
                    onClose={() => setSelectedStaff(null)}
                    onViewFullProfile={() => handleViewStaff(selectedStaff.id)}
                />
            )}

            <div className="rounded-2xl bg-(--txt-clr) p-6 flex flex-col gap-4 sec-ff">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-(--pry-clr) sec-ff">Staff Members</h2>
                        <p className="text-sm text-(--pry-clr)/70 sec-ff mt-0.5">
                            Total: {total} staff member{total !== 1 ? "s" : ""}
                        </p>
                    </div>
                    <InviteStaff storeId={storeId} variant="button-only" onInvited={fetchStaff} />
                </div>

                {/* Search + Filter row */}
                <div className="flex gap-2">
                    {/* Search */}
                    <div className="relative flex-1 min-w-0">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--pry-clr)/40 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by name or email…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm text-(--pry-clr) sec-ff outline-none focus:border-(--prof-clr) transition-colors bg-white placeholder:text-(--pry-clr)/30"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--pry-clr)/40 hover:text-(--pry-clr) transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Filter dropdown */}
                    <div className="relative shrink-0" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen((v) => !v)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold sec-ff transition-colors whitespace-nowrap ${
                                activeFilter !== "all"
                                    ? "border-(--prof-clr) bg-(--pry-clr)/5 text-(--pry-clr)"
                                    : "border-gray-200 bg-white text-(--pry-clr)"
                            }`}
                        >
                            {activeOption.icon}
                            <span className="hidden sm:inline">{activeOption.label}</span>
                            <ChevronDown
                                size={14}
                                className={`text-(--pry-clr)/50 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl border border-gray-200 shadow-lg z-20 overflow-hidden">
                                {FILTER_OPTIONS.map(({ key, label, icon }) => (
                                    <button
                                        key={key}
                                        onClick={() => { setActiveFilter(key); setDropdownOpen(false); }}
                                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm sec-ff transition-colors ${
                                            activeFilter === key
                                                ? "bg-(--pry-clr)/8 text-(--pry-clr) font-semibold"
                                                : "text-(--pry-clr)/70 hover:bg-gray-50"
                                        }`}
                                    >
                                        {icon}
                                        {label}
                                        {activeFilter === key && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-(--acc-clr)" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 size={22} className="animate-spin text-(--pry-clr)" />
                    </div>
                ) : filteredStaff.length === 0 ? (
                    <div className="text-center py-10">
                        {emptyMessage() ? (
                            <p className="text-sm text-(--pry-clr)/50 sec-ff">{emptyMessage()}</p>
                        ) : (
                            <div>
                                <p className="text-sm text-(--pry-clr)/70 sec-ff mb-3">
                                    No staff members found for this store.
                                </p>
                                <InviteStaff storeId={storeId} variant="button-with-text" />
                            </div>
                        )}
                    </div>
                ) : (
                    <StaffTable
                        staff={filteredStaff}
                        onViewDetails={(member) => setSelectedStaff(member)}
                        onViewFullProfile={(id) => handleViewStaff(id)}
                    />
                )}
            </div>
        </>
    );
}

function StaffTable({
    staff,
    onViewDetails,
    onViewFullProfile,
}: {
    staff: StaffMember[];
    onViewDetails: (member: StaffMember) => void;
    onViewFullProfile: (id: string) => void;
}) {
    return (
        <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-xs font-semibold text-(--pry-clr)/60 sec-ff">Staff Member</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-(--pry-clr)/60 sec-ff">Email</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-(--pry-clr)/60 sec-ff">Role</th>
                            <th className="text-left py-3 px-4 text-xs font-semibold text-(--pry-clr)/60 sec-ff">Access Level</th>
                            <th className="text-right py-3 px-4 text-xs font-semibold text-(--pry-clr)/60 sec-ff">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map((member) => (
                            <tr key={member.id} className="border-b border-gray-100 hover:bg-(--pry-clr)/5 transition-colors">
                                <td className="py-3 px-4">
                                    <button onClick={() => onViewDetails(member)} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-(--pry-clr)/10 flex items-center justify-center shrink-0">
                                            <span className="text-xs font-bold text-(--pry-clr) sec-ff">
                                                {member.name.slice(0, 2).toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="text-sm font-semibold text-(--pry-clr) sec-ff">{member.name}</span>
                                    </button>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-1">
                                        <Mail size={12} className="text-(--pry-clr)/40" />
                                        <span className="text-sm text-(--pry-clr)/70 sec-ff">{member.email || "—"}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    {member.role ? (
                                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-blue-500/10 text-blue-600 sec-ff font-medium">
                                            <Briefcase size={10} />
                                            {member.role}
                                        </span>
                                    ) : (
                                        <span className="text-sm text-(--pry-clr)/40 sec-ff">—</span>
                                    )}
                                </td>
                                <td className="py-3 px-4">
                                    {member.access ? (
                                        <span className="text-xs px-2 py-1 rounded-md bg-purple-500/10 text-purple-600 sec-ff font-medium">
                                            {member.access}
                                        </span>
                                    ) : (
                                        <span className="text-sm text-(--pry-clr)/40 sec-ff">—</span>
                                    )}
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <button
                                        onClick={() => onViewFullProfile(member.id)}
                                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-(--pry-clr) hover:bg-(--pry-clr)/5 transition-colors flex items-center gap-1 ml-auto"
                                    >
                                        <Eye size={12} />
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile */}
            <div className="flex flex-col gap-3 md:hidden">
                {staff.map((member) => (
                    <MobileStaffCard
                        key={member.id}
                        staff={member}
                        onViewDetails={() => onViewDetails(member)}
                        onViewFullProfile={() => onViewFullProfile(member.id)}
                    />
                ))}
            </div>
        </>
    );
}

function MobileStaffCard({
    staff,
    onViewDetails,
    onViewFullProfile,
}: Readonly<{
    staff: StaffMember;
    onViewDetails: () => void;
    onViewFullProfile: () => void;
}>) {
    return (
        <div className="w-full p-4 rounded-xl border border-gray-200 hover:border-(--pry-clr)/30 hover:bg-(--pry-clr)/5 transition-all">
            <div className="flex items-start justify-between mb-3">
                <button onClick={onViewDetails} className="flex items-center gap-3 flex-1 text-left">
                    <div className="w-10 h-10 rounded-lg bg-(--pry-clr)/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-(--pry-clr) sec-ff">
                            {staff.name.slice(0, 2).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-(--pry-clr) sec-ff">{staff.name}</p>
                        {staff.email && (
                            <p className="text-xs text-(--pry-clr)/50 sec-ff flex items-center gap-1 mt-0.5">
                                <Mail size={10} />
                                {staff.email}
                            </p>
                        )}
                    </div>
                </button>
                <button
                    onClick={onViewFullProfile}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-(--pry-clr) hover:bg-(--pry-clr)/5 transition-colors flex items-center gap-1"
                >
                    <Eye size={12} />
                    View
                </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                {staff.role && (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-blue-500/10 text-blue-600 sec-ff font-medium">
                        <Briefcase size={10} />
                        {staff.role}
                    </span>
                )}
                {staff.access && (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-purple-500/10 text-purple-600 sec-ff font-medium">
                        <Key size={10} />
                        {staff.access}
                    </span>
                )}
                {!staff.role && !staff.access && (
                    <span className="text-xs text-(--pry-clr)/40 sec-ff">No roles or access assigned</span>
                )}
            </div>
        </div>
    );
}

function StaffDetailsModal({
    staff,
    onClose,
    onViewFullProfile,
}: Readonly<{
    staff: StaffMember;
    onClose: () => void;
    onViewFullProfile: () => void;
}>) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-(--pry-clr) sec-ff">Staff Details</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-medium text-(--pry-clr)/50 sec-ff">Name</label>
                        <p className="text-sm font-semibold text-(--pry-clr) sec-ff">{staff.name}</p>
                    </div>
                    {staff.email && (
                        <div>
                            <label className="text-xs font-medium text-(--pry-clr)/50 sec-ff flex items-center gap-1">
                                <Mail size={12} /> Email
                            </label>
                            <p className="text-sm text-(--pry-clr) sec-ff">{staff.email}</p>
                        </div>
                    )}
                    <div>
                        <label className="text-xs font-medium text-(--pry-clr)/50 sec-ff flex items-center gap-1">
                            <Briefcase size={12} /> Role
                        </label>
                        <p className="text-sm text-(--pry-clr) sec-ff">{staff.role || "No role assigned"}</p>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-(--pry-clr)/50 sec-ff flex items-center gap-1">
                            <Key size={12} /> Access Level
                        </label>
                        <p className="text-sm text-(--pry-clr) sec-ff">{staff.access || "No special access"}</p>
                    </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm sec-ff"
                    >
                        Close
                    </button>
                    <button
                        onClick={onViewFullProfile}
                        className="flex-1 px-4 py-2 bg-(--pry-clr) text-white rounded-lg hover:bg-(--pry-clr)/90 transition-colors flex items-center justify-center gap-2 text-sm sec-ff"
                    >
                        <Eye size={14} />
                        View Full Profile
                    </button>
                </div>
            </div>
        </div>
    );
}
// src/components/staff/get-staff.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, UserPlus, Mail, Key, X, Eye, Briefcase, Users, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { getStaffs, type StaffMember } from "@/lib/staff";
import InviteStaff from "./invite-staff";

interface GetStaffProps {
    storeId?: string; // Optional for backward compatibility
}

export default function GetStaff({ storeId: propStoreId }: Readonly<GetStaffProps>) {
    const params = useParams();
    const router = useRouter();
    // Get storeId from URL params if not provided as prop
    const storeId = propStoreId || (params?.storeId as string);
    
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [unassignedStaff, setUnassignedStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingUnassigned, setLoadingUnassigned] = useState(false);
    const [total, setTotal] = useState(0);
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [showUnassigned, setShowUnassigned] = useState(false);

    useEffect(() => {
        const fetchStaff = async () => {
            if (!storeId) {
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                // Pass the store_id to only get staff for this specific store
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

        fetchStaff();
    }, [storeId]);

    const fetchUnassignedStaff = async () => {
        if (!storeId) return;
        
        setLoadingUnassigned(true);
        try {
            const data = await getStaffs(storeId);
            // Filter staff members who don't have a role assigned
            const withoutRole = data.staff.filter((member) => !member.role);
            setUnassignedStaff(withoutRole);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to load unassigned staff.");
            setUnassignedStaff([]);
        } finally {
            setLoadingUnassigned(false);
        }
    };

    const handleViewStaff = (staffId: string) => {
        router.push(`/dashboard/staff/${storeId}/${staffId}`);
    };

    const handleToggleUnassigned = () => {
        if (!showUnassigned) {
            fetchUnassignedStaff();
        }
        setShowUnassigned(!showUnassigned);
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
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-(--pry-clr) sec-ff">Staff Members</h2>
                        <p className="text-sm text-(--pry-clr)/70 sec-ff mt-0.5">
                            Total: {total} staff member{total !== 1 ? "s" : ""}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleToggleUnassigned}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-(--pry-clr) hover:bg-(--pry-clr)/5 transition-colors"
                        >
                            {showUnassigned ? <Users size={16} /> : <UserMinus size={16} />}
                            {showUnassigned ? "Hide Unassigned" : "Show Unassigned"}
                        </button>
                        <InviteStaff storeId={storeId} variant="button-only" onInvited={() => {
                            // Refresh both lists when new staff is invited
                            const fetchData = async () => {
                                const data = await getStaffs(storeId);
                                setStaff(data.staff);
                                setTotal(data.total);
                                if (showUnassigned) {
                                    const withoutRole = data.staff.filter((member) => !member.role);
                                    setUnassignedStaff(withoutRole);
                                }
                            };
                            fetchData();
                        }} />
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 size={22} className="animate-spin text-(--pry-clr)" />
                    </div>
                ) : staff.length === 0 && (!showUnassigned || unassignedStaff.length === 0) ? (
                    <div className="text-center py-10">
                        <p className="text-sm text-(--pry-clr)/70 sec-ff mb-3">
                            No staff members found for this store.
                        </p>
                        <InviteStaff storeId={storeId} variant="button-with-text" />
                    </div>
                ) : (
                    <>
                        {/* All Staff Section */}
                        {staff.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-(--pry-clr)/70 sec-ff mb-3 flex items-center gap-2">
                                    <Users size={14} />
                                    All Staff Members
                                </h3>
                                <StaffTable 
                                    staff={staff} 
                                    onViewDetails={(member) => setSelectedStaff(member)}
                                    onViewFullProfile={(id) => handleViewStaff(id)}
                                />
                            </div>
                        )}

                        {/* Unassigned Staff Section (Staff without roles) */}
                        {showUnassigned && (
                            <div className="mt-4">
                                <h3 className="text-sm font-semibold text-(--pry-clr)/70 sec-ff mb-3 flex items-center gap-2">
                                    <UserMinus size={14} />
                                    Unassigned Staff (No Role Assigned)
                                </h3>
                                {loadingUnassigned ? (
                                    <div className="flex items-center justify-center py-6">
                                        <Loader2 size={18} className="animate-spin text-(--pry-clr)" />
                                    </div>
                                ) : unassignedStaff.length === 0 ? (
                                    <p className="text-sm text-(--pry-clr)/50 sec-ff text-center py-6">
                                        All staff members have roles assigned.
                                    </p>
                                ) : (
                                    <StaffTable 
                                        staff={unassignedStaff} 
                                        onViewDetails={(member) => setSelectedStaff(member)}
                                        onViewFullProfile={(id) => handleViewStaff(id)}
                                    />
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

// Separate component for the staff table/cards to avoid duplication
function StaffTable({ 
    staff, 
    onViewDetails, 
    onViewFullProfile 
}: { 
    staff: StaffMember[];
    onViewDetails: (member: StaffMember) => void;
    onViewFullProfile: (id: string) => void;
}) {
    return (
        <>
            {/* Desktop Table View - hidden on mobile */}
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
                            <tr
                                key={member.id}
                                className="border-b border-gray-100 hover:bg-(--pry-clr)/5 transition-colors group"
                            >
                                <td className="py-3 px-4">
                                    <button
                                        onClick={() => onViewDetails(member)}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-(--pry-clr)/10 flex items-center justify-center shrink-0">
                                            <span className="text-xs font-bold text-(--pry-clr) sec-ff">
                                                {member.name.slice(0, 2).toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="text-sm font-semibold text-(--pry-clr) sec-ff">
                                            {member.name}
                                        </span>
                                    </button>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-1">
                                        <Mail size={12} className="text-(--pry-clr)/40" />
                                        <span className="text-sm text-(--pry-clr)/70 sec-ff">
                                            {member.email || "—"}
                                        </span>
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

            {/* Mobile Card View - visible only on mobile */}
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
                <button
                    onClick={onViewDetails}
                    className="flex items-center gap-3 flex-1 text-left"
                >
                    <div className="w-10 h-10 rounded-lg bg-(--pry-clr)/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-(--pry-clr) sec-ff">
                            {staff.name.slice(0, 2).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-(--pry-clr) sec-ff">
                            {staff.name}
                        </p>
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
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
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
                                <Mail size={12} />
                                Email
                            </label>
                            <p className="text-sm text-(--pry-clr) sec-ff">{staff.email}</p>
                        </div>
                    )}
                    
                    <div>
                        <label className="text-xs font-medium text-(--pry-clr)/50 sec-ff flex items-center gap-1">
                            <Briefcase size={12} />
                            Role
                        </label>
                        <p className="text-sm text-(--pry-clr) sec-ff">
                            {staff.role || "No role assigned"}
                        </p>
                    </div>
                    
                    <div>
                        <label className="text-xs font-medium text-(--pry-clr)/50 sec-ff flex items-center gap-1">
                            <Key size={12} />
                            Access Level
                        </label>
                        <p className="text-sm text-(--pry-clr) sec-ff">
                            {staff.access || "No special access"}
                        </p>
                    </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={onViewFullProfile}
                        className="flex-1 px-4 py-2 bg-(--pry-clr) text-white rounded-lg hover:bg-(--pry-clr)/90 transition-colors flex items-center justify-center gap-2"
                    >
                        <Eye size={14} />
                        View Full Profile
                    </button>
                </div>
            </div>
        </div>
    );
}
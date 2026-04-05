// src/components/staff/invite-staff.tsx

"use client";

import { useState } from "react";
import { UserPlus, X, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { inviteStaff, type InviteStaffBody } from "@/lib/staff";

interface InviteStaffProps {
    storeId?: string;
    variant?: "button-only" | "button-with-text" | "full";
    onInvited?: () => void;
}

interface StaffInvite {
    first_name: string;
    last_name: string;
    email: string;
}

export default function InviteStaff({ storeId, variant = "button-only", onInvited }: Readonly<InviteStaffProps>) {
    const [isOpen, setIsOpen] = useState(false);
    const [staffList, setStaffList] = useState<StaffInvite[]>([
        { first_name: "", last_name: "", email: "" }
    ]);
    const [loading, setLoading] = useState(false);

    const handleAddStaff = () => {
        setStaffList([...staffList, { first_name: "", last_name: "", email: "" }]);
    };

    const handleRemoveStaff = (index: number) => {
        if (staffList.length === 1) {
            toast.error("You need at least one staff member to invite");
            return;
        }
        setStaffList(staffList.filter((_, i) => i !== index));
    };

    const handleStaffChange = (index: number, field: keyof StaffInvite, value: string) => {
        const updated = [...staffList];
        updated[index][field] = value;
        setStaffList(updated);
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate all entries
        const invalidEntries = staffList.filter(
            s => !s.first_name.trim() || !s.last_name.trim() || !s.email.trim()
        );
        
        if (invalidEntries.length > 0) {
            toast.error("Please fill in all fields (first name, last name, and email) for each staff member");
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const invalidEmails = staffList.filter(s => !emailRegex.test(s.email.trim()));
        if (invalidEmails.length > 0) {
            toast.error("Please enter valid email addresses for all staff members");
            return;
        }

        if (!storeId) {
            toast.error("Please select a store first");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");

            const inviteData: InviteStaffBody[] = staffList.map(s => ({
                first_name: s.first_name.trim(),
                last_name: s.last_name.trim(),
                email: s.email.trim()
            }));

            const response = await inviteStaff(inviteData);
            
            toast.success(`${response.invited} staff member${response.invited !== 1 ? "s" : ""} invited successfully!`);
            setStaffList([{ first_name: "", last_name: "", email: "" }]);
            setIsOpen(false);
            onInvited?.();
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Failed to invite staff members.");
        } finally {
            setLoading(false);
        }
    };

    const getButtonContent = () => {
        switch (variant) {
            case "button-with-text":
                return (
                    <>
                        <UserPlus size={16} />
                        <span>Invite Staff</span>
                    </>
                );
            case "full":
                return (
                    <div className="flex flex-col items-center gap-3">
                        <UserPlus size={32} className="text-(--pry-clr)" />
                        <span className="text-sm font-medium">Invite Staff Members</span>
                        <span className="text-xs text-(--pry-clr)/50">
                            Send invitations to your team
                        </span>
                    </div>
                );
            default:
                return <UserPlus size={18} />;
        }
    };

    // For staff-card.tsx which doesn't have storeId yet
    if (!storeId && variant !== "full") {
        return (
            <button
                onClick={() => toast.error("Please select a store first")}
                className="p-2 bg-(--pry-clr)/10 text-(--pry-clr) rounded-lg hover:bg-(--pry-clr)/20 transition-colors"
            >
                <UserPlus size={18} />
            </button>
        );
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`flex items-center gap-2 ${
                    variant === "full"
                        ? "w-full flex-col p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-(--pry-clr)/30 hover:bg-(--pry-clr)/5 transition-all"
                        : variant === "button-with-text"
                        ? "px-4 py-2 bg-(--pry-clr) text-white rounded-lg hover:bg-(--pry-clr)/90 transition-colors text-sm font-medium"
                        : "p-2 bg-(--pry-clr)/10 text-(--pry-clr) rounded-lg hover:bg-(--pry-clr)/20 transition-colors"
                }`}
            >
                {getButtonContent()}
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto sec-ff">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 my-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-(--pry-clr) sec-ff">Invite Staff Members</h3>
                                <p className="text-xs text-(--pry-clr)/50 sec-ff mt-0.5">
                                    Add multiple staff members at once
                                </p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleInvite} className="space-y-4">
                            <div className="space-y-3">
                                {staffList.map((staff, index) => (
                                    <div key={index} className="flex gap-3 items-start p-4 border border-gray-100 rounded-xl bg-gray-50/30">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-(--pry-clr)/60 sec-ff mb-1">
                                                    First Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={staff.first_name}
                                                    onChange={(e) => handleStaffChange(index, "first_name", e.target.value)}
                                                    placeholder="John"
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--pry-clr)/50 focus:border-(--pry-clr) text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-(--pry-clr)/60 sec-ff mb-1">
                                                    Last Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={staff.last_name}
                                                    onChange={(e) => handleStaffChange(index, "last_name", e.target.value)}
                                                    placeholder="Doe"
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--pry-clr)/50 focus:border-(--pry-clr) text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-(--pry-clr)/60 sec-ff mb-1">
                                                    Email *
                                                </label>
                                                <input
                                                    type="email"
                                                    value={staff.email}
                                                    onChange={(e) => handleStaffChange(index, "email", e.target.value)}
                                                    placeholder="john@company.com"
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--pry-clr)/50 focus:border-(--pry-clr) text-sm"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveStaff(index)}
                                            className="mt-6 p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={handleAddStaff}
                                className="flex items-center gap-2 text-sm font-medium text-(--pry-clr) hover:text-(--pry-clr)/80 transition-colors sec-ff"
                            >
                                <Plus size={16} />
                                Add another staff member
                            </button>

                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-(--pry-clr) text-white rounded-lg hover:bg-(--pry-clr)/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading && <Loader2 size={16} className="animate-spin" />}
                                    {loading ? "Sending..." : `Send Invitation${staffList.length > 1 ? "s" : ""}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
// src/components/staff/dismiss.tsx

"use client";

import { useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { dismissStaff } from "@/lib/staff";

interface DismissStaffProps {
    staffId: string;
    staffName: string;
    open: boolean;
    onClose: () => void;
    onDismissed: () => void;
}

export default function DismissStaff({ staffId, staffName, open, onClose, onDismissed }: Readonly<DismissStaffProps>) {
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleDismiss = async () => {
        setLoading(true);
        try {
            await dismissStaff({ staffId });
            toast.success(`${staffName} has been dismissed.`);
            onDismissed();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to dismiss staff member.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl p-6 w-full max-w-sm flex flex-col gap-5 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon + heading */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <TriangleAlert size={22} className="text-red-500" />
                    </div>
                    <div>
                        <p className="text-base font-bold text-(--pry-clr) sec-ff">Dismiss staff member?</p>
                        <p className="text-sm text-(--pry-clr)/60 sec-ff mt-1 leading-relaxed">
                            You&apos;re about to dismiss{" "}
                            <span className="font-semibold text-(--pry-clr)">{staffName}</span>.
                            This is permanent and cannot be undone.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-(--pry-clr) sec-ff hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDismiss}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold sec-ff hover:bg-red-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Dismissing…
                            </>
                        ) : (
                            "Yes, dismiss"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
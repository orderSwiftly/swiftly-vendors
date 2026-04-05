// src/components/staff/staff-card.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ChevronRight, MapPin } from "lucide-react";
import { toast } from "sonner";
import { getStores, type Store } from "@/lib/store";
import InviteStaff from "./invite-staff";

export default function StaffCard() {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const data = await getStores();
                setStores(data);
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to load stores.");
            } finally {
                setLoading(false);
            }
        };
        fetchStores();
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <div className="rounded-2xl bg-(--txt-clr) p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-(--pry-clr) sec-ff">Staff</h2>
                        <p className="text-sm text-(--pry-clr)/70 sec-ff mt-0.5">
                            Select a store to manage its staff
                        </p>
                    </div>
                    <InviteStaff variant="button-only" />
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 size={22} className="animate-spin text-(--pry-clr)" />
                    </div>
                ) : stores.length === 0 ? (
                    <p className="text-sm text-(--pry-clr)/70 sec-ff text-center py-10">
                        No stores found. Create a store first.
                    </p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {stores.map((store) => (
                            <button
                                key={store.id}
                                onClick={() => router.push(`/dashboard/staff/${store.id}`)}
                                className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-(--pry-clr)/30 hover:bg-(--pry-clr)/5 transition-all group cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-(--pry-clr)/10 flex items-center justify-center shrink-0">
                                        <span className="text-sm font-bold text-(--pry-clr) sec-ff">
                                            {store.name.slice(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-(--pry-clr) sec-ff">
                                            {store.name}
                                        </p>
                                        <p className="text-xs text-(--pry-clr)/50 sec-ff flex items-center gap-1 mt-0.5">
                                            <MapPin size={10} />
                                            {store.locations.length} location{store.locations.length !== 1 ? "s" : ""}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-md sec-ff font-medium ${
                                        store.is_active
                                            ? "bg-emerald-500/10 text-emerald-500"
                                            : "bg-(--pry-clr)/10 text-(--pry-clr)/50"
                                    }`}>
                                        {store.is_active ? "Active" : "Inactive"}
                                    </span>
                                    <ChevronRight
                                        size={16}
                                        className="text-(--pry-clr)/40 group-hover:text-(--pry-clr) transition-colors"
                                    />
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
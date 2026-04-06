// src/components/staff/staff-card.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ChevronRight, MapPin, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { getStores, type Store } from "@/lib/store";
import InviteStaff from "./invite-staff";
import AllStaff from "./all-staff";

type View = "stores" | "all-staff";

export default function StaffCard() {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<View>("stores");
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
                    <div className="flex items-center gap-3">
                        {view === "all-staff" && (
                            <button
                                onClick={() => setView("stores")}
                                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-(--pry-clr)/5 transition-colors shrink-0"
                            >
                                <ArrowLeft size={16} className="text-(--pry-clr)" />
                            </button>
                        )}
                        <div>
                            <h2 className="text-lg font-bold text-(--pry-clr) sec-ff">
                                {view === "all-staff" ? "All Staff" : "Staff"}
                            </h2>
                            <p className="text-sm text-(--pry-clr)/70 sec-ff mt-0.5">
                                {view === "all-staff"
                                    ? "Every staff member across your organisation"
                                    : "Select a store to manage its staff"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {view === "stores" && (
                            <button
                                onClick={() => setView("all-staff")}
                                className="text-sm font-semibold sec-ff text-(--pry-clr) px-3 py-2 rounded-xl border border-gray-200 hover:bg-(--pry-clr)/5 transition-colors"
                            >
                                See all staff
                            </button>
                        )}
                        <InviteStaff variant="button-only" />
                    </div>
                </div>

                {view === "all-staff" ? (
                    <AllStaff />
                ) : loading ? (
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
                                        <p className="text-sm font-semibold text-(--pry-clr) sec-ff">{store.name}</p>
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
                                    <ChevronRight size={16} className="text-(--pry-clr)/40 group-hover:text-(--pry-clr) transition-colors" />
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
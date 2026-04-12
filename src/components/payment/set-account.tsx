// src/components/payment/set-account.tsx

"use client";

import { useState, useEffect } from "react";
import { setStoreSubaccount, listSubaccounts } from "@/lib/payment";
import { getStores, type Store } from "@/lib/store";
import { toast } from "sonner";
import { Loader2, Link2, ChevronDown } from "lucide-react";

interface Subaccount {
    id: string;
    account_name: string;
    account_number: string;
    bank_name: string;
    created_at: string;
    stores: Store[];
}

interface SetAccountProps {
    onSuccess?: () => void;
}

export default function SetAccount({ onSuccess }: SetAccountProps) {
    const [selectedStoreId, setSelectedStoreId] = useState<string>("");
    const [selectedStoreName, setSelectedStoreName] = useState<string>("");
    const [selectedSubaccountId, setSelectedSubaccountId] = useState<string>("");
    const [stores, setStores] = useState<Store[]>([]);
    const [subaccounts, setSubaccounts] = useState<Subaccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Fetch stores and subaccounts
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all stores using your existing function
                const allStores = await getStores();
                // console.log("All stores:", allStores);
                
                // Fetch subaccounts to see which stores are already linked
                const subaccountsData = await listSubaccounts();
                const allSubaccounts = subaccountsData.subaccounts || [];
                // console.log("Subaccounts:", allSubaccounts);
                
                // Get store IDs that already have subaccounts
                const linkedStoreIds = new Set<string>();
                allSubaccounts.forEach((sub: Subaccount) => {
                    if (sub.stores && sub.stores.length > 0) {
                        sub.stores.forEach((store: Store) => {
                            linkedStoreIds.add(store.id);
                        });
                    }
                });
                // console.log("Linked store IDs:", Array.from(linkedStoreIds));
                
                // Filter stores that don't have subaccounts
                const unlinkedStores = allStores.filter(
                    (store: Store) => !linkedStoreIds.has(store.id)
                );
                
                // console.log("Unlinked stores:", unlinkedStores);
                
                setStores(unlinkedStores);
                setSubaccounts(allSubaccounts);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                toast.error("Failed to load stores");
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    const handleSubmit = async () => {
        if (!selectedStoreId) {
            toast.error("Please select a store");
            return;
        }
        if (!selectedSubaccountId) {
            toast.error("Please select a bank account");
            return;
        }

        setIsSubmitting(true);
        try {
            await setStoreSubaccount({
                store_id: selectedStoreId,
                subaccount_id: selectedSubaccountId,
            });
            
            toast.success(`${selectedStoreName} linked to bank account successfully!`);
            setIsOpen(false);
            
            // Reset selections
            setSelectedStoreId("");
            setSelectedStoreName("");
            setSelectedSubaccountId("");
            
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to link bank account");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get selected subaccount details
    const selectedSubaccount = subaccounts.find(acc => acc.id === selectedSubaccountId);

    if (loading) {
        return (
            <button
                disabled
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-(--sec-clr)/20 text-(--sec-clr) cursor-not-allowed"
            >
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading stores...
            </button>
        );
    }

    if (stores.length === 0) {
        return (
            <button
                disabled
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-(--sec-clr)/20 text-(--sec-clr) cursor-not-allowed sec-ff"
                title="All stores already have linked bank accounts"
            >
                <Link2 className="w-4 h-4" />
                All Stores Linked
            </button>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-(--acc-clr) text-(--txt-clr) hover:opacity-80 transition-all"
            >
                <Link2 className="w-4 h-4" />
                Link Store to Bank Account
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Modal */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-40 bg-black/50"
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Modal */}
                    <div className="absolute right-0 mt-2 z-50 w-96 bg-(--txt-clr) rounded-xl shadow-lg border border-(--sec-clr)/20 overflow-hidden">
                        <div className="p-5 border-b border-(--sec-clr)/20">
                            <h3 className="text-lg font-semibold text-(--pry-clr)">Link Store to Bank Account</h3>
                            <p className="text-sm text-(--prof-clr) mt-1">
                                Select a store and a bank account to receive payments
                            </p>
                        </div>

                        <div className="p-5 space-y-4">
                            {/* Store Selection */}
                            <div>
                                <label className="block text-sm font-medium text-(--pry-clr) mb-2">
                                    Select Store
                                </label>
                                <select
                                    value={selectedStoreId}
                                    onChange={(e) => {
                                        const store = stores.find(s => s.id === e.target.value);
                                        setSelectedStoreId(e.target.value);
                                        setSelectedStoreName(store?.name || store?.store_name || "");
                                    }}
                                    className="w-full p-3 rounded-lg border border-(--sec-clr)/30 bg-(--txt-clr) text-(--pry-clr) focus:outline-none focus:border-(--acc-clr)"
                                >
                                    <option value="">-- Select a store --</option>
                                    {stores.map((store) => (
                                        <option key={store.id} value={store.id}>
                                            {store.name || store.store_name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-(--prof-clr) mt-1">
                                    {stores.length} store(s) need bank account linking
                                </p>
                            </div>

                            {/* Bank Account Selection */}
                            <div>
                                <label className="block text-sm font-medium text-(--pry-clr) mb-2">
                                    Select Bank Account
                                </label>
                                <select
                                    value={selectedSubaccountId}
                                    onChange={(e) => setSelectedSubaccountId(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-(--sec-clr)/30 bg-(--txt-clr) text-(--pry-clr) focus:outline-none focus:border-(--acc-clr)"
                                >
                                    <option value="">-- Select a bank account --</option>
                                    {subaccounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.account_name} - {account.bank_name} ({account.account_number})
                                        </option>
                                    ))}
                                </select>
                                {subaccounts.length === 0 && (
                                    <p className="text-xs text-red-500 mt-1">
                                        No bank accounts available. Please create one first.
                                    </p>
                                )}
                            </div>

                            {/* Selected Info Preview */}
                            {selectedStoreName && selectedSubaccount && (
                                <div className="p-3 rounded-lg bg-(--acc-clr)/5 border border-(--acc-clr)/20">
                                    <p className="text-xs text-(--prof-clr)">You&apos;re linking:</p>
                                    <p className="text-sm font-medium text-(--pry-clr)">{selectedStoreName}</p>
                                    <p className="text-xs text-(--acc-clr) mt-1">
                                        → {selectedSubaccount.account_name} ({selectedSubaccount.bank_name})
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="p-5 border-t border-(--sec-clr)/20 flex gap-3">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border border-(--sec-clr)/30 text-(--pry-clr) hover:bg-(--sec-clr)/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedStoreId || !selectedSubaccountId || isSubmitting || subaccounts.length === 0}
                                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-(--acc-clr) text-(--txt-clr) hover:opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Linking...
                                    </>
                                ) : (
                                    "Link Account"
                                )}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
// src/components/payment/payment-card.tsx

"use client";

import { useEffect, useState } from "react";
import { listSubaccounts } from "@/lib/payment";
import { toast } from "sonner";
import CreateAccountButton from "@/components/payment/create-acct-btn";
import { Landmark, CreditCard, Loader2 } from "lucide-react";

export interface Store {
    id: string;
    name: string;
}

export interface Subaccount {
    id: string;
    account_name: string;
    account_number: string;
    bank_name: string;
    created_at: string;
    stores: Store[];
}

export default function PaymentCard() {
    const [accounts, setAccounts] = useState<Subaccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const data = await listSubaccounts();
            setAccounts(data.subaccounts);
            setError(null);
        } catch (error) {
            setError(error instanceof Error ? error : new Error("An unknown error occurred"));
            toast.error("Failed to fetch subaccounts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    return (
        <section className="w-full flex flex-col gap-6">

            {/* Header */}
            <div className="flex items-center justify-between w-full">
                <div className="flex flex-col gap-0.5">
                    <h1 className="text-(--pry-clr) font-semibold text-xl pry-ff">Payment Accounts</h1>
                    <p className="text-sm text-(--prof-clr) pry-ff">Manage your linked bank accounts</p>
                </div>
                <CreateAccountButton onSuccess={fetchAccounts} />
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex flex-col gap-3 items-center justify-center py-10">
                    <Loader2 className="animate-spin w-6 h-6 text-(--pry-clr)" />
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="w-full rounded-xl border border-red-200 bg-red-50 px-5 py-4">
                    <p className="text-sm text-red-600">{error.message}</p>
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && accounts.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-5 py-20 w-full rounded-xl border border-dashed border-(--sec-clr) bg-(--txt-clr) sec-ff">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-(--acc-clr)/10">
                        <CreditCard className="w-8 h-8 text-(--acc-clr)" />
                    </div>
                    <div className="flex flex-col items-center gap-1.5 text-center">
                        <p className="text-(--pry-clr) font-semibold text-base">No bank accounts yet</p>
                        <p className="text-(--prof-clr) text-sm max-w-sm">
                            Add a bank account to start receiving payouts from your stores.
                        </p>
                    </div>
                    <CreateAccountButton onSuccess={fetchAccounts} />
                </div>
            )}

            {/* Account list */}
            {!loading && !error && accounts.length > 0 && (
                <div className="flex flex-col gap-3 w-full sec-ff">
                    {accounts.map((account) => (
                        <div
                            key={account.id}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full rounded-xl border border-(--sec-clr)/40 bg-(--txt-clr) px-5 py-4"
                        >
                            {/* Left — icon + details */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-(--acc-clr)/10 shrink-0">
                                    <Landmark className="w-5 h-5 text-(--acc-clr)" />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-(--pry-clr) font-semibold text-sm">{account.account_name}</p>
                                    <p className="text-(--prof-clr) text-xs">{account.bank_name}</p>
                                    <p className="text-(--prof-clr) text-xs font-mono tracking-wide">{account.account_number}</p>
                                </div>
                            </div>

                            {/* Right — date + store tags */}
                            <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                                <p className="text-(--prof-clr) text-xs">
                                    Added {new Date(account.created_at).toLocaleDateString("en-NG", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>
                                {account.stores.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {account.stores.map((store) => (
                                            <span
                                                key={store.id}
                                                className="px-2.5 py-0.5 rounded-full bg-(--acc-clr)/10 text-(--tet-clr) text-xs font-medium"
                                            >
                                                {store.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </section>
    );
}
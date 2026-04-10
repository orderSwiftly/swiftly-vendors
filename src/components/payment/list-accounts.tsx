// src/components/payment/list-accounts.tsx

"use client";

import { listSubaccounts } from "@/lib/payment";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Spinner from "../ui/spinner";

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

export default function ListAccounts() {
    const [accounts, setAccounts] = useState<Subaccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const data = await listSubaccounts();
                setAccounts(data.subaccounts);
            } catch (error) {
                setError(error instanceof Error ? error : new Error("An unknown error occurred"));
                toast.error("Failed to fetch subaccounts");
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    return (
        <div>
            {loading && <div className="flex items-center justify-center"><Spinner /></div>}
            {error && <p>Error: {error.message}</p>}
            {!loading && !error && (
                <ul>
                    {accounts.map((account) => (
                        <li key={account.id}>
                            <h3>{account.account_name}</h3>
                            <p>Bank: {account.bank_name}</p>
                            <p>Number: {account.account_number}</p>
                            <p>Added: {new Date(account.created_at).toLocaleDateString()}</p>
                            {account.stores.length > 0 && (
                                <p>Stores: {account.stores.map(s => s.name).join(", ")}</p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
// src/components/payment/list-banks.tsx

"use client";

import { listBanks, resolveAccount } from "@/lib/payment";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Bank {
    id: number;
    code: string;
    name: string;
    provider_type: string;
}

interface ResolvedAccount {
    account_name: string;
    account_number: string;
}

export default function ListBanks() {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // search
    const [search, setSearch] = useState("");
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // resolve
    const [accountNumber, setAccountNumber] = useState("");
    const [resolving, setResolving] = useState(false);
    const [resolved, setResolved] = useState<ResolvedAccount | null>(null);
    const [resolveError, setResolveError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const data = await listBanks();
                setBanks(data.data);
            } catch (error) {
                setError(error instanceof Error ? error : new Error("An unknown error occurred"));
                toast.error("Failed to fetch banks");
            } finally {
                setLoading(false);
            }
        };
        fetchBanks();
    }, []);

    const filteredBanks = banks.filter((bank) =>
        bank.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelectBank = (bank: Bank) => {
        setSelectedBank(bank);
        setSearch(bank.name);
        setDropdownOpen(false);
        setResolved(null);
        setResolveError(null);
    };

    const handleResolve = async () => {
        if (!selectedBank) return toast.error("Please select a bank");
        if (!accountNumber || accountNumber.length < 10) return toast.error("Enter a valid account number");

        setResolving(true);
        setResolved(null);
        setResolveError(null);

        try {
            const data = await resolveAccount(accountNumber, selectedBank.code);
            setResolved(data.data);
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Failed to resolve account";
            setResolveError(msg);
            toast.error(msg);
        } finally {
            setResolving(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 p-4 max-w-md">
            {/* Bank search dropdown */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-(--pry-clr)">Bank</label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder={loading ? "Loading banks..." : "Search bank..."}
                        value={search}
                        disabled={loading}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setSelectedBank(null);
                            setDropdownOpen(true);
                            setResolved(null);
                        }}
                        onFocus={() => setDropdownOpen(true)}
                        className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-(--pry-clr) placeholder:text-white/30 text-sm focus:outline-none focus:border-(--acc-clr)"
                    />
                    {dropdownOpen && search && filteredBanks.length > 0 && (
                        <ul className="absolute z-10 mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-white/10 bg-(--sec-clr) shadow-lg">
                            {filteredBanks.map((bank) => (
                                <li
                                    key={bank.id}
                                    onClick={() => handleSelectBank(bank)}
                                    className="px-3 py-2 text-sm text-(--pry-clr) hover:bg-white/10 cursor-pointer"
                                >
                                    {bank.name}
                                </li>
                            ))}
                        </ul>
                    )}
                    {dropdownOpen && search && filteredBanks.length === 0 && !loading && (
                        <div className="absolute z-10 mt-1 w-full rounded-lg border border-white/10 bg-(--sec-clr) px-3 py-2 text-sm text-white/40">
                            No banks found
                        </div>
                    )}
                </div>
                {error && <p className="text-red-400 text-xs">{error.message}</p>}
            </div>

            {/* Account number input */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-(--pry-clr)">Account Number</label>
                <input
                    type="text"
                    placeholder="Enter account number"
                    value={accountNumber}
                    maxLength={10}
                    onChange={(e) => {
                        setAccountNumber(e.target.value.replace(/\D/g, ""));
                        setResolved(null);
                        setResolveError(null);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-(--pry-clr) placeholder:text-white/30 text-sm focus:outline-none focus:border-(--acc-clr)"
                />
            </div>

            {/* Resolve button */}
            <button
                onClick={handleResolve}
                disabled={resolving || !selectedBank || accountNumber.length < 10}
                className="w-full py-2 rounded-lg bg-(--acc-clr) text-(--pry-clr) font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
                {resolving ? "Resolving..." : "Resolve Account"}
            </button>

            {/* Resolved account display */}
            {resolved && (
                <div className="rounded-lg border border-(--acc-clr)/30 bg-(--acc-clr)/10 px-4 py-3 flex flex-col gap-1">
                    <p className="text-xs text-white/50 uppercase tracking-wide">Account Name</p>
                    <p className="text-(--pry-clr) font-semibold">{resolved.account_name}</p>
                    <p className="text-sm text-white/60">{resolved.account_number}</p>
                </div>
            )}

            {/* Resolve error */}
            {resolveError && (
                <p className="text-red-400 text-sm">{resolveError}</p>
            )}
        </div>
    );
}
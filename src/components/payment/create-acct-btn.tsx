// src/components/payment/create-acct-btn.tsx

"use client";

import { useState } from "react";
import { listBanks, resolveAccount, createSubaccount } from "@/lib/payment";
import { toast } from "sonner";
import { X } from "lucide-react";

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

interface CreateAccountButtonProps {
    onSuccess?: () => void;
}

export default function CreateAccountButton({ onSuccess }: Readonly<CreateAccountButtonProps>) {
    const [open, setOpen] = useState(false);

    // banks
    const [banks, setBanks] = useState<Bank[]>([]);
    const [banksLoading, setBanksLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

    // resolve
    const [accountNumber, setAccountNumber] = useState("");
    const [resolving, setResolving] = useState(false);
    const [resolved, setResolved] = useState<ResolvedAccount | null>(null);

    // submit
    const [submitting, setSubmitting] = useState(false);

    const filteredBanks = banks.filter((b) =>
        b.name.toLowerCase().includes(search.toLowerCase())
    );

    const openModal = async () => {
        setOpen(true);
        if (banks.length > 0) return;
        setBanksLoading(true);
        try {
            const data = await listBanks();
            setBanks(data.data);
        } catch {
            toast.error("Failed to load banks");
        } finally {
            setBanksLoading(false);
        }
    };

    const closeModal = () => {
        setOpen(false);
        setSearch("");
        setSelectedBank(null);
        setAccountNumber("");
        setResolved(null);
        setDropdownOpen(false);
    };

    const handleSelectBank = (bank: Bank) => {
        setSelectedBank(bank);
        setSearch(bank.name);
        setDropdownOpen(false);
        setResolved(null);
    };

    // auto-resolve once account number hits 10 digits and a bank is selected
const handleAccountNumberChange = async (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    setAccountNumber(digits);
    setResolved(null);

    if (digits.length === 10 && selectedBank?.code) {   // guard .code explicitly
        setResolving(true);
        try {
            const data = await resolveAccount(digits, selectedBank.code);
            setResolved(data);
        } catch {
            toast.error("Could not resolve account. Check the number and try again.");
        } finally {
            setResolving(false);
        }
    }
};

    const handleSubmit = async () => {
        if (!selectedBank || !resolved) return;
        setSubmitting(true);
        try {
            await createSubaccount({
                account_number: accountNumber,
                account_bank: selectedBank.code,
            });
            toast.success("Bank account added successfully");
            onSuccess?.();   // <-- add this
            closeModal();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to add bank account");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <button
                onClick={openModal}
                className="px-4 py-2 rounded-lg bg-(--acc-clr) text-(--pry-clr) font-semibold text-sm hover:opacity-90 transition-opacity pry-ff cursor-pointer"
            >
                Add Bank Account
            </button>

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                    onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
                >
<div className="w-full max-w-md bg-(--txt-clr) rounded-xl border border-(--sec-clr)/30 p-6 flex flex-col gap-5">

    {/* Header */}
    <div className="flex items-center justify-between">
        <h2 className="text-(--pry-clr) font-semibold text-base pry-ff">Add Bank Account</h2>
        <button
            onClick={closeModal}
            className="text-(--sec-clr) hover:text-(--pry-clr) text-xl leading-none transition-colors cursor-pointer"
        >
            <X />
        </button>
    </div>

    {/* Bank search */}
    <div className="flex flex-col gap-1 sec-ff">
        <label className="text-sm font-medium text-(--prof-clr)">Bank</label>
        <div className="relative">
            <input
                type="text"
                placeholder={banksLoading ? "Loading banks..." : "Search bank..."}
                value={search}
                disabled={banksLoading}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedBank(null);
                    setResolved(null);
                    setDropdownOpen(true);
                }}
                onFocus={() => setDropdownOpen(true)}
                className="w-full px-3 py-2 rounded-lg border border-(--sec-clr)/40 bg-(--txt-clr) text-(--pry-clr) placeholder:text-(--sec-clr) text-sm focus:outline-none focus:border-(--acc-clr)"
            />
            {dropdownOpen && search && (
                <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-(--sec-clr)/30 bg-(--txt-clr) shadow-lg">
                    {filteredBanks.length > 0 ? (
                        filteredBanks.map((bank) => (
                            <li
                                key={bank.id}
                                onClick={() => handleSelectBank(bank)}
                                className="px-3 py-2 text-sm text-(--pry-clr) hover:bg-(--acc-clr)/10 cursor-pointer"
                            >
                                {bank.name}
                            </li>
                        ))
                    ) : (
                        <li className="px-3 py-2 text-sm text-(--sec-clr)">No banks found</li>
                    )}
                </ul>
            )}
        </div>
    </div>

    {/* Account number */}
    <div className="flex flex-col gap-1 sec-ff">
        <label className="text-sm font-medium text-(--prof-clr)">Account Number</label>
        <input
            type="text"
            inputMode="numeric"
            placeholder="Enter 10-digit account number"
            value={accountNumber}
            onChange={(e) => handleAccountNumberChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-(--sec-clr)/40 bg-(--txt-clr) text-(--pry-clr) placeholder:text-(--sec-clr) text-sm focus:outline-none focus:border-(--acc-clr)"
        />
        {resolving && (
            <p className="text-xs text-(--sec-clr)">Resolving account...</p>
        )}
    </div>

    {/* Resolved account name */}
    {resolved && (
        <div className="rounded-lg border border-(--acc-clr)/30 bg-(--acc-clr)/10 px-4 py-3 flex flex-col gap-0.5 sec-ff">
            <p className="text-xs text-(--prof-clr) uppercase tracking-wide">Account Name</p>
            <p className="text-(--pry-clr) font-semibold">{resolved.account_name}</p>
        </div>
    )}

    {/* Actions */}
    <div className="flex gap-3 pt-1 sec-ff">
        <button
            onClick={closeModal}
            className="flex-1 py-2 rounded-lg border border-(--sec-clr)/40 text-(--prof-clr) text-sm hover:bg-(--sec-clr)/10 transition-colors"
        >
            Cancel
        </button>
        <button
            onClick={handleSubmit}
            disabled={!resolved || submitting}
            className="flex-1 py-2 rounded-lg bg-(--acc-clr) text-(--pry-clr) font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-opacity cursor-pointer"
        >
            {submitting ? "Saving..." : "Save Account"}
        </button>
    </div>

</div>
                </div>
            )}
        </>
    );
}
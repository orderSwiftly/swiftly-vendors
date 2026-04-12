// src/components/payment/del-acct-btn.tsx
"use client";

import { useState } from "react";
import { Trash2, Loader2, X, AlertTriangle } from "lucide-react";

interface DeleteAcctBtnProps {
    accountId: string;
    accountName: string;
    onDelete: (accountId: string) => Promise<void>;
    isDeleting?: boolean;
}

export default function DeleteAcctBtn({ accountId, accountName, onDelete, isDeleting = false }: Readonly<DeleteAcctBtnProps>) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeletingLocal, setIsDeletingLocal] = useState(false);

    const handleDeleteClick = () => {
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeletingLocal(true);
        try {
            await onDelete(accountId);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Delete failed:", error);
        } finally {
            setIsDeletingLocal(false);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {/* Delete Button */}
            <button
                onClick={handleDeleteClick}
                disabled={isDeleting || isDeletingLocal}
                className="p-1 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title="Delete bank account"
            >
                {(isDeleting || isDeletingLocal) ? (
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                ) : (
                    <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600 transition-colors" />
                )}
            </button>

            {/* Confirmation Modal */}
            {isModalOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-50 bg-black/50"
                        onClick={handleCancel}
                    />
                    
                    {/* Modal */}
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
                        <div className="bg-(--txt-clr) rounded-xl shadow-xl border border-(--sec-clr)/20 overflow-hidden">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-5 border-b border-(--sec-clr)/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-(--pry-clr)">Delete Bank Account</h3>
                                </div>
                                <button
                                    onClick={handleCancel}
                                    className="p-1 rounded-lg hover:bg-(--sec-clr)/10 transition-colors"
                                >
                                    <X className="w-5 h-5 text-(--sec-clr)" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-5">
                                <p className="text-(--pry-clr) mb-2">
                                    Are you sure you want to delete <span className="font-semibold text-red-600">&apos;{accountName}&apos;</span>?
                                </p>
                                <p className="text-sm text-(--sec-clr)">
                                    This action cannot be undone. Any stores linked to this account will need to be re-linked to a new bank account.
                                </p>
                                
                                {/* Show warning if account has linked stores */}
                                {/* This would need the stores data passed in */}
                            </div>

                            {/* Modal Footer */}
                            <div className="flex gap-3 p-5 border-t border-(--sec-clr)/20">
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border border-(--sec-clr)/30 text-(--pry-clr) hover:bg-(--sec-clr)/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    disabled={isDeletingLocal}
                                    className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {isDeletingLocal ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        "Yes, Delete"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
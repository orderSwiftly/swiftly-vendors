// src/components/products/import-product.tsx

"use client";

import { useState, useRef } from "react";
import { Upload, X, FileSpreadsheet, Loader2, CheckCircle2 } from "lucide-react";

interface ImportProductProps {
    storeId: string;
    onImported?: () => void;
}

export default function ImportProduct({ storeId, onImported }: Readonly<ImportProductProps>) {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (f: File) => {
        setFile(f);
        setDone(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handleFile(f);
    };

    const handleImport = async () => {
        if (!file) return;
        setLoading(true);
        // TODO: wire up your real import API call here
        // e.g. await importProductsFromCSV(storeId, file);
        await new Promise((r) => setTimeout(r, 1500)); // simulated delay
        setLoading(false);
        setDone(true);
        onImported?.();
        setTimeout(() => {
            setOpen(false);
            setFile(null);
            setDone(false);
        }, 1200);
    };

    const close = () => {
        if (loading) return;
        setOpen(false);
        setFile(null);
        setDone(false);
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-(--pry-clr) sec-ff hover:bg-(--pry-clr)/5 transition-colors cursor-pointer"
            >
                <Upload size={15} />
                Import
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
                    <div className="bg-(--txt-clr) rounded-2xl border border-gray-200 w-full max-w-md p-6 flex flex-col gap-5 shadow-xl">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-(--pry-clr) sec-ff">Import Products</p>
                                <p className="text-xs text-(--pry-clr)/50 sec-ff mt-0.5">Upload a CSV or Excel file to bulk-add products.</p>
                            </div>
                            <button onClick={close} className="text-(--pry-clr)/40 hover:text-(--pry-clr) transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Drop Zone */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => inputRef.current?.click()}
                            className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 cursor-pointer transition-colors ${
                                dragOver
                                    ? "border-(--pry-clr) bg-(--pry-clr)/5"
                                    : file
                                    ? "border-green-400 bg-green-50"
                                    : "border-gray-200 hover:border-(--pry-clr)/40 hover:bg-(--pry-clr)/5"
                            }`}
                        >
                            <input
                                ref={inputRef}
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                className="hidden"
                                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                            />
                            {file ? (
                                <>
                                    <FileSpreadsheet size={28} className="text-green-500" />
                                    <p className="text-sm font-medium text-(--pry-clr) sec-ff">{file.name}</p>
                                    <p className="text-xs text-(--pry-clr)/40 sec-ff">{(file.size / 1024).toFixed(1)} KB</p>
                                </>
                            ) : (
                                <>
                                    <Upload size={28} className="text-(--pry-clr)/30" />
                                    <p className="text-sm text-(--pry-clr)/60 sec-ff">Drag & drop or <span className="text-(--pry-clr) font-medium">browse</span></p>
                                    <p className="text-xs text-(--pry-clr)/40 sec-ff">Supports .csv, .xlsx, .xls</p>
                                </>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={close}
                                disabled={loading}
                                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-(--pry-clr) sec-ff hover:bg-gray-50 disabled:opacity-40 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={!file || loading || done}
                                className="flex-1 py-2.5 rounded-xl bg-(--pry-clr) text-white text-sm font-medium sec-ff flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
                            >
                                {done ? (
                                    <><CheckCircle2 size={15} /> Imported</>
                                ) : loading ? (
                                    <><Loader2 size={15} className="animate-spin" /> Importing…</>
                                ) : (
                                    <><Upload size={15} /> Import</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
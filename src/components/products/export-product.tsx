"use client";

import { useState } from "react";
import { Download, X, Loader2, CheckCircle2, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import type { Product } from "@/lib/products";

interface ExportProductProps {
    products: Product[];
    storeName?: string;
}

type ExportFormat = "csv" | "xlsx";

function getRows(products: Product[]) {
    return products.map((p) => ({
        Name: p.name,
        SKU: p.sku,
        Category: p.category,
        Price: Number(p.price),
        Status: p.is_active ? "Active" : "Inactive",
    }));
}

function exportCSV(products: Product[], filename: string) {
    const rows = getRows(products);
    const csv = [
        ["Name", "SKU", "Category", "Price", "Status"].join(","),
        ...rows.map((r) =>
            [`"${r.Name}"`, `"${r.SKU}"`, `"${r.Category}"`, r.Price, r.Status].join(",")
        ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

function exportXLSX(products: Product[], filename: string) {
    const rows = getRows(products);
    const ws = XLSX.utils.json_to_sheet(rows);

    // Column widths for readability
    ws["!cols"] = [
        { wch: 28 }, // Name
        { wch: 16 }, // SKU
        { wch: 18 }, // Category
        { wch: 12 }, // Price
        { wch: 10 }, // Status
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, `${filename}.xlsx`);
}

export default function ExportProduct({ products, storeName }: Readonly<ExportProductProps>) {
    const [open, setOpen] = useState(false);
    const [format, setFormat] = useState<ExportFormat>("csv");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 600));

        const slug = storeName ? storeName.toLowerCase().replace(/\s+/g, "-") : "products";
        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `${slug}-${timestamp}`;

        if (format === "csv") {
            exportCSV(products, filename);
        } else {
            exportXLSX(products, filename);
        }

        setLoading(false);
        setDone(true);
        setTimeout(() => {
            setOpen(false);
            setDone(false);
        }, 1200);
    };

    const close = () => {
        if (loading) return;
        setOpen(false);
        setDone(false);
    };

    const formats: { id: ExportFormat; label: string; desc: string }[] = [
        {
            id: "csv",
            label: "CSV",
            desc: "Opens in Excel & Google Sheets",
        },
        {
            id: "xlsx",
            label: "Excel (.xlsx)",
            desc: "Formatted workbook, ready to share",
        },
    ];

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-(--pry-clr) sec-ff hover:bg-(--pry-clr)/5 transition-colors cursor-pointer"
            >
                <Download size={15} />
                Export
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-sm p-6 flex flex-col gap-5 shadow-xl">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-(--pry-clr) sec-ff">Export Products</p>
                                <p className="text-xs text-(--pry-clr)/50 sec-ff mt-0.5">
                                    {products.length} product{products.length !== 1 ? "s" : ""} will be exported
                                </p>
                            </div>
                            <button onClick={close} className="text-(--pry-clr)/40 hover:text-(--pry-clr) transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Format Selection */}
                        <div className="flex flex-col gap-2">
                            <p className="text-xs font-medium text-(--pry-clr)/60 sec-ff uppercase tracking-wide">Choose format</p>
                            <div className="flex flex-col gap-2">
                                {formats.map((f) => (
                                    <button
                                        key={f.id}
                                        onClick={() => setFormat(f.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors ${
                                            format === f.id
                                                ? "border-(--pry-clr) bg-(--pry-clr)/5"
                                                : "border-gray-200 hover:border-(--pry-clr)/30"
                                        }`}
                                    >
                                        <span className={format === f.id ? "text-(--pry-clr)" : "text-(--pry-clr)/40"}>
                                            <FileSpreadsheet size={16} />
                                        </span>
                                        <div>
                                            <p className="text-sm font-medium text-(--pry-clr) sec-ff">{f.label}</p>
                                            <p className="text-xs text-(--pry-clr)/50 sec-ff">{f.desc}</p>
                                        </div>
                                        <div className={`ml-auto w-4 h-4 rounded-full border-2 transition-colors ${
                                            format === f.id ? "border-(--pry-clr) bg-(--pry-clr)" : "border-gray-300"
                                        }`} />
                                    </button>
                                ))}
                            </div>
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
                                onClick={handleExport}
                                disabled={loading || done || products.length === 0}
                                className="flex-1 py-2.5 rounded-xl bg-(--pry-clr) text-white text-sm font-medium sec-ff flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
                            >
                                {done ? (
                                    <><CheckCircle2 size={15} /> Exported</>
                                ) : loading ? (
                                    <><Loader2 size={15} className="animate-spin" /> Exporting…</>
                                ) : (
                                    <><Download size={15} /> Export</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
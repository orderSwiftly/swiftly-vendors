"use client";
import { useState } from "react";

export default function ImportModal({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [hasIssues, setHasIssues] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
    if (selectedFile?.name.includes("march")) {
      setHasIssues(true);
    } else {
      setHasIssues(false);
    }
  };

  const handleImport = () => {
    if (!file) {
      alert("Please select a file to import");
      return;
    }
    alert(`Importing ${file.name}...`);
    setFile(null);
    setHasIssues(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-start justify-center pt-20 z-50 overflow-auto">
      <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-[32px] font-semibold text-center">Import products</h2>
        <p className="text-[16px] text-[#101828] text-center mt-1">
          SuperStore · Products · Bulk upload via Excel
        </p>

        <div className="mt-4 border rounded-lg p-4 text-[16px]">
          <h3 className="font-medium">How it works</h3>
          <hr className="my-2" />
          <ol className="mt-2 space-y-2">
            <li className="font-bold">
              1. Download the template <br />
              <span className="text-[14px] font-normal">
                Use the official template. Do not change column headers.
              </span>
            </li>
            <hr className="my-2" />
            <li className="font-bold">
              2. Fill in your products <br />
              <span className="text-[14px] font-normal">
                Required: Name, SKU, Price. Optional: Category, Description.
              </span>
            </li>
            <hr className="my-2" />
            <li className="font-bold">
              3. Upload and review <br />
              <span className="text-[14px] font-normal">
                We validate before importing. Duplicate SKUs will be flagged.
              </span>
            </li>
            <hr className="my-2" />
          </ol>
          <button
            className="mt-3 px-4 py-2 rounded-[10px] cursor-pointer text-sm font-medium"
            style={{
              backgroundColor: "#669917",
              color: "var(--txt-clr)",
            }}
          >
            Download Template (.xlsx)
          </button>
        </div>

        <div className="mt-4 border rounded-lg p-4">
          <p className="text-sm text-gray-600">Upload file</p>
          <div className="mt-3 border-dashed border-2 border-gray-200 rounded p-6 text-center">
            {!file ? (
              <label className="cursor-pointer">
                <div className="text-sm text-gray-500">
                  Browse and choose the files you want to upload from your
                  computer
                </div>
                <input
                  onChange={handleFileChange}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                />
                <div
                  className="mt-3 inline-block px-3 py-1 rounded"
                  style={{
                    backgroundColor: "var(--prof-clr)",
                    color: "var(--txt-clr)",
                  }}
                >
                  +
                </div>
              </label>
            ) : (
              <div>
                <div className="text-sm">{file.name}</div>
                <div className="text-xs text-gray-400">
                  48 rows detected · {Math.round(file.size / 1024)} KB
                </div>
              </div>
            )}
          </div>
        </div>

        {hasIssues && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
            3 rows have issues. These will be skipped. Fix and re-upload, or
            proceed with the remaining 45 rows.
          </div>
        )}

        <div className="mt-4 flex justify-between gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            className="flex-1 px-4 py-2 rounded font-medium cursor-pointer"
            style={{
              backgroundColor: "var(--prof-clr)",
              color: "var(--txt-clr)",
            }}
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}

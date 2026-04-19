// src/components/products/get-template.tsx
import { getProductTemplateRaw } from "@/lib/products";
import { Download } from "lucide-react";
import { toast } from "sonner";

export default function GetTemplateComponent() {
  const handleDownloadTemplate = async () => {
    try {
      const csvData = await getProductTemplateRaw();
      
      // Create blob and download
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "product_template.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      
      toast.success("Template downloaded successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to download template");
    }
  };

  return (
    <button
      onClick={handleDownloadTemplate}
      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-(--pry-clr) hover:bg-(--pry-clr)/5 transition-colors border border-gray-200 sec-ff cursor-pointer"
    >
      <Download size={20} />
      Download Template
    </button>
  );
}
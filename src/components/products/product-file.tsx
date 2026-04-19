// src/components/products/product-file.tsx

"use client";

import ImportProduct from "./import-product";
import ExportProduct from "./export-product";
import GetTemplateComponent from "./get-template";
import type { Product } from "@/lib/products";

interface ProductFileProps {
    storeId: string;
    storeName?: string;
    products: Product[];
    onImported?: () => void;
}

export default function ProductFile({ storeId, storeName, products, onImported }: Readonly<ProductFileProps>) {
    return (
        <div className="flex flex-col gap-0.5">
            <ImportProduct storeId={storeId} onImported={onImported} />
            <ExportProduct products={products} storeName={storeName} />
            <div className="h-px bg-gray-200 my-1" /> {/* Separator */}
            <GetTemplateComponent />
        </div>
    );
}
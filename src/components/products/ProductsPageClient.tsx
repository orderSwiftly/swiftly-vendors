"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStores } from "@/lib/store";
import GetProducts from "./get-products";

export default function ProductsPageClient({
    storeId,
}: Readonly<{
    storeId: string;
}>) {
    const router = useRouter();
    const [storeName, setStoreName] = useState<string>("");

    useEffect(() => {
        getStores()
            .then((stores) => {
                const store = stores.find((s) => s.id === storeId);
                setStoreName(store?.store_name || store?.name || "");
            })
            .catch(console.error);
    }, [storeId]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Go back"
                >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-(--pry-clr) sec-ff">Products</h1>
                    {storeName && (
                        <p className="text-sm text-(--pry-clr)/60 sec-ff mt-0.5">{storeName}</p>
                    )}
                </div>
            </div>

            <GetProducts storeId={storeId} storeName={storeName} />
        </div>
    );
}
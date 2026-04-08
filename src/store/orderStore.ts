// src/store/orderStore.ts

import { create } from "zustand";

interface OrderStore {
    storeId: string | null;
    setStoreId: (storeId: string) => void;
    clearStoreId: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
    storeId: null,
    setStoreId: (storeId) => set({ storeId }),
    clearStoreId: () => set({ storeId: null }),
}));
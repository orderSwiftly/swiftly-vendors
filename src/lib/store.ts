// src/lib/store.ts

import { AxiosError } from "axios";
import { api } from "@/utils/api";

export interface StoreLocation {
    id: string;
    name: string;
    address: string;
    is_active: boolean;
}

export interface Store {
    id: string;
    name: string;
    store_name?: string;
    image_url: string | null;
    is_active: boolean;
    locations: StoreLocation[];
}

interface CreateLocationInput {
    name: string;
    address: string;
}

interface CreateStoreBody {
    store_name: string;
    locations: CreateLocationInput[];
}

interface EditStoreNameBody {
    new_name: string;
}

interface EditLocationBody {
    new_name?: string;
    new_address?: string;
}

interface AddLocationBody {
    name: string;
    address: string;
}

export const createStore = async (storeData: CreateStoreBody) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        const response = await api.post("/stores", storeData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to create store.");
        }
        throw new Error("An unexpected error occurred.");
    }
};

export const getStores = async (): Promise<Store[]> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        const response = await api.get<Store[]>("/stores", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to fetch stores.");
        }
        throw new Error("An unexpected error occurred.");
    }
};

export const editStoreName = async (storeId: string, body: EditStoreNameBody) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        const response = await api.patch(`/stores/${storeId}`, body, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to edit store name.");
        }
        throw new Error("An unexpected error occurred.");
    }
};

export const editLocation = async (locationId: string, body: EditLocationBody) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        const response = await api.patch(`/locations/${locationId}`, body, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to edit location.");
        }
        throw new Error("An unexpected error occurred.");
    }
};

export const deactivateStore = async (storeId: string) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        const response = await api.post(`/stores/${storeId}/deactivate`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to deactivate store.");
        }
        throw new Error("An unexpected error occurred.");
    }
};

export const reactivateStore = async (storeId: string) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        const response = await api.post(`/stores/${storeId}/activate`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to reactivate store.");
        }
        throw new Error("An unexpected error occurred.");
    }
};

export const deactivateLocation = async (locationId: string) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        const response = await api.post(`/locations/${locationId}/deactivate`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to deactivate location.");
        }
        throw new Error("An unexpected error occurred.");
    }
};

export const activateLocation = async (locationId: string) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        const response = await api.post(`/locations/${locationId}/activate`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to activate location.");
        }
        throw new Error("An unexpected error occurred.");
    }
};

export const addLocation = async (storeId: string, locations: AddLocationBody[]) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        const response = await api.post(`/stores/${storeId}/locations`, locations, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to add location.");
        }
        throw new Error("An unexpected error occurred.");
    }
};

// src/lib/store.ts

// src/lib/store.ts

export const uploadStoreImage = async (storeId: string, photo: File) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const formData = new FormData();
        formData.append("photo", photo);

        // Option 1: Let axios handle everything without manually setting headers
        const res = await api.patch(`/stores/${storeId}/image`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                // Remove any Content-Type headers completely
            },
            // Ensure axios doesn't transform the data
            transformRequest: [(data) => data],
        });
        
        // console.log("Upload success:", res.data);
        return res.data;
    } catch (error) {
        // console.error("Upload error:", error);
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to upload store image.");
        }
        throw new Error("An unexpected error occurred.");
    }
};
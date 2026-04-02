import { api } from "@/utils/api";

export interface StockAdjustment {
  adjusted_quantity: number;
  reason: string;
}

export interface InventoryItem {
  _id?: string;
  product_id?: string;
  sku: string;
  name: string;
  current_stock?: number;
  max_stock?: number;
  status?: string;
}

export interface InventoryResponse {
  data: InventoryItem[];
  location_name?: string;
  total?: number;
}

export const fetchInventoryByLocation = async (
  locationId: string,
  page = 1,
  search = "",
) => {
  try {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "10",
    });
    if (search) {
      params.append("search", search);
    }
    const response = await api.get(
      `/locations/${locationId}/inventory?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch inventory",
    );
  }
};

export const adjustStock = async (
  locationId: string,
  productId: string,
  adjustmentData: StockAdjustment,
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post(
      `/inventory/${locationId}/${productId}/adjust`,
      adjustmentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to adjust stock");
  }
};

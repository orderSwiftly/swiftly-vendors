import { api } from "@/utils/api";

export interface StockAdjustment {
  adjusted_quantity: number;
  reason: string;
}

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

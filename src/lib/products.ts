import { api } from "@/utils/api";

export interface ProductInput {
  name: string;
  sku: string;
  price: number | string;
  category: string;
  status: boolean | string;
}

export interface Product extends ProductInput {
  _id?: string;
  id?: string;
}

export const addProduct = async (
  storeId: string,
  productData: ProductInput,
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post(
      `/stores/${storeId}/products`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to add product");
  }
};

export const editProduct = async (
  productId: string,
  productData: ProductInput,
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.patch(`/products/${productId}`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to edit product");
  }
};

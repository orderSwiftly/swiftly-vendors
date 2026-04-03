import { api } from "@/utils/api";

export interface ProductInput {
  name: string;
  sku: string;
  price: number | string;
  category: string;
  is_active?: boolean;
}

export interface Product extends ProductInput {
  _id?: string;
  id?: string;
  is_active?: boolean;
}

export interface ProductResponse {
  data: Product[];
  total?: number;
}

export const fetchProductsByStore = async (
  storeId: string,
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
    const response = await api.get(`/stores/${storeId}/products?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch products",
    );
  }
};

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

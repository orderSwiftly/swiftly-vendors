// src/lib/products.ts

import { api } from "@/utils/api";
import { AxiosError } from "axios";

// fetch products by store
export interface Product {
    id: string;
    name: string;
    sku: string;
    price: string;
    category: string;
    is_active: boolean;
    images_url: string[];
}

export interface ProductResponse {
    data: Product[];
    total: number;
}

export const fetchProductsByStore = async (
    storeId: string,
    page = 1,
    search = "",
): Promise<ProductResponse> => {
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
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to fetch products");
        }
        throw new Error("An unexpected error occurred.");
    }
};

// create product
export interface ProductInput {
    name: string;
    sku: string;
    price: number;
    category: string;
    status?: boolean;
}

export const createProduct = async (
    storeId: string,
    productData: ProductInput,
): Promise<void> => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.post(`/stores/${storeId}/products`, productData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to create product.");
        }
        throw new Error("An unexpected error occurred.");
    }
};

// edit product
export const editProduct = async (
    productId: string,
    productData: ProductInput,
): Promise<void> => {
    try {
        const token = localStorage.getItem("token");
        const response = await api.patch(`/products/${productId}`, productData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to edit product.");
        }
        throw new Error("An unexpected error occurred.");
    }
};

// upload product
export const uploadProductImage = async (
    productId: string,
    files: File[],
): Promise<void> => {
    try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        files.forEach((file) => formData.append("photo", file));
        const response = await api.patch(`/products/${productId}/images`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to upload image.");
        }
        throw new Error("An unexpected error occurred.");
    }
};

// get categories
export const fetchCategories = async (): Promise<string[]> => {
    try {
        const response = await api.get("/categories");
        // The response has { categories: [...] } structure
        return Array.isArray(response.data?.categories) ? response.data.categories : [];
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to fetch categories.");
        }
        throw new Error("An unexpected error occurred.");
    }
}

// Get product template (CSV format)
export interface ProductTemplate {
  name: string;
  sku: string;
  price: number | string;
  category: string;
  is_active: boolean | string;
}

export const getProductTemplateRaw = async (): Promise<string> => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/products/template', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product template');
    }
    throw error;
  }
};


// bulk upload products from CSV file
export interface ImportResult {
  inserted: number;
  errors: string[];
}

// Import products from CSV file
// src/lib/products.ts

// src/lib/products.ts

export interface ImportResult {
  inserted: number;
  errors: string[];  // Backend returns array of strings, not objects
}

export const importProducts = async (
  storeId: string, 
  file: File
): Promise<ImportResult> => {
  try {
    const token = localStorage.getItem('token');
    
    // Read and fix the CSV content
    const fileText = await file.text();
    const lines = fileText.split('\n');
    
    // Fix the is_active values (convert TRUE/FALSE to true/false)
    const fixedLines = lines.map((line, index) => {
      if (index === 0) return line; // Skip header row
      if (!line.trim()) return line;
      
      const values = line.split(',');
      const headers = lines[0].toLowerCase().split(',');
      const isActiveIndex = headers.findIndex(h => h.trim() === 'is_active');
      
      if (isActiveIndex !== -1 && values[isActiveIndex]) {
        // Convert to lowercase true/false
        const val = values[isActiveIndex].trim().toLowerCase();
        values[isActiveIndex] = (val === 'true' || val === 'false') ? val : 'false';
        return values.join(',');
      }
      return line;
    });
    
    const fixedCsv = fixedLines.join('\n');
    const fixedFile = new File([fixedCsv], file.name, { type: 'text/csv' });
    
    const formData = new FormData();
    formData.append('photo', fixedFile);
    
    const response = await api.post(`/store/${storeId}/products/import`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to import products');
    }
    throw error;
  }
};
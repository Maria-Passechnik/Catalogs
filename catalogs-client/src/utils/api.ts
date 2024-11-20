import axios from "axios";
import { CatalogInterface } from "../types/CatalogInterface";
import {
  ApiResponse,
  GetCatalogsResponse,
  UpdateCatalogResponse,
} from "../types/api";

const CATALOGS_API = axios.create({
  baseURL: process.env.REACT_APP_CATALOGS_API,
});

export const getCatalogs = async (
  page: number,
  limit: number
): Promise<{
  data: CatalogInterface[];
  total: number;
}> => {
  const response = await CATALOGS_API.get<GetCatalogsResponse>(`/`, {
    params: { page, limit },
  });

  return {
    total: response.data.total,
    data: response.data.data,
  };
};

export const createCatalog = async (
  catalog: Omit<CatalogInterface, "id" | "indexedAt">
): Promise<void> => {
  await CATALOGS_API.post<UpdateCatalogResponse>("/", catalog);
};

export const updateCatalog = async (
  id: string,
  catalog: Partial<CatalogInterface>
): Promise<void> => {
  await CATALOGS_API.patch<UpdateCatalogResponse>(`/${id}`, catalog);
};

export const deleteCatalog = async (id: string): Promise<void> => {
  await CATALOGS_API.delete<ApiResponse>(`/${id}`);
};

export const bulkDeleteCatalogs = async (ids: string[]): Promise<void> => {
  await CATALOGS_API.delete<ApiResponse>(`/`, {
    params: { ids: ids.join(",") },
  });
};

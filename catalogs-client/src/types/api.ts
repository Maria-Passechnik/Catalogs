import { CatalogInterface } from "./CatalogInterface";

export interface ApiResponse {
  success: string;
  message: string;
}

export interface GetCatalogsResponse extends ApiResponse {
  data: CatalogInterface[];
  total: number;
}

export interface UpdateCatalogResponse extends ApiResponse {
  data: CatalogInterface;
}

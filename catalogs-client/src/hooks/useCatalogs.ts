import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  getCatalogs,
  createCatalog,
  updateCatalog,
  deleteCatalog,
  bulkDeleteCatalogs,
} from "../utils/api";
import { CatalogInterface } from "../types/CatalogInterface";
import notify from "../utils/toast";

export const useCatalogs = (page: number, limit: number) => {
  const queryClient = useQueryClient();

  const {
    data: paginatedData = { data: [], total: 0 },
    isLoading: isFetchingCatalogs,
    refetch: refetchCatalogs,
    error: fetchError,
  } = useQuery({
    queryKey: ["catalogs", page, limit],
    queryFn: async (): Promise<{ data: CatalogInterface[]; total: number }> => {
      try {
        const response = await getCatalogs(page, limit);
        return response;
      } catch (error) {
        notify.error(`Failed to fetch catalogs`);
        throw new Error(`Failed to fetch catalogs: ${error}`);
      }
    },
    retry: 0,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const addCatalog = useMutation({
    mutationFn: (catalog: Omit<CatalogInterface, "id" | "indexedAt">) =>
      createCatalog(catalog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogs"] });
    },
    onError: (error: Error) => {
      throw new Error(`Error creating catalog: ${error.message}`);
    },
  });

  const editCatalog = useMutation({
    mutationFn: (idAndCatalog: {
      id: string;
      catalog: Partial<CatalogInterface>;
    }) => updateCatalog(idAndCatalog.id, idAndCatalog.catalog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogs"] });
    },
    onError: (error: Error) => {
      throw new Error(`Error updating catalog: ${error.message}`);
    },
  });

  const removeCatalog = useMutation({
    mutationFn: (id: string) => deleteCatalog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogs"] });
    },
    onError: (error: Error) => {
      throw new Error(`Error deleting catalog: ${error.message}`);
    },
  });

  const removeMultipleCatalogs = useMutation({
    mutationFn: (ids: string[]) => bulkDeleteCatalogs(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogs"] });
    },
    onError: (error: Error) => {
      throw new Error(`Error deleting multiple catalogs: ${error.message}`);
    },
  });

  return {
    catalogs: paginatedData.data,
    total: paginatedData.total,
    isFetchingCatalogs,
    refetchCatalogs,
    fetchError,
    addCatalog,
    editCatalog,
    removeCatalog,
    removeMultipleCatalogs,
  };
};

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
    retry: 3,
    retryDelay: 5000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const addCatalog = useMutation({
    mutationFn: async (catalog: Omit<CatalogInterface, "id" | "indexedAt">) => {
      try {
        return await createCatalog(catalog);
      } catch (error) {
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attempt) => {
      notify.error(`Retrying to create catalog... Attempt ${attempt + 1}`);
      return 1000 * attempt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogs"] });
      notify.success("Catalog created successfully!");
    },
    onError: (error: Error) => {
      notify.error("Failed to create catalog after multiple retries.");
      throw new Error(`Error creating catalog: ${error.message}`);
    },
  });

  const editCatalog = useMutation({
    mutationFn: async (idAndCatalog: {
      id: string;
      catalog: Partial<CatalogInterface>;
    }) => {
      try {
        return await updateCatalog(idAndCatalog.id, idAndCatalog.catalog);
      } catch (error) {
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attempt) => {
      notify.error(`Retrying to update catalog... Attempt ${attempt + 1}`);
      return 1000 * attempt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogs"] });
      notify.success("Catalog updated successfully!");
    },
    onError: (error: Error) => {
      notify.error("Failed to update catalog after multiple retries.");
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
      notify.error("Error deleting selected catalogs. Please try again.");
      throw new Error(`${error.message}`);
    },
  });

  return {
    catalogs: paginatedData.data,
    total: paginatedData.total,
    isFetchingCatalogs,
    fetchError,
    addCatalog,
    editCatalog,
    removeCatalog,
    removeMultipleCatalogs,
  };
};

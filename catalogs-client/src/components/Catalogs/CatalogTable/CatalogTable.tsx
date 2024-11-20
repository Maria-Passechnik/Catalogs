import { useState } from "react";
import {
  DataGrid,
  GridPaginationModel,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";

import { CatalogInterface } from "../../../types/CatalogInterface";
import { CatalogModal } from "../CatalogModal/CatalogModal";
import { useCatalogs } from "../../../hooks/useCatalogs";
import { StyledCatalogTable } from "./CatalogTable.styles";
import { dataGridColumns, dataGridInitialState } from "./CatalogTableConfig";
import { toast } from "react-toastify";
import notify from "../../../utils/toast";

export const CatalogTable: React.FC = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [selectedCatalog, setSelectedCatalog] =
    useState<CatalogInterface | null>(null);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );
  const [isModalOpen, setModalOpen] = useState(false);

  const {
    catalogs,
    total,
    isFetchingCatalogs: loading,
    addCatalog,
    editCatalog,
    removeCatalog,
    removeMultipleCatalogs,
    refetchCatalogs,
  } = useCatalogs(paginationModel.page + 1, paginationModel.pageSize);

  const handlePaginationChange = (newModel: GridPaginationModel) => {
    if (
      newModel.page !== paginationModel.page ||
      newModel.pageSize !== paginationModel.pageSize
    ) {
      setPaginationModel(newModel);
    }
  };

  const handleAddCatalog = () => setModalOpen(true);

  const handleEditCatalog = (catalog: CatalogInterface) => {
    setSelectedCatalog(catalog);
    setModalOpen(true);
  };
  const handleCloseModal = () => setModalOpen(false);

  const saveCatalog = async (catalog: CatalogInterface) => {
    try {
      if (selectedCatalog) {
        await editCatalog.mutateAsync({ id: selectedCatalog._id, catalog });
        notify.success("Catalog updated successfully!");
      } else {
        await addCatalog.mutateAsync(catalog);
        notify.success("Catalog created successfully!");
      }
      setModalOpen(false);
    } catch (error) {
      toast.error("Error saving catalog. Please try again.");
    }
  };

  const handleDeleteCatalog = async (id: string) => {
    try {
      await removeCatalog.mutateAsync(id);
      notify.success("Catalog deleted successfully!");
      setSelectedCatalog(null);
    } catch (error) {
      toast.error("Error deleting catalog. Please try again.");
    }
  };

  const handleBulkDelete = async () => {
    try {
      const idsToDelete = selectionModel.map((id) => id.toString());
      await removeMultipleCatalogs.mutateAsync(idsToDelete);
      notify.success("Selected catalogs deleted successfully!");
      setSelectionModel([]);
    } catch (error) {
      toast.error("Error deleting selected catalogs. Please try again.");
    }
  };

  return (
    <StyledCatalogTable>
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <Button variant="outlined" onClick={handleAddCatalog} disableRipple>
          Add Catalog
        </Button>
        {selectionModel.length > 0 && (
          <Button variant="outlined" onClick={handleBulkDelete}>
            Delete Selected ({selectionModel.length})
          </Button>
        )}
      </Box>
      <DataGrid
        initialState={dataGridInitialState}
        loading={loading}
        rows={catalogs}
        columns={dataGridColumns(handleEditCatalog, handleDeleteCatalog)}
        getRowId={(row) => row._id}
        rowCount={total}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationChange}
        checkboxSelection
        onRowSelectionModelChange={(newSelection) =>
          setSelectionModel(newSelection)
        }
        rowSelectionModel={selectionModel}
      />
      <CatalogModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={saveCatalog}
        initialData={selectedCatalog}
      />
    </StyledCatalogTable>
  );
};

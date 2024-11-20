import { GridColDef } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import { EditNoteOutlined, DeleteOutlineOutlined } from "@mui/icons-material";
import { CatalogInterface } from "../../../types/CatalogInterface";

export const dataGridColumns = (
  handleEditCatalog: (catalog: CatalogInterface) => void,
  handleDeleteCatalog: (id: string) => Promise<void>
): GridColDef[] => [
  { field: "id", headerName: "ID", flex: 1 },
  { field: "name", headerName: "Name", flex: 1 },
  { field: "vertical", headerName: "Vertical", flex: 1 },
  {
    field: "isPrimary",
    headerName: "Primary",
    flex: 1,
    renderCell: (params) => (params.value ? "Yes" : "No"),
  },
  {
    field: "locales",
    headerName: "Multi-locale",
    flex: 1,
    renderCell: (params) => (params.value.length > 1 ? "Yes" : "No"),
  },
  {
    field: "indexedAt",
    headerName: "Last Indexed",
    flex: 1,
    renderCell: (params) => new Date(params.value).toLocaleString(),
  },
  {
    field: "actions",
    headerName: "",
    flex: 0.5,
    renderCell: (params) => (
      <Box className="settings-container">
        <IconButton onClick={() => handleEditCatalog(params.row)}>
          <EditNoteOutlined />
        </IconButton>
        <IconButton onClick={() => handleDeleteCatalog(params.row._id)}>
          <DeleteOutlineOutlined />
        </IconButton>
      </Box>
    ),
  },
];

export const dataGridInitialState = {
  columns: {
    columnVisibilityModel: {
      id: false,
      name: true,
      vertical: true,
      isPrimary: true,
      locales: true,
      indexedAt: true,
    },
  },
};

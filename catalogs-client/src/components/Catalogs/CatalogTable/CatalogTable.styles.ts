import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledCatalogTable = styled(Box)({
  height: 500,
  width: "100%",
  ".MuiDataGrid-row:hover .settings-container": {
    opacity: "1",
    pointerEvents: "all",
  },
  ".settings-container": {
    opacity: "0",
    pointerEvents: "none",
    transition: "opacity 0.2s ease",
  },
});

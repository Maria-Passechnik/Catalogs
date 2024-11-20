import React from "react";
import { Box, Typography } from "@mui/material";
import { CatalogTable } from "../components/Catalogs/CatalogTable/CatalogTable";

export const CatalogsDashboard: React.FC = () => {
  return (
    <Box p={6}>
      <Typography variant="h4" pb={4}>
        Catalogs Dashboard
      </Typography>
      <CatalogTable />
    </Box>
  );
};

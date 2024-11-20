import React from "react";
import { Typography, Box } from "@mui/material";

interface InputLabelProps {
  label: string;
}

export const InputLabel: React.FC<InputLabelProps> = ({ label }) => {
  return (
    <Box>
      <Typography
        component="label"
        sx={{
          fontWeight: "bold",
          marginBottom: "4px",
          display: "block",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

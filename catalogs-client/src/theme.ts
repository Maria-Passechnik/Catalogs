import { createTheme } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "'Krub', 'sans-serif'",
    h4: {
      color: "black",
    },
    h6: {
      color: "black",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: "bold",
          border: "1px solid #762232",
          color: "#762232",
          borderRadius: "4px",
        },
      },
    },
  },
});

export default theme;

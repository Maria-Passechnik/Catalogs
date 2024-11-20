import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import { CatalogsDashboard } from "./pages/CatalogsDashboard";
import { Header } from "./components/AppHeader/AppHeader";
import { Footer } from "./components/AppFooter/AppFooter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer position="top-right" limit={3} autoClose={3000}/>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header />
        <Box
          component="main"
          sx={{
            flex: 1,
            padding: 2,
          }}
        >
          <CatalogsDashboard />
        </Box>
        <Footer />
      </Box>
    </ThemeProvider >
  );
}

export default App;

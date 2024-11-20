import { Avatar, Box } from "@mui/material";

export const Footer: React.FC = () => (
  <Box
    component="footer"
    sx={{
      backgroundColor: "#669694",
      color: "white",
      padding: 2,
      display: "flex",
      justifyContent: "center",
    }}
  >
    <Avatar src="/syte-ai-logo-vector.svg" sx={{ width: 100, height: 50 }} />
  </Box>
);

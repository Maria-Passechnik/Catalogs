import { Avatar, Box } from "@mui/material";

export const Header: React.FC = () => (
  <Box
    component="header"
    sx={{
      backgroundColor: "#669694",
      color: "white",
      paddingLeft: "2.5rem",
      paddingY: "1rem",
    }}
  >
    <Avatar src="/syte-ai-logo-vector.svg" sx={{ width: 100, height: 50 }} />
  </Box>
);

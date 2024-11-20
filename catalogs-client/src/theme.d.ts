declare module "@mui/material/styles" {
  interface Theme {
    customStyles?: {
      cardBackgroundColor: string;
    };
  }
  interface ThemeOptions {
    customStyles?: {
      cardBackgroundColor?: string;
    };
  }
}

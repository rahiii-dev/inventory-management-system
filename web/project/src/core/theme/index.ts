import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1E40AF", 
    },
    secondary: {
      main: "#0D9488",
    },
    background: {
      default: "#F3F4F6",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1F2937",
      secondary: "#6B7280",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h4: {
      fontWeight: 600,
    },
  },
});

export default theme;

import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#006624",
    },
    error: {
      main: "#dc3545",
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
        },
        input: {
          backgroundColor: "transparent",
        },
      },
    },
  },
});

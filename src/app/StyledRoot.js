"use client";

import { ThemeProvider } from "@mui/material/styles";
import { ThemeProvider as CustomThemeProvider, useTheme } from "./contexts/ThemeContext";
import getTheme from "./theme";

export default function StyledRoot({ children }) {
  return (
    <CustomThemeProvider>
      <ThemeWrapper>
        {children}
      </ThemeWrapper>
    </CustomThemeProvider>
  );
}

function ThemeWrapper({ children }) {
  const { mode } = useTheme();
  const theme = getTheme(mode);
  
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

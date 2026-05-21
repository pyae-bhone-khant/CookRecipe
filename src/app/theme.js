"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF7622", // Premium Saffron Amber
      light: "#FFA26B",
      dark: "#E05500",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#E84A5F", // Rich Terracotta Rose
      light: "#FF7D8D",
      dark: "#B21437",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FAF8F5", // Soft Warm Cream Canvas
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1C1714", // Deep rich warm espresso
      secondary: "#6A5E57", // Soft warm clay gray
    },
    divider: "rgba(255, 118, 34, 0.08)",
  },
  typography: {
    fontFamily: "var(--font-inter), sans-serif",
    h1: {
      fontFamily: "var(--font-outfit), sans-serif",
      fontWeight: 800,
      color: "#1C1714",
    },
    h2: {
      fontFamily: "var(--font-outfit), sans-serif",
      fontWeight: 800,
      color: "#1C1714",
    },
    h3: {
      fontFamily: "var(--font-outfit), sans-serif",
      fontWeight: 700,
      color: "#1C1714",
    },
    h4: {
      fontFamily: "var(--font-outfit), sans-serif",
      fontWeight: 700,
      color: "#1C1714",
    },
    h5: {
      fontFamily: "var(--font-outfit), sans-serif",
      fontWeight: 600,
      color: "#1C1714",
    },
    h6: {
      fontFamily: "var(--font-outfit), sans-serif",
      fontWeight: 600,
      color: "#1C1714",
    },
    subtitle1: {
      fontFamily: "var(--font-inter), sans-serif",
      fontWeight: 500,
    },
    subtitle2: {
      fontFamily: "var(--font-inter), sans-serif",
      fontWeight: 500,
    },
    body1: {
      fontFamily: "var(--font-inter), sans-serif",
      fontSize: "0.95rem",
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: "var(--font-inter), sans-serif",
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    button: {
      fontFamily: "var(--font-outfit), sans-serif",
      fontWeight: 600,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#FAF8F5",
          color: "#1C1714",
          scrollbarWidth: "thin",
          scrollbarColor: "#FF7622 #FAF8F5",
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#FAF8F5",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#FF7622",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#E05500",
          },
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: "rgba(250, 248, 245, 0.8)", // Semi-translucent base cream
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 118, 34, 0.08)",
          color: "#1C1714",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: "50px", // Ultra rounded modern pill style
          padding: "8px 24px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          fontWeight: 600,
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(255, 118, 34, 0.2)",
          },
          "&:active": {
            transform: "translateY(0px)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #FF7622 0%, #FF5126 100%)",
          color: "#FFFFFF",
          "&:hover": {
            background: "linear-gradient(135deg, #FF8C42 0%, #FF603A 100%)",
          },
        },
        outlinedPrimary: {
          borderColor: "#FF7622",
          color: "#FF7622",
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px",
            borderColor: "#FF5126",
            backgroundColor: "rgba(255, 118, 34, 0.04)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          background: "#FFFFFF",
          border: "1px solid rgba(255, 118, 34, 0.06)",
          boxShadow: "0 8px 32px rgba(255, 118, 34, 0.03)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          "&:hover": {
            transform: "translateY(-6px)",
            borderColor: "rgba(255, 118, 34, 0.2)",
            boxShadow: "0 12px 40px rgba(255, 118, 34, 0.08)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
            backgroundColor: "#FFFFFF",
            transition: "all 0.3s ease",
            "& fieldset": {
              borderColor: "rgba(255, 118, 34, 0.12)",
              borderWidth: "1.5px",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255, 118, 34, 0.3)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#FF7622",
              boxShadow: "0 0 10px rgba(255, 118, 34, 0.15)",
            },
          },
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          transition: "all 0.2s ease",
          "&.Mui-selected": {
            background: "linear-gradient(135deg, #FF7622 0%, #FF5126 100%)",
            color: "#FFFFFF",
            "&:hover": {
              background: "linear-gradient(135deg, #FF8C42 0%, #FF603A 100%)",
            },
          },
        },
      },
    },
  },
});

export default theme;

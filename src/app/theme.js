"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#10B981", // Modern Emerald Green
      light: "#34D399",
      dark: "#059669",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#8B5CF6", // Vibrant Purple
      light: "#A78BFA",
      dark: "#7C3AED",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F8FAFC", // Clean Slate Background
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A", // Deep Slate
      secondary: "#475569", // Muted Slate
    },
    divider: "rgba(16, 185, 129, 0.1)",
  },
  typography: {
    fontFamily: "var(--font-inter), sans-serif",
    h1: {
      fontFamily: "var(--font-outfit), sans-serif",
      fontWeight: 800,
      color: "#0F172A",
    },
    h2: {
      fontFamily: "var(--font-outfit), sans-serif",
      fontWeight: 800,
      color: "#0F172A",
    },
    h3: {
      fontFamily: "var(--font-outfit), sans-serif",
      fontWeight: 700,
      color: "#0F172A",
    },
    h4: {
      fontFamily: "var(--font-outfit), sans-serif",
      fontWeight: 700,
      color: "#0F172A",
    },
    h5: {
      fontFamily: "var(--font-outfit), sans-serif",
      fontWeight: 600,
      color: "#0F172A",
    },
    h6: {
      fontFamily: "var(--font-outfit), sans-serif",
      fontWeight: 600,
      color: "#0F172A",
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
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F8FAFC",
          color: "#0F172A",
          scrollbarWidth: "thin",
          scrollbarColor: "#10B981 #F8FAFC",
          "&::-webkit-scrollbar": {
            width: "10px",
            height: "10px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#F8FAFC",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#10B981",
            borderRadius: "6px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#059669",
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
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(16, 185, 129, 0.1)",
          color: "#0F172A",
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
          borderRadius: "12px",
          padding: "10px 28px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          fontWeight: 600,
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 25px rgba(16, 185, 129, 0.25)",
          },
          "&:active": {
            transform: "translateY(0px)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
          color: "#FFFFFF",
          "&:hover": {
            background: "linear-gradient(135deg, #34D399 0%, #10B981 100%)",
          },
        },
        outlinedPrimary: {
          borderColor: "#10B981",
          color: "#10B981",
          borderWidth: "2px",
          "&:hover": {
            borderWidth: "2px",
            borderColor: "#059669",
            backgroundColor: "rgba(16, 185, 129, 0.08)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          background: "#FFFFFF",
          border: "1px solid rgba(16, 185, 129, 0.08)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          "&:hover": {
            transform: "translateY(-8px)",
            borderColor: "rgba(16, 185, 129, 0.25)",
            boxShadow: "0 12px 40px rgba(16, 185, 129, 0.12)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#FFFFFF",
            transition: "all 0.3s ease",
            "& fieldset": {
              borderColor: "rgba(16, 185, 129, 0.15)",
              borderWidth: "2px",
            },
            "&:hover fieldset": {
              borderColor: "rgba(16, 185, 129, 0.35)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#10B981",
              boxShadow: "0 0 0 4px rgba(16, 185, 129, 0.1)",
            },
          },
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          transition: "all 0.2s ease",
          "&.Mui-selected": {
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            color: "#FFFFFF",
            "&:hover": {
              background: "linear-gradient(135deg, #34D399 0%, #10B981 100%)",
            },
          },
        },
      },
    },
  },
});

export default theme;

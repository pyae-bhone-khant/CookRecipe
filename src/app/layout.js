

import { Outfit, Inter } from "next/font/google";
import "./globals.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import AppLayout from "./components/AppLayout";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import StyledRoot from "./StyledRoot";
import SessionWrapper from "./SessionWrapper";
import { CssBaseline } from "@mui/material";
import "nprogress/nprogress.css";
import "./styles/nprogress.css"; // or "../app/styles/nprogress.css" depending on path
import { Suspense } from "react";
import RouteProgress from "./components/RouteProgress";


const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "CookCraft",
  description: "Recipes from everywhere...",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Add viewport meta tag for proper responsive behavior */}
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>

      <body className={`${outfit.variable} ${inter.variable}`}>
        <div className="bg-mesh" />
        <AppRouterCacheProvider>
          <StyledRoot>
            {/* Add CssBaseline here to normalize styles */}
            <CssBaseline />
            <AppLayout>
              <SessionWrapper>
                <Suspense fallback={null}>
                  <RouteProgress />

              {children}
              </Suspense>
              </SessionWrapper>
              </AppLayout>
          </StyledRoot>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

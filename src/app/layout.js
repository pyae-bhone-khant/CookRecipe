

import { Geist, Geist_Mono } from "next/font/google";
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


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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

      <body className={`${geistSans.variable} ${geistMono.variable}`}>
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

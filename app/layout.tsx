import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";

const font = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Focality",
  description: "Focality",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} relative antialiased`}>
        <ConvexClientProvider>
          <ThemeProvider defaultTheme="system" attribute="class">
            {children}
            <Toaster />
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}

import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { TanStackProvider } from "@/components/providers/TanStackProvider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
          <TanStackProvider>
            <ThemeProvider defaultTheme="system" attribute="class">
              {children}
              <Toaster />
            </ThemeProvider>
          </TanStackProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}

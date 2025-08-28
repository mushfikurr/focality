import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const font = Montserrat({
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
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${font.className} relative antialiased`}>
          <ConvexClientProvider>
            <ThemeProvider defaultTheme="system" attribute="class">
              {children}
            </ThemeProvider>
          </ConvexClientProvider>
          <Toaster />
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}

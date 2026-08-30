import "./globals.css";

import type { Metadata, Viewport } from "next";

import { Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ModalProvider } from "@/providers/modal-provider";
import { Analytics } from "@/components/analytics";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: {
    default: "KalanaDidulanga | " + siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Kalana Didulanga",
    "KayD",
    "Full Stack Software Engineer",
    "MERN Stack Developer",
    "Frontend Engineer",
  ],
  authors: [
    {
      name: "Kalana Didulanga",
      url: "https://kalanadidulanga.com/",
    },
  ],
  creator: "kalanadidulanga",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  icons: {
    icon: "/images/K.png",
    shortcut: "/images/K.png",
    apple: "/images/K.png",
  },
  // manifest: `${siteConfig.url}/site.webmanifest`,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Analytics />
          <Toaster />
          <ModalProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}

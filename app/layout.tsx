import "./globals.css";

import type { Metadata, Viewport } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import { siteConfig } from "@/config/site";
import { profile } from "@/config/profile";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@/components/analytics";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", style: ["normal", "italic"] });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

// Runs before first paint. The js class arms the scroll reveals (see
// [data-rise] in globals.css); without it, content just shows.
const jsScript = `document.documentElement.classList.add("js")`;

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Kalana Didulanga Koralegedara | " + siteConfig.name,
    // Every page title carries the name, so a search for him finds any page.
    template: `%s | ${profile.displayName}`,
  },
  description: siteConfig.description,
  keywords: [
    profile.name,
    ...profile.alternateNames,
    "Full Stack Software Engineer",
    "Next.js Developer",
    "React Native Developer",
  ],
  authors: [
    {
      name: "Kalana Didulanga Koralegedara",
      url: siteConfig.url,
    },
  ],
  creator: "kalanadidulanga",
  // No og:url here: pages inherit this, and each sets its own canonical.
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Kalana Didulanga Koralegedara | " + siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "Kalana Didulanga Koralegedara | " + siteConfig.name,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#07100d" },
  ],
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsScript }} />
        {/* Reveal starts at opacity 0 and clears it on hydration, so without
            JavaScript the wrapped content would never appear. */}
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              "<style>[data-reveal],[data-rise]{opacity:1!important;transform:none!important;translate:none!important;filter:none!important;animation:none!important}</style>",
          }}
        />
      </head>
      <body className={cn("min-h-[100dvh] bg-background font-sans antialiased", geist.variable, geistMono.variable)}>
        {/* The garden is a dark world first. Light stays one click away and
            keeps the same green. */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}

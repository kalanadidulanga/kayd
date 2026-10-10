import "./globals.css";

import type { Metadata, Viewport } from "next";

import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ModalProvider } from "@/providers/modal-provider";
import { Analytics } from "@/components/analytics";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  variable: "--font-instrument",
});

// Runs before first paint so the remembered accent never flashes. Anything
// unexpected in storage falls back to indigo. Mirrors components/accent-picker.
const accentScript = `try{var a=localStorage.getItem("kayd-accent");document.documentElement.dataset.accent=["indigo","emerald","ember"].indexOf(a)>-1?a:"indigo"}catch(e){document.documentElement.dataset.accent="indigo"}`;

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: {
    default: "Kalana Didulanga | " + siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Kalana Didulanga",
    "KayD",
    "Full Stack Software Engineer",
    "Next.js Developer",
    "React Native Developer",
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
  // manifest: `${siteConfig.url}/site.webmanifest`,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" data-accent="indigo" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: accentScript }} />
        {/* Reveal starts at opacity 0 and clears it on hydration, so without
            JavaScript the wrapped content would never appear. noscript rather
            than @media (scripting: none), which has a narrower browser floor
            than the fallback it is standing in for. */}
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              "<style>[data-reveal]{opacity:1!important;transform:none!important;translate:none!important;filter:none!important}</style>",
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geist.variable,
          geistMono.variable,
          instrument.variable
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

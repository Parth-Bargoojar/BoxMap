import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BoxMap — Know what's where.",
    template: "%s | BoxMap",
  },
  description: "Catalog your storage boxes and find any item in seconds. BoxMap turns your physical storage into a searchable inventory.",
  applicationName: "BoxMap",
  keywords: ["storage inventory", "box organizer", "find stored items", "home organization app"],
  authors: [{ name: "BoxMap" }],
  creator: "BoxMap",
  publisher: "BoxMap",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    title: "BoxMap — Know what's where.",
    description: "Catalog your storage boxes and find any item in seconds. BoxMap turns your physical storage into a searchable inventory.",
    siteName: "BoxMap",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BoxMap — Know what's where.",
    description: "Catalog your storage boxes and find any item in seconds. BoxMap turns your physical storage into a searchable inventory.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "BoxMap",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://boxmap.vercel.app",
    "description": "Catalog your storage boxes and find any item in seconds. BoxMap turns your physical storage into a searchable inventory.",
    "applicationCategory": "BusinessApplication, Utility",
    "operatingSystem": "All",
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {children}
          <Toaster position="top-center" />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  )
}

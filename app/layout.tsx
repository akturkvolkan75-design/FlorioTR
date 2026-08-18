import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PanelBrand from "@/components/PanelBrand";
import { cookies } from "next/headers";
import { themes, type ThemeName } from "@/themes/themes";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://floriotr.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "FlorioTR | Online Çiçek Siparişi",
    template: "%s | FlorioTR",
  },

  description:
    "FlorioTR ile güvenli şekilde online çiçek siparişi verin. Siparişinizi takip edin, hazırlanan çiçeğin fotoğrafını görün ve sevdiklerinize kolayca gönderin.",

  applicationName: "FlorioTR",

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  keywords: [
    "FlorioTR",
    "online çiçek siparişi",
    "çiçek siparişi",
    "çiçek gönder",
    "İstanbul çiçek siparişi",
    "aynı gün çiçek",
    "çiçek teslimatı",
  ],

  authors: [
    {
      name: "FlorioTR",
    },
  ],

  creator: "FlorioTR",
  publisher: "FlorioTR",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      maxSnippet: -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: "FlorioTR",
    title: "FlorioTR | Online Çiçek Siparişi",
    description:
      "FlorioTR ile güvenli şekilde online çiçek siparişi verin. Siparişinizi takip edin, hazırlanan çiçeğin fotoğrafını görün ve sevdiklerinize kolayca gönderin.",
  },

  twitter: {
    card: "summary_large_image",
    title: "FlorioTR | Online Çiçek Siparişi",
    description:
      "FlorioTR ile güvenli şekilde online çiçek siparişi verin. Siparişinizi takip edin ve sevdiklerinize kolayca çiçek gönderin.",
  },

  category: "shopping",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  const savedTheme =
    cookieStore.get("floriotr_theme")?.value;

  const initialTheme: ThemeName =
    savedTheme && savedTheme in themes
      ? (savedTheme as ThemeName)
      : "pudra";

  return (
    <html
      lang="tr"
      className="h-full antialiased"
    >
      <body className="min-h-full">
        <ThemeProvider initialTheme={initialTheme}>
          <Header />

          <PanelBrand />

          <main className="min-h-screen">
            {children}
          </main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
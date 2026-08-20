import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PanelBrand from "@/components/PanelBrand";


const rawSiteUrl =
  process.env.NEXT_PUBLIC_APP_URL?.trim();


const siteUrl =
  rawSiteUrl &&
  /^https?:\/\//.test(rawSiteUrl)
    ? rawSiteUrl.replace(/\/$/, "")
    : "https://www.floriotr.com";


export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "FlorioTR | Online Çiçek Siparişi ve Çiçek Gönderimi",

    template:
      "%s | FlorioTR",
  },

  description:
    "FlorioTR ile online çiçek siparişi verin. Özel anlarınız için özenle hazırlanan çiçekleri keşfedin, sevdiklerinize kolayca çiçek gönderin ve siparişinizi takip edin.",

  applicationName:
    "FlorioTR",

  icons: {
    icon: [
      {
        url: "/floriotr-icon.svg",
        type: "image/svg+xml",
      },
    ],

    shortcut:
      "/floriotr-icon.svg",

    apple:
      "/floriotr-icon.svg",
  },

  keywords: [
    "FlorioTR",
    "online çiçek siparişi",
    "çiçek siparişi",
    "çiçek gönder",
    "çiçek gönderimi",
    "aynı gün çiçek",
    "çiçek teslimatı",
    "gül buketi",
    "orkide",
    "çiçek buketi",
  ],

  authors: [
    {
      name: "FlorioTR",
    },
  ],

  creator:
    "FlorioTR",

  publisher:
    "FlorioTR",

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
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteUrl,
    siteName: "FlorioTR",

    title:
      "FlorioTR | Online Çiçek Siparişi ve Çiçek Gönderimi",

    description:
      "Özel anlarınız için özenle hazırlanan çiçekleri FlorioTR'da keşfedin ve sevdiklerinize kolayca gönderin.",
  },

  twitter: {
    card: "summary",

    title:
      "FlorioTR | Online Çiçek Siparişi ve Çiçek Gönderimi",

    description:
      "Özel anlarınız için özenle hazırlanan çiçekleri FlorioTR'da keşfedin.",
  },

  category:
    "shopping",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const websiteStructuredData = {
    "@context":
      "https://schema.org",

    "@type":
      "WebSite",

    "@id":
      `${siteUrl}/#website`,

    url:
      siteUrl,

    name:
      "FlorioTR",

    alternateName:
      "Florio TR",

    inLanguage:
      "tr-TR",
  };


  const organizationStructuredData = {
    "@context":
      "https://schema.org",

    "@type":
      "Organization",

    "@id":
      `${siteUrl}/#organization`,

    name:
      "FlorioTR",

    url:
      siteUrl,

    logo:
      `${siteUrl}/floriotr-icon.svg`,
  };


  return (
    <html
      lang="tr"
      className="h-full antialiased"
    >
      <body className="min-h-full">

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(
                websiteStructuredData
              ),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(
                organizationStructuredData
              ),
          }}
        />

        <ThemeProvider>

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
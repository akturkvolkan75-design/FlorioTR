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
    ? rawSiteUrl
    : "https://www.floriotr.com";



export const metadata: Metadata = {

  metadataBase: new URL(siteUrl),


  title: {
    default: "FlorioTR | Online Çiçek Siparişi",
    template: "%s | FlorioTR",
  },


  description:
    "FlorioTR ile güvenli şekilde online çiçek siparişi verin. Siparişinizi takip edin ve sevdiklerinize kolayca çiçek gönderin.",


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
      "max-snippet": -1,
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
      "FlorioTR ile sevdiklerinize özel çiçekler gönderin.",
  },


  twitter: {
    card: "summary_large_image",
    title: "FlorioTR | Online Çiçek Siparişi",
    description:
      "FlorioTR ile sevdiklerinize özel çiçekler gönderin.",
  },


  category: "shopping",

};





export default function RootLayout({

  children,

}: Readonly<{

  children: React.ReactNode;

}>) {


  return (

    <html

      lang="tr"

      className="h-full antialiased"

    >

      <body className="min-h-full">


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
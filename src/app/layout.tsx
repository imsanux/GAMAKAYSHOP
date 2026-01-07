import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google"; // Optimized font loading
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Configure Inter font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gamakay.com'),
  title: "Gamakay Giftcards - Digital Gift Cards & Subscriptions Nepal",
  description: "Buy digital gift cards and subscriptions instantly in Nepal. Gaming (PlayStation, Xbox, Nintendo), Streaming (Netflix, Spotify), Software (VPNs, AI Tools), and more. Delivered via WhatsApp.",
  keywords: "gift cards nepal, digital gift cards, playstation nepal, xbox nepal, netflix nepal, spotify nepal, gaming cards, streaming subscriptions, NordVPN nepal",
  authors: [{ name: "Gamakay Giftcards" }],
  creator: "Gamakay Giftcards",
  publisher: "Gamakay Giftcards",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gamakay.com",
    siteName: "Gamakay Giftcards",
    title: "Gamakay Giftcards - Digital Gift Cards & Subscriptions Nepal",
    description: "Buy digital gift cards and subscriptions instantly in Nepal. Gaming, Streaming, Software, and more. Delivered via WhatsApp.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gamakay Giftcards - Digital Gift Cards Nepal",
    description: "Buy digital gift cards and subscriptions instantly in Nepal.",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/logo.png",
    },
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Gamakay Giftcards",
              "url": "https://gamakay.com",
              "description": "Buy digital gift cards and subscriptions instantly in Nepal",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://gamakay.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Gamakay Giftcards",
              "description": "Digital gift cards and subscriptions delivered instantly via WhatsApp in Nepal",
              "url": "https://gamakay.com",
              "telephone": "+977-9862157864",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "NP"
              },
              "priceRange": "Rs. 300 - Rs. 50000",
              "paymentAccepted": "Cash, Bank Transfer",
              "currenciesAccepted": "NPR"
            })
          }}
        />
      </head>
      <body suppressHydrationWarning className={inter.className} style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh'
      }}>
        <CartProvider>
          <Header />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

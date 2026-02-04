import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
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
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#faf9f7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://wa.me" />
      </head>
      <body suppressHydrationWarning style={{
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

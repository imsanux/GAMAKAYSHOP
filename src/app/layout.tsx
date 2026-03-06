import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Giftcards Nepal | Buy Steam, Apple, PlayStation Gift Cards Online - Gamakay",
  description: "Nepal's #1 trusted store for digital gift cards. Buy Steam gift cards Nepal, Apple gift cards Nepal, PlayStation, Xbox, Netflix, Spotify & more. Instant delivery via WhatsApp. Safe, fast & reliable.",
  keywords: "giftcards nepal, buy giftcards nepal, steam giftcard nepal, apple giftcards nepal, playstation gift card nepal, xbox gift card nepal, netflix nepal, spotify nepal, nintendo eshop nepal, google play nepal, gaming gift cards nepal, digital gift cards kathmandu, gift cards in nepal, buy digital gift cards nepal, steam wallet nepal, itunes gift card nepal, gamakay nepal, online gift cards nepal, esewa gift card, khalti gift card",
  authors: [{ name: "Gamakay Giftcards Nepal" }],
  creator: "Gamakay Giftcards",
  publisher: "Gamakay Giftcards Nepal",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  alternates: {
    canonical: "https://gamakay.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gamakay.com",
    siteName: "Gamakay Giftcards Nepal",
    title: "Giftcards Nepal | Buy Steam, Apple, PlayStation Gift Cards - Gamakay",
    description: "Nepal's trusted store for digital gift cards. Steam, Apple, PlayStation, Xbox, Netflix & more. Instant WhatsApp delivery!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gamakay Giftcards Nepal - Digital Gift Cards Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Giftcards Nepal | Buy Digital Gift Cards Online - Gamakay",
    description: "Nepal's #1 trusted store for Steam, Apple, PlayStation & more gift cards. Instant delivery!",
    images: ["/og-image.png"],
  },
  verification: {
    google: "your-google-verification-code",
  },
  category: "E-commerce",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  themeColor: "#fbfbfd",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Gamakay" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="geo.region" content="NP" />
        <meta name="geo.placename" content="Kathmandu, Nepal" />
        <link rel="preconnect" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://wa.me" />

        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Gamakay Giftcards Nepal",
              "url": "https://gamakay.com",
              "logo": "https://gamakay.com/logo.png",
              "description": "Nepal's trusted store for digital gift cards. Steam, Apple, PlayStation, Xbox, Netflix & more.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "NP",
                "addressLocality": "Kathmandu"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": ["English", "Nepali"]
              },
              "sameAs": []
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Gamakay Giftcards Nepal",
              "url": "https://gamakay.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://gamakay.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "Gamakay Giftcards",
              "image": "https://gamakay.com/logo.png",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "Nepal"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "27.7172",
                "longitude": "85.3240"
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": "00:00",
                "closes": "23:59"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Digital Gift Cards",
                "itemListElement": [
                  { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Steam Gift Cards Nepal" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Apple Gift Cards Nepal" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "PlayStation Gift Cards Nepal" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Xbox Gift Cards Nepal" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Netflix Gift Cards Nepal" } }
                ]
              }
            }),
          }}
        />

        {/* Theme initialization */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme) {
                    document.documentElement.setAttribute('data-theme', theme);
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh'
      }}>
        <ThemeProvider>
          <CartProvider>
            <SmoothScroll>
              <Header />
              <main style={{ flex: 1 }}>
                {children}
              </main>
              <Footer />
              <Analytics />
              <SpeedInsights />
            </SmoothScroll>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


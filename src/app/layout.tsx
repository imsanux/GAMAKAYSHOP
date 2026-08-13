import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gamakay.com'),
  title: {
    default: "Buy Digital Gift Cards Nepal | Steam, PlayStation, Netflix & More — Gamakay",
    template: "%s | Gamakay Nepal",
  },
  description: "Nepal's #1 trusted store for digital gift cards & subscriptions. Buy Steam, PlayStation, Xbox, Apple, Netflix, Spotify, Discord Nitro, Crunchyroll & more. Instant delivery via WhatsApp — safe, fast & reliable.",
  keywords: [
    "gift cards Nepal", "buy gift cards Nepal", "digital gift cards Nepal",
    "steam gift card Nepal", "steam wallet Nepal", "buy steam Nepal",
    "PlayStation gift card Nepal", "PS5 gift card Nepal", "PSN card Nepal",
    "Xbox gift card Nepal", "Xbox Game Pass Nepal",
    "Apple gift card Nepal", "iTunes gift card Nepal", "App Store gift card Nepal",
    "Netflix Nepal", "Netflix subscription Nepal", "buy Netflix Nepal",
    "Spotify Premium Nepal", "Spotify gift card Nepal",
    "Nintendo eShop Nepal", "Nintendo Switch Nepal",
    "Google Play gift card Nepal", "Google Play Nepal",
    "Discord Nitro Nepal", "Crunchyroll Nepal", "YouTube Premium Nepal",
    "ChatGPT Plus Nepal", "NordVPN Nepal", "VPN Nepal",
    "gaming gift cards Nepal", "streaming subscriptions Nepal",
    "digital products Nepal", "online gift cards Nepal",
    "gift cards Kathmandu", "buy gift cards online Nepal",
    "eSewa gift card", "Khalti gift card", "instant delivery gift cards",
    "WhatsApp delivery Nepal", "gamakay", "gamakay Nepal",
    "student discount gift cards Nepal", "cheap gift cards Nepal",
  ],
  authors: [{ name: "Gamakay", url: "https://gamakay.com" }],
  creator: "Gamakay",
  publisher: "Gamakay",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: "https://gamakay.com",
  },
  openGraph: {
    type: "website",
    locale: "en_NP",
    url: "https://gamakay.com",
    siteName: "Gamakay",
    title: "Buy Digital Gift Cards Nepal | Steam, PlayStation, Netflix & More — Gamakay",
    description: "Nepal's trusted store for digital gift cards & subscriptions. Steam, Apple, PlayStation, Xbox, Netflix & more. Instant WhatsApp delivery!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gamakay — Nepal's Digital Gift Card Store",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@gamakaynepal",
    creator: "@gamakaynepal",
    title: "Buy Digital Gift Cards Nepal | Gamakay",
    description: "Nepal's #1 store for Steam, PlayStation, Apple, Netflix & more. Instant WhatsApp delivery!",
    images: ["/og-image.png"],
  },
  category: "Shopping",
  classification: "E-commerce, Digital Goods",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfd" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
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
        <meta name="geo.position" content="27.7172;85.3240" />
        <meta name="ICBM" content="27.7172, 85.3240" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="3 days" />
        <meta name="rating" content="general" />
        
        {/* Preload LCP hero */}
        <link
          rel="preload"
          as="image"
          href="/IMAGES/webpmobile/AI_mobile.webp"
          fetchPriority="high"
        />
        <link rel="preconnect" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://wa.me" />

        {/* JSON-LD — Organization */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Gamakay",
          "url": "https://gamakay.com",
          "logo": { "@type": "ImageObject", "url": "https://gamakay.com/og-image.png", "width": 1200, "height": 630 },
          "description": "Nepal's trusted store for digital gift cards and subscriptions. Steam, Apple, PlayStation, Xbox, Netflix & more.",
          "foundingDate": "2023",
          "address": { "@type": "PostalAddress", "addressCountry": "NP", "addressLocality": "Kathmandu" },
          "contactPoint": { "@type": "ContactPoint", "contactType": "customer support", "contactOption": "TollFree", "availableLanguage": ["English", "Nepali"] },
          "sameAs": ["https://wa.me/9779862157864"]
        }) }} />

        {/* JSON-LD — WebSite with Sitelinks Search */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Gamakay",
          "url": "https://gamakay.com",
          "description": "Buy digital gift cards in Nepal — Steam, PlayStation, Apple, Netflix, Spotify & more with instant WhatsApp delivery.",
          "inLanguage": "en-NP",
          "potentialAction": { "@type": "SearchAction", "target": { "@type": "EntryPoint", "urlTemplate": "https://gamakay.com/search?q={search_term_string}" }, "query-input": "required name=search_term_string" }
        }) }} />

        {/* JSON-LD — Store */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "Gamakay — Digital Gift Cards Nepal",
          "image": ["https://gamakay.com/og-image.png"],
          "url": "https://gamakay.com",
          "priceRange": "NPR 500 – NPR 50,000",
          "currenciesAccepted": "NPR, USD",
          "paymentAccepted": "eSewa, Khalti, Bank Transfer",
          "address": { "@type": "PostalAddress", "addressLocality": "Kathmandu", "addressCountry": "NP" },
          "geo": { "@type": "GeoCoordinates", "latitude": "27.7172", "longitude": "85.3240" },
          "openingHoursSpecification": { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], "opens": "00:00", "closes": "23:59" },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Digital Gift Cards & Subscriptions",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Steam Gift Card Nepal", "description": "Buy Steam Wallet gift cards in Nepal with instant WhatsApp delivery", "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "215" } } },
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "PlayStation Gift Card Nepal", "description": "Buy PSN / PlayStation gift cards in Nepal", "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "142" } } },
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Apple Gift Card Nepal", "description": "Buy Apple / iTunes gift cards in Nepal for App Store, iCloud and more", "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "189" } } },
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Xbox Gift Card Nepal", "description": "Buy Xbox & Microsoft gift cards in Nepal", "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "94" } } },
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Netflix Subscription Nepal", "description": "Buy Netflix accounts & subscriptions in Nepal", "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "312" } } },
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Spotify Premium Nepal", "description": "Buy Spotify Premium plans in Nepal", "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "276" } } },
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Discord Nitro Nepal", "description": "Buy Discord Nitro subscriptions in Nepal", "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "153" } } },
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Nintendo eShop Gift Card Nepal", "description": "Buy Nintendo Switch eShop cards in Nepal", "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.7", "reviewCount": "68" } } },
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Google Play Gift Card Nepal", "description": "Buy Google Play cards in Nepal", "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "112" } } }
            ]
          }
        }) }} />

        {/* JSON-LD — FAQ for rich snippets */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "How do I buy a gift card in Nepal?", "acceptedAnswer": { "@type": "Answer", "text": "Browse our store at gamakay.com, add the gift card to your cart, and checkout. We will deliver the code to you via WhatsApp instantly, usually within 5 minutes." } },
            { "@type": "Question", "name": "How fast is delivery?", "acceptedAnswer": { "@type": "Answer", "text": "Most deliveries are completed in under 5 minutes via WhatsApp. Some products may take longer depending on availability." } },
            { "@type": "Question", "name": "Can I buy Steam gift cards in Nepal?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! Gamakay sells Steam Wallet gift cards in Nepal with instant WhatsApp delivery. We carry multiple denominations." } },
            { "@type": "Question", "name": "Do you sell Netflix subscriptions in Nepal?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, we offer Netflix accounts and subscriptions in Nepal. Contact us on WhatsApp to find the best plan for you." } },
            { "@type": "Question", "name": "What payment methods do you accept?", "acceptedAnswer": { "@type": "Answer", "text": "We accept eSewa, Khalti, bank transfers, and other popular payment methods in Nepal." } },
            { "@type": "Question", "name": "Is there a student discount?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! Students with a valid college or university ID get 10% off academic products and 5% off everything else on the site." } }
          ]
        }) }} />

        {/* Prevent flash of unstyled content */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body suppressHydrationWarning style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh'
      }}>
        <CartProvider>
          <SmoothScrollProvider>
            <Header />
            <main style={{ flex: 1 }}>
              {children}
            </main>
            <Footer />
            <Analytics />
            <SpeedInsights />
          </SmoothScrollProvider>
        </CartProvider>
      </body>
    </html>
  );
}

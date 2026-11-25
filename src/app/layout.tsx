import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gamakay.shop"),
  title: {
    default: "Buy Gift Cards in Nepal | Steam, PSN, Apple & AI | Gamakay",
    template: "%s | Gamakay Nepal",
  },
  description:
    "Buy digital gift cards & subscriptions in Nepal. Steam, PlayStation, Apple, Netflix, Spotify, ChatGPT & Claude AI with eSewa, Khalti & fast WhatsApp delivery.",
  keywords: [
    "buy gift cards in Nepal",
    "digital gift cards Nepal",
    "online gift cards Nepal",
    "gift cards Kathmandu",
    "gift cards Pokhara",
    "eSewa gift card Nepal",
    "Khalti gift card Nepal",
    "Steam gift card Nepal",
    "Steam Wallet code Nepal",
    "buy Steam gift card Nepal",
    "PlayStation gift card Nepal",
    "PSN card USD INR Nepal",
    "PlayStation Plus Nepal",
    "PS5 gift card Nepal",
    "Xbox Game Pass Ultimate Nepal",
    "Xbox gift card Nepal",
    "Apple gift card Nepal",
    "iTunes gift card Nepal",
    "App Store gift card Nepal",
    "iCloud+ Nepal",
    "Netflix subscription Nepal",
    "buy Netflix Nepal",
    "Spotify Premium Nepal",
    "YouTube Premium Nepal",
    "Crunchyroll Premium Nepal",
    "Discord Nitro Nepal",
    "Nintendo eShop gift card Nepal",
    "Google Play gift card Nepal",
    "Claude AI Pro Nepal",
    "ChatGPT Plus Nepal",
    "Cursor AI Pro Nepal",
    "Grok and X Premium Nepal",
    "Telegram Premium Nepal",
    "Coursera Plus Nepal",
    "Meta One Nepal",
    "Gemini Pro Nepal",
    "Suno AI Nepal",
    "Canva Pro Nepal",
    "NordVPN Nepal",
    "travel eSIM Nepal",
    "WhatsApp delivery gift cards Nepal",
    "Gamakay",
    "Gamakay Nepal",
  ],
  authors: [{ name: "Gamakay", url: "https://gamakay.shop" }],
  creator: "Gamakay",
  publisher: "Gamakay",
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
    locale: "en_NP",
    url: "https://gamakay.shop",
    siteName: "Gamakay",
    title: "Buy Gift Cards in Nepal | Steam, PSN, Apple & AI | Gamakay",
    description:
      "Buy digital gift cards & subscriptions in Nepal. Steam, PlayStation, Apple, Netflix, Spotify, ChatGPT & Claude AI with eSewa, Khalti & fast WhatsApp delivery.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gamakay - Buy Digital Gift Cards and Subscriptions in Nepal",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@gamakaynepal",
    creator: "@gamakaynepal",
    title: "Buy Digital Gift Cards in Nepal | Gamakay",
    description:
      "Steam, PlayStation, Apple, Netflix, Spotify, ChatGPT & Claude AI in Nepal with eSewa, Khalti & fast WhatsApp delivery.",
    images: ["/og-image.png"],
  },
  category: "Shopping",
  classification: "E-commerce, Digital Goods",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#141413" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${plusJakartaSans.variable}`}>
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
        <meta name="rating" content="general" />

        <link rel="preconnect" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://wa.me" />

        {/* JSON-LD: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Gamakay",
              alternateName: "Gamakay Giftcards Nepal",
              url: "https://gamakay.shop",
              logo: {
                "@type": "ImageObject",
                url: "https://gamakay.shop/gamakay-logo.webp",
              },
              image: "https://gamakay.shop/og-image.png",
              description:
                "Digital gift cards and subscriptions in Nepal including Steam, PlayStation, Apple, Xbox, Netflix, Spotify, ChatGPT Plus and Claude AI with fast WhatsApp delivery.",
              foundingDate: "2023",
              telephone: "+977-9862157864",
              areaServed: { "@type": "Country", name: "Nepal" },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Kathmandu",
                addressRegion: "Bagmati",
                addressCountry: "NP",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+977-9862157864",
                contactType: "customer support",
                areaServed: "NP",
                availableLanguage: ["English", "Nepali"],
              },
              sameAs: [
                "https://www.instagram.com/gamakaygiftcards/",
                "https://wa.me/9779862157864",
              ],
            }),
          }}
        />

        {/* JSON-LD: WebSite with Sitelinks SearchBox */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Gamakay",
              alternateName: "Gamakay Nepal",
              url: "https://gamakay.shop",
              description:
                "Buy digital gift cards and subscriptions in Nepal: Steam, PlayStation, Apple, Xbox, Netflix, Spotify, ChatGPT and Claude AI with fast WhatsApp delivery.",
              inLanguage: "en-NP",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://gamakay.shop/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* JSON-LD: Store */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "Gamakay Digital Gift Cards Nepal",
              image: ["https://gamakay.shop/og-image.png"],
              url: "https://gamakay.shop",
              telephone: "+977-9862157864",
              priceRange: "NPR 385 - NPR 50,000",
              currenciesAccepted: "NPR",
              paymentAccepted: "eSewa, Khalti, ConnectIPS, Bank Transfer",
              areaServed: { "@type": "Country", name: "Nepal" },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Kathmandu",
                addressRegion: "Bagmati",
                addressCountry: "NP",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "27.7172",
                longitude: "85.3240",
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
                opens: "00:00",
                closes: "23:59",
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Digital Gift Cards & Subscriptions in Nepal",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Steam Gift Card Nepal",
                      url: "https://gamakay.shop/product/steam-giftcards-us-india",
                      description: "Buy Steam Wallet gift cards (US & India) in Nepal with fast WhatsApp delivery.",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "PlayStation Gift Card Nepal",
                      url: "https://gamakay.shop/product/playstation-giftcards-usd",
                      description: "Buy PSN PlayStation Store gift cards (USD & INR) in Nepal for PS4 and PS5.",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Apple Gift Card Nepal",
                      url: "https://gamakay.shop/product/apple-gift-card-usd",
                      description: "Buy Apple and iTunes gift cards in Nepal for App Store, iCloud+ and Apple Music.",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Xbox Game Pass Ultimate Nepal",
                      url: "https://gamakay.shop/product/xbox-gamepass-ultimate",
                      description: "Buy Xbox Game Pass Ultimate and Xbox gift cards in Nepal.",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Netflix Subscription Nepal",
                      url: "https://gamakay.shop/product/netflix-monthly",
                      description: "Buy Netflix 4K Ultra HD monthly subscriptions in Nepal with fast WhatsApp delivery.",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Spotify Premium Nepal",
                      url: "https://gamakay.shop/product/spotify-premium",
                      description: "Buy Spotify Premium plans in Nepal with instant WhatsApp delivery.",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Claude AI Pro Nepal",
                      url: "https://gamakay.shop/product/claude-ai-anthropic",
                      description: "Buy Claude AI Pro by Anthropic subscription in Nepal via eSewa, Khalti or bank transfer.",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "ChatGPT Plus Nepal",
                      url: "https://gamakay.shop/product/chatgpt-plus",
                      description: "Buy ChatGPT Plus subscription in Nepal with fast WhatsApp activation.",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Discord Nitro Nepal",
                      url: "https://gamakay.shop/product/discord-nitro",
                      description: "Buy Discord Nitro subscriptions in Nepal with fast delivery.",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Nintendo eShop Gift Card Nepal",
                      url: "https://gamakay.shop/product/nintendo-eshop-giftcards",
                      description: "Buy Nintendo Switch eShop gift cards in Nepal.",
                    },
                  },
                ],
              },
            }),
          }}
        />

        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body
        suppressHydrationWarning
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100dvh",
        }}
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <CartProvider>
          <SmoothScrollProvider>
            <Header />
            <main id="main-content" style={{ flex: 1 }}>
              {children}
            </main>
            <Footer />
            <CartDrawer />
            <Analytics />
            <SpeedInsights />
          </SmoothScrollProvider>
        </CartProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import HomePageClient from '@/components/HomePageClient';
import { getFeaturedProducts } from '@/lib/products';
import { SITE_URL, DEFAULT_OG_IMAGE, getPriceRange, toAbsoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute: 'Buy Gift Cards in Nepal | Steam, PSN, Apple & AI | Gamakay',
  },
  description:
    'Buy digital gift cards & subscriptions in Nepal. Steam, PlayStation, Apple, Netflix, Spotify, ChatGPT & Claude AI with eSewa, Khalti & fast WhatsApp delivery.',
  alternates: {
    canonical: SITE_URL,
    languages: {
      'en-NP': SITE_URL,
      'x-default': SITE_URL,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_NP',
    url: SITE_URL,
    siteName: 'Gamakay',
    title: 'Buy Gift Cards in Nepal | Steam, PSN, Apple & AI | Gamakay',
    description:
      'Buy digital gift cards & subscriptions in Nepal. Steam, PlayStation, Apple, Netflix, Spotify, ChatGPT & Claude AI with eSewa, Khalti & fast WhatsApp delivery.',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Gamakay - Digital Gift Cards and Subscriptions in Nepal',
      },
    ],
  },
};

export default function HomePage() {
  const featured = getFeaturedProducts(16);

  // Synced 1-to-1 with visible FAQSection copy for Google Rich Results compliance
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I buy from Gamakay?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pick your gift card and amount, add it to your cart, and head to checkout. Put in your phone number to get an order number, then send the pre-filled message on WhatsApp or Viber. Once you send your payment screenshot, we reply with your code right in chat.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does delivery take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most codes are sent within 5 to 15 minutes on WhatsApp. During busy hours or for certain regional denominations, it can take 1 to 24 hours depending on stock.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does checkout work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Place your order with your WhatsApp or Viber number to get an order code. We send the details right in chat and deliver your code as soon as your order is confirmed.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I check if a card works with my account?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Every product lists its region (US, India, or Global). Make sure your Apple ID, PlayStation, Steam, or Nintendo account matches that region before ordering. If you aren't sure, just ask us on WhatsApp first.",
        },
      },
      {
        '@type': 'Question',
        name: 'What is your refund policy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'If there is an issue on our end before delivery, you get a full refund. Once a digital code has been delivered, it cannot be refunded, and we cannot refund orders bought for the wrong account region.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I track my order?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Go to the Track Order page and enter the phone number you used at checkout. It opens WhatsApp with your details filled in so we can reply with your order status right away.',
        },
      },
    ],
  };

  const featuredListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Popular Digital Gift Cards & Subscriptions in Nepal',
    url: SITE_URL,
    numberOfItems: featured.length,
    itemListElement: featured.map((product, index) => {
      const { min } = getPriceRange(product);
      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.name,
          url: `${SITE_URL}/product/${product.slug}`,
          image: toAbsoluteUrl(product.image_url),
          brand: { '@type': 'Brand', name: product.brand },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'NPR',
            price: min,
            availability: product.in_stock
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          },
        },
      };
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(featuredListSchema) }}
      />
      <HomePageClient />
    </>
  );
}

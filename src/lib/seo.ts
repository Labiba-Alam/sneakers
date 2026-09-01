// KINGSMAN Structured Data Schema Generators for Technical SEO
import { Product } from '../types';

export const SITE_URL = 'https://kingsman-luxury.com';

// Canonical URL Helpers
export const getCanonicalUrl = (path = ''): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath === '/' ? '' : cleanPath}`;
};

export const getProductCanonicalUrl = (product: Product): string => {
  const slug = (product.sku || product.id).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `${SITE_URL}/products/${slug}`;
};

export const getCategoryCanonicalUrl = (category: string): string => {
  const slug = category.toLowerCase().replace(/\s+/g, '-');
  return `${SITE_URL}/collections/${slug}`;
};

// 1. Organization Schema
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'KINGSMAN Royal Luxury Sneakers',
  alternateName: 'KINGSMAN Atelier',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
    caption: 'KINGSMAN Royal Coat of Arms'
  },
  sameAs: [
    'https://instagram.com/kingsman.royal',
    'https://facebook.com/kingsman.royal',
    'https://twitter.com/kingsman_royal'
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+880-9612-888999',
      contactType: 'customer service',
      areaServed: ['BD', 'US', 'GB', 'AE'],
      availableLanguage: ['English', 'Bengali']
    }
  ]
});

// 2. Website & SearchAction Schema
export const getWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'KINGSMAN Royal Luxury Sneakers',
  url: SITE_URL,
  publisher: {
    '@id': `${SITE_URL}/#organization`
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/?search={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  }
});

// 3. LocalBusiness Schema
export const getLocalBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ShoeStore',
  '@id': `${SITE_URL}/#store`,
  name: 'KINGSMAN Luxury Sneakers Atelier',
  image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80',
  telephone: '+880-9612-888999',
  priceRange: '$$$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Plot 42, Gulshan Avenue',
    addressLocality: 'Dhaka',
    postalCode: '1212',
    addressCountry: 'BD'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 23.7925,
    longitude: 90.4167
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '10:00',
      closes: '22:00'
    }
  ],
  url: SITE_URL
});

// 4. Product Schema with Reviews & Merchant Return Policy
export const getProductSchema = (product: Product) => {
  const productUrl = getProductCanonicalUrl(product);
  const colorNames = product.colors ? product.colors.map(c => c.name).join(', ') : 'Standard';
  const sizeNames = product.sizes ? product.sizes.map(s => `EU ${s}`).join(', ') : 'EU 40-45';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}/#product`,
    name: product.name,
    image: product.images && product.images.length > 0 ? product.images : [product.metaImage || ''],
    description: product.description || product.subtitle,
    sku: product.sku,
    mpn: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'KINGSMAN'
    },
    category: product.category,
    color: colorNames,
    size: sizeNames,
    material: product.materials || 'Full-Grain Italian Calfskin Leather',
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'USD',
      price: product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'KINGSMAN Royal Atelier'
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'BD',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn'
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: 0,
          currency: 'USD'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'BD'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY'
          }
        }
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || 4.9,
      reviewCount: product.reviewCount || 24,
      bestRating: '5',
      worstRating: '1'
    }
  };
};

// 5. Breadcrumb Schema
export const getBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url.startsWith('/') ? item.url : `/${item.url}`}`
  }))
});

// 6. FAQ Schema
export const getFAQSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Are KINGSMAN sneakers authentic and quality-inspected?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, every KINGSMAN pair is a curated luxury import, individually inspected by master cobblers for leather density, seam alignment, and comfort before dispatch.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is the delivery time across Bangladesh?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Inside Dhaka City, orders are delivered within 24 to 48 hours via private courier. Outside Dhaka, delivery takes 2 to 3 business days with full package tracking.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you offer Cash on Delivery (COD)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Cash on Delivery is available across all 64 districts in Bangladesh with open-box verification on delivery.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is the KINGSMAN exchange & return policy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We provide a 7-day complimentary size exchange and return window on all unworn footwear in original royal packaging.'
      }
    }
  ]
});


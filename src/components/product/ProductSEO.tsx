import React, { useEffect } from 'react';
import { Product } from '../../types';

interface ProductSEOProps {
  product: Product;
}

export const ProductSEO: React.FC<ProductSEOProps> = ({ product }) => {
  useEffect(() => {
    // Dynamic Page Title
    const originalTitle = document.title;
    document.title = `${product.name} | KINGSMAN Atelier Luxury Footwear`;

    // Dynamic Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', `${product.name} - ${product.subtitle}. Handcrafted Florentine leather sneaker. SKU: ${product.sku}. Cash on Delivery in Dhaka & Bangladesh.`);

    // Inject JSON-LD Product Schema
    const schemaData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": product.images,
      "description": product.description,
      "sku": product.sku,
      "mpn": product.sku,
      "brand": {
        "@type": "Brand",
        "name": "KINGSMAN Atelier"
      },
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "USD",
        "price": product.price,
        "priceValidUntil": "2027-12-31",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "KINGSMAN Dhaka Vault"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating.toString(),
        "reviewCount": product.reviewCount.toString(),
        "bestRating": "5",
        "worstRating": "1"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'product-json-ld';
    script.innerHTML = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      document.title = originalTitle;
      const existingScript = document.getElementById('product-json-ld');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [product]);

  return null;
};

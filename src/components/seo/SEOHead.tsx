import React, { useEffect } from 'react';
import { 
  getOrganizationSchema, 
  getWebsiteSchema, 
  getLocalBusinessSchema, 
  getProductSchema, 
  getBreadcrumbSchema, 
  getFAQSchema,
  getProductCanonicalUrl,
  getCategoryCanonicalUrl,
  getCanonicalUrl,
  SITE_URL 
} from '../../lib/seo';
import { Product } from '../../types';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  product?: Product;
  categoryName?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'KINGSMAN | Handcrafted Royal Luxury Sneakers',
  description = 'Meticulously handcrafted luxury sneakers made with full-grain Italian leather, custom 24K gold accents, and unprecedented comfort.',
  canonicalUrl,
  ogImage = 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80',
  product,
  categoryName
}) => {
  useEffect(() => {
    // 1. Calculate Real Dynamic Titles, Descriptions & Canonical URLs
    const finalTitle = product 
      ? `${product.name} | Handcrafted Luxury ${product.category} Sneaker | KINGSMAN`
      : categoryName 
      ? `${categoryName} Luxury Footwear Archive | KINGSMAN Royal Atelier` 
      : title;

    const finalDescription = product
      ? `${product.name} - ${product.subtitle || product.description}. Crafted from premium leather with signature gold-tone accents. Available in sizes ${product.sizes?.join(', ') || 'EU 40-45'}. Express delivery across Bangladesh.`
      : categoryName
      ? `Explore curated ${categoryName} luxury sneakers at KINGSMAN. Individually inspected, authentic imported silhouettes with express courier delivery.`
      : description;

    const finalCanonical = product
      ? getProductCanonicalUrl(product)
      : categoryName
      ? getCategoryCanonicalUrl(categoryName)
      : canonicalUrl ? getCanonicalUrl(canonicalUrl) : SITE_URL;

    const primaryImage = product?.images?.[0] || product?.metaImage || ogImage;
    const colorNames = product?.colors?.map(c => c.name).join(' / ') || 'Standard Edition';
    const imageAltText = product ? `${product.name} in ${colorNames} - KINGSMAN Luxury Sneaker` : 'KINGSMAN Royal Luxury Sneakers Atelier';

    // 2. Set Page Title
    document.title = finalTitle;

    // 3. Helper to set/update meta elements
    const setMetaTag = (selector: string, attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Meta Description & Keywords
    setMetaTag('meta[name="description"]', 'name', 'description', finalDescription);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', 'luxury sneakers, handcrafted sneakers, Italian leather shoes, KINGSMAN, high tops, low tops, Dhaka luxury fashion, genuine leather');
    setMetaTag('meta[name="robots"]', 'name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // OpenGraph Core
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'KINGSMAN Royal Luxury Sneakers');
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', finalTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', finalDescription);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', primaryImage);
    setMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', imageAltText);
    setMetaTag('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
    setMetaTag('meta[property="og:image:height"]', 'property', 'og:image:height', '800');
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', finalCanonical);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', product ? 'product' : 'website');

    // OpenGraph E-commerce Product Attributes
    if (product) {
      setMetaTag('meta[property="product:price:amount"]', 'property', 'product:price:amount', product.price.toString());
      setMetaTag('meta[property="product:price:currency"]', 'property', 'product:price:currency', 'USD');
      setMetaTag('meta[property="product:availability"]', 'property', 'product:availability', product.stock > 0 ? 'in stock' : 'out of stock');
      setMetaTag('meta[property="product:brand"]', 'property', 'product:brand', 'KINGSMAN');
      setMetaTag('meta[property="product:category"]', 'property', 'product:category', product.category);
      setMetaTag('meta[property="product:condition"]', 'property', 'product:condition', 'new');
      setMetaTag('meta[property="product:retailer_item_id"]', 'property', 'product:retailer_item_id', product.sku);
    }

    // Twitter Cards (Summary Large Image)
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:site"]', 'name', 'twitter:site', '@kingsman_royal');
    setMetaTag('meta[name="twitter:creator"]', 'name', 'twitter:creator', '@kingsman_royal');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', finalTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', finalDescription);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', primaryImage);
    setMetaTag('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', imageAltText);

    if (product) {
      setMetaTag('meta[name="twitter:label1"]', 'name', 'twitter:label1', 'Price');
      setMetaTag('meta[name="twitter:data1"]', 'name', 'twitter:data1', `$${product.price}`);
      setMetaTag('meta[name="twitter:label2"]', 'name', 'twitter:label2', 'Availability');
      setMetaTag('meta[name="twitter:data2"]', 'name', 'twitter:data2', product.stock > 0 ? 'In Stock (Express Courier)' : 'Sold Out');
    }

    // Canonical link tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', finalCanonical);

    // 4. Inject Google Rich Results JSON-LD Schemas
    const schemas: any[] = [
      getOrganizationSchema(),
      getWebsiteSchema(),
      getLocalBusinessSchema(),
      getFAQSchema()
    ];

    if (product) {
      schemas.push(getProductSchema(product));
      schemas.push(getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: product.category, url: `/collections/${product.category.toLowerCase().replace(/\s+/g, '-')}` },
        { name: product.name, url: `/products/${(product.sku || product.id).toLowerCase().replace(/[^a-z0-9]+/g, '-')}` }
      ]));
    } else if (categoryName) {
      schemas.push(getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: categoryName, url: `/collections/${categoryName.toLowerCase().replace(/\s+/g, '-')}` }
      ]));
    } else {
      schemas.push(getBreadcrumbSchema([
        { name: 'Home', url: '/' }
      ]));
    }

    let scriptTag = document.getElementById('kingsman-jsonld');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'kingsman-jsonld';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schemas);

  }, [title, description, canonicalUrl, ogImage, product, categoryName]);

  return null;
};


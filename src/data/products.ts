import { Product, CategoryType } from '../types';

export const CATEGORIES_LIST: { name: CategoryType; description: string; image: string }[] = [
  {
    name: 'Men Sneakers',
    description: 'Precision-crafted luxury silhouettes engineered for discerning gentlemen in Bangladesh.',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'Women Sneakers',
    description: 'Effortless luxury tailored with sleek profiles, plush cushioning, and metallic accents.',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'High Tops',
    description: 'Commanding high-top silhouettes with padded collars and gold-tone insignias.',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'Casual Sneakers',
    description: 'Clean, minimalist elegance designed for daily wear and relaxed sophistication.',
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'Running Shoes',
    description: 'High-rebound cushioning with engineered jacquard weave and breathable comfort.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'Sports Shoes',
    description: 'Performance-grade footwear combining athletic responsiveness with streetwear aesthetics.',
    image: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'Basketball Shoes',
    description: 'Elevated court aesthetics featuring high-traction outsoles and padded ankle support.',
    image: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'Slides & Sandals',
    description: 'Ergonomic footbeds with premium velvet touch for effortless off-duty luxury.',
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'Accessories',
    description: 'Aromatic cedar shoe trees, metallic lace kits, and leather care essentials.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85'
  }
];

// Curated authentic launch collection in Bangladeshi Taka (৳ BDT)
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'kng-001',
    name: 'KINGSMAN Sovereign Crimson I',
    subtitle: 'Curated premium luxury silhouette with polished gold-tone heel emblem.',
    price: 6990,
    originalPrice: 7990,
    discountPercent: 12,
    stock: 24,
    sizeStock: { 39: 2, 40: 5, 41: 7, 42: 6, 43: 3, 44: 1 },
    sku: 'KNG-SOV-CRM-01',
    category: 'Men Sneakers',
    sizes: [39, 40, 41, 42, 43, 44],
    colors: [
      { name: 'Royal Crimson & Gold', hex: '#C1121F' },
      { name: 'Obsidian Black', hex: '#111111' },
      { name: 'Pure Chalk White', hex: '#F8F8F8' }
    ],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'The Sovereign Crimson I represents the pinnacle of our curated luxury collection. Hand-selected for exceptional build quality and verified before dispatch, each pair balances commanding presence with all-day comfort.',
    craftsmanshipDetails: [
      'Selected premium leather and textured upper',
      'Deep crimson finish with refined gold-tone trim',
      'Anatomical memory-foam insoles with soft lining',
      'High-traction durable rubber outsoles',
      'Individual model certification tag on the inner tongue'
    ],
    materials: 'Premium Leather, Breathable Inner Lining, Gold-Tone Hardware, High-Density Rubber',
    careInstructions: 'Clean with dry microfiber cloth. Apply natural leather balm monthly. Store in complimentary velvet dust bags.',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isLimitedEdition: true,
    rating: 4.95,
    reviewCount: 28,
    tags: ['Flagship', 'Gold Accent', 'Curated Luxury', 'Royal Edition'],
    relatedProductIds: ['kng-002', 'kng-003', 'kng-005'],
    frequentlyBoughtTogetherIds: ['kng-acc-01', 'kng-acc-02']
  },
  {
    id: 'kng-002',
    name: 'KINGSMAN Imperial Court High',
    subtitle: 'High-top court silhouette in matte obsidian and brushed gold-tone accents.',
    price: 5490,
    originalPrice: 5990,
    discountPercent: 8,
    stock: 18,
    sizeStock: { 39: 2, 40: 4, 41: 5, 42: 4, 43: 2, 44: 1 },
    sku: 'KNG-IMP-CRT-02',
    category: 'High Tops',
    sizes: [39, 40, 41, 42, 43, 44],
    colors: [
      { name: 'Matte Obsidian', hex: '#111111' },
      { name: 'Pure White & Gold', hex: '#C7A55B' }
    ],
    images: [
      'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'A commanding high-top silhouette designed for maximum ankle support and unmistakable street presence. Featuring padded collars and signature KINGSMAN gold-tone heel detailing.',
    craftsmanshipDetails: [
      'Supple soft-finish leather upper',
      'Padded high-top collar with padded Achilles notch',
      'Gold foil stamped KINGSMAN coat of arms on lateral flank',
      'Reinforced cupsole construction with durable rubber tread'
    ],
    materials: 'Selected Leather, Suede Overlays, Brushed Gold-Tone Hardware',
    careInstructions: 'Protect with stain repellent spray prior to first wear.',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    isLimitedEdition: false,
    rating: 4.92,
    reviewCount: 19,
    tags: ['High Top', 'Black Gold', 'Court', 'Curated Streetwear'],
    relatedProductIds: ['kng-001', 'kng-004'],
    frequentlyBoughtTogetherIds: ['kng-acc-01']
  },
  {
    id: 'kng-003',
    name: 'KINGSMAN Monarch Minimal Low',
    subtitle: 'Understated luxury low-top sneaker in smooth chalk finish.',
    price: 4890,
    originalPrice: 5290,
    discountPercent: 7,
    stock: 22,
    sizeStock: { 39: 3, 40: 5, 41: 6, 42: 5, 43: 2, 44: 1 },
    sku: 'KNG-MNR-LOW-03',
    category: 'Casual Sneakers',
    sizes: [39, 40, 41, 42, 43, 44],
    colors: [
      { name: 'Chalk White', hex: '#F8F8F8' },
      { name: 'Deep Crimson Trim', hex: '#C1121F' }
    ],
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Clean, unpretentious perfection. The Monarch Minimal Low seamlessly transitions from sharp tailoring to casual weekend wear with effortless grace.',
    craftsmanshipDetails: [
      'Smooth matte white finish with clean stitch lines',
      'Subtle gold debossed serial number on heel',
      'Ultra-lightweight cupsole construction',
      'Breathable cushioned sockliner'
    ],
    materials: 'Selected Leather, Durable Cupsole, Cushioned Sockliner',
    careInstructions: 'Wipe clean with moist white cloth.',
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    isLimitedEdition: false,
    rating: 4.88,
    reviewCount: 34,
    tags: ['Casual Sneakers', 'Minimal', 'White Sneaker', 'Daily Luxury'],
    relatedProductIds: ['kng-001', 'kng-005']
  },
  {
    id: 'kng-004',
    name: 'KINGSMAN Vanguard Royal Runner',
    subtitle: 'Ultralight performance runner with responsive high-rebound cushioning.',
    price: 4250,
    originalPrice: 4890,
    discountPercent: 13,
    stock: 15,
    sizeStock: { 40: 3, 41: 4, 42: 4, 43: 3, 44: 1 },
    sku: 'KNG-VNG-RUN-04',
    category: 'Running Shoes',
    sizes: [40, 41, 42, 43, 44],
    colors: [
      { name: 'Stealth Black & Crimson', hex: '#C1121F' },
      { name: 'Metallic Platinum', hex: '#E0E0E0' }
    ],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Modern athletic engineering meets refined aesthetics. The Vanguard features high-density response cushioning for smooth energy return and daily comfort.',
    craftsmanshipDetails: [
      'Engineered jacquard weave mesh with reinforced mudguards',
      'High-rebound response midsole cushion',
      'Torsional support shank plate for stability',
      'Reflective metallic gold thread accents'
    ],
    materials: 'Jacquard Weave, Synthetic Overlays, Rebound Foam, Rubber',
    careInstructions: 'Hand wash with mild sneaker detergent.',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true,
    isLimitedEdition: false,
    rating: 4.85,
    reviewCount: 22,
    tags: ['Running Shoes', 'Cushioned', 'Performance Luxury'],
    relatedProductIds: ['kng-001', 'kng-005']
  },
  {
    id: 'kng-005',
    name: 'KINGSMAN Apex Streetwear Phantom',
    subtitle: 'Triple-black tonal stealth sneaker with architectural rubber outsole.',
    price: 5200,
    originalPrice: 5800,
    discountPercent: 10,
    stock: 16,
    sizeStock: { 39: 2, 40: 4, 41: 4, 42: 4, 43: 2 },
    sku: 'KNG-APX-PHT-05',
    category: 'Men Sneakers',
    sizes: [39, 40, 41, 42, 43],
    colors: [
      { name: 'Triple Obsidian Black', hex: '#0D0D0D' },
      { name: 'Graphite Grey', hex: '#262626' }
    ],
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Stealth aesthetics designed for urban nightscapes. The Apex Phantom blends technical synthetic textiles with premium matte leather mudguards.',
    craftsmanshipDetails: [
      'Abrasion-resistant ballistic mesh and leather overlays',
      'Concealed lace locking system',
      'Heavy-duty lugged outsole for wet Dhaka asphalt grip',
      'Antimicrobial breathable mesh insole'
    ],
    materials: 'Matte Leather, Ballistic Mesh, High-Grip Vulcanized Rubber',
    careInstructions: 'Wipe with damp cloth and protect from extreme heat.',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    isLimitedEdition: false,
    rating: 4.90,
    reviewCount: 15,
    tags: ['Stealth Black', 'Streetwear', 'All-Weather', 'Urban Drop'],
    relatedProductIds: ['kng-001', 'kng-002']
  },
  {
    id: 'kng-006',
    name: 'KINGSMAN Sovereign Velvet Slide',
    subtitle: 'Ergonomic comfort footbed wrapped in rich royal crimson velvet.',
    price: 2450,
    originalPrice: 2850,
    discountPercent: 14,
    stock: 20,
    sizeStock: { 39: 3, 40: 5, 41: 5, 42: 4, 43: 3 },
    sku: 'KNG-SOV-SLD-06',
    category: 'Slides & Sandals',
    sizes: [39, 40, 41, 42, 43],
    colors: [
      { name: 'Royal Crimson Velvet', hex: '#C1121F' },
      { name: 'Obsidian Velvet', hex: '#111111' }
    ],
    images: [
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Effortless off-duty luxury. Designed for restorative downtime with contoured arch support and ultra-soft strap padding.',
    craftsmanshipDetails: [
      'Plush velvet strap with embossed gold-foil crest',
      'Anatomically sculpted EVA footbed',
      'Anti-slip patterned outsole'
    ],
    materials: 'Micro-Velvet, High-Grade EVA Foam, Textured Rubber',
    careInstructions: 'Spot clean velvet with soft brush.',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    isLimitedEdition: false,
    rating: 4.80,
    reviewCount: 26,
    tags: ['Slides', 'Comfort', 'Summer Luxury', 'Loungewear'],
    relatedProductIds: ['kng-001', 'kng-acc-01']
  },
  {
    id: 'kng-acc-01',
    name: 'KINGSMAN Royal Cedar & Velvet Shoe Tree Kit',
    subtitle: 'Aromatic Red Cedar wood trees wrapped in plush royal crimson velvet.',
    price: 1250,
    originalPrice: 1450,
    discountPercent: 13,
    stock: 50,
    sizeStock: { 40: 15, 42: 20, 44: 15 },
    sku: 'KNG-ACC-TREE-01',
    category: 'Accessories',
    sizes: [40, 42, 44],
    colors: [{ name: 'Crimson Velvet & Cedar', hex: '#C1121F' }],
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Preserve the shape and fresh aroma of your footwear collection. Made from aromatic cedar and finished with solid brass-finish hardware.',
    craftsmanshipDetails: [
      'Naturally moisture-wicking Aromatic Cedar wood',
      'Plush crimson velvet heel buffer',
      'Solid brass-finish extension springs and crest handle'
    ],
    materials: 'Aromatic Cedar, Brass-Finish Metal, Velvet',
    careInstructions: 'Sand lightly every year to refresh natural cedar aroma.',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    isLimitedEdition: false,
    rating: 4.97,
    reviewCount: 18,
    tags: ['Accessory', 'Shoe Care', 'Cedar', 'Gift']
  },
  {
    id: 'kng-acc-02',
    name: 'KINGSMAN Gold Aglet Lace & Care Set',
    subtitle: 'Waxed cotton laces with engraved gold-tone screw-on aglets.',
    price: 850,
    originalPrice: 950,
    discountPercent: 10,
    stock: 60,
    sizeStock: { 41: 60 },
    sku: 'KNG-ACC-LACE-02',
    category: 'Accessories',
    sizes: [41],
    colors: [
      { name: 'Gold & Crimson Laces', hex: '#C7A55B' },
      { name: 'Black & Gold Laces', hex: '#111111' }
    ],
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Elevate any pair of sneakers with custom weighted gold-tone aglets and high-density waxed cotton cords.',
    craftsmanshipDetails: [
      'Heavyweight 100% long-staple waxed cotton',
      'Polished gold-tone metal aglet tips with laser crest',
      'Includes premium leather balm and horsehair shine brush'
    ],
    materials: 'Waxed Cotton, Gold-Tone Metal, Horsehair Brush',
    careInstructions: 'Keep dry.',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    isLimitedEdition: false,
    rating: 4.94,
    reviewCount: 12,
    tags: ['Accessory', 'Gold Laces', 'Customization']
  }
];

import { Product, CategoryType } from '../types';

export const CATEGORIES_LIST: { name: CategoryType; description: string; image: string }[] = [
  {
    name: 'Lifestyle',
    description: 'Effortless luxury tailored for contemporary streetwear.',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'Running',
    description: 'High-performance engineering with premium layered uppers and responsive cushioning.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'Basketball',
    description: 'Elevated court aesthetics with metallic accents and responsive traction soles.',
    image: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'High Tops',
    description: 'Commanding silhouettes with padded ankle collars and royal crest detailing.',
    image: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'Low Tops',
    description: 'Clean, minimalist elegance selected for daily sophistication.',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'Limited Edition',
    description: 'Exclusive limited drops, individually inspected and certified authentic.',
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'New Arrivals',
    description: 'The latest curated drops featuring season-defining colorways.',
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'Sale',
    description: 'Curated luxury silhouettes at special private-sale prices.',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=85'
  },
  {
    name: 'Accessories',
    description: 'Cedar shoe trees, brass horn kits, and metallic-tipped lace sets.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85'
  }
];

// Curated high-resolution sneaker images for diverse premium catalog representation
const SNEAKER_IMAGE_BANK = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1588117305388-c2631a279f82?auto=format&fit=crop&w=1000&q=85'
];

const MODEL_NAMES = [
  'Royal Sovereign I', 'Imperial Crimson Low', 'Crown Heritage High', 'Monarch Velvet Runner',
  'Kingston Obsidian 88', 'Valiant Court Master', 'Majestic Gold Line', 'Regal Phantom Craft',
  'Aura Zenith Low', 'Sovereign Runner Pro', 'Empire Black Gold', 'Elegance High Top 01',
  'Dynasty Minimalist', 'Vanguard Sovereign Leather', 'Patriarch Court High', 'Noble Crest Runner',
  'Royal Velvet Street', 'Grand Monarch Prime', 'Gilded Crest High', 'Sovereign Luxe Trainer'
];

const CATEGORIES: CategoryType[] = [
  'Lifestyle', 'Running', 'Basketball', 'High Tops', 'Low Tops', 'Limited Edition', 'New Arrivals', 'Sale', 'Accessories'
];

// Helper to generate 100 comprehensive products
function generateCatalog(): Product[] {
  const products: Product[] = [];

  // 1. Featured Flagship Models
  products.push({
    id: 'kng-001',
    name: 'KINGSMAN Sovereign Crimson I',
    subtitle: 'Curated premium luxury silhouette with polished gold-tone heel emblem.',
    price: 680,
    originalPrice: 780,
    discountPercent: 12,
    stock: 8,
    sku: 'KNG-SOV-CRM-01',
    category: 'Limited Edition',
    sizes: [40, 41, 42, 43, 44, 45],
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
    rating: 4.98,
    reviewCount: 42,
    tags: ['Flagship', 'Gold Accent', 'Curated Luxury', 'Royal Edition'],
    relatedProductIds: ['kng-002', 'kng-003', 'kng-005'],
    frequentlyBoughtTogetherIds: ['kng-acc-01', 'kng-acc-02']
  });

  products.push({
    id: 'kng-002',
    name: 'KINGSMAN Imperial Court High',
    subtitle: 'High-top court silhouette in matte obsidian and brushed gold-tone accents.',
    price: 520,
    originalPrice: 520,
    stock: 14,
    sku: 'KNG-IMP-CRT-02',
    category: 'High Tops',
    sizes: [39, 40, 41, 42, 43, 44, 45, 46],
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
    reviewCount: 29,
    tags: ['High Top', 'Black Gold', 'Court', 'Curated Streetwear'],
    relatedProductIds: ['kng-001', 'kng-004'],
    frequentlyBoughtTogetherIds: ['kng-acc-01']
  });

  products.push({
    id: 'kng-003',
    name: 'KINGSMAN Monarch Minimal Low',
    subtitle: 'Understated luxury low-top sneaker in smooth chalk finish.',
    price: 450,
    originalPrice: 490,
    discountPercent: 8,
    stock: 22,
    sku: 'KNG-MNR-LOW-03',
    category: 'Low Tops',
    sizes: [39, 40, 41, 42, 43, 44, 45],
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
    rating: 4.95,
    reviewCount: 64,
    tags: ['Low Top', 'Minimal', 'White Sneaker', 'Daily Luxury'],
    relatedProductIds: ['kng-001', 'kng-006']
  });

  products.push({
    id: 'kng-004',
    name: 'KINGSMAN Vanguard Royal Runner',
    subtitle: 'Ultralight performance runner with responsive high-rebound cushioning.',
    price: 480,
    originalPrice: 480,
    stock: 12,
    sku: 'KNG-VNG-RUN-04',
    category: 'Running',
    sizes: [40, 41, 42, 43, 44, 45, 46],
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
    rating: 4.89,
    reviewCount: 38,
    tags: ['Running', 'Cushioned', 'Performance Luxury'],
    relatedProductIds: ['kng-001', 'kng-005']
  });

  // Accessories
  products.push({
    id: 'kng-acc-01',
    name: 'KINGSMAN Royal Cedar & Velvet Shoe Tree Kit',
    subtitle: 'Aromatic Red Cedar wood trees wrapped in plush royal crimson velvet.',
    price: 120,
    originalPrice: 120,
    stock: 50,
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
    reviewCount: 88,
    tags: ['Accessory', 'Shoe Care', 'Cedar', 'Gift']
  });

  products.push({
    id: 'kng-acc-02',
    name: 'KINGSMAN Gold Aglet Lace & Care Set',
    subtitle: 'Waxed cotton laces with engraved gold-tone screw-on aglets.',
    price: 85,
    originalPrice: 95,
    discountPercent: 10,
    stock: 75,
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
    reviewCount: 31,
    tags: ['Accessory', 'Gold Laces', 'Customization']
  });

  // Generate remaining 94 realistic items programmatically to reach ~100 products
  let itemCounter = 5;
  for (let i = 0; i < 94; i++) {
    itemCounter++;
    const cat = CATEGORIES[i % CATEGORIES.length];
    const baseName = MODEL_NAMES[i % MODEL_NAMES.length];
    const num = String(itemCounter).padStart(3, '0');
    const image1 = SNEAKER_IMAGE_BANK[i % SNEAKER_IMAGE_BANK.length];
    const image2 = SNEAKER_IMAGE_BANK[(i + 1) % SNEAKER_IMAGE_BANK.length];
    const priceBase = 320 + ((i * 17) % 680);
    const hasDiscount = i % 4 === 0;
    const isLimited = cat === 'Limited Edition' || i % 7 === 0;
    const isNew = i % 3 === 0;
    const isBest = i % 5 === 0;
    const isSale = cat === 'Sale' || hasDiscount;

    products.push({
      id: `kng-${num}`,
      name: `KINGSMAN ${baseName} ${num}`,
      subtitle: `Curated ${cat.toLowerCase()} silhouette featuring premium textured finish and gold-tone accents.`,
      price: priceBase,
      originalPrice: hasDiscount ? priceBase + 60 : priceBase,
      discountPercent: hasDiscount ? Math.round((60 / (priceBase + 60)) * 100) : undefined,
      stock: (i % 12) + 2, // Stock 2 to 14
      sku: `KNG-${cat.substring(0,3).toUpperCase()}-${num}`,
      category: cat,
      sizes: [39, 40, 41, 42, 43, 44, 45, 46].filter((_, idx) => (idx + i) % 2 === 0 || idx < 5),
      colors: [
        { name: 'Obsidian Black', hex: '#111111' },
        { name: 'Royal Crimson', hex: '#C1121F' },
        { name: 'Imperial Gold', hex: '#C7A55B' },
        { name: 'Pure White', hex: '#F8F8F8' }
      ].slice(0, (i % 3) + 2),
      images: [image1, image2],
      description: `The KINGSMAN ${baseName} ${num} merges royal aesthetics with clean architectural lines. Selected and quality-inspected for exceptional comfort and longevity.`,
      craftsmanshipDetails: [
        'Premium selected leather upper',
        'Laser-engraved KINGSMAN royal insignia',
        'Custom high-durability rubber sole with reinforced stitching',
        'Injected ergonomic footbed for all-day comfort'
      ],
      materials: 'Premium Leather, Breathable Mesh, Durable Rubber',
      careInstructions: 'Clean gently with soft brush or damp cloth.',
      isFeatured: i < 8,
      isNewArrival: isNew,
      isBestSeller: isBest,
      isLimitedEdition: isLimited,
      rating: Number((4.7 + (i % 30) * 0.01).toFixed(2)),
      reviewCount: 12 + ((i * 7) % 90),
      tags: [cat, 'Luxury', 'Curated Import', 'Premium Quality'],
      relatedProductIds: ['kng-001', 'kng-002', 'kng-003']
    });
  }

  return products;
}

export const INITIAL_PRODUCTS: Product[] = generateCatalog();

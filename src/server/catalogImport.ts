import { Product, CategoryType, DepartmentType, SneakerBrand, ClothingType, GenderType } from '../types';

export interface CSVProductRow {
  sku: string;
  name: string;
  category: string;
  subCategory?: string;
  gender?: string;
  price_bdt: number;
  sale_price_bdt?: number;
  description: string;
  material?: string;
  color: string;
  images: string[];
  is_featured?: boolean;
  is_new_drop?: boolean;
  stock_39: number;
  stock_40: number;
  stock_41: number;
  stock_42: number;
  stock_43: number;
  stock_44: number;
  stock_45: number;
}

export interface ImportValidationResult {
  valid: boolean;
  errors: string[];
  products: Product[];
  totalSizesCount: number;
}

/**
 * Standard CSV Header Template for KINGSMAN Store Owner
 */
export const CSV_CATALOG_TEMPLATE_HEADER = [
  'sku',
  'name',
  'category',
  'subCategory',
  'gender',
  'price_bdt',
  'sale_price_bdt',
  'description',
  'material',
  'color',
  'images',
  'is_featured',
  'is_new_drop',
  'stock_39',
  'stock_40',
  'stock_41',
  'stock_42',
  'stock_43',
  'stock_44',
  'stock_45',
].join(',');

export const CSV_CATALOG_SAMPLE_ROW = [
  'KNG-OZX-BLK',
  'Kingsman Onyx Runner',
  'Nike',
  'Streetwear',
  'Unisex',
  '6500',
  '5900',
  'Handcrafted premium full-grain Italian leather with gold-tone aglets.',
  'Full-Grain Leather & Breathable Mesh',
  'Matte Black / Crimson',
  'https://cdn.example.com/shoe1.jpg,https://cdn.example.com/shoe2.jpg',
  'TRUE',
  'TRUE',
  '4',
  '6',
  '8',
  '8',
  '5',
  '3',
  '2',
].join(',');

/**
 * Parses raw CSV string into validated Product entities.
 */
export function parseProductCatalogCSV(csvContent: string): ImportValidationResult {
  const lines = csvContent.split(/\r?\n/).filter(line => line.trim().length > 0);
  const errors: string[] = [];
  const products: Product[] = [];
  let totalSizesCount = 0;

  if (lines.length < 2) {
    return {
      valid: false,
      errors: ['CSV file is empty or missing data rows.'],
      products: [],
      totalSizesCount: 0,
    };
  }

  const headerLine = lines[0].toLowerCase();
  const headers = headerLine.split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const seenSkus = new Set<string>();

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    // Split CSV respecting quotes
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let charIndex = 0; charIndex < rawLine.length; charIndex++) {
      const char = rawLine[charIndex];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^["']|["']$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^["']|["']$/g, ''));

    const rowMap: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rowMap[h] = values[idx] || '';
    });

    const sku = (rowMap['sku'] || '').trim().toUpperCase();
    const name = (rowMap['name'] || '').trim();
    const rawCategory = (rowMap['category'] || 'Nike').trim();
    const isSneakerBrand = ['Nike', 'Jordan', 'Adidas', 'New Balance', 'Converse', 'Louis Vuitton'].includes(rawCategory);
    const category = (isSneakerBrand ? rawCategory : ['T-Shirt', 'Hoodie', 'Sweatshirt'].includes(rawCategory) ? rawCategory : 'Nike') as CategoryType;
    const department: DepartmentType = isSneakerBrand ? 'Sneakers' : 'Clothing';
    const brand = isSneakerBrand ? (category as SneakerBrand) : undefined;
    const clothingType = !isSneakerBrand ? (category as ClothingType) : undefined;
    const rawGender = (rowMap['gender'] || 'Unisex').trim();
    const gender: GenderType = rawGender === 'Men' ? 'Men' : rawGender === 'Women' ? 'Women' : 'Unisex';
    const price = parseFloat(rowMap['price_bdt'] || '0');
    const salePrice = parseFloat(rowMap['sale_price_bdt'] || '0');
    const description = (rowMap['description'] || '').trim();
    const material = (rowMap['material'] || '').trim();
    const color = (rowMap['color'] || 'Standard').trim();
    const imagesRaw = (rowMap['images'] || '').trim();
    const images = imagesRaw ? imagesRaw.split(',').map(u => u.trim()).filter(Boolean) : [];

    // Validations
    if (!sku) {
      errors.push(`Row ${i + 1}: Missing SKU.`);
      continue;
    }
    if (seenSkus.has(sku)) {
      errors.push(`Row ${i + 1}: Duplicate SKU '${sku}' found.`);
      continue;
    }
    seenSkus.add(sku);

    if (!name) {
      errors.push(`Row ${i + 1}: Product name is required.`);
    }
    if (isNaN(price) || price <= 0) {
      errors.push(`Row ${i + 1} (${sku}): Price in BDT must be a positive number.`);
    }

    // Size stocks
    const sizeStock: Record<string, number> = {};
    const sizeKeys = [39, 40, 41, 42, 43, 44, 45];
    let rowTotalStock = 0;

    sizeKeys.forEach(size => {
      const stockVal = parseInt(rowMap[`stock_${size}`] || '0', 10);
      const safeVal = isNaN(stockVal) || stockVal < 0 ? 0 : stockVal;
      sizeStock[String(size)] = safeVal;
      rowTotalStock += safeVal;
      if (safeVal > 0) totalSizesCount++;
    });

    const discountPercent = !isNaN(salePrice) && salePrice > 0 && salePrice < price
      ? Math.round(((price - salePrice) / price) * 100)
      : undefined;

    const productId = `kng-${sku.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const slug = `${(brand || clothingType || 'item').toLowerCase()}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    products.push({
      id: productId,
      sku,
      name,
      subtitle: rowMap['subcategory'] || `${category} Streetwear Edition`,
      category,
      department,
      brand,
      clothingType,
      gender,
      weightGrams: department === 'Sneakers' ? 1100 : 350,
      slug,
      price: salePrice > 0 && salePrice < price ? salePrice : price,
      originalPrice: salePrice > 0 && salePrice < price ? price : undefined,
      discountPercent,
      stock: rowTotalStock,
      sizeStock,
      sizes: sizeKeys.filter(s => (sizeStock[String(s)] || 0) > 0),
      colors: [{ name: color, hex: color.toLowerCase().includes('black') ? '#111111' : '#C1121F' }],
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85'],
      description: description || 'Premium KINGSMAN unisex streetwear silhouette.',
      craftsmanshipDetails: [
        material || 'Premium construction',
        'KINGSMAN insignia',
        'Ergonomic cushioned footbed',
        'High-density grip outsole',
      ],
      materials: material || 'Premium Materials',
      careInstructions: 'Clean gently with damp cloth. Store in dry dust bag.',
      isFeatured: rowMap['is_featured']?.toUpperCase() === 'TRUE',
      isNewArrival: rowMap['is_new_drop']?.toUpperCase() === 'TRUE',
      isBestSeller: false,
      isLimitedEdition: false,
      rating: 5.0,
      reviewCount: 0,
      tags: [category, department, 'Imported Quality'],
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    products,
    totalSizesCount,
  };
}

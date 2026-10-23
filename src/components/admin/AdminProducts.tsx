import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Copy, 
  Upload, 
  AlertCircle
} from 'lucide-react';
import { 
  Product, 
  CategoryType, 
  DepartmentType, 
  SneakerBrand, 
  ClothingType, 
  GenderType 
} from '../../types';
import { SNEAKER_BRANDS, CLOTHING_TYPES } from '../../data/products';

interface AdminProductsProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  isAddModalOpenFromParent?: boolean;
  onCloseAddModalFromParent?: () => void;
}

const SNEAKER_SIZES: number[] = [39, 40, 41, 42, 43, 44, 45, 46];
const CLOTHING_SIZES: string[] = ['S', 'M', 'L', 'XL', 'XXL'];

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  isAddModalOpenFromParent,
  onCloseAddModalFromParent
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<'All' | DepartmentType>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [visibilityFilter, setVisibilityFilter] = useState<string>('All');
  const [isEditorOpen, setIsEditorOpen] = useState(isAddModalOpenFromParent || false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'images' | 'sizes' | 'seo'>('basic');

  // Trigger from parent quick action
  React.useEffect(() => {
    if (isAddModalOpenFromParent) {
      setEditingProduct(null);
      setIsEditorOpen(true);
    }
  }, [isAddModalOpenFromParent]);

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    department: 'Sneakers',
    brand: 'Nike',
    clothingType: undefined,
    category: 'Nike',
    gender: 'Men',
    subtitle: 'Luxury Silhouette',
    price: 9500,
    originalPrice: 11500,
    sku: `KNG-${Math.floor(1000 + Math.random() * 9000)}`,
    stock: 25,
    sizeStock: { '39': 3, '40': 5, '41': 8, '42': 6, '43': 3 },
    sizes: [39, 40, 41, 42, 43],
    weightGrams: 1150,
    description: 'Masterfully crafted luxury silhouette with premium finishings.',
    craftsmanshipDetails: ['Handcrafted Upper', 'Ergonomic Cushioning', 'Signature Box'],
    materials: 'Premium Materials',
    careInstructions: 'Clean with soft cloth and specialized balm.',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'],
    colors: [{ name: 'Royal Gold', hex: '#C7A55B' }],
    tags: ['Luxury', 'Curated'],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    isLimitedEdition: false,
    visibility: 'Published',
    seoTitle: '',
    seoDescription: '',
    slug: ''
  });

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'All' || p.department === departmentFilter;
    const matchesCat = categoryFilter === 'All' || 
                       p.category === categoryFilter || 
                       p.brand === categoryFilter || 
                       p.clothingType === categoryFilter;
    const matchesVis = visibilityFilter === 'All' || 
                       p.visibility === visibilityFilter || 
                       (visibilityFilter === 'Archived' && p.isArchived);
    return matchesSearch && matchesDept && matchesCat && matchesVis;
  });

  const handleOpenNew = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      department: 'Sneakers',
      brand: 'Nike',
      clothingType: undefined,
      category: 'Nike',
      gender: 'Men',
      subtitle: 'Luxury Silhouette',
      price: 8500,
      originalPrice: 10500,
      sku: `KNG-${Math.floor(1000 + Math.random() * 9000)}`,
      stock: 25,
      sizeStock: { '39': 3, '40': 5, '41': 8, '42': 6, '43': 3 },
      sizes: [39, 40, 41, 42, 43],
      weightGrams: 1100,
      description: 'Handcrafted luxury footwear crafted for modern elegance.',
      craftsmanshipDetails: ['Italian Leather', 'Durable Sole'],
      materials: 'Premium Leather',
      careInstructions: 'Store in protective dust bag.',
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'],
      colors: [{ name: 'Onyx Black', hex: '#111111' }],
      tags: ['Luxury'],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      isLimitedEdition: false,
      visibility: 'Published',
      seoTitle: '',
      seoDescription: '',
      slug: ''
    });
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsEditorOpen(true);
  };

  const handleDepartmentChange = (dept: DepartmentType) => {
    const isSneaker = dept === 'Sneakers';
    const defaultCat = isSneaker ? 'Nike' : 'T-Shirt';
    const defaultSizes = isSneaker ? [39, 40, 41, 42, 43, 44] : ['S', 'M', 'L', 'XL'];
    const initialSizeStock: Record<string, number> = {};
    defaultSizes.forEach(s => { initialSizeStock[String(s)] = 5; });

    setFormData(prev => ({
      ...prev,
      department: dept,
      brand: isSneaker ? ('Nike' as SneakerBrand) : undefined,
      clothingType: !isSneaker ? ('T-Shirt' as ClothingType) : undefined,
      category: defaultCat as CategoryType,
      sizes: defaultSizes,
      sizeStock: initialSizeStock,
      weightGrams: isSneaker ? 1100 : 350
    }));
  };

  const handleDuplicate = (product: Product) => {
    const dup: Product = {
      ...product,
      id: `p-${Date.now()}`,
      name: `${product.name} (Copy)`,
      sku: `${product.sku}-DUP`,
      rating: 5.0,
      reviewCount: 0,
      slug: `${product.slug || product.name.toLowerCase().replace(/\s+/g, '-')}-copy`
    };
    onAddProduct(dup);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const totalStock = formData.sizeStock 
      ? Object.values(formData.sizeStock).reduce((a: number, b) => a + Number(b), 0)
      : formData.stock || 20;

    const department = formData.department || 'Sneakers';
    const isSneaker = department === 'Sneakers';
    const brand = isSneaker ? (formData.brand as SneakerBrand || 'Nike') : undefined;
    const clothingType = !isSneaker ? (formData.clothingType as ClothingType || 'T-Shirt') : undefined;
    const category: CategoryType = isSneaker ? (brand as SneakerBrand) : (clothingType as ClothingType);

    const generatedSlug = formData.slug?.trim() || 
      `${(brand || clothingType || 'item').toLowerCase()}-${formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    const completeProduct: Product = {
      id: editingProduct ? editingProduct.id : `p-${Date.now()}`,
      name: formData.name.trim(),
      subtitle: formData.subtitle || 'Royal Craft',
      price: Number(formData.price) || 2999,
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      discountPercent: (formData.originalPrice && formData.originalPrice > Number(formData.price))
        ? Math.round(((formData.originalPrice - Number(formData.price)) / formData.originalPrice) * 100)
        : 0,
      stock: totalStock,
      sizeStock: formData.sizeStock || {},
      sku: formData.sku || `SKU-${Date.now()}`,
      department,
      brand,
      clothingType,
      category,
      gender: formData.gender || 'Unisex',
      weightGrams: Number(formData.weightGrams) || (isSneaker ? 1100 : 350),
      sizes: formData.sizes && formData.sizes.length > 0 
        ? formData.sizes 
        : (isSneaker ? SNEAKER_SIZES : CLOTHING_SIZES),
      colors: formData.colors || [{ name: 'Midnight', hex: '#111' }],
      images: formData.images && formData.images.length > 0 
        ? formData.images 
        : ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'],
      description: formData.description || '',
      craftsmanshipDetails: formData.craftsmanshipDetails || ['Handcrafted'],
      materials: formData.materials || 'Premium Materials',
      careInstructions: formData.careInstructions || 'Wipe clean',
      isFeatured: !!formData.isFeatured,
      isNewArrival: !!formData.isNewArrival,
      isBestSeller: !!formData.isBestSeller,
      isLimitedEdition: !!formData.isLimitedEdition,
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewCount: editingProduct ? editingProduct.reviewCount : 1,
      tags: formData.tags || [category, department],
      seoTitle: formData.seoTitle || formData.name,
      seoDescription: formData.seoDescription || formData.description,
      slug: generatedSlug,
      visibility: formData.visibility || 'Published'
    };

    if (editingProduct) {
      onUpdateProduct(completeProduct);
    } else {
      onAddProduct(completeProduct);
    }

    setIsEditorOpen(false);
    if (onCloseAddModalFromParent) onCloseAddModalFromParent();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-white tracking-wide">
            PRODUCT CATALOG & INVENTORY
          </h1>
          <p className="text-xs text-white/60">
            Manage Sneakers & Clothing departments, size stock matrices & weights.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs uppercase font-bold tracking-wider rounded transition-all shadow-lg red-border-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#141414] border border-white/10 p-4 rounded-lg grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or SKU..."
            className="w-full pl-9 pr-4 py-2 bg-[#181818] border border-white/15 text-white text-xs rounded focus:outline-none focus:border-[#C7A55B]"
          />
        </div>

        <div>
          <select
            value={departmentFilter}
            onChange={(e) => {
              setDepartmentFilter(e.target.value as any);
              setCategoryFilter('All');
            }}
            className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white text-xs rounded focus:outline-none focus:border-[#C7A55B]"
          >
            <option value="All">All Departments</option>
            <option value="Sneakers">Sneakers</option>
            <option value="Clothing">Clothing</option>
          </select>
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white text-xs rounded focus:outline-none focus:border-[#C7A55B]"
          >
            <option value="All">All Categories / Brands ({products.length})</option>
            {(departmentFilter === 'All' || departmentFilter === 'Sneakers') && (
              <optgroup label="Sneaker Brands">
                {SNEAKER_BRANDS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </optgroup>
            )}
            {(departmentFilter === 'All' || departmentFilter === 'Clothing') && (
              <optgroup label="Clothing Categories">
                {CLOTHING_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        <div>
          <select
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white text-xs rounded focus:outline-none focus:border-[#C7A55B]"
          >
            <option value="All">All Visibilities</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Product Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-[#141414] border border-white/10 rounded-lg overflow-hidden group hover:border-[#C7A55B]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="relative h-48 bg-[#0D0D0D] overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="px-2 py-0.5 bg-black/80 text-[#C7A55B] font-mono text-[10px] font-bold uppercase rounded border border-[#C7A55B]/30">
                    {product.sku}
                  </span>
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                    product.department === 'Sneakers' ? 'bg-[#C7A55B] text-[#111]' : 'bg-[#C1121F] text-white'
                  }`}>
                    {product.department}
                  </span>
                </div>

                <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white font-mono text-xs font-bold rounded">
                  ৳ {product.price.toLocaleString()}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif-luxury font-bold text-white text-sm group-hover:text-[#C7A55B] transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-white/50 mt-0.5">
                      <span className="text-[#C7A55B] font-semibold">{product.category}</span>
                      <span>•</span>
                      <span>{product.gender || 'Unisex'}</span>
                      {product.weightGrams && (
                        <>
                          <span>•</span>
                          <span>{product.weightGrams}g</span>
                        </>
                      )}
                    </div>
                  </div>
                  {product.stock < 5 && (
                    <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase rounded flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Low ({product.stock})
                    </span>
                  )}
                </div>

                {/* Stock per size badge list */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {product.sizeStock && Object.entries(product.sizeStock).map(([sz, qty]) => {
                    const q = Number(qty);
                    return (
                      <span key={sz} className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${q === 0 ? 'bg-red-500/20 text-red-400' : q <= 3 ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-white/70'}`}>
                        {sz}: {q}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-3 bg-[#1A1A1A] border-t border-white/10 flex items-center justify-between text-xs">
              <button
                onClick={() => handleOpenEdit(product)}
                className="flex items-center gap-1 text-white/70 hover:text-white font-semibold"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => handleDuplicate(product)}
                className="flex items-center gap-1 text-white/50 hover:text-[#C7A55B]"
                title="Duplicate"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Duplicate</span>
              </button>

              <button
                onClick={() => onDeleteProduct(product.id)}
                className="flex items-center gap-1 text-red-400 hover:text-red-300"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Add / Edit Modal Drawer */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#141414] border border-[#C7A55B]/40 p-6 rounded-lg shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div>
                <h2 className="font-serif-luxury text-xl font-bold text-white">
                  {editingProduct ? `EDIT: ${editingProduct.name}` : 'CREATE NEW PRODUCT'}
                </h2>
                <p className="text-xs text-white/50">Configure department, brand/type, size stock matrix and weights.</p>
              </div>
              <button
                onClick={() => {
                  setIsEditorOpen(false);
                  if (onCloseAddModalFromParent) onCloseAddModalFromParent();
                }}
                className="p-1 text-white/50 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 mb-6">
              {[
                { id: 'basic', label: 'Basic Info' },
                { id: 'images', label: 'Images & Media' },
                { id: 'sizes', label: 'Size Stock Matrix' },
                { id: 'seo', label: 'SEO & Visibility' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                    activeTab === t.id
                      ? 'border-[#C7A55B] text-[#C7A55B]'
                      : 'border-transparent text-white/50 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              
              {/* Tab 1: Basic Info */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  
                  {/* Department & Brand / Type Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white/5 border border-white/10 rounded">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#C7A55B] block mb-1">Department</label>
                      <select
                        value={formData.department || 'Sneakers'}
                        onChange={(e) => handleDepartmentChange(e.target.value as DepartmentType)}
                        className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white text-xs rounded focus:outline-none focus:border-[#C7A55B]"
                      >
                        <option value="Sneakers">Sneakers</option>
                        <option value="Clothing">Clothing</option>
                      </select>
                    </div>

                    {formData.department === 'Sneakers' ? (
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#C7A55B] block mb-1">Brand (Sneakers)</label>
                        <select
                          value={formData.brand || 'Nike'}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            brand: e.target.value as SneakerBrand,
                            category: e.target.value as CategoryType
                          })}
                          className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white text-xs rounded focus:outline-none focus:border-[#C7A55B]"
                        >
                          {SNEAKER_BRANDS.map(b => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="text-[10px] uppercase font-bold text-[#C7A55B] block mb-1">Clothing Type</label>
                        <select
                          value={formData.clothingType || 'T-Shirt'}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            clothingType: e.target.value as ClothingType,
                            category: e.target.value as CategoryType
                          })}
                          className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white text-xs rounded focus:outline-none focus:border-[#C7A55B]"
                        >
                          {CLOTHING_TYPES.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#C7A55B] block mb-1">Gender (Filter)</label>
                      <select
                        value={formData.gender || 'Men'}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as GenderType })}
                        className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white text-xs rounded focus:outline-none focus:border-[#C7A55B]"
                      >
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Unisex">Unisex</option>
                      </select>
                    </div>
                  </div>

                  {/* Name and SKU */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Product Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white text-xs rounded focus:outline-none focus:border-[#C7A55B]"
                        placeholder="e.g. Air Jordan 1 Retro High OG"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">SKU Code</label>
                      <input
                        type="text"
                        required
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white font-mono text-xs rounded focus:outline-none focus:border-[#C7A55B]"
                      />
                    </div>
                  </div>

                  {/* Price, Original Price, Weight */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Price (৳ BDT)</label>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white text-xs font-mono rounded focus:outline-none focus:border-[#C7A55B]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Original Price (৳ BDT)</label>
                      <input
                        type="number"
                        value={formData.originalPrice || ''}
                        onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white text-xs font-mono rounded focus:outline-none focus:border-[#C7A55B]"
                        placeholder="For discount display"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Weight (Grams)</label>
                      <input
                        type="number"
                        value={formData.weightGrams || ''}
                        onChange={(e) => setFormData({ ...formData, weightGrams: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white text-xs font-mono rounded focus:outline-none focus:border-[#C7A55B]"
                        placeholder="e.g. 1100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white text-xs rounded focus:outline-none focus:border-[#C7A55B]"
                    />
                  </div>

                  {/* Badges Toggles */}
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {[
                      { key: 'isFeatured', label: 'Featured' },
                      { key: 'isNewArrival', label: 'New Arrival' },
                      { key: 'isBestSeller', label: 'Best Seller' },
                      { key: 'isLimitedEdition', label: 'Limited Drop' }
                    ].map(b => (
                      <label key={b.key} className="flex items-center gap-2 p-2 bg-[#181818] border border-white/10 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!(formData as any)[b.key]}
                          onChange={(e) => setFormData({ ...formData, [b.key]: e.target.checked })}
                          className="accent-[#C7A55B]"
                        />
                        <span className="text-[10px] font-bold text-white">{b.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Images */}
              {activeTab === 'images' && (
                <div className="space-y-4">
                  <div className="p-6 border-2 border-dashed border-white/20 rounded-lg text-center bg-[#181818] hover:border-[#C7A55B] transition-colors">
                    <Upload className="w-8 h-8 text-[#C7A55B] mx-auto mb-2" />
                    <p className="text-xs font-bold text-white">Product Photo URLs</p>
                    <p className="text-[10px] text-white/50 mb-3">Add direct links to high-resolution product imagery</p>
                    <button
                      type="button"
                      onClick={() => {
                        const newImg = prompt('Enter Image URL:');
                        if (newImg && newImg.trim()) {
                          setFormData({ ...formData, images: [...(formData.images || []), newImg.trim()] });
                        }
                      }}
                      className="px-4 py-2 bg-[#C7A55B] text-[#111] text-xs font-bold uppercase tracking-wider rounded"
                    >
                      + Add Photo URL
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {formData.images?.map((url, idx) => (
                      <div key={idx} className="relative group rounded overflow-hidden border border-white/20">
                        <img src={url} alt={`Preview ${idx}`} className="w-full h-24 object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, images: formData.images?.filter((_, i) => i !== idx) })}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white text-[10px] rounded opacity-80 group-hover:opacity-100"
                        >
                          ✕
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-[#C7A55B] text-[#111] text-[9px] font-bold uppercase rounded">
                            Thumbnail
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Size Stock Matrix (Department specific) */}
              {activeTab === 'sizes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/60">
                      Define stock quantity per size for {formData.department || 'Sneakers'}.
                    </p>
                    <span className="text-[10px] uppercase font-bold text-[#C7A55B]">
                      {formData.department === 'Sneakers' ? 'EU Footwear Sizes' : 'Apparel Sizes'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {(formData.department === 'Sneakers' ? SNEAKER_SIZES : CLOTHING_SIZES).map(sz => {
                      const szKey = String(sz);
                      const currentVal = formData.sizeStock ? formData.sizeStock[szKey] || 0 : 0;
                      return (
                        <div key={szKey} className="p-3 bg-[#181818] border border-white/10 rounded">
                          <label className="text-[10px] font-mono font-bold text-[#C7A55B] block mb-1">
                            {formData.department === 'Sneakers' ? `EU ${sz}` : `Size ${sz}`}
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={currentVal}
                            onChange={(e) => {
                              const val = Math.max(0, Number(e.target.value));
                              const updatedStock = { ...(formData.sizeStock || {}), [szKey]: val };
                              const updatedSizes = Object.keys(updatedStock)
                                .filter(k => updatedStock[k] > 0)
                                .map(k => isNaN(Number(k)) ? k : Number(k));

                              setFormData({
                                ...formData,
                                sizeStock: updatedStock,
                                sizes: updatedSizes.length > 0 ? updatedSizes : (formData.department === 'Sneakers' ? SNEAKER_SIZES : CLOTHING_SIZES)
                              });
                            }}
                            className="w-full px-2 py-1 bg-[#111111] border border-white/20 text-white font-mono text-xs rounded"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 4: SEO & Visibility */}
              {activeTab === 'seo' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">URL Slug</label>
                    <input
                      type="text"
                      value={formData.slug || ''}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white text-xs font-mono rounded"
                      placeholder="e.g. jordan-1-retro-high-bred"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">SEO Page Title</label>
                    <input
                      type="text"
                      value={formData.seoTitle || ''}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white text-xs rounded"
                      placeholder="Product SEO Title"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Meta Description</label>
                    <textarea
                      rows={2}
                      value={formData.seoDescription || ''}
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white text-xs rounded"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Visibility Status</label>
                    <select
                      value={formData.visibility || 'Published'}
                      onChange={(e) => setFormData({ ...formData, visibility: e.target.value as any })}
                      className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white text-xs rounded"
                    >
                      <option value="Published">Published (Visible in Shop)</option>
                      <option value="Draft">Draft (Hidden in Admin)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 bg-white/10 text-white text-xs font-bold uppercase rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#C1121F] text-white text-xs font-bold uppercase tracking-wider rounded"
                >
                  Save Product
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

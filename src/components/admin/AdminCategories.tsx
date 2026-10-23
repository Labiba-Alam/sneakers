import React, { useState } from 'react';
import { Tags, Plus, Edit, Trash2, Layers, Check } from 'lucide-react';
import { CategoryType, CategoryDetail, DepartmentType } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ExtendedCategoryDetail extends CategoryDetail {
  department: DepartmentType;
}

const DEFAULT_CATEGORIES: ExtendedCategoryDetail[] = [
  {
    id: 'cat-nike',
    name: 'Nike',
    department: 'Sneakers',
    slug: 'nike',
    description: 'Iconic athletic footwear, Air Max innovations, and lifestyle Dunk Low silhouettes.',
    bannerImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    productCount: 2,
    isFeatured: true,
    seoTitle: 'Nike Sneakers Collection | KINGSMAN',
    seoDescription: 'Authentic Nike sneakers curated and imported directly to Dhaka.'
  },
  {
    id: 'cat-jordan',
    name: 'Jordan',
    department: 'Sneakers',
    slug: 'jordan',
    description: 'Air Jordan retro classics, high tops, and luxury court statement editions.',
    bannerImage: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
    productCount: 2,
    isFeatured: true,
    seoTitle: 'Air Jordan Collection | KINGSMAN',
    seoDescription: 'Premium Air Jordan retro silhouettes with luxury finishings.'
  },
  {
    id: 'cat-adidas',
    name: 'Adidas',
    department: 'Sneakers',
    slug: 'adidas',
    description: 'Samba, Gazelle, and terrace culture heritage silhouettes crafted with authentic suede.',
    bannerImage: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=800&q=80',
    productCount: 2,
    isFeatured: true,
    seoTitle: 'Adidas Footwear | KINGSMAN',
    seoDescription: 'Classic Adidas models with timeless European street style.'
  },
  {
    id: 'cat-nb',
    name: 'New Balance',
    department: 'Sneakers',
    slug: 'new-balance',
    description: 'Pinnacle comfort runners, 990 series, and 550 vintage court aesthetics.',
    bannerImage: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
    productCount: 2,
    isFeatured: true,
    seoTitle: 'New Balance Heritage | KINGSMAN',
    seoDescription: 'Ergonomic lifestyle sneakers by New Balance.'
  },
  {
    id: 'cat-converse',
    name: 'Converse',
    department: 'Sneakers',
    slug: 'converse',
    description: 'Chuck 70 vintage canvas classics and elevated high-top deconstructions.',
    bannerImage: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80',
    productCount: 2,
    isFeatured: true,
    seoTitle: 'Converse Chuck 70 Collection | KINGSMAN',
    seoDescription: 'Upgraded vulcanized classics with archival details.'
  },
  {
    id: 'cat-lv',
    name: 'Louis Vuitton',
    department: 'Sneakers',
    slug: 'louis-vuitton',
    description: 'Haute couture luxury sneakers, monogram calfskin uppers, and runway designs.',
    bannerImage: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    productCount: 2,
    isFeatured: true,
    seoTitle: 'Louis Vuitton Footwear | KINGSMAN',
    seoDescription: 'Artisanal luxury footwear crafted in Paris and Florence.'
  },
  {
    id: 'cat-tshirt',
    name: 'T-Shirt',
    department: 'Clothing',
    slug: 't-shirt',
    description: 'Heavyweight combed luxury cotton tees with minimalist streetwear drape.',
    bannerImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    productCount: 2,
    isFeatured: true,
    seoTitle: 'Luxury T-Shirts | KINGSMAN Apparel',
    seoDescription: 'Heavyweight organic cotton tees for modern royalty.'
  },
  {
    id: 'cat-hoodie',
    name: 'Hoodie',
    department: 'Clothing',
    slug: 'hoodie',
    description: 'Heavyweight French terry oversized hoodies built for structure and cold season warmth.',
    bannerImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    productCount: 2,
    isFeatured: true,
    seoTitle: 'Premium Oversized Hoodies | KINGSMAN',
    seoDescription: 'Substantial French terry hoodies engineered for comfort.'
  },
  {
    id: 'cat-sweatshirt',
    name: 'Sweatshirt',
    department: 'Clothing',
    slug: 'sweatshirt',
    description: 'Tailored luxury crewnecks with ribbed cuffs and subtle embossed branding.',
    bannerImage: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    productCount: 2,
    isFeatured: true,
    seoTitle: 'Designer Sweatshirts | KINGSMAN',
    seoDescription: 'Classic crewneck sweatshirts made from premium cotton fleece.'
  }
];

export const AdminCategories: React.FC = () => {
  const { products } = useStore();
  const [categories, setCategories] = useState<ExtendedCategoryDetail[]>(DEFAULT_CATEGORIES);
  const [departmentTab, setDepartmentTab] = useState<'All' | DepartmentType>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExtendedCategoryDetail | null>(null);
  const [formData, setFormData] = useState<Partial<ExtendedCategoryDetail>>({
    name: 'Nike',
    department: 'Sneakers',
    description: '',
    bannerImage: '',
    seoTitle: '',
    seoDescription: ''
  });

  const getDynamicCount = (catName: string) => {
    return products.filter(p => p.category === catName || p.brand === catName || p.clothingType === catName).length;
  };

  const filteredCategories = categories.filter(c => departmentTab === 'All' || c.department === departmentTab);

  const handleOpenEdit = (cat: ExtendedCategoryDetail) => {
    setEditingCategory(cat);
    setFormData({ ...cat });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...formData } as ExtendedCategoryDetail : c));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-white tracking-wide">
            CATEGORY & BRAND MANAGEMENT
          </h1>
          <p className="text-xs text-white/60">
            Structure includes Sneakers (6 brands) and Clothing (3 types) departments.
          </p>
        </div>

        {/* Department Switcher */}
        <div className="flex border border-white/15 rounded bg-white/5 p-1 self-start sm:self-auto">
          {(['All', 'Sneakers', 'Clothing'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setDepartmentTab(tab)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-colors ${
                departmentTab === tab ? 'bg-[#C1121F] text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat) => {
          const liveCount = getDynamicCount(cat.name);
          return (
            <div key={cat.id} className="bg-[#141414] border border-white/10 rounded-lg overflow-hidden flex flex-col justify-between group hover:border-[#C7A55B]/40 transition-colors">
              <div className="relative h-36 bg-[#0D0D0D] overflow-hidden">
                <img src={cat.bannerImage} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/40 to-transparent" />
                
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded ${
                    cat.department === 'Sneakers' ? 'bg-[#C7A55B] text-[#111]' : 'bg-[#C1121F] text-white'
                  }`}>
                    {cat.department}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <h3 className="font-serif-luxury font-bold text-lg text-white">{cat.name}</h3>
                    <p className="text-[10px] text-white/50 font-mono">/{cat.slug}</p>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                    liveCount > 0 ? 'bg-white/20 text-white' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {liveCount} {liveCount === 1 ? 'Item' : 'Items'}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2 flex-1">
                <p className="text-xs text-white/70 line-clamp-2">{cat.description}</p>
              </div>

              <div className="p-3 bg-[#1A1A1A] border-t border-white/10 flex justify-end gap-3 text-xs">
                <button 
                  onClick={() => handleOpenEdit(cat)} 
                  className="text-white/70 hover:text-white font-semibold flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#141414] border border-[#C7A55B]/40 p-6 rounded-lg text-white">
            <h2 className="font-serif-luxury text-lg font-bold mb-4">
              EDIT {formData.name?.toUpperCase()}
            </h2>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Banner Image URL</label>
                <input
                  type="text"
                  required
                  value={formData.bannerImage}
                  onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white rounded"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white rounded"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">SEO Title</label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white rounded"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white/10 text-white font-bold rounded">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#C1121F] text-white font-bold rounded">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

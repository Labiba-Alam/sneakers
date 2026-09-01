import React, { useState } from 'react';
import { Tags, Plus, Edit, Trash2, Image as ImageIcon, Sparkles, Globe, Eye } from 'lucide-react';
import { CategoryType, CategoryDetail } from '../../types';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryDetail[]>([
    {
      id: 'cat-1',
      name: 'Lifestyle',
      slug: 'lifestyle',
      description: 'Everyday elevated luxury sneakers designed for ultimate poise.',
      bannerImage: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
      productCount: 14,
      isFeatured: true,
      seoTitle: 'Luxury Lifestyle Sneakers | KINGSMAN',
      seoDescription: 'Handcrafted Italian leather lifestyle sneakers.'
    },
    {
      id: 'cat-2',
      name: 'High Tops',
      slug: 'high-tops',
      description: 'Ankle-hugging architectural silhouettes with 24K gold foil details.',
      bannerImage: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
      productCount: 8,
      isFeatured: true,
      seoTitle: 'Royal High Top Sneakers | KINGSMAN',
      seoDescription: 'Premium high top leather footwear.'
    },
    {
      id: 'cat-3',
      name: 'Running',
      slug: 'running',
      description: 'Ultra-light responsive performance silhouettes engineered for royalty.',
      bannerImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      productCount: 11,
      isFeatured: true,
      seoTitle: 'Performance Running Shoes | KINGSMAN',
      seoDescription: 'Engineered carbon plate running sneakers.'
    },
    {
      id: 'cat-4',
      name: 'Limited Edition',
      slug: 'limited-edition',
      description: 'Numbered, serialized artisan drops produced in batches of 100.',
      bannerImage: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80',
      productCount: 5,
      isFeatured: true,
      seoTitle: 'Numbered Limited Edition Drops | KINGSMAN',
      seoDescription: 'Exclusive serialized luxury drops.'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDetail | null>(null);
  const [formData, setFormData] = useState<Partial<CategoryDetail>>({
    name: 'Lifestyle',
    description: '',
    bannerImage: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    seoTitle: '',
    seoDescription: ''
  });

  const handleOpenNew = () => {
    setEditingCategory(null);
    setFormData({
      name: 'New Category' as CategoryType,
      description: 'Luxury handcrafted sneakers collection.',
      bannerImage: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
      seoTitle: '',
      seoDescription: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryDetail) => {
    setEditingCategory(cat);
    setFormData({ ...cat });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...formData } as CategoryDetail : c));
    } else {
      const newCat: CategoryDetail = {
        id: `cat-${Date.now()}`,
        name: (formData.name || 'Custom') as CategoryType,
        slug: (formData.name || 'custom').toLowerCase().replace(/\s+/g, '-'),
        description: formData.description || '',
        bannerImage: formData.bannerImage || 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
        productCount: 0,
        isFeatured: true,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription
      };
      setCategories([...categories, newCat]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-white tracking-wide">
            CATEGORY MANAGEMENT
          </h1>
          <p className="text-xs text-white/60">
            Organize catalog taxonomies, hero banners & SEO metadata.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2 bg-[#C1121F] text-white text-xs uppercase font-bold tracking-wider rounded shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Create Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-[#141414] border border-white/10 rounded-lg overflow-hidden flex flex-col justify-between">
            <div className="relative h-36 bg-[#0D0D0D]">
              <img src={cat.bannerImage} alt={cat.name} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="px-2 py-0.5 bg-[#C7A55B] text-[#111] text-[10px] font-bold uppercase rounded">
                  {cat.productCount} Silhouettes
                </span>
                <h3 className="font-serif-luxury font-bold text-xl text-white mt-1">{cat.name}</h3>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <p className="text-xs text-white/70">{cat.description}</p>
              <p className="text-[10px] text-white/40 font-mono">Slug: /{cat.slug}</p>
            </div>

            <div className="p-3 bg-[#1A1A1A] border-t border-white/10 flex justify-end gap-3 text-xs">
              <button onClick={() => handleOpenEdit(cat)} className="text-white/70 hover:text-white font-semibold flex items-center gap-1">
                <Edit className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => handleDelete(cat.id)} className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#141414] border border-[#C7A55B]/40 p-6 rounded-lg text-white">
            <h2 className="font-serif-luxury text-lg font-bold mb-4">
              {editingCategory ? `EDIT CATEGORY` : 'CREATE CATEGORY'}
            </h2>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Category Title</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value as any })}
                  className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white rounded"
                />
              </div>

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

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white/10 text-white font-bold rounded">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#C1121F] text-white font-bold rounded">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

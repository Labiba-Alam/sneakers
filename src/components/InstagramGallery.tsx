import React from 'react';
import { Instagram, Crown, ArrowUpRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const INSTA_POSTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    likes: '4.2k',
    tag: '@KINGSMAN.ROYAL'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=800&q=80',
    likes: '6.8k',
    tag: '#KingsmanLook'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
    likes: '3.9k',
    tag: 'Curated Streetwear'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80',
    likes: '8.1k',
    tag: '#KingsmanLuxury'
  }
];

export const InstagramGallery: React.FC = () => {
  const { setView } = useStore();

  return (
    <section className="py-20 bg-[#F8F8F8] border-t border-[#111111]/10 text-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-[#C1121F] text-xs font-bold uppercase tracking-[0.2em] mb-2">
            <Instagram className="w-4 h-4 text-[#C1121F]" />
            <span>@KINGSMAN.ROYAL</span>
          </div>
          <h2 className="font-serif-luxury text-3xl font-bold text-[#111111]">
            THE ROYAL GALLERY
          </h2>
          <p className="text-[#111111]/70 text-xs font-normal mt-1">
            Tag #KINGSMANROYAL on Instagram to be featured in our official community feed.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {INSTA_POSTS.map(post => (
            <div
              key={post.id}
              onClick={() => setView('catalog')}
              className="group relative aspect-square bg-white overflow-hidden cursor-pointer border border-[#111111]/15 shadow-sm hover:shadow-xl"
            >
              <img
                src={post.image}
                alt="Instagram Royal Feed"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                <Instagram className="w-6 h-6 text-[#C7A55B] mb-2" />
                <span className="text-xs font-bold text-white">{post.tag}</span>
                <span className="text-[10px] text-white/80 mt-1">{post.likes} Likes</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

import { ProductReview } from '../types';

export const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: 'rev-101',
    productId: 'kng-001',
    author: 'Lord Alexander Vance',
    rating: 5,
    title: 'The undisputed crown jewel of my sneaker collection',
    comment: 'The craftsmanship on the Sovereign Crimson I is unmatched. The leather is absurdly soft, and the gold-plated heel emblem glints with subtle royalty. I wore these to London Fashion Week and received dozens of compliments.',
    date: 'August 2, 2026',
    verifiedPurchase: true,
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    userPhotos: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'rev-102',
    productId: 'kng-001',
    author: 'Siddharth R.',
    rating: 5,
    title: 'Pristine quality and rapid delivery in Dhaka',
    comment: 'Ordered via bKash payment with express delivery. Arrived in a wooden mahogany presentation box wrapped in velvet. The attention to detail is pure luxury.',
    date: 'July 28, 2026',
    verifiedPurchase: true,
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'rev-103',
    productId: 'kng-002',
    author: 'Marcus Sterling',
    rating: 5,
    title: 'Best high top ever created',
    comment: 'Superior ankle support and that gold emblem on the back is so tastefull. Feels like Fear of God meets Savile Row tailoring.',
    date: 'July 20, 2026',
    verifiedPurchase: true,
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'rev-104',
    productId: 'kng-003',
    author: 'Elena Rostova',
    rating: 5,
    title: 'Flawless minimalist luxury',
    comment: 'I bought these for my husband and ended up ordering a pair for myself too! Clean lines, zero break-in period, exceptional leather quality.',
    date: 'June 14, 2026',
    verifiedPurchase: true,
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  }
];

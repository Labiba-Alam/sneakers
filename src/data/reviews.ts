import { ProductReview } from '../types';

export const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: 'rev-101',
    productId: 'kng-001',
    author: 'Tahmid Hasan',
    rating: 5,
    title: 'Flawless build quality and commanding presence',
    comment: 'The leather quality on the Sovereign Crimson I is exceptional. The gold-tone heel emblem is tasteful and sharp. Verified the size with the guide and it fits true to EU 42.',
    date: 'October 12, 2026',
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
    title: 'Fast delivery inside Dhaka with proper packaging',
    comment: 'Paid the advance delivery fee via bKash and received the parcel within 2 days in Banani. Sneaker was double-boxed with velvet dust bag. Very satisfied with the customer service on WhatsApp.',
    date: 'October 8, 2026',
    verifiedPurchase: true,
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'rev-103',
    productId: 'kng-002',
    author: 'Farhan Kabir',
    rating: 5,
    title: 'Solid ankle support and streetwear styling',
    comment: 'The Imperial Court High is definitely a head-turner. Padded collar feels comfortable even for long days. Delivered via Steadfast with zero hassle.',
    date: 'September 29, 2026',
    verifiedPurchase: true,
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'rev-104',
    productId: 'kng-003',
    author: 'Nabila Chowdhury',
    rating: 5,
    title: 'Understated minimalist white sneaker',
    comment: 'Perfect everyday sneaker. Clean silhouette, comfortable insole, and easy to keep clean. Great unisex sizing.',
    date: 'September 15, 2026',
    verifiedPurchase: true,
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  }
];

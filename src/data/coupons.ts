import { Coupon } from '../types';

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'ROYAL10',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 200,
    description: '10% off on royal orders over $200',
    isActive: true
  },
  {
    code: 'KINGSMAN20',
    discountType: 'percentage',
    discountValue: 20,
    minSpend: 500,
    description: '20% off VIP invitation for orders over $500',
    isActive: true
  },
  {
    code: 'FIRSTROYAL',
    discountType: 'fixed',
    discountValue: 50,
    minSpend: 300,
    description: '$50 welcome gift on your first KINGSMAN order',
    isActive: true
  },
  {
    code: 'BDROYAL',
    discountType: 'percentage',
    discountValue: 15,
    minSpend: 150,
    description: '15% discount for Bangladeshi Sneakerheads',
    isActive: true
  },
  {
    code: 'FREEDELIVERY',
    discountType: 'fixed',
    discountValue: 2, // Covers shipping fee
    minSpend: 100,
    description: 'Free Courier Delivery Code',
    isActive: true
  },
  {
    code: 'FLASHBD',
    discountType: 'fixed',
    discountValue: 25,
    minSpend: 200,
    description: 'Flash Campaign $25 (৳3,000) Special Savings',
    isActive: true
  }
];

export interface District {
  name: string;
  division: string;
  isDhaka: boolean;
  deliveryChargeBDT: number;
  deliveryChargeUSD: number;
  estimatedDays: string;
}

export const BANGLADESH_DISTRICTS: District[] = [
  // Dhaka Division
  { name: 'Dhaka - Inside City', division: 'Dhaka', isDhaka: true, deliveryChargeBDT: 80, deliveryChargeUSD: 2, estimatedDays: '1-2 Business Days' },
  { name: 'Dhaka - Suburbs (Savar, Gazipur, Keraniganj)', division: 'Dhaka', isDhaka: false, deliveryChargeBDT: 100, deliveryChargeUSD: 3, estimatedDays: '2-3 Business Days' },
  { name: 'Faridpur', division: 'Dhaka', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Gopalganj', division: 'Dhaka', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Kishoreganj', division: 'Dhaka', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Madaripur', division: 'Dhaka', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Manikganj', division: 'Dhaka', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Munshiganj', division: 'Dhaka', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Narayanganj', division: 'Dhaka', isDhaka: false, deliveryChargeBDT: 120, deliveryChargeUSD: 3, estimatedDays: '2-3 Business Days' },
  { name: 'Narsingdi', division: 'Dhaka', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Rajbari', division: 'Dhaka', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Shariatpur', division: 'Dhaka', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },

  // Chattogram Division
  { name: 'Chattogram', division: 'Chattogram', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Bandarban', division: 'Chattogram', isDhaka: false, deliveryChargeBDT: 180, deliveryChargeUSD: 5, estimatedDays: '3-5 Business Days' },
  { name: 'Brahmanbaria', division: 'Chattogram', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Chandpur', division: 'Chattogram', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Cumilla', division: 'Chattogram', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: "Cox's Bazar", division: 'Chattogram', isDhaka: false, deliveryChargeBDT: 160, deliveryChargeUSD: 4, estimatedDays: '3-4 Business Days' },
  { name: 'Feni', division: 'Chattogram', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Khagrachhari', division: 'Chattogram', isDhaka: false, deliveryChargeBDT: 180, deliveryChargeUSD: 5, estimatedDays: '3-5 Business Days' },
  { name: 'Lakshmipur', division: 'Chattogram', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Noakhali', division: 'Chattogram', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Rangamati', division: 'Chattogram', isDhaka: false, deliveryChargeBDT: 180, deliveryChargeUSD: 5, estimatedDays: '3-5 Business Days' },

  // Sylhet Division
  { name: 'Sylhet', division: 'Sylhet', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Habiganj', division: 'Sylhet', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Moulvibazar', division: 'Sylhet', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Sunamganj', division: 'Sylhet', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },

  // Rajshahi Division
  { name: 'Rajshahi', division: 'Rajshahi', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Bogra', division: 'Rajshahi', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Joypurhat', division: 'Rajshahi', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Naogaon', division: 'Rajshahi', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Natore', division: 'Rajshahi', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Nawabganj', division: 'Rajshahi', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Pabna', division: 'Rajshahi', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Sirajganj', division: 'Rajshahi', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },

  // Khulna Division
  { name: 'Khulna', division: 'Khulna', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Bagerhat', division: 'Khulna', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Chuadanga', division: 'Khulna', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Jessore', division: 'Khulna', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Jhenaidah', division: 'Khulna', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Kushtia', division: 'Khulna', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Magura', division: 'Khulna', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Meherpur', division: 'Khulna', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Narail', division: 'Khulna', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Satkhira', division: 'Khulna', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },

  // Barishal Division
  { name: 'Barishal', division: 'Barishal', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-5 Business Days' },
  { name: 'Barguna', division: 'Barishal', isDhaka: false, deliveryChargeBDT: 160, deliveryChargeUSD: 4, estimatedDays: '3-5 Business Days' },
  { name: 'Bhola', division: 'Barishal', isDhaka: false, deliveryChargeBDT: 160, deliveryChargeUSD: 4, estimatedDays: '3-5 Business Days' },
  { name: 'Jhalokati', division: 'Barishal', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-5 Business Days' },
  { name: 'Patuakhali', division: 'Barishal', isDhaka: false, deliveryChargeBDT: 160, deliveryChargeUSD: 4, estimatedDays: '3-5 Business Days' },
  { name: 'Pirojpur', division: 'Barishal', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-5 Business Days' },

  // Rangpur Division
  { name: 'Rangpur', division: 'Rangpur', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-5 Business Days' },
  { name: 'Dinajpur', division: 'Rangpur', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-5 Business Days' },
  { name: 'Gaibandha', division: 'Rangpur', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-5 Business Days' },
  { name: 'Kurigram', division: 'Rangpur', isDhaka: false, deliveryChargeBDT: 160, deliveryChargeUSD: 4, estimatedDays: '3-5 Business Days' },
  { name: 'Lalmonirhat', division: 'Rangpur', isDhaka: false, deliveryChargeBDT: 160, deliveryChargeUSD: 4, estimatedDays: '3-5 Business Days' },
  { name: 'Nilphamari', division: 'Rangpur', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-5 Business Days' },
  { name: 'Panchagarh', division: 'Rangpur', isDhaka: false, deliveryChargeBDT: 160, deliveryChargeUSD: 4, estimatedDays: '3-5 Business Days' },
  { name: 'Thakurgaon', division: 'Rangpur', isDhaka: false, deliveryChargeBDT: 160, deliveryChargeUSD: 4, estimatedDays: '3-5 Business Days' },

  // Mymensingh Division
  { name: 'Mymensingh', division: 'Mymensingh', isDhaka: false, deliveryChargeBDT: 140, deliveryChargeUSD: 3.5, estimatedDays: '2-4 Business Days' },
  { name: 'Jamalpur', division: 'Mymensingh', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Netrokona', division: 'Mymensingh', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' },
  { name: 'Sherpur', division: 'Mymensingh', isDhaka: false, deliveryChargeBDT: 150, deliveryChargeUSD: 4, estimatedDays: '2-4 Business Days' }
];

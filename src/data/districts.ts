export interface District {
  name: string;
  division: string;
  isDhaka: boolean;
  deliveryChargeBDT: number;
  estimatedDays: string;
}

// Confirmed KINGSMAN Delivery Policy:
// - Inside Dhaka: BDT 100 (1-3 working days)
// - Outside Dhaka: BDT 160 (2-5 working days)
// - Delivery fee is payable in advance for both areas via MFS / Card to confirm dispatch.
export const BANGLADESH_DISTRICTS: District[] = [
  // Dhaka Division
  { name: 'Dhaka - Inside City', division: 'Dhaka', isDhaka: true, deliveryChargeBDT: 100, estimatedDays: '1-3 Working Days' },
  { name: 'Dhaka - Suburbs (Savar, Gazipur, Keraniganj)', division: 'Dhaka', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Faridpur', division: 'Dhaka', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Gopalganj', division: 'Dhaka', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Kishoreganj', division: 'Dhaka', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Madaripur', division: 'Dhaka', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Manikganj', division: 'Dhaka', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Munshiganj', division: 'Dhaka', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Narayanganj', division: 'Dhaka', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Narsingdi', division: 'Dhaka', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Rajbari', division: 'Dhaka', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Shariatpur', division: 'Dhaka', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },

  // Chattogram Division
  { name: 'Chattogram', division: 'Chattogram', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Bandarban', division: 'Chattogram', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Brahmanbaria', division: 'Chattogram', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Chandpur', division: 'Chattogram', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Cumilla', division: 'Chattogram', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: "Cox's Bazar", division: 'Chattogram', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Feni', division: 'Chattogram', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Khagrachhari', division: 'Chattogram', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Lakshmipur', division: 'Chattogram', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Noakhali', division: 'Chattogram', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Rangamati', division: 'Chattogram', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },

  // Sylhet Division
  { name: 'Sylhet', division: 'Sylhet', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Habiganj', division: 'Sylhet', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Moulvibazar', division: 'Sylhet', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Sunamganj', division: 'Sylhet', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },

  // Rajshahi Division
  { name: 'Rajshahi', division: 'Rajshahi', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Bogra', division: 'Rajshahi', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Joypurhat', division: 'Rajshahi', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Naogaon', division: 'Rajshahi', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Natore', division: 'Rajshahi', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Nawabganj', division: 'Rajshahi', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Pabna', division: 'Rajshahi', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Sirajganj', division: 'Rajshahi', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },

  // Khulna Division
  { name: 'Khulna', division: 'Khulna', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Bagerhat', division: 'Khulna', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Chuadanga', division: 'Khulna', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Jessore', division: 'Khulna', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Jhenaidah', division: 'Khulna', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Kushtia', division: 'Khulna', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Magura', division: 'Khulna', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Meherpur', division: 'Khulna', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Narail', division: 'Khulna', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Satkhira', division: 'Khulna', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },

  // Barishal Division
  { name: 'Barishal', division: 'Barishal', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Barguna', division: 'Barishal', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Bhola', division: 'Barishal', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Jhalokati', division: 'Barishal', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Patuakhali', division: 'Barishal', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Pirojpur', division: 'Barishal', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },

  // Rangpur Division
  { name: 'Rangpur', division: 'Rangpur', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Dinajpur', division: 'Rangpur', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Gaibandha', division: 'Rangpur', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Kurigram', division: 'Rangpur', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Lalmonirhat', division: 'Rangpur', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Nilphamari', division: 'Rangpur', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Panchagarh', division: 'Rangpur', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Thakurgaon', division: 'Rangpur', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },

  // Mymensingh Division
  { name: 'Mymensingh', division: 'Mymensingh', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Jamalpur', division: 'Mymensingh', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Netrokona', division: 'Mymensingh', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' },
  { name: 'Sherpur', division: 'Mymensingh', isDhaka: false, deliveryChargeBDT: 160, estimatedDays: '2-5 Working Days' }
];

import React, { useState } from 'react';
import { Search, Users, Crown, Phone, Mail, MapPin, ShoppingBag, Heart, Download, Eye, ShieldCheck } from 'lucide-react';
import { CustomerAccount, Order } from '../../types';

interface AdminCustomersProps {
  orders: Order[];
}

export const AdminCustomers: React.FC<AdminCustomersProps> = ({ orders }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [vipFilter, setVipFilter] = useState<string>('All');
  const [inspectingCustomer, setInspectingCustomer] = useState<CustomerAccount | null>(null);

  // Generate customer list from orders + defaults
  const customers: CustomerAccount[] = [
    {
      id: 'cust-1',
      fullName: 'Marcus Sterling',
      phone: '+1 555-019-2834',
      email: 'm.sterling@kingsman.royal',
      district: 'Dhaka - Inside City',
      area: 'Manhattan',
      address: '450 Park Avenue, Penthouse B',
      createdAt: '2025-11-12',
      totalOrders: 6,
      totalSpent: 4250,
      vipTier: 'Kingsman Sovereign',
      accountStatus: 'VIP'
    },
    {
      id: 'cust-2',
      fullName: 'Labiba Alam',
      phone: '+880 1711 000000',
      email: 'alam.labiba003@gmail.com',
      district: 'Dhaka - Inside City',
      area: 'Gulshan 2',
      address: 'Road 71, House 14',
      createdAt: '2026-01-05',
      totalOrders: 4,
      totalSpent: 1890,
      vipTier: 'Royal Platinum',
      accountStatus: 'Active'
    },
    {
      id: 'cust-3',
      fullName: 'Rahim Chowdhury',
      phone: '+880 1819 123456',
      email: 'rahim.c@gmail.com',
      district: 'Chittagong',
      area: 'GEC Circle',
      address: 'Tower 4, Floor 12',
      createdAt: '2026-02-18',
      totalOrders: 2,
      totalSpent: 750,
      vipTier: 'Member',
      accountStatus: 'Active'
    },
    {
      id: 'cust-4',
      fullName: 'Tanvir Ahmed',
      phone: '+880 1912 987654',
      email: 'tanvir@cox.com',
      district: 'Sylhet',
      area: 'Zindabazar',
      address: 'Royal Villa 8',
      createdAt: '2026-03-01',
      totalOrders: 3,
      totalSpent: 1220,
      vipTier: 'Royal Platinum',
      accountStatus: 'Active'
    }
  ];

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery) || (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesVip = vipFilter === 'All' || c.vipTier === vipFilter;
    return matchesSearch && matchesVip;
  });

  const handleExportCustomersCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Customer ID,Full Name,Phone,Email,District,Total Orders,Total Spent USD,VIP Tier,Created At"].join(",") + "\n"
      + filteredCustomers.map(c => `${c.id},"${c.fullName}",${c.phone},${c.email || ''},"${c.district}",${c.totalOrders},${c.totalSpent},${c.vipTier},${c.createdAt}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KINGSMAN_Customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-white tracking-wide">
            CUSTOMER CRM & VIP PROFILES
          </h1>
          <p className="text-xs text-white/60">
            Track customer order histories, VIP tiers, contact details & wishlists.
          </p>
        </div>

        <button
          onClick={handleExportCustomersCSV}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#181818] border border-white/20 text-white text-xs uppercase font-bold tracking-wider rounded"
        >
          <Download className="w-4 h-4 text-[#C7A55B]" />
          <span>Export Customers CSV</span>
        </button>
      </div>

      <div className="bg-[#141414] border border-white/10 p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, email or region..."
            className="w-full pl-9 pr-4 py-2 bg-[#181818] border border-white/15 text-white text-xs rounded focus:outline-none focus:border-[#C7A55B]"
          />
        </div>

        <div>
          <select
            value={vipFilter}
            onChange={(e) => setVipFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white text-xs rounded"
          >
            <option value="All">All VIP Tiers</option>
            <option value="Kingsman Sovereign">Kingsman Sovereign ($3,000+)</option>
            <option value="Royal Platinum">Royal Platinum ($1,000+)</option>
            <option value="Member">Member</option>
          </select>
        </div>
      </div>

      <div className="bg-[#141414] border border-white/10 rounded-lg overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white">
            <thead className="bg-[#1A1A1A] text-white/50 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Customer Name</th>
                <th className="p-3.5">Phone & Email</th>
                <th className="p-3.5">District / Region</th>
                <th className="p-3.5">VIP Tier</th>
                <th className="p-3.5">Total Orders</th>
                <th className="p-3.5">Total Spent</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5">
                    <p className="font-bold text-white">{cust.fullName}</p>
                    <p className="text-[10px] text-white/50">Joined: {cust.createdAt}</p>
                  </td>
                  <td className="p-3.5 font-mono">
                    <p className="text-white">{cust.phone}</p>
                    <p className="text-[10px] text-white/50">{cust.email}</p>
                  </td>
                  <td className="p-3.5 text-white/70">{cust.district}</td>
                  <td className="p-3.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      cust.vipTier === 'Kingsman Sovereign' ? 'bg-[#C7A55B] text-black' :
                      cust.vipTier === 'Royal Platinum' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/10 text-white/70'
                    }`}>
                      {cust.vipTier}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-white">{cust.totalOrders}</td>
                  <td className="p-3.5 font-mono font-bold text-emerald-400">${cust.totalSpent}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setInspectingCustomer(cust)}
                      className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded"
                      title="Inspect VIP Profile"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {inspectingCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#141414] border border-[#C7A55B]/40 p-6 rounded-lg text-white space-y-4">
            <div className="flex justify-between items-start border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] px-2 py-0.5 bg-[#C7A55B] text-black font-bold uppercase rounded">
                  {inspectingCustomer.vipTier}
                </span>
                <h2 className="font-serif-luxury text-xl font-bold text-white mt-1">{inspectingCustomer.fullName}</h2>
              </div>
              <button onClick={() => setInspectingCustomer(null)} className="text-white/50 hover:text-white">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-white/70">Phone: <span className="font-mono text-white">{inspectingCustomer.phone}</span></p>
              <p className="text-white/70">Email: <span className="font-mono text-white">{inspectingCustomer.email || 'N/A'}</span></p>
              <p className="text-white/70">Address: <span className="text-white">{inspectingCustomer.address}, {inspectingCustomer.area}, {inspectingCustomer.district}</span></p>
              <div className="p-3 bg-[#181818] rounded grid grid-cols-2 gap-2 mt-3 font-mono">
                <div>
                  <p className="text-[10px] text-white/50 uppercase">Total Orders</p>
                  <p className="text-base font-bold text-white">{inspectingCustomer.totalOrders}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase">Lifetime Spend</p>
                  <p className="text-base font-bold text-emerald-400">${inspectingCustomer.totalSpent}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button onClick={() => setInspectingCustomer(null)} className="px-4 py-2 bg-white/10 text-white text-xs font-bold rounded">
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

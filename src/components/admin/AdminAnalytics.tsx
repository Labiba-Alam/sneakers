import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, ShoppingBag, ArrowUpRight, Calendar, MapPin, PieChart as PieIcon } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const weeklyData = [
  { day: 'Mon', sales: 12400 },
  { day: 'Tue', sales: 18900 },
  { day: 'Wed', sales: 15600 },
  { day: 'Thu', sales: 22400 },
  { day: 'Fri', sales: 31000 },
  { day: 'Sat', sales: 38500 },
  { day: 'Sun', sales: 27800 },
];

const districtSalesData = [
  { name: 'Dhaka City', value: 65, color: '#C7A55B' },
  { name: 'Dhaka Suburbs', value: 15, color: '#C1121F' },
  { name: 'Chittagong', value: 10, color: '#3B82F6' },
  { name: 'Sylhet', value: 6, color: '#10B981' },
  { name: 'Others', value: 4, color: '#8B5CF6' },
];

export const AdminAnalytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-white tracking-wide">
            ENTERPRISE ANALYTICS & REVENUE REPORTS
          </h1>
          <p className="text-xs text-white/60">
            Conversion metrics, regional sales distributions, AOV & growth trajectories.
          </p>
        </div>

        <div className="flex bg-[#181818] p-1 border border-white/10 rounded-lg text-xs">
          {(['weekly', 'monthly', 'yearly'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 font-bold uppercase tracking-wider rounded capitalize transition-all ${
                timeframe === t ? 'bg-[#C7A55B] text-[#111]' : 'text-white/60 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#141414] border border-white/10 p-4 rounded-lg">
          <p className="text-[10px] text-white/50 uppercase font-bold">Gross Revenue</p>
          <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">$166,600</p>
          <p className="text-[10px] text-emerald-400 mt-1">↑ +22.4% vs last period</p>
        </div>

        <div className="bg-[#141414] border border-white/10 p-4 rounded-lg">
          <p className="text-[10px] text-white/50 uppercase font-bold">Average Order Value (AOV)</p>
          <p className="text-2xl font-bold font-mono text-white mt-1">$385.50</p>
          <p className="text-[10px] text-white/50 mt-1">High-ticket luxury basket</p>
        </div>

        <div className="bg-[#141414] border border-white/10 p-4 rounded-lg">
          <p className="text-[10px] text-white/50 uppercase font-bold">Conversion Rate</p>
          <p className="text-2xl font-bold font-mono text-[#C7A55B] mt-1">4.28%</p>
          <p className="text-[10px] text-emerald-400 mt-1">↑ +0.6% optimization</p>
        </div>

        <div className="bg-[#141414] border border-white/10 p-4 rounded-lg">
          <p className="text-[10px] text-white/50 uppercase font-bold">Returning VIPs</p>
          <p className="text-2xl font-bold font-mono text-purple-400 mt-1">38.2%</p>
          <p className="text-[10px] text-purple-400 mt-1">High brand loyalty</p>
        </div>
      </div>

      {/* Main Bar Chart */}
      <div className="bg-[#141414] border border-white/10 p-5 rounded-lg space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          {timeframe.toUpperCase()} SALES PERFORMANCE SUMMARY
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="day" stroke="#666" fontSize={11} />
              <YAxis stroke="#666" fontSize={11} tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#fff', fontSize: '12px' }} formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Gross Volume']} />
              <Bar dataKey="sales" fill="#C1121F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Pie Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#141414] border border-white/10 p-5 rounded-lg">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Regional Sales Share</h3>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={districtSalesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {districtSalesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#fff', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#141414] border border-white/10 p-5 rounded-lg space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Top Performing Silhouettes</h3>
          <div className="space-y-3">
            {[
              { name: 'KINGSMAN Sovereign High', sales: 142, revenue: 56800 },
              { name: 'Royal Heritage Low', sales: 98, revenue: 34300 },
              { name: 'Monarch Leather Runner', sales: 74, revenue: 25900 },
            ].map((p, i) => (
              <div key={i} className="p-3 bg-[#181818] rounded flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-white">{p.name}</p>
                  <p className="text-[10px] text-white/50">{p.sales} pairs sold</p>
                </div>
                <p className="font-mono font-bold text-[#C7A55B]">${p.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

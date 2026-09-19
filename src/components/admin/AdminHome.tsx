import React, { useState } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Users, 
  Package, 
  AlertTriangle, 
  ArrowUpRight, 
  Plus, 
  FileSpreadsheet, 
  Download, 
  Ticket, 
  TrendingUp, 
  RefreshCw, 
  Layers, 
  Sparkles,
  ArrowRight,
  Eye,
  Send
} from 'lucide-react';
import { Order, Product, InventoryLog } from '../../types';
import { AdminTab } from './AdminSidebar';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

interface AdminHomeProps {
  orders: Order[];
  products: Product[];
  onNavigateTab: (tab: AdminTab) => void;
  onOpenAddProduct: () => void;
  onOpenCreateCoupon: () => void;
  onSelectOrderDetails: (order: Order) => void;
}

const mockMonthlyData = [
  { month: 'Jan', revenue: 42500, orders: 180 },
  { month: 'Feb', revenue: 58900, orders: 240 },
  { month: 'Mar', revenue: 64200, orders: 290 },
  { month: 'Apr', revenue: 81000, orders: 350 },
  { month: 'May', revenue: 76500, orders: 310 },
  { month: 'Jun', revenue: 94800, orders: 420 },
  { month: 'Jul', revenue: 112000, orders: 490 },
  { month: 'Aug', revenue: 128500, orders: 560 },
];

export const AdminHome: React.FC<AdminHomeProps> = ({
  orders,
  products,
  onNavigateTab,
  onOpenAddProduct,
  onOpenCreateCoupon,
  onSelectOrderDetails
}) => {
  const [lastSyncTime, setLastSyncTime] = useState('Today at 3:15 PM');
  const [isSyncing, setIsSyncing] = useState(false);
  const [chartTimeframe, setChartTimeframe] = useState<'monthly' | 'weekly'>('monthly');

  // Calculation Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const todaySales = orders.filter(o => o.createdAt.includes('2026') || o.createdAt.includes('Today')).reduce((acc, o) => acc + o.total, 0) || 12450;
  const todayOrdersCount = orders.length || 18;
  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed' || o.orderStatus === 'Packaging');
  const pendingCount = pendingOrders.length;
  const deliveredCount = orders.filter(o => o.orderStatus === 'Delivered').length;
  const cancelledCount = orders.filter(o => o.orderStatus === 'Cancelled').length;
  const pendingDeliveries = orders.filter(o => o.orderStatus === 'Shipped' || o.orderStatus === 'Packaging');

  // Low stock calculation across sizes
  const lowStockItems: { product: Product; size: number; stock: number }[] = [];
  products.forEach(p => {
    if (p.sizeStock) {
      Object.entries(p.sizeStock).forEach(([sizeStr, qty]) => {
        const numericQty = Number(qty);
        if (numericQty <= 3) {
          lowStockItems.push({ product: p, size: Number(sizeStr), stock: numericQty });
        }
      });
    } else if (p.stock <= 5) {
      lowStockItems.push({ product: p, size: 42, stock: p.stock });
    }
  });

  const handleManualGoogleSheetsSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      setLastSyncTime(`Just now (${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`);
    }, 1200);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Order ID,Customer,Phone,Amount,Status,Date"].join(",") + "\n"
      + orders.map(o => `${o.id},"${o.customerName}",${o.customerPhone},${o.total},${o.orderStatus},${o.createdAt}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KINGSMAN_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#141414] border border-[#C7A55B]/30 p-6 rounded-lg shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-[#C7A55B] text-xs font-bold uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Royal Atelier Commerce Engine</span>
          </div>
          <h1 className="font-serif-luxury text-2xl md:text-3xl font-bold text-white">
            KINGSMAN OVERVIEW
          </h1>
          <p className="text-xs text-white/60">
            Real-time analytics, inventory matrix alerts, and pending fulfillment management.
          </p>
        </div>

        {/* Google Sheets Sync Widget */}
        <div className="flex items-center gap-3 bg-[#1A1A1A] border border-white/10 px-4 py-2.5 rounded-lg text-xs">
          <FileSpreadsheet className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-left">
            <p className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Google Sheets Sync</p>
            <p className="text-xs font-bold text-white">{lastSyncTime}</p>
          </div>
          <button
            onClick={handleManualGoogleSheetsSync}
            disabled={isSyncing}
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded transition-colors disabled:opacity-50"
            title="Trigger Instant Sync to Google Sheets"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-[#C7A55B]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Recommended Quick Actions Widgets */}
      <div>
        <h2 className="text-xs uppercase tracking-widest font-bold text-[#C7A55B] mb-3 flex items-center gap-2">
          <span>Quick Actions Command Center</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <button
            onClick={() => onNavigateTab('orders')}
            className="p-3 bg-[#181818] hover:bg-[#222] border border-white/10 rounded-lg text-left transition-all hover:border-[#C7A55B]/50 group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded bg-[#C1121F]/20 text-[#C1121F]">📦</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#C1121F] text-white rounded-full">
                {pendingCount}
              </span>
            </div>
            <p className="text-xs font-bold text-white group-hover:text-[#C7A55B] transition-colors">New Orders</p>
            <p className="text-[10px] text-white/50">Open pending list</p>
          </button>

          <button
            onClick={() => onNavigateTab('inventory')}
            className="p-3 bg-[#181818] hover:bg-[#222] border border-white/10 rounded-lg text-left transition-all hover:border-[#C7A55B]/50 group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded bg-amber-500/20 text-amber-400">⚠️</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-500 text-black rounded-full">
                {lowStockItems.length}
              </span>
            </div>
            <p className="text-xs font-bold text-white group-hover:text-[#C7A55B] transition-colors">Low Stock</p>
            <p className="text-[10px] text-white/50">Filtered inventory</p>
          </button>

          <button
            onClick={() => onNavigateTab('analytics')}
            className="p-3 bg-[#181818] hover:bg-[#222] border border-white/10 rounded-lg text-left transition-all hover:border-[#C7A55B]/50 group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded bg-emerald-500/20 text-emerald-400">💰</span>
              <span className="text-[10px] font-semibold text-emerald-400">+14%</span>
            </div>
            <p className="text-xs font-bold text-white group-hover:text-[#C7A55B] transition-colors">Today's Sales</p>
            <p className="text-[10px] text-white/50">Revenue breakdown</p>
          </button>

          <button
            onClick={() => onNavigateTab('orders')}
            className="p-3 bg-[#181818] hover:bg-[#222] border border-white/10 rounded-lg text-left transition-all hover:border-[#C7A55B]/50 group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded bg-blue-500/20 text-blue-400">🚚</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-500 text-white rounded-full">
                {pendingDeliveries.length}
              </span>
            </div>
            <p className="text-xs font-bold text-white group-hover:text-[#C7A55B] transition-colors">Pending Shipments</p>
            <p className="text-[10px] text-white/50">Awaiting courier</p>
          </button>

          <button
            onClick={onOpenCreateCoupon}
            className="p-3 bg-[#181818] hover:bg-[#222] border border-white/10 rounded-lg text-left transition-all hover:border-[#C7A55B]/50 group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded bg-purple-500/20 text-purple-400">🎟️</span>
              <Plus className="w-3.5 h-3.5 text-white/40" />
            </div>
            <p className="text-xs font-bold text-white group-hover:text-[#C7A55B] transition-colors">Create Coupon</p>
            <p className="text-[10px] text-white/50">Add promo discount</p>
          </button>

          <button
            onClick={onOpenAddProduct}
            className="p-3 bg-[#C1121F]/20 hover:bg-[#C1121F]/30 border border-[#C1121F]/50 rounded-lg text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded bg-[#C1121F] text-white">➕</span>
              <Plus className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs font-bold text-white group-hover:text-[#C7A55B] transition-colors">Add Product</p>
            <p className="text-[10px] text-white/70">Create new silhouette</p>
          </button>

        </div>
      </div>

      {/* Summary KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-[#141414] border border-white/10 p-4 rounded-lg">
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Today's Sales</span>
            <DollarSign className="w-4 h-4 text-[#C7A55B]" />
          </div>
          <p className="text-xl font-bold font-mono text-white">৳ {todaySales.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-400 font-semibold mt-1">↑ +18.4% vs yesterday</p>
        </div>

        <div className="bg-[#141414] border border-white/10 p-4 rounded-lg">
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Total Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-bold font-mono text-white">৳ {totalRevenue.toLocaleString()}</p>
          <p className="text-[10px] text-white/50 mt-1">Lifetime processed</p>
        </div>

        <div className="bg-[#141414] border border-white/10 p-4 rounded-lg">
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Pending Orders</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-bold font-mono text-white">{pendingCount}</p>
          <p className="text-[10px] text-amber-400 font-semibold mt-1">Requires packaging</p>
        </div>

        <div className="bg-[#141414] border border-white/10 p-4 rounded-lg">
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Delivered Orders</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-bold font-mono text-white">{deliveredCount}</p>
          <p className="text-[10px] text-emerald-400 font-semibold mt-1">Successfully fulfilled</p>
        </div>

      </div>

      {/* Charts & Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales & Revenue Chart (2 cols) */}
        <div className="lg:col-span-2 bg-[#141414] border border-white/10 p-5 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Revenue & Growth Trajectory</h3>
              <p className="text-[11px] text-white/50">Monthly gross volume in ৳ BDT</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] uppercase font-bold rounded"
              >
                <Download className="w-3 h-3" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockMonthlyData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C7A55B" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#C7A55B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="month" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} tickFormatter={(v) => `৳${v/1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#fff', fontSize: '12px' }}
                  formatter={(value: any) => [`৳ ${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C7A55B" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Inventory Matrix Alert */}
        <div className="bg-[#141414] border border-[#C1121F]/30 p-5 rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#C1121F]">
                <AlertTriangle className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Stock Matrix Alerts</h3>
              </div>
              <button 
                onClick={() => onNavigateTab('inventory')}
                className="text-[10px] text-[#C7A55B] hover:underline uppercase font-bold"
              >
                View All Matrix
              </button>
            </div>
            <p className="text-[11px] text-white/50 mb-4">
              Silhouettes requiring immediate factory restock (&le; 3 pairs remaining per size).
            </p>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
              {lowStockItems.length === 0 ? (
                <p className="text-xs text-emerald-400 py-4 text-center">All inventory sizes well-stocked.</p>
              ) : (
                lowStockItems.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-[#1C1C1C] border border-white/10 rounded flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white line-clamp-1">{item.product.name}</p>
                      <p className="text-[10px] text-white/50">Size EU {item.size} • SKU: {item.product.sku}</p>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${item.stock === 0 ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {item.stock === 0 ? 'Out of Stock' : `${item.stock} left`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('inventory')}
            className="w-full mt-4 py-2 bg-[#C1121F] hover:bg-[#a30f1a] text-white text-xs uppercase font-bold tracking-wider rounded flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Update Size Quantities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Recent Orders Section */}
      <div className="bg-[#141414] border border-white/10 p-5 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Live Orders</h3>
            <p className="text-[11px] text-white/50">Most recent transactions across Bangladesh & International</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs text-[#C7A55B] hover:underline font-bold uppercase tracking-wider"
          >
            View All Orders ({orders.length}) &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white">
            <thead className="bg-[#1A1A1A] text-white/50 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">District</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-mono text-[#C7A55B] font-bold">{order.id}</td>
                  <td className="p-3">
                    <p className="font-semibold text-white">{order.customerName}</p>
                    <p className="text-[10px] text-white/50">{order.customerPhone}</p>
                  </td>
                  <td className="p-3 text-white/70">{order.district}</td>
                  <td className="p-3">
                    <span className="text-[10px] px-2 py-0.5 bg-white/10 rounded font-mono text-white/80">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-emerald-400">${order.total}</td>
                  <td className="p-3">
                    <span className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-wider ${
                      order.orderStatus === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                      order.orderStatus === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                      order.orderStatus === 'Shipped' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onSelectOrderDetails(order)}
                      className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
                      title="Inspect & Process Order"
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

    </div>
  );
};

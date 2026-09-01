import React, { useState } from 'react';
import { 
  Boxes, 
  AlertTriangle, 
  RefreshCw, 
  Search, 
  Plus, 
  Minus, 
  History, 
  CheckCircle2, 
  XCircle,
  FileSpreadsheet
} from 'lucide-react';
import { Product, InventoryLog } from '../../types';

interface AdminInventoryProps {
  products: Product[];
  onUpdateProductStock: (productId: string, sizeStock: Record<number, number>, log: InventoryLog) => void;
  inventoryLogs: InventoryLog[];
  filterLowStockOnly?: boolean;
}

export const AdminInventory: React.FC<AdminInventoryProps> = ({
  products,
  onUpdateProductStock,
  inventoryLogs,
  filterLowStockOnly = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyAlerts, setOnlyAlerts] = useState(filterLowStockOnly);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustSize, setAdjustSize] = useState<number>(40);
  const [adjustQty, setAdjustQty] = useState<number>(5);
  const [adjustReason, setAdjustReason] = useState<'Restock' | 'Adjustment' | 'Return' | 'Sale'>('Restock');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!onlyAlerts) return matchesSearch;

    // Check if any size stock is <= 3
    if (p.sizeStock) {
      const hasLow = Object.values(p.sizeStock).some(qty => Number(qty) <= 3);
      return matchesSearch && hasLow;
    }
    return matchesSearch && p.stock <= 5;
  });

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const currentSizeStock = selectedProduct.sizeStock || { 39: 5, 40: 5, 41: 5, 42: 5, 43: 5, 44: 5 };
    const prevStock = currentSizeStock[adjustSize] || 0;
    const newStock = adjustReason === 'Sale' ? Math.max(0, prevStock - adjustQty) : prevStock + adjustQty;

    const updatedSizeStock = {
      ...currentSizeStock,
      [adjustSize]: newStock
    };

    const log: InventoryLog = {
      id: `log-${Date.now()}`,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      size: adjustSize,
      previousStock: prevStock,
      newStock: newStock,
      changeReason: adjustReason,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      adminUser: 'Lord Sterling (Admin)'
    };

    onUpdateProductStock(selectedProduct.id, updatedSizeStock, log);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-white tracking-wide">
            PER-SIZE INVENTORY MATRIX & STOCK LOGS
          </h1>
          <p className="text-xs text-white/60">
            Real-time stock controls for EU sizes 38 to 46, audit history & restock triggers.
          </p>
        </div>

        <button
          onClick={() => setOnlyAlerts(!onlyAlerts)}
          className={`flex items-center gap-2 px-4 py-2 border text-xs uppercase font-bold tracking-wider rounded transition-all ${
            onlyAlerts
              ? 'bg-amber-500 border-amber-500 text-black font-extrabold'
              : 'bg-[#181818] border-white/20 text-white/70 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{onlyAlerts ? 'Showing Low Stock Alerts (&le; 3)' : 'Filter Low Stock Alerts'}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#141414] border border-white/10 p-4 rounded-lg">
        <div className="relative">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inventory by silhouette title or SKU..."
            className="w-full pl-9 pr-4 py-2 bg-[#181818] border border-white/15 text-white text-xs rounded focus:outline-none focus:border-[#C7A55B]"
          />
        </div>
      </div>

      {/* Inventory Matrix Grid */}
      <div className="space-y-4">
        {filteredProducts.map((product) => {
          const sizes = [38, 39, 40, 41, 42, 43, 44, 45, 46];
          const stockMap = product.sizeStock || { 39: 5, 40: 5, 41: 5, 42: 5 };
          const totalStock = (Object.values(stockMap) as number[]).reduce((a, b) => a + Number(b), 0);

          return (
            <div key={product.id} className="bg-[#141414] border border-white/10 rounded-lg p-5 hover:border-[#C7A55B]/40 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded border border-white/20" />
                  <div>
                    <h3 className="font-serif-luxury font-bold text-white text-base">{product.name}</h3>
                    <p className="text-[10px] text-white/50 font-mono">SKU: {product.sku} • Category: {product.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded">
                    Total In Stock: {totalStock} pairs
                  </span>
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setAdjustSize(40);
                    }}
                    className="px-3 py-1 bg-[#C7A55B] hover:bg-[#b0904b] text-[#111] text-xs font-bold uppercase tracking-wider rounded"
                  >
                    + Adjust Size Stock
                  </button>
                </div>
              </div>

              {/* Per-Size Stock Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
                {sizes.map((sz) => {
                  const qty = stockMap[sz] !== undefined ? stockMap[sz] : 0;
                  const isLow = qty <= 3 && qty > 0;
                  const isOut = qty === 0;

                  return (
                    <div
                      key={sz}
                      className={`p-2.5 rounded text-center border ${
                        isOut
                          ? 'bg-red-500/10 border-red-500/30 text-red-400'
                          : isLow
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-[#1C1C1C] border-white/10 text-white'
                      }`}
                    >
                      <p className="text-[10px] font-mono font-bold text-white/60">EU {sz}</p>
                      <p className="text-sm font-bold font-mono my-0.5">{qty}</p>
                      <p className="text-[9px] uppercase font-bold tracking-wider">
                        {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Optimal'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Inventory Audit Log History */}
      <div className="bg-[#141414] border border-white/10 p-5 rounded-lg space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#C7A55B] flex items-center gap-2">
          <History className="w-4 h-4" />
          <span>Audit Log History</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white">
            <thead className="bg-[#1A1A1A] text-white/50 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Size</th>
                <th className="p-3">Change Reason</th>
                <th className="p-3">Before &rarr; After</th>
                <th className="p-3">Admin User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 font-mono">
              {inventoryLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-white/50 text-xs font-sans">
                    No manual stock adjustments recorded yet.
                  </td>
                </tr>
              ) : (
                inventoryLogs.slice(0, 10).map((log) => (
                  <tr key={log.id} className="hover:bg-white/5">
                    <td className="p-3 text-white/50">{log.timestamp}</td>
                    <td className="p-3 font-sans font-bold text-white">{log.productName}</td>
                    <td className="p-3 text-[#C7A55B]">EU {log.size}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] uppercase font-bold text-white">
                        {log.changeReason}
                      </span>
                    </td>
                    <td className="p-3 text-emerald-400 font-bold">
                      {log.previousStock} &rarr; {log.newStock}
                    </td>
                    <td className="p-3 text-white/70 font-sans">{log.adminUser || 'Admin'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#141414] border border-[#C7A55B]/40 p-6 rounded-lg text-white">
            <h2 className="font-serif-luxury text-lg font-bold text-white mb-2">
              MANUAL STOCK ADJUSTMENT
            </h2>
            <p className="text-xs text-white/60 mb-4">{selectedProduct.name}</p>

            <form onSubmit={handleApplyAdjustment} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Select Size</label>
                <select
                  value={adjustSize}
                  onChange={(e) => setAdjustSize(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white rounded font-mono"
                >
                  {[38, 39, 40, 41, 42, 43, 44, 45, 46].map(s => (
                    <option key={s} value={s}>EU Size {s} (Current: {selectedProduct.sizeStock?.[s] || 0})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Adjustment Reason</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white rounded"
                >
                  <option value="Restock">+ Factory Restock</option>
                  <option value="Return">+ Customer Return</option>
                  <option value="Adjustment">Set Manual Quantity</option>
                  <option value="Sale">- Manual Direct Sale</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Quantity Offset</label>
                <input
                  type="number"
                  min="1"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white rounded font-mono"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button type="button" onClick={() => setSelectedProduct(null)} className="px-4 py-2 bg-white/10 text-white font-bold rounded">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#C1121F] text-white font-bold uppercase tracking-wider rounded">
                  Update Matrix Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

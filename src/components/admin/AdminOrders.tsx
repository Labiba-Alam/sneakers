import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Printer, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle, 
  RotateCcw,
  Package,
  MapPin,
  CreditCard,
  User,
  Phone,
  Mail,
  FileText,
  ChevronRight,
  Send,
  Sparkles
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface AdminOrdersProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  selectedOrderForModal?: Order | null;
  onClearSelectedOrderModal?: () => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  orders,
  onUpdateOrderStatus,
  selectedOrderForModal,
  onClearSelectedOrderModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');
  const [districtFilter, setDistrictFilter] = useState<string>('All');
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(selectedOrderForModal || null);

  // Sync prop changes if passed from parent home click
  React.useEffect(() => {
    if (selectedOrderForModal) {
      setInspectingOrder(selectedOrderForModal);
    }
  }, [selectedOrderForModal]);

  const allStatuses: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Packaging',
    'Shipped',
    'Delivered',
    'Cancelled',
    'Returned'
  ];

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery) ||
      o.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.district && o.district.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
    const matchesPayment = paymentFilter === 'All' || o.paymentMethod === paymentFilter;
    const matchesDistrict = districtFilter === 'All' || o.district === districtFilter;

    return matchesSearch && matchesStatus && matchesPayment && matchesDistrict;
  });

  const handlePrintInvoice = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>KINGSMAN INVOICE - ${order.id}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #111; }
            .header { text-align: center; border-bottom: 2px solid #111; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; letter-spacing: 2px; }
            .subtitle { font-size: 12px; color: #666; text-transform: uppercase; margin-top: 5px; }
            .flex { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .box { font-size: 13px; line-height: 1.6; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 13px; }
            th { background-color: #f4f4f4; text-transform: uppercase; font-size: 11px; }
            .total { text-align: right; margin-top: 20px; font-size: 16px; font-weight: bold; }
            .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">KINGSMAN ROYAL SILHOUETTES</div>
            <div class="subtitle">OFFICIAL ATELIER INVOICE & PROVENANCE RECEIPT</div>
          </div>
          <div class="flex">
            <div class="box">
              <strong>Billed To:</strong><br/>
              ${order.customerName}<br/>
              Phone: ${order.customerPhone}<br/>
              Address: ${order.address}, ${order.area}<br/>
              District: ${order.district}
            </div>
            <div class="box" style="text-align: right;">
              <strong>Invoice #:</strong> ${order.id}<br/>
              <strong>Tracking #:</strong> ${order.trackingNumber}<br/>
              <strong>Date:</strong> ${order.createdAt}<br/>
              <strong>Payment:</strong> ${order.paymentMethod} (${order.paymentStatus})
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Silhouette Product</th>
                <th>Selected Size</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td><strong>${item.product.name}</strong><br/><small>SKU: ${item.product.sku}</small></td>
                  <td>EU ${item.selectedSize}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.product.price}</td>
                  <td>$${item.product.price * item.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            <p>Subtotal: $${order.subtotal}</p>
            <p>Delivery Fee (${order.district}): $${order.shippingFee}</p>
            <p>Discount: -$${order.discountAmount}</p>
            <p style="font-size: 20px; color: #C1121F;">TOTAL PAID: $${order.total}</p>
          </div>
          <div class="footer">
            Thank you for choosing KINGSMAN Royal Sneakers. Every pair includes our lifetime authenticity card.
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleExportOrdersCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Order ID,Customer Name,Phone,Email,District,Address,Payment Method,Payment Status,Order Status,Total USD,Created At,Tracking Number"].join(",") + "\n"
      + filteredOrders.map(o => `${o.id},"${o.customerName}",${o.customerPhone},${o.customerEmail || ''},"${o.district}","${o.address.replace(/"/g, '""')}",${o.paymentMethod},${o.paymentStatus},${o.orderStatus},${o.total},${o.createdAt},${o.trackingNumber}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KINGSMAN_Orders_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-white tracking-wide">
            ORDER FULFILLMENT & INVOICING
          </h1>
          <p className="text-xs text-white/60">
            Manage live orders, update customer tracking, print invoices & dispatch shipments.
          </p>
        </div>

        <button
          onClick={handleExportOrdersCSV}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1C1C1C] hover:bg-[#252525] border border-white/20 text-white text-xs uppercase font-bold tracking-wider rounded transition-all"
        >
          <Download className="w-4 h-4 text-[#C7A55B]" />
          <span>Export Filtered Orders CSV</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-[#141414] border border-white/10 p-4 rounded-lg space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          
          {/* Search Bar */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, Phone, Customer, Tracking #..."
              className="w-full pl-9 pr-4 py-2 bg-[#181818] border border-white/15 text-white text-xs rounded focus:outline-none focus:border-[#C7A55B]"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white text-xs rounded focus:outline-none focus:border-[#C7A55B]"
            >
              <option value="All">All Statuses ({orders.length})</option>
              {allStatuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white text-xs rounded focus:outline-none focus:border-[#C7A55B]"
            >
              <option value="All">All Regions / Districts</option>
              <option value="Dhaka - Inside City">Dhaka - Inside City</option>
              <option value="Dhaka - Suburbs">Dhaka - Suburbs</option>
              <option value="Chittagong">Chittagong</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Rajshahi">Rajshahi</option>
              <option value="Khulna">Khulna</option>
            </select>
          </div>

        </div>
      </div>

      {/* Orders Data Table */}
      <div className="bg-[#141414] border border-white/10 rounded-lg overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white">
            <thead className="bg-[#1A1A1A] text-white/50 uppercase tracking-wider text-[10px] border-b border-white/10">
              <tr>
                <th className="p-3.5">Order ID</th>
                <th className="p-3.5">Customer & Contact</th>
                <th className="p-3.5">Region</th>
                <th className="p-3.5">Items</th>
                <th className="p-3.5">Payment Method</th>
                <th className="p-3.5">Total Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-white/50 text-xs">
                    No orders matched your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    
                    {/* ID & Date */}
                    <td className="p-3.5 font-mono">
                      <p className="text-[#C7A55B] font-bold">{order.id}</p>
                      <p className="text-[10px] text-white/50">{order.createdAt}</p>
                    </td>

                    {/* Customer */}
                    <td className="p-3.5">
                      <p className="font-bold text-white">{order.customerName}</p>
                      <p className="text-[10px] text-white/60 font-mono">{order.customerPhone}</p>
                    </td>

                    {/* District */}
                    <td className="p-3.5 text-white/70">
                      <p className="font-semibold">{order.district}</p>
                      <p className="text-[10px] text-white/50 truncate max-w-[120px]">{order.area}</p>
                    </td>

                    {/* Items count & sizes */}
                    <td className="p-3.5">
                      <p className="font-semibold">{order.items.length} item(s)</p>
                      <p className="text-[10px] text-white/50">
                        EU {order.items.map(i => i.selectedSize).join(', ')}
                      </p>
                    </td>

                    {/* Payment */}
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 bg-white/10 rounded font-mono text-[10px] text-white/80">
                        {order.paymentMethod}
                      </span>
                      <p className="text-[9px] text-emerald-400 font-semibold mt-0.5">{order.paymentStatus}</p>
                    </td>

                    {/* Total */}
                    <td className="p-3.5 font-mono font-bold text-emerald-400">
                      ${order.total}
                    </td>

                    {/* Order Status Select */}
                    <td className="p-3.5">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-[10px] font-bold px-2 py-1 rounded border focus:outline-none uppercase tracking-wider ${
                          order.orderStatus === 'Delivered' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' :
                          order.orderStatus === 'Cancelled' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                          order.orderStatus === 'Shipped' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' :
                          'bg-amber-500/20 border-amber-500/50 text-amber-400'
                        }`}
                      >
                        {allStatuses.map(status => (
                          <option key={status} value={status} className="bg-[#1A1A1A] text-white">
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => setInspectingOrder(order)}
                        className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
                        title="View Full Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePrintInvoice(order)}
                        className="p-1.5 bg-[#C7A55B]/20 hover:bg-[#C7A55B]/40 text-[#C7A55B] rounded transition-colors"
                        title="Print Formal Invoice"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Order Inspector Modal */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#141414] border border-white/20 p-6 rounded-lg shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[#C7A55B] font-mono font-bold text-lg">{inspectingOrder.id}</span>
                  <span className="text-xs px-2.5 py-0.5 bg-[#C1121F] text-white rounded font-bold uppercase tracking-wider">
                    {inspectingOrder.orderStatus}
                  </span>
                </div>
                <p className="text-xs text-white/50 mt-0.5">Tracking Number: <span className="font-mono text-white">{inspectingOrder.trackingNumber}</span></p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrintInvoice(inspectingOrder)}
                  className="px-3 py-1.5 bg-[#C7A55B] hover:bg-[#b0904b] text-[#111111] text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => {
                    setInspectingOrder(null);
                    if (onClearSelectedOrderModal) onClearSelectedOrderModal();
                  }}
                  className="p-1.5 text-white/50 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Stepper Status Update Bar */}
            <div className="py-4 border-b border-white/10">
              <p className="text-[10px] uppercase tracking-wider font-bold text-white/60 mb-2">
                Order Fulfillment Lifecycle Status
              </p>
              <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
                {allStatuses.map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      onUpdateOrderStatus(inspectingOrder.id, st);
                      setInspectingOrder({ ...inspectingOrder, orderStatus: st });
                    }}
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border transition-all shrink-0 ${
                      inspectingOrder.orderStatus === st
                        ? 'bg-[#C1121F] border-[#C1121F] text-white shadow-md'
                        : 'bg-[#181818] border-white/10 text-white/50 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-b border-white/10 text-xs">
              <div className="p-3 bg-[#181818] rounded space-y-1">
                <p className="text-[10px] uppercase font-bold text-[#C7A55B]">Customer Profile</p>
                <p className="font-bold text-white text-sm">{inspectingOrder.customerName}</p>
                <p className="text-white/70 flex items-center gap-1.5"><Phone className="w-3 h-3 text-white/40" /> {inspectingOrder.customerPhone}</p>
                {inspectingOrder.customerEmail && <p className="text-white/70 flex items-center gap-1.5"><Mail className="w-3 h-3 text-white/40" /> {inspectingOrder.customerEmail}</p>}
              </div>

              <div className="p-3 bg-[#181818] rounded space-y-1">
                <p className="text-[10px] uppercase font-bold text-[#C7A55B]">Shipping Destination</p>
                <p className="font-bold text-white">{inspectingOrder.district}</p>
                <p className="text-white/70">{inspectingOrder.address}, {inspectingOrder.area}</p>
                {inspectingOrder.notes && <p className="text-amber-400 text-[10px] italic">Notes: "{inspectingOrder.notes}"</p>}
              </div>
            </div>

            {/* Items Ordered */}
            <div className="py-4 space-y-3">
              <p className="text-xs uppercase font-bold text-white/70">Ordered Silhouettes ({inspectingOrder.items.length})</p>
              <div className="space-y-2">
                {inspectingOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-[#181818] border border-white/10 rounded flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <p className="font-bold text-white text-xs">{item.product.name}</p>
                        <p className="text-[10px] text-white/60">Selected Size: <strong className="text-white">EU {item.selectedSize}</strong> • Color: {item.selectedColor.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs font-bold text-emerald-400">${item.product.price} × {item.quantity}</p>
                      <p className="font-mono text-xs text-white font-bold">${item.product.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Summary Footer */}
            <div className="pt-3 border-t border-white/10 flex justify-between items-center font-mono">
              <div className="text-xs text-white/60">
                <span>Payment: {inspectingOrder.paymentMethod}</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/60">Subtotal: ${inspectingOrder.subtotal}</p>
                <p className="text-xs text-white/60">Shipping Fee: ${inspectingOrder.shippingFee}</p>
                <p className="text-base text-emerald-400 font-bold">TOTAL: ${inspectingOrder.total}</p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

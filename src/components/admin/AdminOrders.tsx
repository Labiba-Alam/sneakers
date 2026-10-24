import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Printer, 
  Download, 
  Eye, 
  CheckCircle2, 
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
  AlertCircle,
  Save,
  Banknote,
  Check
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { useStore } from '../../context/StoreContext';

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
  const { markDeliveryChargeReceived, updateCourierBooking } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [deliveryFilter, setDeliveryFilter] = useState<string>('All');
  const [districtFilter, setDistrictFilter] = useState<string>('All');
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(selectedOrderForModal || null);

  // Courier booking edit state inside modal
  const [modalCourierName, setModalCourierName] = useState<'Steadfast' | 'Pathao'>('Steadfast');
  const [modalConsignmentId, setModalConsignmentId] = useState('');
  const [modalCodAmount, setModalCodAmount] = useState<number>(0);
  const [isSavingCourier, setIsSavingCourier] = useState(false);
  const [courierSaved, setCourierSaved] = useState(false);

  // Sync prop changes if passed from parent
  React.useEffect(() => {
    if (selectedOrderForModal) {
      setInspectingOrder(selectedOrderForModal);
    }
  }, [selectedOrderForModal]);

  // When inspectingOrder changes, sync courier form inputs
  React.useEffect(() => {
    if (inspectingOrder) {
      setModalCourierName(inspectingOrder.courierName || inspectingOrder.courierPartner || 'Steadfast');
      setModalConsignmentId(inspectingOrder.consignmentId || '');
      setModalCodAmount(
        inspectingOrder.codAmountToCollect ?? 
        (inspectingOrder.remainingAmountDue ?? Math.max(0, inspectingOrder.subtotal - inspectingOrder.discountAmount))
      );
      setCourierSaved(false);
    }
  }, [inspectingOrder]);

  // Real-world status progression
  const allStatuses: OrderStatus[] = [
    'Awaiting Delivery Charge',
    'Confirmed',
    'Packed',
    'Handed to Courier',
    'Delivered',
    'Cancelled',
    'Returned'
  ];

  const filteredOrders = orders.filter(o => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(searchQuery) ||
      o.trackingNumber.toLowerCase().includes(q) ||
      (o.consignmentId && o.consignmentId.toLowerCase().includes(q)) ||
      (o.district && o.district.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
    const matchesDelivery = 
      deliveryFilter === 'All' || 
      (deliveryFilter === 'Paid' && o.deliveryChargePaid) || 
      (deliveryFilter === 'Unpaid' && !o.deliveryChargePaid);
    const matchesDistrict = districtFilter === 'All' || o.district === districtFilter;

    return matchesSearch && matchesStatus && matchesDelivery && matchesDistrict;
  });

  const handleMarkPaid = async (orderId: string) => {
    await markDeliveryChargeReceived(orderId);
    if (inspectingOrder && inspectingOrder.id === orderId) {
      setInspectingOrder({
        ...inspectingOrder,
        deliveryChargePaid: true,
        deliveryChargePaidAt: new Date().toISOString(),
        orderStatus: inspectingOrder.orderStatus === 'Awaiting Delivery Charge' ? 'Confirmed' : inspectingOrder.orderStatus,
      });
    }
  };

  const handleSaveCourier = async () => {
    if (!inspectingOrder) return;
    setIsSavingCourier(true);
    await updateCourierBooking(inspectingOrder.id, modalCourierName, modalConsignmentId, modalCodAmount);
    setInspectingOrder({
      ...inspectingOrder,
      courierName: modalCourierName,
      courierPartner: modalCourierName,
      consignmentId: modalConsignmentId,
      codAmountToCollect: modalCodAmount,
      remainingAmountDue: modalCodAmount,
    });
    setIsSavingCourier(false);
    setCourierSaved(true);
    setTimeout(() => setCourierSaved(false), 2500);
  };

  const handlePrintParcelSlip = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const codAmount = order.codAmountToCollect ?? (order.remainingAmountDue ?? Math.max(0, order.subtotal - order.discountAmount));

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>PARCEL SLIP & INVOICE - ${order.id}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; }
            body { padding: 30px; color: #111; line-height: 1.4; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #111; padding-bottom: 12px; margin-bottom: 20px; }
            .title { font-size: 22px; font-weight: 800; letter-spacing: 1.5px; }
            .subtitle { font-size: 11px; color: #555; text-transform: uppercase; margin-top: 2px; }
            .badge { display: inline-block; background: #000; color: #fff; padding: 3px 8px; font-size: 10px; font-weight: bold; border-radius: 3px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
            .card { border: 1px solid #ccc; padding: 12px; border-radius: 4px; font-size: 12px; }
            .card h4 { font-size: 11px; text-transform: uppercase; color: #777; margin-bottom: 6px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
            .highlight { background: #fdf6e2; border: 1px solid #d4af37; padding: 10px; border-radius: 4px; font-size: 13px; font-weight: bold; margin-bottom: 16px; display: flex; justify-content: space-between; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 16px; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px 10px; text-align: left; }
            th { background-color: #f5f5f5; text-transform: uppercase; font-size: 10px; }
            .totals { margin-left: auto; width: 280px; font-size: 12px; margin-bottom: 20px; }
            .totals-row { display: flex; justify-content: space-between; padding: 4px 0; }
            .totals-row.grand { border-top: 2px solid #111; font-weight: bold; font-size: 14px; margin-top: 6px; padding-top: 6px; }
            .cod-banner { background: #111; color: #fff; padding: 10px 14px; text-align: center; font-size: 14px; font-weight: bold; margin-top: 10px; }
            .footer { text-align: center; font-size: 10px; color: #888; border-top: 1px solid #eee; padding-top: 12px; margin-top: 24px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">KINGSMAN LUXURY ATELIER</div>
              <div class="subtitle">Official Courier Shipping Slip & Provenance Receipt</div>
            </div>
            <div style="text-align: right;">
              <span class="badge">${order.courierName || 'Steadfast'} Express</span>
              <p style="font-size: 12px; font-weight: bold; margin-top: 4px;">Order: ${order.id}</p>
              <p style="font-size: 11px; color: #666;">Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div class="highlight">
            <span>CASH ON DELIVERY (COD) TO COLLECT:</span>
            <span style="font-size: 16px; color: #c1121f;">৳ ${codAmount.toLocaleString()}</span>
          </div>

          <div class="grid">
            <div class="card">
              <h4>Consignee / Customer Details</h4>
              <p style="font-weight: bold; font-size: 13px;">${order.customerName}</p>
              <p>Phone: <strong>${order.customerPhone}</strong></p>
              <p>Address: ${order.address}</p>
              <p>District: <strong>${order.district}</strong></p>
              ${order.notes ? `<p style="margin-top: 6px; color: #a16207;">Note: ${order.notes}</p>` : ''}
            </div>

            <div class="card">
              <h4>Courier & Dispatch Info</h4>
              <p>Courier Partner: <strong>${order.courierName || 'Steadfast'}</strong></p>
              <p>Consignment ID: <strong>${order.consignmentId || 'Pending Booking'}</strong></p>
              <p>Tracking #: <strong>${order.trackingNumber}</strong></p>
              <p>Advance Delivery Charge: <strong>৳ ${order.shippingFee} (${order.deliveryChargePaid ? 'Paid' : 'Awaiting'})</strong></p>
              <p>Parcel Weight: ~${((order.totalWeightGrams || 1000) / 1000).toFixed(2)} kg</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item Silhouette / Apparel</th>
                <th>Size</th>
                <th>Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td><strong>${item.product?.name || 'Product'}</strong></td>
                  <td>${item.selectedSize}</td>
                  <td>${item.quantity}</td>
                  <td style="text-align: right;">৳ ${(item.product?.price || 0).toLocaleString()}</td>
                  <td style="text-align: right;">৳ ${((item.product?.price || 0) * item.quantity).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row"><span>Products Subtotal:</span><span>৳ ${order.subtotal.toLocaleString()}</span></div>
            ${order.discountAmount > 0 ? `<div class="totals-row" style="color: #c1121f;"><span>Discount:</span><span>-৳ ${order.discountAmount.toLocaleString()}</span></div>` : ''}
            <div class="totals-row"><span>Advance Delivery Fee:</span><span>৳ ${order.shippingFee.toLocaleString()}</span></div>
            <div class="totals-row grand"><span>Total Parcel COD:</span><span>৳ ${codAmount.toLocaleString()}</span></div>
          </div>

          <div class="cod-banner">
            COURIER COLLECTS FROM CUSTOMER: ৳ ${codAmount.toLocaleString()}
          </div>

          <div class="footer">
            KINGSMAN Luxury Footwear • Hotline: 01581054939 • Official Order Document
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleExportOrdersCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Order ID,Customer Name,Phone,Email,District,Address,Payment Method,Delivery Fee Paid,Order Status,COD to Collect,Total BDT,Courier,Consignment ID,Created At"].join(",") + "\n"
      + filteredOrders.map(o => `${o.id},"${o.customerName}",${o.customerPhone},${o.customerEmail || ''},"${o.district}","${(o.address || '').replace(/"/g, '""')}",${o.paymentMethod},${o.deliveryChargePaid ? 'YES' : 'NO'},${o.orderStatus},${o.codAmountToCollect || 0},${o.total},${o.courierName || 'Steadfast'},"${o.consignmentId || ''}",${o.createdAt}`).join("\n");
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
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-white tracking-wide">
            ORDER FULFILLMENT & COURIER DISPATCH
          </h1>
          <p className="text-xs text-white/60">
            Verify advance delivery charges, transition fulfillment steps & manage Steadfast / Pathao courier bookings.
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
              placeholder="Search by Order ID, Phone, Customer, Consignment #..."
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

          {/* Delivery Fee Paid Filter */}
          <div>
            <select
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#181818] border border-white/15 text-white text-xs rounded focus:outline-none focus:border-[#C7A55B]"
            >
              <option value="All">Delivery Charge: All</option>
              <option value="Paid">Charge Received</option>
              <option value="Unpaid">Awaiting Charge</option>
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
                <th className="p-3.5">Customer & Phone</th>
                <th className="p-3.5">District</th>
                <th className="p-3.5">Delivery Fee</th>
                <th className="p-3.5">COD to Collect</th>
                <th className="p-3.5">Courier</th>
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
                filteredOrders.map((order) => {
                  const cod = order.codAmountToCollect ?? (order.remainingAmountDue ?? Math.max(0, order.subtotal - order.discountAmount));
                  return (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      
                      {/* ID & Date */}
                      <td className="p-3.5 font-mono">
                        <p className="text-[#C7A55B] font-bold">{order.id}</p>
                        <p className="text-[10px] text-white/50">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </td>

                      {/* Customer */}
                      <td className="p-3.5">
                        <p className="font-bold text-white">{order.customerName}</p>
                        <p className="text-[10px] text-white/60 font-mono">{order.customerPhone}</p>
                      </td>

                      {/* District */}
                      <td className="p-3.5 text-white/70">
                        <p className="font-semibold">{order.district}</p>
                        <p className="text-[10px] text-white/40 truncate max-w-[120px]">{order.address}</p>
                      </td>

                      {/* Advance Delivery Fee Status */}
                      <td className="p-3.5">
                        {order.deliveryChargePaid ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Received (৳{order.shippingFee})</span>
                            </span>
                            {order.deliveryChargePaidBy && (
                              <p className="text-[9px] text-white/40 mt-0.5">by {order.deliveryChargePaidBy}</p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded text-[10px] font-bold">
                              <Clock className="w-3 h-3" />
                              <span>Due ৳{order.shippingFee}</span>
                            </span>
                            <div>
                              <button
                                onClick={() => handleMarkPaid(order.id)}
                                className="px-2 py-1 bg-[#C7A55B] hover:bg-[#b0904b] text-black text-[9px] font-bold uppercase rounded tracking-wider shadow transition-all block mt-1"
                              >
                                Mark Paid
                              </button>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* COD to Collect */}
                      <td className="p-3.5 font-mono font-bold text-emerald-400">
                        ৳ {cod.toLocaleString()}
                      </td>

                      {/* Courier Partner */}
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-white/10 rounded font-mono text-[10px] text-white/90">
                          {order.courierName || order.courierPartner || 'Steadfast'}
                        </span>
                        {order.consignmentId ? (
                          <p className="text-[10px] text-[#C7A55B] font-mono mt-0.5">#{order.consignmentId}</p>
                        ) : (
                          <p className="text-[9px] text-white/40 mt-0.5">Not booked yet</p>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-3.5">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className={`text-[10px] font-bold px-2 py-1 rounded border focus:outline-none uppercase tracking-wider ${
                            order.orderStatus === 'Delivered' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' :
                            order.orderStatus === 'Cancelled' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                            order.orderStatus === 'Handed to Courier' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' :
                            order.orderStatus === 'Confirmed' ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' :
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
                          title="Manage Order & Courier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePrintParcelSlip(order)}
                          className="p-1.5 bg-[#C7A55B]/20 hover:bg-[#C7A55B]/40 text-[#C7A55B] rounded transition-colors"
                          title="Print Parcel Shipping Slip"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Order Inspector & Courier Booking Drawer/Modal */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#141414] border border-white/20 p-6 rounded-lg shadow-2xl text-white max-h-[90vh] overflow-y-auto space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[#C7A55B] font-mono font-bold text-lg">{inspectingOrder.id}</span>
                  <span className="text-xs px-2.5 py-0.5 bg-[#C1121F] text-white rounded font-bold uppercase tracking-wider">
                    {inspectingOrder.orderStatus}
                  </span>
                  {inspectingOrder.deliveryChargePaid ? (
                    <span className="text-xs px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded font-bold">
                      Delivery Charge Paid
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded font-bold">
                      Awaiting Delivery Charge (৳{inspectingOrder.shippingFee})
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/50 mt-0.5">Tracking Number: <span className="font-mono text-white">{inspectingOrder.trackingNumber}</span></p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrintParcelSlip(inspectingOrder)}
                  className="px-3 py-1.5 bg-[#C7A55B] hover:bg-[#b0904b] text-[#111111] text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
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

            {/* Advance Delivery Charge Verification Banner */}
            {!inspectingOrder.deliveryChargePaid ? (
              <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-amber-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>Advance Delivery Charge Not Confirmed Yet (৳{inspectingOrder.shippingFee})</span>
                  </h4>
                  <p className="text-[11px] text-white/70 mt-1">
                    {inspectingOrder.advanceDeliveryFeeTrxId 
                      ? `Customer reported TrxID: ${inspectingOrder.advanceDeliveryFeeTrxId} (${inspectingOrder.advanceDeliveryFeeMethod || 'MFS'}, sender: ${inspectingOrder.senderMfsPhone || 'N/A'}). Verify in your MFS statement.` 
                      : 'Customer placed order without TrxID. Check your bKash/Nagad/Rocket account or call customer.'}
                  </p>
                </div>
                <button
                  onClick={() => handleMarkPaid(inspectingOrder.id)}
                  className="px-4 py-2 bg-[#C7A55B] hover:bg-[#b0904b] text-black font-bold text-xs uppercase tracking-wider rounded shadow transition-all shrink-0"
                >
                  Mark Delivery Charge Received
                </button>
              </div>
            ) : (
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded flex items-center justify-between text-xs text-emerald-300">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Delivery Charge Received (৳{inspectingOrder.shippingFee})</span>
                </span>
                <span className="text-[10px] text-white/50">
                  {inspectingOrder.deliveryChargePaidBy && `Confirmed by ${inspectingOrder.deliveryChargePaidBy} on ${new Date(inspectingOrder.deliveryChargePaidAt || '').toLocaleString()}`}
                </span>
              </div>
            )}

            {/* Status Steps Progression */}
            <div className="py-2 border-b border-white/10 space-y-2">
              <p className="text-[10px] uppercase tracking-wider font-bold text-white/60">
                Order Status Lifecycle Steps:
              </p>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
                {allStatuses.map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      onUpdateOrderStatus(inspectingOrder.id, st);
                      setInspectingOrder({ ...inspectingOrder, orderStatus: st });
                    }}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border transition-all shrink-0 ${
                      inspectingOrder.orderStatus === st
                        ? 'bg-[#C1121F] border-[#C1121F] text-white shadow-md'
                        : 'bg-[#181818] border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Courier Booking Card (Steadfast or Pathao) */}
            <div className="bg-[#181818] border border-white/15 p-4 rounded-lg space-y-3">
              <h4 className="font-serif-luxury text-sm font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C7A55B]" />
                <span>Courier Booking & Consignment Details</span>
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">
                    Courier Partner
                  </label>
                  <select
                    value={modalCourierName}
                    onChange={(e) => setModalCourierName(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#141414] border border-white/15 text-white rounded outline-none"
                  >
                    <option value="Steadfast">Steadfast Courier</option>
                    <option value="Pathao">Pathao Courier</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">
                    Consignment / Tracking ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. STF-849204"
                    value={modalConsignmentId}
                    onChange={(e) => setModalConsignmentId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141414] border border-white/15 text-white font-mono rounded outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">
                    COD Amount to Collect (৳)
                  </label>
                  <input
                    type="number"
                    value={modalCodAmount}
                    onChange={(e) => setModalCodAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#141414] border border-white/15 text-emerald-400 font-mono font-bold rounded outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {courierSaved && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Courier booking saved!</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSaveCourier}
                  disabled={isSavingCourier}
                  className="ml-auto px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1.5 transition-all"
                >
                  <Save className="w-3.5 h-3.5 text-[#C7A55B]" />
                  <span>{isSavingCourier ? 'Saving...' : 'Save Courier Details'}</span>
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#181818] rounded space-y-1">
                <p className="text-[10px] uppercase font-bold text-[#C7A55B]">Customer Profile</p>
                <p className="font-bold text-white text-sm">{inspectingOrder.customerName}</p>
                <p className="text-white/70 flex items-center gap-1.5"><Phone className="w-3 h-3 text-white/40" /> {inspectingOrder.customerPhone}</p>
                {inspectingOrder.customerEmail && <p className="text-white/70 flex items-center gap-1.5"><Mail className="w-3 h-3 text-white/40" /> {inspectingOrder.customerEmail}</p>}
              </div>

              <div className="p-3 bg-[#181818] rounded space-y-1">
                <p className="text-[10px] uppercase font-bold text-[#C7A55B]">Shipping Destination</p>
                <p className="font-bold text-white">{inspectingOrder.district}</p>
                <p className="text-white/70">{inspectingOrder.address}</p>
                {inspectingOrder.notes && <p className="text-amber-400 text-[10px] italic">Note: "{inspectingOrder.notes}"</p>}
              </div>
            </div>

            {/* Items Ordered */}
            <div className="space-y-2 text-xs">
              <p className="uppercase font-bold text-white/70">Ordered Items ({inspectingOrder.items.length})</p>
              <div className="space-y-2">
                {inspectingOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-[#181818] border border-white/10 rounded flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={item.product?.images?.[0] || ''} alt={item.product?.name || ''} className="w-12 h-12 object-contain bg-black rounded" />
                      <div>
                        <p className="font-bold text-white">{item.product?.name}</p>
                        <p className="text-[10px] text-white/60">Size: <strong className="text-white">{item.selectedSize}</strong> • Color: {item.selectedColor?.name || 'Standard'} • Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <p className="text-emerald-400 font-bold">৳ {(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="pt-3 border-t border-white/10 flex justify-between items-center font-mono text-xs">
              <div className="text-white/60">
                <p>Advance Delivery Fee: ৳ {inspectingOrder.shippingFee.toLocaleString()}</p>
                <p>Status: {inspectingOrder.deliveryChargePaid ? 'Paid' : 'Unpaid'}</p>
              </div>
              <div className="text-right">
                <p className="text-white/60">Subtotal: ৳ {inspectingOrder.subtotal.toLocaleString()}</p>
                <p className="text-base text-emerald-400 font-bold">COD to Collect: ৳ {modalCodAmount.toLocaleString()}</p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

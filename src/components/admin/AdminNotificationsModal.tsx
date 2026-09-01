import React, { useState } from 'react';
import { Bell, AlertTriangle, ShoppingBag, CreditCard, MessageSquare, Check, Trash2 } from 'lucide-react';
import { AdminNotification } from '../../types';
import { AdminTab } from './AdminSidebar';

interface AdminNotificationsModalProps {
  notifications: AdminNotification[];
  onClose: () => void;
  onMarkAllRead: () => void;
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminNotificationsModal: React.FC<AdminNotificationsModalProps> = ({
  notifications,
  onClose,
  onMarkAllRead,
  onNavigateTab
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'low_stock' | 'new_order' | 'failed_payment' | 'message'>('all');

  const filtered = notifications.filter(n => activeFilter === 'all' || n.type === activeFilter);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-end p-4 md:p-6">
      <div className="w-full max-w-md bg-[#141414] border border-[#C7A55B]/40 rounded-lg shadow-2xl p-5 text-white space-y-4 max-h-[85vh] flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#C7A55B]" />
            <h2 className="font-serif-luxury font-bold text-base">NOTIFICATIONS CENTER</h2>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white">✕</button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 border-b border-white/10 text-[10px]">
          {[
            { id: 'all', label: 'All' },
            { id: 'low_stock', label: 'Low Stock' },
            { id: 'new_order', label: 'New Orders' },
            { id: 'failed_payment', label: 'Payments' },
            { id: 'message', label: 'Messages' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveFilter(t.id as any)}
              className={`px-2.5 py-1 font-bold uppercase tracking-wider rounded transition-all shrink-0 ${
                activeFilter === t.id ? 'bg-[#C7A55B] text-[#111]' : 'bg-[#181818] text-white/60 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {filtered.length === 0 ? (
            <p className="text-xs text-white/50 py-8 text-center">No notifications found.</p>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.linkTab) onNavigateTab(item.linkTab as AdminTab);
                  onClose();
                }}
                className={`p-3 rounded border cursor-pointer transition-all ${
                  item.isRead ? 'bg-[#181818] border-white/5 opacity-70' : 'bg-[#1C1C1C] border-[#C7A55B]/40 hover:border-[#C7A55B]'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="p-1.5 rounded bg-white/10 text-[#C7A55B] shrink-0 mt-0.5">
                    {item.type === 'low_stock' ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> :
                     item.type === 'new_order' ? <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" /> :
                     item.type === 'failed_payment' ? <CreditCard className="w-3.5 h-3.5 text-red-400" /> :
                     <MessageSquare className="w-3.5 h-3.5 text-blue-400" />}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white line-clamp-1">{item.title}</p>
                    <p className="text-[11px] text-white/70 line-clamp-2">{item.message}</p>
                    <p className="text-[9px] text-white/40 mt-1">{item.timestamp}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
          <button
            onClick={onMarkAllRead}
            className="text-[11px] text-[#C7A55B] hover:underline font-bold"
          >
            Mark All as Read
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white/10 text-white text-xs font-bold rounded"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

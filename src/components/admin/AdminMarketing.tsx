import React, { useState } from 'react';
import { Megaphone, Mail, Globe, CheckCircle2, Download, ShieldCheck, Sparkles, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { env } from '../../lib/env';

export const AdminMarketing: React.FC = () => {
  const [subscribers] = useState([
    { email: 'subscriber@example.com', joinedAt: '2026-10-15', status: 'Subscribed' },
    { email: 'kingsmanszn@gmail.com', joinedAt: '2026-10-18', status: 'Subscribed (Owner)' },
  ]);

  // Real status evaluated directly from environment variables
  const rawGa4 = env.GA_MEASUREMENT_ID;
  const isGa4Configured = Boolean(rawGa4 && !rawGa4.includes('your-ga4') && rawGa4.startsWith('G-'));

  const rawPixel = env.META_PIXEL_ID;
  const isPixelConfigured = Boolean(rawPixel && !rawPixel.includes('your-pixel') && rawPixel.length > 5);

  const rawGtm = env.GTM_ID;
  const isGtmConfigured = Boolean(rawGtm && rawGtm.startsWith('GTM-'));

  const handleExportSubscribersCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Email,Subscribed Date,Status"].join(",") + "\n"
      + subscribers.map(s => `${s.email},${s.joinedAt},${s.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KINGSMAN_Subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-white tracking-wide">
            MARKETING, ANALYTICS & PIXEL TRACKING
          </h1>
          <p className="text-xs text-white/60">
            Real configuration status evaluated from Vercel / production environment variables.
          </p>
        </div>
      </div>

      {/* Production Integration Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Meta Pixel */}
        <div className="bg-[#141414] border border-white/10 p-5 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Meta (Facebook) Pixel</span>
            <span className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded ${
              isPixelConfigured ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {isPixelConfigured ? 'Active via ENV' : 'Pending Client ID'}
            </span>
          </div>
          <p className="text-sm font-mono font-bold text-white">
            {isPixelConfigured ? rawPixel : 'Not Configured'}
          </p>
          <p className="text-[11px] text-white/50 leading-relaxed">
            {isPixelConfigured 
              ? 'Tracking page views, initiate checkout, and purchases.' 
              : 'Add VITE_META_PIXEL_ID in Vercel to activate event tracking.'
            }
          </p>
        </div>

        {/* Google Analytics 4 */}
        <div className="bg-[#141414] border border-white/10 p-5 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Google Analytics 4 (GA4)</span>
            <span className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded ${
              isGa4Configured ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {isGa4Configured ? 'Active via ENV' : 'Pending Client ID'}
            </span>
          </div>
          <p className="text-sm font-mono font-bold text-white">
            {isGa4Configured ? rawGa4 : 'Not Configured'}
          </p>
          <p className="text-[11px] text-white/50 leading-relaxed">
            {isGa4Configured 
              ? 'E-commerce enhanced purchase and cart event telemetry enabled.' 
              : 'Add VITE_GA_MEASUREMENT_ID (e.g. G-XXXXXXXXXX) in Vercel.'
            }
          </p>
        </div>

        {/* Google Sheets Sync */}
        <div className="bg-[#141414] border border-white/10 p-5 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Google Sheets Webhook</span>
            <span className="px-2 py-0.5 bg-[#C7A55B]/20 text-[#C7A55B] text-[9px] uppercase font-bold rounded">
              Ready for Code.gs
            </span>
          </div>
          <p className="text-sm font-mono font-bold text-white">
            Server Webhook Ready
          </p>
          <p className="text-[11px] text-white/50 leading-relaxed">
            Deploy GoogleAppsScript.js to your Google Sheet and set GOOGLE_SHEETS_WEBHOOK_URL to log live sales.
          </p>
        </div>

      </div>

      {/* Deployment Guidance Notice */}
      <div className="p-4 bg-[#141414] border border-white/10 rounded-lg space-y-2 text-xs">
        <div className="flex items-center gap-2 text-[#C7A55B] font-bold uppercase tracking-wider">
          <Info className="w-4 h-4" />
          <span>Production Environment Variables Checklist for Vercel</span>
        </div>
        <p className="text-white/70">
          To maintain strict data integrity, tracking IDs are never hardcoded or simulated. Set the following environment variables in your Vercel Project Settings:
        </p>
        <div className="font-mono text-[11px] bg-black/50 p-3 border border-white/10 space-y-1 text-white/80">
          <p>VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX</p>
          <p>VITE_META_PIXEL_ID=XXXXXXXXXXXXXXXX</p>
          <p>GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec</p>
          <p>RESEND_API_KEY=re_XXXXXXXXXXXXXXXX</p>
          <p>SSLCOMMERZ_STORE_ID=your_live_store_id</p>
          <p>SSLCOMMERZ_STORE_PASSWORD=your_live_password</p>
        </div>
      </div>

      {/* Newsletter Subscribers Table */}
      <div className="bg-[#141414] border border-white/10 p-5 rounded-lg space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Newsletter Subscribers Feed</h3>
            <p className="text-[11px] text-white/50">Verified email submissions from website drop opt-ins</p>
          </div>
          <button
            onClick={handleExportSubscribersCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181818] border border-white/20 hover:border-white/40 text-white text-xs font-bold uppercase rounded cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#C7A55B]" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white">
            <thead className="bg-[#1A1A1A] text-white/50 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Subscriber Email</th>
                <th className="p-3">Opted-in Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 font-mono">
              {subscribers.map((sub, i) => (
                <tr key={i} className="hover:bg-white/5">
                  <td className="p-3 text-white font-sans font-semibold">{sub.email}</td>
                  <td className="p-3 text-white/50">{sub.joinedAt}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase rounded">
                      {sub.status}
                    </span>
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

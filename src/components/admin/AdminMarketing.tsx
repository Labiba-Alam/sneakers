import React, { useState } from 'react';
import { Megaphone, Mail, Globe, CheckCircle2, Download, ShieldCheck, Sparkles, Activity } from 'lucide-react';

export const AdminMarketing: React.FC = () => {
  const [subscribers, setSubscribers] = useState([
    { email: 'vip.collector@royal.com', joinedAt: '2026-07-28', status: 'Subscribed' },
    { email: 'alam.labiba003@gmail.com', joinedAt: '2026-08-01', status: 'Subscribed' },
    { email: 'm.sterling@kingsman.royal', joinedAt: '2026-08-04', status: 'Subscribed' }
  ]);

  const [metaPixelActive, setMetaPixelActive] = useState(true);
  const [ga4Active, setGa4Active] = useState(true);
  const [gtmActive, setGtmActive] = useState(true);

  const handleExportSubscribersCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Email,Subscribed Date,Status"].join(",") + "\n"
      + subscribers.map(s => `${s.email},${s.joinedAt},${s.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KINGSMAN_Newsletter_Subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-white tracking-wide">
            MARKETING, TRACKING & SEO HEALTH
          </h1>
          <p className="text-xs text-white/60">
            Manage tracking pixels, Google Tag Manager & email newsletter subscriber feeds.
          </p>
        </div>
      </div>

      {/* Integration Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-[#141414] border border-white/10 p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-white/60 uppercase">Meta Pixel</span>
            <span className={`w-2.5 h-2.5 rounded-full ${metaPixelActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          </div>
          <p className="text-sm font-bold text-white">FB-PIXEL-98234</p>
          <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={metaPixelActive}
              onChange={(e) => setMetaPixelActive(e.target.checked)}
              className="accent-[#C7A55B]"
            />
            <span>Pixel Enabled</span>
          </label>
        </div>

        <div className="bg-[#141414] border border-white/10 p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-white/60 uppercase">Google Analytics 4</span>
            <span className={`w-2.5 h-2.5 rounded-full ${ga4Active ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          </div>
          <p className="text-sm font-bold text-white">G-98402934X</p>
          <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={ga4Active}
              onChange={(e) => setGa4Active(e.target.checked)}
              className="accent-[#C7A55B]"
            />
            <span>GA4 Active</span>
          </label>
        </div>

        <div className="bg-[#141414] border border-white/10 p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-white/60 uppercase">Google Tag Manager</span>
            <span className={`w-2.5 h-2.5 rounded-full ${gtmActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          </div>
          <p className="text-sm font-bold text-white">GTM-KNG8892</p>
          <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={gtmActive}
              onChange={(e) => setGtmActive(e.target.checked)}
              className="accent-[#C7A55B]"
            />
            <span>GTM Active</span>
          </label>
        </div>

        <div className="bg-[#141414] border border-emerald-500/30 p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">SEO Health Score</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-400">98 / 100</p>
          <p className="text-[10px] text-white/50">Lighthouse Green Ready</p>
        </div>

      </div>

      {/* Newsletter Subscribers Table */}
      <div className="bg-[#141414] border border-white/10 p-5 rounded-lg space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Newsletter Subscribers Feed</h3>
            <p className="text-[11px] text-white/50">Opted-in luxury collector emails</p>
          </div>
          <button
            onClick={handleExportSubscribersCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181818] border border-white/20 text-white text-xs font-bold uppercase rounded"
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

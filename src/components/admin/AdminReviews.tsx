import React, { useState } from 'react';
import { Star, CheckCircle, XCircle, MessageSquare, AlertTriangle, ThumbsUp, User } from 'lucide-react';
import { ProductReview } from '../../types';

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<(ProductReview & { status: 'Approved' | 'Pending' | 'Rejected'; adminReply?: string })[]>([
    {
      id: 'rev-1',
      productId: 'p-1',
      author: 'Marcus Sterling',
      rating: 5,
      title: 'Perfection in Italian Leather',
      comment: 'The stitch quality on the Margom soles is unreal. Comfort level is unmatched.',
      date: '2026-07-28',
      verifiedPurchase: true,
      status: 'Approved',
      adminReply: 'Thank you Lord Sterling. We are honoured to serve your silhouette collection.'
    },
    {
      id: 'rev-2',
      productId: 'p-2',
      author: 'Sadia R.',
      rating: 5,
      title: 'Fast Delivery in Dhaka!',
      comment: 'Received the box in Gulshan in under 24 hours. The luxury unboxing experience is top notch.',
      date: '2026-08-01',
      verifiedPurchase: true,
      status: 'Approved'
    },
    {
      id: 'rev-3',
      productId: 'p-3',
      author: 'Anonymous Guest',
      rating: 2,
      title: 'Wrong size delivered',
      comment: 'I requested size 42 but received 41.',
      date: '2026-08-04',
      verifiedPurchase: false,
      status: 'Pending'
    }
  ]);

  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleApprove = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
  };

  const handleReject = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
  };

  const handleSendReply = (id: string) => {
    if (!replyText.trim()) return;
    setReviews(reviews.map(r => r.id === id ? { ...r, adminReply: replyText } : r));
    setReplyingReviewId(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-white tracking-wide">
            CUSTOMER REVIEWS & FEEDBACK
          </h1>
          <p className="text-xs text-white/60">
            Moderate customer testimonials, verify purchases & dispatch official responses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#141414] border border-white/10 p-4 rounded-lg">
          <p className="text-[10px] text-white/50 uppercase font-bold">Average Satisfaction</p>
          <p className="text-2xl font-bold font-mono text-emerald-400 mt-1 flex items-center gap-2">
            <span>4.9 / 5.0</span>
            <Star className="w-5 h-5 fill-[#C7A55B] text-[#C7A55B]" />
          </p>
        </div>
        <div className="bg-[#141414] border border-white/10 p-4 rounded-lg">
          <p className="text-[10px] text-white/50 uppercase font-bold">Total Reviews</p>
          <p className="text-2xl font-bold font-mono text-white mt-1">{reviews.length}</p>
        </div>
        <div className="bg-[#141414] border border-white/10 p-4 rounded-lg">
          <p className="text-[10px] text-white/50 uppercase font-bold">Verified Purchases</p>
          <p className="text-2xl font-bold font-mono text-[#C7A55B] mt-1">94%</p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-[#141414] border border-white/10 p-5 rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{rev.author}</span>
                  {rev.verifiedPurchase && (
                    <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold uppercase rounded">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 my-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-[#C7A55B] text-[#C7A55B]' : 'text-white/20'}`} />
                  ))}
                  <span className="text-[10px] text-white/50 ml-2">{rev.date}</span>
                </div>
              </div>

              <span className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase ${
                rev.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' :
                rev.status === 'Rejected' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {rev.status}
              </span>
            </div>

            <p className="text-xs text-white/90 font-semibold">{rev.title}</p>
            <p className="text-xs text-white/70 italic">"{rev.comment}"</p>

            {rev.adminReply && (
              <div className="p-3 bg-[#1A1A1A] border-l-2 border-[#C7A55B] text-xs space-y-1">
                <p className="text-[10px] font-bold uppercase text-[#C7A55B]">Official Atelier Reply</p>
                <p className="text-white/80">{rev.adminReply}</p>
              </div>
            )}

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(rev.id)}
                  className="px-3 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded font-bold"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(rev.id)}
                  className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded font-bold"
                >
                  Reject
                </button>
              </div>

              <button
                onClick={() => setReplyingReviewId(rev.id)}
                className="text-[#C7A55B] hover:underline font-bold flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
            </div>

            {replyingReviewId === rev.id && (
              <div className="pt-3 space-y-2">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type official atelier response..."
                  className="w-full px-3 py-2 bg-[#181818] border border-white/20 text-white text-xs rounded"
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setReplyingReviewId(null)} className="px-3 py-1 bg-white/10 text-white text-xs font-bold rounded">
                    Cancel
                  </button>
                  <button onClick={() => handleSendReply(rev.id)} className="px-4 py-1 bg-[#C7A55B] text-[#111] text-xs font-bold rounded">
                    Publish Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

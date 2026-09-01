import React, { useState } from 'react';
import { INITIAL_REVIEWS } from '../data/reviews';
import { Star, CheckCircle2, Crown, MessageSquarePlus } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ReviewsSection: React.FC = () => {
  const { showToast } = useStore();
  const [reviewsList, setReviewsList] = useState(INITIAL_REVIEWS);
  const [showAddReview, setShowAddReview] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [rating, setRating] = useState(5);

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewComment.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      productId: 'kng-001',
      author: authorName,
      rating,
      title: reviewTitle || 'Royal Excellence',
      comment: reviewComment,
      date: 'Just Now',
      verifiedPurchase: true,
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };

    setReviewsList([newRev, ...reviewsList]);
    setShowAddReview(false);
    showToast('Your review has been submitted to the Royal Archives!');
    setAuthorName('');
    setReviewTitle('');
    setReviewComment('');
  };

  return (
    <section className="py-24 bg-[#F8F8F8] border-t border-b border-[#111111]/10 text-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 text-[#C1121F] text-xs font-bold uppercase tracking-[0.2em] mb-2">
              <Crown className="w-4 h-4 text-[#C7A55B]" />
              <span>Verified Buyer Testimonials</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#111111]">
              WHAT THE ROYALTY SAY
            </h2>
          </div>

          <button
            onClick={() => setShowAddReview(!showAddReview)}
            className="px-6 py-3 bg-[#111111] hover:bg-[#C1121F] text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 self-start md:self-auto transition-colors"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#C7A55B]" />
            <span>Write Royal Review</span>
          </button>
        </div>

        {/* Add Review Form */}
        {showAddReview && (
          <form onSubmit={handleAddReviewSubmit} className="bg-white border border-[#C7A55B] p-6 mb-12 space-y-4 max-w-2xl mx-auto shadow-2xl">
            <h3 className="font-serif-luxury text-xl font-bold text-[#111111]">Share Your KINGSMAN Experience</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-[#111111]/80 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lord Sterling"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F3F3F3] border border-[#111111]/20 text-[#111111] text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#111111]/80 block mb-1">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#F3F3F3] border border-[#111111]/20 text-[#111111] text-xs focus:outline-none"
                >
                  <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                  <option value={4}>★★★★☆ (4 Stars - Great)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Good)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#111111]/80 block mb-1">Review Headline</label>
              <input
                type="text"
                placeholder="e.g. Pure luxury craftsmanship"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#F3F3F3] border border-[#111111]/20 text-[#111111] text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#111111]/80 block mb-1">Detailed Feedback</label>
              <textarea
                rows={3}
                required
                placeholder="Describe fit, leather feel, packaging, or compliments received..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3 py-2 bg-[#F3F3F3] border border-[#111111]/20 text-[#111111] text-xs focus:outline-none"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowAddReview(false)}
                className="px-4 py-2 bg-black/10 text-[#111111] text-xs font-bold uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#C1121F] text-white text-xs font-bold uppercase tracking-wider"
              >
                Submit Review
              </button>
            </div>
          </form>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviewsList.map(rev => (
            <div key={rev.id} className="bg-white border border-[#111111]/10 p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={rev.userAvatar} alt={rev.author} referrerPolicy="no-referrer" className="w-10 h-10 rounded-full object-cover border border-[#C7A55B]" />
                  <div>
                    <h4 className="font-serif-luxury text-base font-bold text-[#111111]">{rev.author}</h4>
                    <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified Royal Buyer
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[#C7A55B]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C7A55B]" />
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-serif-luxury text-sm font-bold text-[#111111] mb-1">"{rev.title}"</h5>
                <p className="text-xs text-[#111111]/70 font-normal leading-relaxed">{rev.comment}</p>
              </div>

              {rev.userPhotos && rev.userPhotos.length > 0 && (
                <div className="flex gap-2 pt-2">
                  {rev.userPhotos.map((photo, i) => (
                    <img key={i} src={photo} alt="User submission" referrerPolicy="no-referrer" className="w-16 h-16 object-cover border border-[#111111]/10" />
                  ))}
                </div>
              )}

              <p className="text-[10px] text-[#111111]/40 pt-2 border-t border-[#111111]/10 font-semibold">{rev.date}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { Product, ProductReview, ProductQA } from '../../types';
import { Star, ThumbsUp, CheckCircle, MessageSquare, Send, Image as ImageIcon, Sparkles, User, ShieldCheck } from 'lucide-react';

interface ProductReviewsSectionProps {
  product: Product;
}

const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: 'rev-01',
    productId: 'kng-001',
    author: 'Tanvir Hossain',
    rating: 5,
    title: 'The leather smell and finish is out of this world!',
    comment: 'Ordered from Dhaka Gulshan. Received in 24 hours in a stunning mahogany presentation box. The 24K gold eyelets have a heavy weight. Comfort on Vibram sole is 10/10.',
    date: 'August 2, 2026',
    verifiedPurchase: true,
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    userPhotos: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=300'
    ],
    likes: 24
  },
  {
    id: 'rev-02',
    productId: 'kng-001',
    author: 'Samiul Islam',
    rating: 5,
    title: 'Worth every single Taka. Pure luxury.',
    comment: 'The AI Size Advisor recommended EU 42 and it fits like a glove. I was skeptical about ordering online, but Cash on Delivery made it risk-free.',
    date: 'July 28, 2026',
    verifiedPurchase: true,
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    likes: 18
  },
  {
    id: 'rev-03',
    productId: 'kng-001',
    author: 'Nabila Rahman',
    rating: 5,
    title: 'Bought as a wedding gift for my husband!',
    comment: 'He was stunned! The craftsmanship details on the heel and tongue are exquisite. Thank you KINGSMAN Dhaka team for the express delivery.',
    date: 'July 15, 2026',
    verifiedPurchase: true,
    likes: 12
  }
];

const INITIAL_QA: ProductQA[] = [
  {
    id: 'qa-01',
    productId: 'kng-001',
    question: 'Is Cash on Delivery available for Chittagong delivery?',
    askedBy: 'Zubair Ahmed',
    askedDate: 'August 1, 2026',
    answer: 'Yes! We offer 100% Cash on Delivery across all 64 districts in Bangladesh including Chittagong, Sylhet, and Rajshahi. You can inspect the box before making payment to the courier.',
    answeredBy: 'KINGSMAN Concierge',
    answeredDate: 'August 1, 2026',
    likes: 15
  },
  {
    id: 'qa-02',
    productId: 'kng-001',
    question: 'How do I care for the Tuscan calfskin upper in Bangladesh monsoon weather?',
    askedBy: 'Farhan Masud',
    askedDate: 'July 20, 2026',
    answer: 'Every pair includes a complimentary jar of KINGSMAN Tuscan Organic Beeswax Conditioner. Apply lightly once a month to create a natural waterproof protective barrier.',
    answeredBy: 'KINGSMAN Master Cordwainer',
    answeredDate: 'July 21, 2026',
    likes: 9
  }
];

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'qa'>('reviews');
  const [reviews, setReviews] = useState<ProductReview[]>(INITIAL_REVIEWS);
  const [qaList, setQaList] = useState<ProductQA[]>(INITIAL_QA);
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');

  // New Review Form Modal State
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
    title: '',
    comment: ''
  });

  // New Question Form
  const [newQuestion, setNewQuestion] = useState('');
  const [askerName, setAskerName] = useState('');

  const handleLikeReview = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, likes: (r.likes || 0) + 1 } : r));
  };

  const handleLikeQA = (id: string) => {
    setQaList(prev => prev.map(q => q.id === id ? { ...q, likes: (q.likes || 0) + 1 } : q));
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.author || !newReview.comment) return;

    const added: ProductReview = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      author: newReview.author,
      rating: newReview.rating,
      title: newReview.title || 'Exceptional Footwear',
      comment: newReview.comment,
      date: 'Just now',
      verifiedPurchase: true,
      likes: 1
    };

    setReviews([added, ...reviews]);
    setIsWriteReviewOpen(false);
    setNewReview({ author: '', rating: 5, title: '', comment: '' });
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion || !askerName) return;

    const added: ProductQA = {
      id: `qa-${Date.now()}`,
      productId: product.id,
      question: newQuestion,
      askedBy: askerName,
      askedDate: 'Just now',
      answer: 'Thank you for your inquiry. KINGSMAN Royal Concierge will answer shortly.',
      answeredBy: 'KINGSMAN Concierge',
      answeredDate: 'Pending',
      likes: 0
    };

    setQaList([added, ...qaList]);
    setNewQuestion('');
    setAskerName('');
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    return b.id.localeCompare(a.id);
  });

  return (
    <section id="reviews-section" className="py-12 border-t border-white/10 bg-[#0E0E0E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[#C7A55B] text-xs font-bold uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4 text-[#C7A55B]" />
              <span>Royal Verification & Feedback</span>
            </div>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
              CLIENT TESTIMONIALS & INQUIRIES
            </h3>
          </div>

          {/* Sub-Tab Navigation */}
          <div className="flex items-center border border-white/15 p-1 bg-[#141414]">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'reviews' ? 'bg-[#C1121F] text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab('qa')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'qa' ? 'bg-[#C1121F] text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              Q&A Concierge ({qaList.length})
            </button>
          </div>
        </div>

        {activeTab === 'reviews' ? (
          <div>
            {/* Rating Breakdown Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#141414] border border-white/10 p-6 sm:p-8 mb-8 items-center">
              
              {/* Score Box */}
              <div className="lg:col-span-4 text-center border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
                <span className="font-serif-luxury text-5xl font-black text-white block mb-1">
                  {product.rating.toFixed(1)}
                </span>
                <div className="flex justify-center gap-1 text-[#C7A55B] mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#C7A55B]" />
                  ))}
                </div>
                <p className="text-xs text-white/60 font-light">
                  Based on {product.reviewCount} verified client purchases
                </p>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-2">
                  ✓ 99.4% Client Satisfaction Score
                </p>
              </div>

              {/* Progress Bar Distribution */}
              <div className="lg:col-span-5 space-y-2">
                {[
                  { star: 5, count: 88, pct: 88 },
                  { star: 4, count: 10, pct: 10 },
                  { star: 3, count: 2, pct: 2 },
                  { star: 2, count: 0, pct: 0 },
                  { star: 1, count: 0, pct: 0 }
                ].map(item => (
                  <div key={item.star} className="flex items-center gap-3 text-xs">
                    <span className="w-12 text-white/60 font-bold">{item.star} Stars</span>
                    <div className="flex-1 h-2 bg-white/10 overflow-hidden">
                      <div className="h-full bg-[#C7A55B]" style={{ width: `${item.pct}%` }} />
                    </div>
                    <span className="w-8 text-right font-mono text-white/50">{item.pct}%</span>
                  </div>
                ))}
              </div>

              {/* Write Review Call-to-Action */}
              <div className="lg:col-span-3 text-center lg:text-right border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8">
                <h5 className="font-serif-luxury text-sm font-bold text-white mb-2">
                  Own this Pair?
                </h5>
                <p className="text-xs text-white/60 mb-4 font-light">
                  Share your experience with the Atelier community.
                </p>
                <button
                  onClick={() => setIsWriteReviewOpen(true)}
                  className="px-5 py-2.5 bg-[#C7A55B] hover:bg-[#b08e48] text-black text-xs font-black uppercase tracking-wider transition-colors shadow-lg"
                >
                  Write Client Review
                </button>
              </div>

            </div>

            {/* Review Controls: Filter & Sort */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <span className="text-xs uppercase tracking-widest text-white/60 font-bold">
                Showing {sortedReviews.length} Client Testimonials
              </span>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-white/40 font-semibold">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#181818] border border-white/15 text-white px-3 py-1.5 focus:outline-none focus:border-[#C1121F]"
                >
                  <option value="newest">Newest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </select>
              </div>
            </div>

            {/* Review Cards List */}
            <div className="space-y-4">
              {sortedReviews.map(rev => (
                <div key={rev.id} className="bg-[#141414] border border-white/10 p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {rev.userAvatar ? (
                        <img src={rev.userAvatar} alt={rev.author} className="w-10 h-10 rounded-full object-cover border border-[#C7A55B]" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#222] border border-white/20 flex items-center justify-center text-white font-bold text-xs">
                          {rev.author.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-sm text-white">{rev.author}</h5>
                          {rev.verifiedPurchase && (
                            <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-emerald-400" />
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-white/40 font-mono">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex gap-0.5 text-[#C7A55B]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#C7A55B]" />
                      ))}
                    </div>
                  </div>

                  <h4 className="font-serif-luxury text-base font-bold text-white">
                    "{rev.title}"
                  </h4>

                  <p className="text-xs text-white/80 leading-relaxed font-light">
                    {rev.comment}
                  </p>

                  {/* Photo attachments */}
                  {rev.userPhotos && rev.userPhotos.length > 0 && (
                    <div className="flex gap-2 pt-2">
                      {rev.userPhotos.map((photo, i) => (
                        <img key={i} src={photo} alt="Customer upload" className="w-16 h-16 object-cover border border-white/20" />
                      ))}
                    </div>
                  )}

                  {/* Helpful Button */}
                  <div className="pt-2 flex items-center justify-between text-xs text-white/40 border-t border-white/5">
                    <span>Was this review helpful to your selection?</span>
                    <button
                      onClick={() => handleLikeReview(rev.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-[#C7A55B]" />
                      <span>Helpful ({rev.likes || 0})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Write Review Modal */}
            {isWriteReviewOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <div className="bg-[#141414] border border-[#C7A55B] p-6 max-w-lg w-full text-white">
                  <h3 className="font-serif-luxury text-xl font-bold mb-4">Write a Client Review</h3>
                  <form onSubmit={handleAddReview} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-white/60 mb-1 font-bold">Your Name</label>
                      <input
                        type="text"
                        required
                        value={newReview.author}
                        onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                        placeholder="e.g. Asif Chowdhury"
                        className="w-full px-3 py-2 bg-[#1E1E1E] border border-white/15 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 mb-1 font-bold">Rating</label>
                      <select
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-[#1E1E1E] border border-white/15 text-white"
                      >
                        <option value={5}>5 Stars - Perfection</option>
                        <option value={4}>4 Stars - Very Good</option>
                        <option value={3}>3 Stars - Average</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/60 mb-1 font-bold">Review Title</label>
                      <input
                        type="text"
                        value={newReview.title}
                        onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                        placeholder="Headline summary"
                        className="w-full px-3 py-2 bg-[#1E1E1E] border border-white/15 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 mb-1 font-bold">Your Review</label>
                      <textarea
                        rows={4}
                        required
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        placeholder="Describe leather feel, sizing, and delivery..."
                        className="w-full px-3 py-2 bg-[#1E1E1E] border border-white/15 text-white"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsWriteReviewOpen(false)}
                        className="w-1/2 py-2.5 bg-white/5 border border-white/10 text-white font-bold uppercase"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 py-2.5 bg-[#C1121F] text-white font-bold uppercase"
                      >
                        Submit Review
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Q&A Concierge Tab */
          <div className="space-y-6">
            
            {/* Ask Question Form */}
            <form onSubmit={handleAskQuestion} className="bg-[#141414] border border-white/10 p-6 space-y-4">
              <h4 className="font-serif-luxury text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#C7A55B]" />
                Ask KINGSMAN Royal Concierge
              </h4>
              <p className="text-xs text-white/60 font-light">
                Have a query regarding sizing, custom leather care, or delivery? Ask directly.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <input
                  type="text"
                  required
                  value={askerName}
                  onChange={(e) => setAskerName(e.target.value)}
                  placeholder="Your Full Name"
                  className="px-4 py-2.5 bg-[#1C1C1C] border border-white/15 text-white focus:outline-none focus:border-[#C7A55B]"
                />
                <input
                  type="text"
                  required
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Type your question here..."
                  className="px-4 py-2.5 bg-[#1C1C1C] border border-white/15 text-white focus:outline-none focus:border-[#C7A55B]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#C1121F] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>

            {/* Answered Q&A Cards */}
            <div className="space-y-4">
              {qaList.map(item => (
                <div key={item.id} className="bg-[#141414] border border-white/10 p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="px-2 py-1 bg-[#C7A55B] text-black text-[10px] font-black uppercase shrink-0">
                      Q
                    </span>
                    <div>
                      <h5 className="font-bold text-sm text-white">{item.question}</h5>
                      <p className="text-[10px] text-white/40 font-mono">Asked by {item.askedBy} • {item.askedDate}</p>
                    </div>
                  </div>

                  {item.answer && (
                    <div className="bg-[#181818] border-l-2 border-[#C7A55B] p-4 ml-6 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#C7A55B]">
                        <ShieldCheck className="w-4 h-4 text-[#C7A55B]" />
                        <span>{item.answeredBy}</span>
                      </div>
                      <p className="text-xs text-white/80 font-light leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 text-right">
                    <button
                      onClick={() => handleLikeQA(item.id)}
                      className="text-[11px] text-white/50 hover:text-white inline-flex items-center gap-1"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-[#C7A55B]" />
                      <span>Helpful ({item.likes || 0})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </section>
  );
};

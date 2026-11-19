import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  ShoppingCart,
  Heart,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Send,
  User,
  ExternalLink,
  Code2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function ProductDetailModal({ product, onClose }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details'); // details | reviews | discussion
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const hasDiscount = product.discount_percentage > 0;
  const effectivePrice = hasDiscount
    ? Number((product.price * (1 - product.discount_percentage / 100)).toFixed(2))
    : product.price;

  // Load reviews and peer messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodData = await api.getProductById(product.id);
        if (prodData?.reviews) setReviews(prodData.reviews);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      }

      if (isAuthenticated) {
        try {
          const msgData = await api.getMessages(product.id);
          if (msgData?.messages) setMessages(msgData.messages);
        } catch (err) {
          console.error('Failed to load thread messages:', err);
        }
      }
    };
    fetchData();
  }, [product.id, isAuthenticated]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !isAuthenticated) return;
    setSendingMessage(true);
    try {
      const res = await api.sendMessage({
        reference_id: product.id,
        receiver_id: product.creator_id,
        message_text: newMessage.trim()
      });
      if (res?.success) {
        setMessages((prev) => [...prev, res.data]);
        setNewMessage('');
      }
    } catch (err) {
      alert(err.message || 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    setSubmittingReview(true);
    try {
      const res = await api.addReview(product.id, {
        rating: Number(newRating),
        comment: newComment.trim()
      });
      if (res?.success) {
        setReviews((prev) => [res.review, ...prev]);
        setNewComment('');
        alert('Review submitted successfully!');
      }
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-fade-in border border-slate-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-mnb-600 bg-mnb-50 px-2 py-0.5 rounded">
              {product.category}
            </span>
            <span className="text-xs font-mono text-slate-400">SKU: {product.sku || 'MNB-STORE'}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Product Image */}
            <div className="space-y-4">
              <div className="h-80 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/60 relative">
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {hasDiscount && (
                  <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-md shadow">
                    SAVE {product.discount_percentage}%
                  </span>
                )}
              </div>

              {/* Value Assurance Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <Truck className="w-4 h-4 text-mnb-600 flex-shrink-0" />
                  <span>2-Day Express Dispatch</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>1-Year Hardware Warranty</span>
                </div>
              </div>
            </div>

            {/* Right: Info & Pricing */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 leading-snug">{product.title}</h2>

                {/* Rating & Region */}
                <div className="flex items-center gap-3 my-2.5 text-xs">
                  <div className="flex items-center text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="ml-1 font-bold text-slate-800">{product.rating || '5.0'}</span>
                    <span className="text-slate-400 ml-1">({reviews.length || product.review_count} reviews)</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 font-mono">Region: {product.region_tag || 'Global'}</span>
                </div>

                {/* Pricing Box */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-slate-900">${effectivePrice}</span>
                    {hasDiscount && (
                      <span className="text-base text-slate-400 line-through">${product.price}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Standard sales tax (8%) calculated at simulated checkout.
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Stock Indicator & Cart Actions */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500">Availability:</span>
                  {product.stock_quantity <= 5 ? (
                    <span className="text-amber-600 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Low Stock ({product.stock_quantity} left)
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready to Dispatch ({product.stock_quantity} in stock)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-200 transition-colors font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-2 text-sm font-bold text-slate-900 min-w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-200 transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => {
                      addToCart(product, quantity);
                      onClose();
                    }}
                    disabled={product.stock_quantity <= 0}
                    className="flex-1 bg-mnb-600 hover:bg-mnb-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart (${(effectivePrice * quantity).toFixed(2)})</span>
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'text-rose-500 fill-rose-500' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Seller / Contributor Tech-Stack Section */}
          <div className="bg-gradient-to-r from-slate-50 to-indigo-50/30 rounded-xl p-4 border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-mnb-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                  {product.creator_name?.[0] || 'V'}
                </div>
                <div>
                  <p className="text-xs text-slate-500">Product Creator / Vendor</p>
                  <p className="text-sm font-bold text-slate-900">{product.creator_name || 'MNB Verified Vendor'}</p>
                </div>
              </div>
              {product.creator_portfolio && (
                <a
                  href={product.creator_portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-mnb-600 hover:text-mnb-700 flex items-center gap-1"
                >
                  Portfolio <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {product.creator_tech_stack && product.creator_tech_stack.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                  <Code2 className="w-3 h-3" /> Tech Stack:
                </span>
                {product.creator_tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="bg-white text-slate-700 border border-slate-200 text-[10px] font-mono px-2 py-0.5 rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Tab Navigation: Reviews vs Peer Discussion */}
          <div className="border-b border-slate-200">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === 'details' ? 'border-mnb-600 text-mnb-600' : 'border-transparent text-slate-500'
                }`}
              >
                Customer Reviews ({reviews.length})
              </button>
              <button
                onClick={() => setActiveTab('discussion')}
                className={`pb-2 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'discussion' ? 'border-mnb-600 text-mnb-600' : 'border-transparent text-slate-500'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Peer Discussion & Ask Seller ({messages.length})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'details' ? (
            <div className="space-y-4">
              {/* Add Review Form */}
              {isAuthenticated ? (
                <form onSubmit={handleAddReview} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Leave a Verified Review</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600">Your Rating:</span>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(e.target.value)}
                      className="text-xs bg-white border border-slate-300 rounded px-2 py-1 outline-none"
                    >
                      <option value="5">5 ★★★★★ (Exceptional)</option>
                      <option value="4">4 ★★★★☆ (Good)</option>
                      <option value="3">3 ★★★☆☆ (Average)</option>
                      <option value="2">2 ★★☆☆☆ (Below Average)</option>
                      <option value="1">1 ★☆☆☆☆ (Poor)</option>
                    </select>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Write your feedback regarding developer ergonomics, hardware build quality, etc..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 outline-none focus:border-mnb-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Customer Review'}
                  </button>
                </form>
              ) : (
                <p className="text-xs text-slate-500 italic">Sign in to leave a review for this product.</p>
              )}

              {/* Reviews List */}
              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <p className="text-xs text-slate-400">No customer reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{rev.user_name}</span>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* Peer Discussion Thread */
            <div className="space-y-4">
              <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
                {messages.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">
                    No peer questions yet. Ask the seller about compatibility, shipping, or technical specs!
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          <User className="w-3 h-3 text-mnb-600" />
                          {msg.sender_name}
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-1 rounded uppercase font-mono">
                            {msg.sender_role}
                          </span>
                        </span>
                        <span className="text-[10px]">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-700">{msg.message_text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input Form */}
              {isAuthenticated ? (
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask seller or discuss with peers (e.g., driver support, accessories)..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 outline-none focus:border-mnb-500"
                  />
                  <button
                    type="submit"
                    disabled={sendingMessage || !newMessage.trim()}
                    className="bg-mnb-600 hover:bg-mnb-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              ) : (
                <p className="text-xs text-slate-500 italic">Sign in to participate in the peer discussion thread.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

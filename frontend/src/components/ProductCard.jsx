import React from 'react';
import { Star, ShoppingCart, Heart, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onSelectProduct }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const isWishlisted = isInWishlist(product.id);

  const hasDiscount = product.discount_percentage > 0;
  const effectivePrice = hasDiscount
    ? Number((product.price * (1 - product.discount_percentage / 100)).toFixed(2))
    : product.price;

  const isLowStock = product.stock_quantity <= 5;
  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Badges: Discount & Region */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
        {hasDiscount && (
          <span className="bg-rose-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
            -{product.discount_percentage}% OFF
          </span>
        )}
        {product.is_promotional === 1 && !hasDiscount && (
          <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider">
            FEATURED
          </span>
        )}
        <span className="bg-slate-900/80 backdrop-blur text-slate-200 text-[10px] font-mono px-1.5 py-0.5 rounded">
          {product.region_tag || 'Global'}
        </span>
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        aria-label="Wishlist"
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur text-slate-400 hover:text-rose-600 shadow-md transition-all hover:scale-110"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'text-rose-500 fill-rose-500' : ''}`} />
      </button>

      {/* Product Image */}
      <div
        onClick={() => onSelectProduct(product)}
        className="h-48 w-full bg-slate-100 relative overflow-hidden cursor-pointer"
      >
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />

        {/* Quick View Hover Pill */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/30">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="bg-white/95 text-slate-900 text-xs font-bold px-3.5 py-2 rounded-lg shadow-lg flex items-center gap-1.5 hover:bg-white transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & SKU */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
            <span className="text-mnb-600 font-semibold">{product.category}</span>
            <span>{product.sku || 'SKU-MNB'}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="text-sm font-bold text-slate-900 group-hover:text-mnb-600 transition-colors line-clamp-2 cursor-pointer leading-snug mb-2"
          >
            {product.title}
          </h3>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-700">{product.rating ? Number(product.rating).toFixed(1) : '5.0'}</span>
            <span className="text-[11px] text-slate-400">({product.review_count || 0})</span>
          </div>
        </div>

        {/* Stock Status & Pricing */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-2">
            {isOutOfStock ? (
              <span className="text-rose-600 font-semibold flex items-center gap-1 text-[11px]">
                <AlertCircle className="w-3.5 h-3.5" /> Out of stock
              </span>
            ) : isLowStock ? (
              <span className="text-amber-600 font-semibold flex items-center gap-1 text-[11px] animate-pulse">
                <AlertCircle className="w-3.5 h-3.5" /> Only {product.stock_quantity} left in stock!
              </span>
            ) : (
              <span className="text-emerald-600 font-semibold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> In stock ({product.stock_quantity})
              </span>
            )}
          </div>

          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-slate-900">${effectivePrice}</span>
                {hasDiscount && (
                  <span className="text-xs text-slate-400 line-through">${product.price}</span>
                )}
              </div>
            </div>

            <button
              onClick={() => addToCart(product, 1)}
              disabled={isOutOfStock}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-mnb-600 hover:bg-mnb-700 text-white hover:shadow-mnb-600/30'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

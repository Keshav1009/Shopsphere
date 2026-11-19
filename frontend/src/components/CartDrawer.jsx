import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartDrawer({ onProceedToCheckout, onOpenAuth }) {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, subtotal, tax, total, cartCount } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-fade-in">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-mnb-600" />
              <h2 className="text-lg font-bold text-slate-900">Shopping Cart</h2>
              <span className="text-xs font-semibold bg-mnb-100 text-mnb-800 px-2 py-0.5 rounded-full">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-semibold text-slate-700">Your cart is currently empty</p>
                <p className="text-xs text-slate-400 max-w-xs">
                  Explore developer hardware, software productivity utilities, and MNB merchandise to fill your cart.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 text-xs font-bold text-mnb-600 hover:text-mnb-700"
                >
                  Continue Browsing Catalog →
                </button>
              </div>
            ) : (
              cart.map(({ product, quantity }) => {
                const effectivePrice = product.discount_percentage > 0
                  ? Number((product.price * (1 - product.discount_percentage / 100)).toFixed(2))
                  : product.price;

                return (
                  <div key={product.id} className="py-4 flex gap-4 items-center">
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-100 flex-shrink-0 border border-slate-200"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-slate-400 truncate">{product.sku}</p>
                      <h4 className="text-sm font-bold text-slate-900 truncate">{product.title}</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        ${effectivePrice} each
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 text-xs font-bold">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="px-2 py-0.5 hover:bg-slate-200 text-slate-600"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 min-w-6 text-center text-slate-900">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            disabled={quantity >= product.stock_quantity}
                            className="px-2 py-0.5 hover:bg-slate-200 text-slate-600 disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs font-black text-slate-900 ml-auto">
                          ${(effectivePrice * quantity).toFixed(2)}
                        </span>

                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Financial Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">${subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Simulated Tax (8% VAT/GST)</span>
                  <span className="font-semibold text-slate-900">${tax}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Standard Shipping</span>
                  <span className="text-emerald-600 font-bold uppercase text-[10px]">Free Intern Dispatch</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-black text-slate-900">
                  <span>Total Due</span>
                  <span className="text-mnb-600">${total}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      onProceedToCheckout();
                    }}
                    className="w-full bg-mnb-600 hover:bg-mnb-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-mnb-600/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Proceed to Simulated Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-xs"
                  >
                    Sign In to Checkout
                  </button>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Simulated Sandbox Payment
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-rose-500 hover:underline font-semibold"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

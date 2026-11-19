import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Building,
  Printer
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function CheckoutModal({ isOpen, onClose, onOrderCompleted }) {
  const { cart, subtotal, tax, total, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [shippingAddress, setShippingAddress] = useState(
    'Room 402, Block A, MNB Soft Solutions Cyber Hub, Sector 62, Noida, India'
  );
  const [region, setRegion] = useState(user?.region || 'North America');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');
  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isOpen) return null;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const payload = {
        items: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity
        })),
        shipping_address: shippingAddress,
        region,
        payment_method: paymentMethod
      };

      const res = await api.createOrder(payload);
      if (res?.success) {
        setCompletedOrder(res.order);
        clearCart();
        setStep(3); // Go to confirmation
        if (onOrderCompleted) onOrderCompleted(res.order);
      }
    } catch (err) {
      alert(err.message || 'Checkout failed. Please check stock and details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col border border-slate-200 animate-fade-in">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {step === 3 ? 'Order Confirmed!' : 'Simulated Secure Checkout'}
            </h3>
            <p className="text-xs text-slate-500 font-mono">BCA-311 MNB Storefront Payment Simulator</p>
          </div>
          {step !== 3 && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Indicator */}
        {step !== 3 && (
          <div className="grid grid-cols-2 text-center text-xs border-b border-slate-100 bg-slate-50/30">
            <div className={`py-2.5 font-bold border-b-2 flex items-center justify-center gap-1.5 ${
              step === 1 ? 'border-mnb-600 text-mnb-600 bg-white' : 'border-transparent text-slate-400'
            }`}>
              <Truck className="w-4 h-4" /> 1. Shipping Details
            </div>
            <div className={`py-2.5 font-bold border-b-2 flex items-center justify-center gap-1.5 ${
              step === 2 ? 'border-mnb-600 text-mnb-600 bg-white' : 'border-transparent text-slate-400'
            }`}>
              <CreditCard className="w-4 h-4" /> 2. Payment Gateway
            </div>
          </div>
        )}

        {/* Step 1: Shipping Address */}
        {step === 1 && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Customer Name & Email
              </label>
              <input
                type="text"
                disabled
                value={`${user?.name} (${user?.email})`}
                className="w-full bg-slate-100 text-slate-600 text-xs px-3 py-2 rounded-lg border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Shipping Destination Region
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-white text-xs px-3 py-2.5 rounded-lg border border-slate-300 outline-none focus:border-mnb-500"
              >
                <option value="North America">North America (US & Canada)</option>
                <option value="Europe">Europe (UK, DE, FR)</option>
                <option value="Asia">Asia (India, SG, JP)</option>
                <option value="Global">Global / International</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Physical Shipping Address
              </label>
              <textarea
                rows={3}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter complete office/residence delivery address..."
                className="w-full text-xs p-3 rounded-lg border border-slate-300 outline-none focus:border-mnb-500"
                required
              />
            </div>

            {/* Order Summary Box */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs space-y-1">
              <div className="flex justify-between font-medium text-slate-600">
                <span>Items Subtotal ({cart.length} types)</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between font-medium text-slate-600">
                <span>Tax (8%)</span>
                <span>${tax}</span>
              </div>
              <div className="flex justify-between font-black text-slate-900 border-t border-slate-200 pt-1 text-sm">
                <span>Total Amount Due</span>
                <span className="text-mnb-600">${total}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!shippingAddress.trim()}
                className="bg-mnb-600 hover:bg-mnb-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow flex items-center gap-2 transition-all"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Simulated Payment Gateway */}
        {step === 2 && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900">
              <Lock className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span>Simulated Payment Gateway: Pre-filled sandbox credentials ready for 1-click test checkout.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Payment Mode
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['Credit Card', 'UPI / QR', 'Net Banking'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMethod(mode)}
                    className={`py-2 px-3 rounded-lg border font-semibold text-center transition-all ${
                      paymentMethod === mode
                        ? 'bg-mnb-50 border-mnb-600 text-mnb-700 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === 'Credit Card' ? (
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-white text-xs font-mono px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full bg-white text-xs font-mono px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full bg-white text-xs font-mono px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                <Building className="w-8 h-8 text-mnb-600 mx-auto" />
                <p className="text-xs font-bold text-slate-800">Simulated {paymentMethod}</p>
                <p className="text-[11px] text-slate-500">
                  Instant authorization sandbox. Click authorize to complete order.
                </p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Address
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{loading ? 'Processing Order...' : `Authorize & Pay $${total}`}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation & Invoice Prompt */}
        {step === 3 && completedOrder && (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-xl font-black text-slate-900">Simulated Payment Successful!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Your order has been recorded into the database and inventory has been automatically updated.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-bold text-slate-900">{completedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Charged:</span>
                <span className="font-bold text-slate-900">${completedOrder.total_amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded text-[10px]">
                  {completedOrder.order_status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <span className="text-slate-700 truncate max-w-xs">{completedOrder.shipping_address}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={onClose}
                className="bg-slate-900 text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
              >
                Return to Storefront
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

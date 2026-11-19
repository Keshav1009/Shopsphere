import React, { useState, useEffect } from 'react';
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  Printer,
  Calendar,
  AlertCircle,
  Eye,
  Filter
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function OrderHistory({ onSelectInvoice }) {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getMyOrders();
        if (res?.success) {
          setOrders(res.orders);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated]);

  const filteredOrders = statusFilter === 'All'
    ? orders
    : orders.filter((o) => o.order_status === statusFilter);

  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      default: return 1;
    }
  };

  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-mnb-600" />
            My Orders & Tracking Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track order fulfillment statuses, dispatch routes, and generate printable invoices.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['All', 'Processing', 'Shipped', 'Delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-mnb-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading order history...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No orders found</h3>
          <p className="text-xs text-slate-500">
            {statusFilter === 'All'
              ? 'You have not placed any orders yet. Add items to your cart and complete checkout!'
              : `No orders matching status "${statusFilter}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const currentStep = getStepIndex(order.order_status);
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5 hover:border-slate-300 transition-colors"
              >
                {/* Order Top Meta */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                      #{order.id}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-slate-400 font-mono">• Destination: {order.region}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-slate-900">${order.total_amount}</span>
                    <button
                      onClick={() => onSelectInvoice(order)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Invoice
                    </button>
                  </div>
                </div>

                {/* 4-Step Visual Progress Tracker */}
                <div className="py-2">
                  <div className="relative flex items-center justify-between">
                    {/* Connecting line */}
                    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-slate-200 -z-0" />
                    <div
                      className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-emerald-500 transition-all duration-500 -z-0"
                      style={{ width: `${(currentStep / 3) * 100}%` }}
                    />

                    {steps.map((s, idx) => {
                      const isCompleted = idx <= currentStep;
                      const isCurrent = idx === currentStep;
                      return (
                        <div key={s} className="flex flex-col items-center z-10">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isCompleted
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                                : 'bg-slate-200 text-slate-500'
                            } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span
                            className={`mt-1.5 text-[11px] font-semibold ${
                              isCompleted ? 'text-slate-900 font-bold' : 'text-slate-400'
                            }`}
                          >
                            {s}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items in Order */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Order Items ({(order.items || []).length})
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {(order.items || []).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 bg-white p-2 rounded-lg border border-slate-200/60">
                        <img
                          src={item.image_url || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80'}
                          alt={item.title}
                          className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-800 truncate">{item.title}</p>
                          <p className="text-[11px] text-slate-500">
                            Qty: <strong className="text-slate-800">{item.quantity}</strong> × ${item.unit_price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

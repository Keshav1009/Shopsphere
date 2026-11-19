import React from 'react';
import { X, Printer, Download, CheckCircle2, Building, ShieldCheck } from 'lucide-react';

export default function InvoiceModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.created_at || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col border border-slate-200 print:border-none print:shadow-none animate-fade-in">
        {/* Modal Top Control Bar (Hidden during Print) */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-mnb-600 bg-mnb-50 px-2 py-0.5 rounded">
              TAX INVOICE
            </span>
            <span className="text-xs font-mono text-slate-500">#{order.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-mnb-600 hover:bg-mnb-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-8 space-y-6 text-slate-800" id="printable-invoice">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-black text-slate-900 tracking-tight">MNB Soft Solutions Pvt. Ltd.</span>
              </div>
              <p className="text-xs text-slate-500">Full-Stack Development & E-Commerce Division</p>
              <p className="text-xs text-slate-500">Summer Training Project (Paper Code: <strong>BCA-311</strong>)</p>
              <p className="text-xs text-slate-400 font-mono mt-1">CIN: U72900UP2019PTC112345 • GSTIN: 07AABCM9876Q1Z2</p>
            </div>
            <div className="text-right space-y-1">
              <span className="text-2xl font-black text-mnb-600 tracking-tight uppercase">INVOICE</span>
              <p className="text-xs font-mono font-bold text-slate-900">Invoice No: {order.id}</p>
              <p className="text-xs text-slate-500">Date: {formattedDate}</p>
              <span className="inline-block bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                Payment Status: {order.payment_status || 'PAID'}
              </span>
            </div>
          </div>

          {/* Billing & Shipping Section */}
          <div className="grid grid-cols-2 gap-6 text-xs border-b border-slate-200 pb-6">
            <div>
              <p className="font-bold text-slate-900 uppercase tracking-wider mb-1">Billed To (Customer):</p>
              <p className="font-semibold text-slate-800">{order.customer_name || 'Valued Customer'}</p>
              <p className="text-slate-500">{order.customer_email || 'customer@mnbsolutions.com'}</p>
              <p className="text-slate-500 mt-1">Role: Customer / Academic Reviewer</p>
            </div>
            <div>
              <p className="font-bold text-slate-900 uppercase tracking-wider mb-1">Shipping Destination:</p>
              <p className="text-slate-700 leading-relaxed">{order.shipping_address}</p>
              <p className="text-slate-500 mt-1 font-mono">Region: {order.region || 'Global'}</p>
              <p className="text-slate-500 font-mono">Fulfillment Status: {order.order_status || 'Processing'}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-300 text-slate-500 uppercase text-[10px]">
                  <th className="py-2 font-bold">Item Description & SKU</th>
                  <th className="py-2 font-bold text-center">Qty</th>
                  <th className="py-2 font-bold text-right">Unit Price</th>
                  <th className="py-2 font-bold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(order.items || []).map((item, idx) => (
                  <tr key={idx} className="py-2">
                    <td className="py-2.5">
                      <p className="font-bold text-slate-900">{item.title}</p>
                      <p className="text-[11px] font-mono text-slate-400">SKU: {item.sku || 'MNB-ITEM'}</p>
                    </td>
                    <td className="py-2.5 text-center font-semibold text-slate-700">{item.quantity}</td>
                    <td className="py-2.5 text-right font-mono text-slate-700">${item.unit_price}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900">
                      ${(item.quantity * item.unit_price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="border-t border-slate-200 pt-4 flex justify-end">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold text-slate-900">
                  ${(order.items || []).reduce((sum, i) => sum + i.quantity * i.unit_price, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax (8%):</span>
                <span className="font-mono font-semibold text-slate-900">
                  ${(order.total_amount - (order.items || []).reduce((sum, i) => sum + i.quantity * i.unit_price, 0)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping:</span>
                <span className="font-semibold text-emerald-600 uppercase text-[10px]">Free Dispatch</span>
              </div>
              <div className="border-t border-slate-300 pt-2 flex justify-between text-sm font-black text-slate-900">
                <span>Total Amount Paid:</span>
                <span className="text-mnb-600 font-mono">${order.total_amount}</span>
              </div>
            </div>
          </div>

          {/* Academic & Verification Footer */}
          <div className="pt-6 border-t border-slate-200 text-center text-[10px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-600">
              Thank you for supporting developer initiatives on the MNB Storefront!
            </p>
            <p>
              This is a computer-generated tax invoice generated during Summer Training (BCA-311) at MNB Soft Solutions Pvt. Ltd.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

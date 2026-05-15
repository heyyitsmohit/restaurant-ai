// pages/Track.jsx
import { useState } from 'react';
import { fetchOrder } from '../api/client';
import OrderTimeline from '../components/OrderTimeline';

// Mock order for demo — matches API response shape exactly
const MOCK_ORDER = {
  id: 'DEMO-001',
  status: 'preparing',
  customer_name: 'Jane Smith',
  phone: '555-123-4567',
  notes: '',
  items: [
    { id: '1', menu_item_id: '1', menu_item_name: 'Margherita Pizza', quantity: 2, unit_price: 18.00, subtotal: 36.00 },
    { id: '2', menu_item_id: '2', menu_item_name: 'Tiramisu', quantity: 1, unit_price: 9.00, subtotal: 9.00 },
  ],
  total: 45.00,
  created_at: new Date(Date.now() - 15 * 60000).toISOString(),
  updated_at: new Date(Date.now() - 15 * 60000).toISOString(),
  estimated_minutes: 20,
};

export default function Track() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const data = await fetchOrder(orderId.trim());
      setOrder(data);
    } catch (e) {
      // Demo fallback
      if (orderId.trim().toUpperCase() === 'DEMO-001') {
        setOrder(MOCK_ORDER);
      } else {
        setError(`Order not found. Please check your order ID.`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#faf7f4] pt-16">
      <div className="bg-[#1a1a1a] py-14 px-4 text-center">
        <span className="text-[#D85A30] text-xs font-bold uppercase tracking-widest">Live Updates</span>
        <h1 className="font-['Playfair_Display'] text-4xl font-bold text-white mt-2 mb-3">Track Your Order</h1>
        <p className="text-stone-400 max-w-md mx-auto">Enter your order ID to see real-time status and estimated arrival.</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Search form */}
        <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
          <input
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            placeholder="Enter your order ID"
            className="flex-1 border border-stone-200 bg-white rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D85A30]/30 focus:border-[#D85A30] shadow-sm"
          />
          <button
            type="submit"
            disabled={loading || !orderId.trim()}
            className="bg-[#D85A30] hover:bg-[#c04f28] text-white px-6 py-3.5 rounded-xl font-semibold text-sm transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : 'Track →'}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Order result */}
        {order && (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="bg-[#D85A30]/10 border-b border-[#D85A30]/20 px-6 py-5 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs text-stone-500 font-medium mb-1">Order ID</p>
                <p className="font-bold text-[#1a1a1a] font-mono text-lg">{order.id}</p>
              </div>
              {order.estimated_minutes && (
                <div className="text-right">
                  <p className="text-xs text-stone-500 font-medium mb-1">Estimated Time</p>
                  <p className="font-bold text-[#D85A30]">⏱ {order.estimated_minutes} minutes</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="px-6 py-5 border-b border-stone-100">
              <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">Order Status</h3>
              <OrderTimeline status={order.status} />
            </div>

            {/* Items */}
            <div className="px-6 py-5 border-b border-stone-100">
              <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">Items</h3>
              <div className="space-y-3">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-[#1a1a1a]">
                      <span className="text-stone-400 mr-2">{item.quantity}×</span>
                      {item.menu_item_name}
                    </span>
                    <span className="text-stone-600 font-medium">
                      ${Number(item.subtotal).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="px-6 py-4 border-b border-stone-100">
                <p className="text-xs text-stone-500 font-medium mb-1">Notes</p>
                <p className="text-sm text-stone-700">{order.notes}</p>
              </div>
            )}

            {/* Total */}
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="font-semibold text-[#1a1a1a]">Total</span>
              <span className="font-bold text-xl text-[#D85A30]">${Number(order.total).toFixed(2)}</span>
            </div>

          </div>
        )}

        {/* Empty state */}
        {!order && !error && !loading && (
          <div className="text-center py-12 text-stone-400">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-sm">Enter your order ID above to check your status.</p>
            <p className="text-xs mt-2">You received an order ID when your order was placed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
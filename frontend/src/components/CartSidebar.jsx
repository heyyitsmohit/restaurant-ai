// components/CartSidebar.jsx
import { useState } from 'react';
import { placeOrder } from '../api/client';
import { useToast } from './Toast';

export default function CartSidebar({ items, subtotal, isOpen, onClose, onUpdateQty, onRemove, onClear }) {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [placing, setPlacing] = useState(false);
  const { addToast } = useToast();

  async function handlePlaceOrder() {
    if (!customerName.trim() || !phone.trim()) {
      addToast({ message: 'Please fill in your name and phone number.', type: 'error' });
      return;
    }
    setPlacing(true);
    try {
      const result = await placeOrder({
        items: items.map(i => ({ menu_item_id: i.id, quantity: i.qty })),
        customer_name: customerName,
        phone,
      });
      addToast({ message: `Order #${result.order_id} placed! Total: $${result.total?.toFixed(2)}`, type: 'success', duration: 5000 });
      onClear();
      setShowOrderForm(false);
      setCustomerName('');
      setPhone('');
      onClose();
    } catch (e) {
      addToast({ message: `Failed to place order: ${e.message}`, type: 'error' });
    } finally {
      setPlacing(false);
    }
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="cart-open fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <div>
            <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#1a1a1a]">Your Cart</h2>
            <p className="text-xs text-stone-500 mt-0.5">{items.reduce((s, i) => s + i.qty, 0)} items</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-stone-500 font-medium">Your cart is empty</p>
              <p className="text-stone-400 text-sm mt-1">Add some dishes to get started</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-3 items-start group">
                <div className="w-14 h-14 rounded-xl bg-stone-100 overflow-hidden shrink-0">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#1a1a1a] truncate">{item.name}</p>
                  <p className="text-[#D85A30] text-sm font-medium">${(item.price * item.qty).toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button
                      onClick={() => onUpdateQty(item.id, item.qty - 1)}
                      className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-bold flex items-center justify-center transition-colors"
                    >−</button>
                    <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                    <button
                      onClick={() => onUpdateQty(item.id, item.qty + 1)}
                      className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-bold flex items-center justify-center transition-colors"
                    >+</button>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-stone-300 hover:text-red-400 transition-colors p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-stone-100 p-5 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Subtotal</span>
              <span className="font-bold text-[#1a1a1a] text-base">${subtotal.toFixed(2)}</span>
            </div>

            {showOrderForm ? (
              <div className="space-y-3">
                <input
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Your name"
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D85A30]/30 focus:border-[#D85A30]"
                />
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Phone number"
                  type="tel"
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D85A30]/30 focus:border-[#D85A30]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowOrderForm(false)}
                    className="flex-1 py-2.5 border border-stone-200 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="flex-1 bg-[#D85A30] hover:bg-[#c04f28] text-white py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60"
                  >
                    {placing ? 'Placing…' : 'Confirm Order'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowOrderForm(true)}
                className="w-full bg-[#D85A30] hover:bg-[#c04f28] text-white py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                Proceed to Order →
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// pages/Admin.jsx
import { useState, useEffect } from 'react';
import { fetchAllOrders, updateOrderStatus } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/Toast';

const STATUSES = ['received', 'preparing', 'ready', 'delivered'];

// Mock orders for demo
const MOCK_ORDERS = [
  { order_id: 'ORD-001', customer_name: 'Alice Johnson', items: [{name:'Margherita Pizza',quantity:2}], total: 36, status: 'preparing', created_at: new Date(Date.now()-20*60000).toISOString() },
  { order_id: 'ORD-002', customer_name: 'Bob Martinez', items: [{name:'Braised Short Rib',quantity:1},{name:'Tiramisu',quantity:2}], total: 50, status: 'received', created_at: new Date(Date.now()-5*60000).toISOString() },
  { order_id: 'ORD-003', customer_name: 'Carol White', items: [{name:'Pan-Seared Salmon',quantity:1}], total: 28, status: 'ready', created_at: new Date(Date.now()-35*60000).toISOString() },
  { order_id: 'ORD-004', customer_name: 'David Chen', items: [{name:'Negroni Sbagliato',quantity:3},{name:'Burrata',quantity:1}], total: 53, status: 'delivered', created_at: new Date(Date.now()-90*60000).toISOString() },
];

function timeAgo(isoStr) {
  const mins = Math.round((Date.now() - new Date(isoStr)) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
}

export default function Admin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const { addToast } = useToast();

  useEffect(() => {
    let interval;
    async function load() {
      try {
        const data = await fetchAllOrders();
        setOrders(data);
      } catch {
        setOrders(MOCK_ORDERS);
      } finally {
        setLoading(false);
      }
    }
    load();
    interval = setInterval(load, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  async function handleStatusChange(orderId, newStatus) {
    setUpdating(prev => ({ ...prev, [orderId]: true }));
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, status: newStatus } : o));
      addToast({ message: `Order ${orderId} updated to "${newStatus}"`, type: 'success' });
    } catch (e) {
      // Demo: still update locally
      setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, status: newStatus } : o));
      addToast({ message: `Status updated (demo mode)`, type: 'info' });
    } finally {
      setUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  }

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#faf7f4] pt-16">
      {/* Header */}
      <div className="bg-[#1a1a1a] py-10 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="text-[#D85A30] text-xs font-bold uppercase tracking-widest">Admin</span>
            <h1 className="font-['Playfair_Display'] text-3xl font-bold text-white mt-1">Order Dashboard</h1>
          </div>
          <div className="flex gap-3 flex-wrap">
            {STATUSES.map(s => (
              <div key={s} className="bg-white/10 backdrop-blur px-4 py-2 rounded-xl text-center">
                <p className="text-white font-bold text-xl">{counts[s] || 0}</p>
                <p className="text-stone-400 text-xs capitalize">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 skeleton rounded-xl" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <div className="text-5xl mb-4">📋</div>
            <p>No orders yet</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr>
                    {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Time', 'Update'].map(h => (
                      <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-stone-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map(order => (
                    <tr key={order.order_id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-mono text-sm font-semibold text-[#1a1a1a]">{order.order_id}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#1a1a1a] font-medium">{order.customer_name}</td>
                      <td className="px-5 py-4 text-sm text-stone-500 max-w-xs">
                        {(order.items || []).map(i => `${i.quantity}× ${i.name}`).join(', ')}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-[#D85A30]">${Number(order.total).toFixed(2)}</td>
                      <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                      <td className="px-5 py-4 text-xs text-stone-400">{timeAgo(order.created_at)}</td>
                      <td className="px-5 py-4">
                        <select
                          value={order.status}
                          disabled={updating[order.order_id]}
                          onChange={e => handleStatusChange(order.order_id, e.target.value)}
                          className="text-xs border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#D85A30]/30 bg-white disabled:opacity-50 cursor-pointer"
                        >
                          {STATUSES.map(s => (
                            <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden space-y-4">
              {orders.map(order => (
                <div key={order.order_id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-mono font-bold text-[#1a1a1a]">{order.order_id}</p>
                      <p className="text-sm text-stone-500 mt-0.5">{order.customer_name}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-xs text-stone-500 mb-3">
                    {(order.items || []).map(i => `${i.quantity}× ${i.name}`).join(', ')}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#D85A30]">${Number(order.total).toFixed(2)}</span>
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order.order_id, e.target.value)}
                      className="text-xs border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none bg-white"
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
